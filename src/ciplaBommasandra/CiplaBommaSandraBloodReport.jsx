import React, { useEffect, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useSnackbar } from "notistack";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";

const TARGET_CORP_ID = "928c489f-29e9-4612-be11-9b1a27ecb996";
const TARGET_CAMP_CYCLE_ID = "423119";
const CLIENT_NAME = "Cipla Limited Virgonagar";
// const CLIENT_NAME = "Cipla Limited Bommasandra";
// const TARGET_CORP_ID = "b3148da9-7f8a-4712-a9a9-dfe8e3296137";
// const TARGET_CAMP_CYCLE_ID = "423157";

const REPLACE_CLIENT_TEXT = "Unocare Camp";
const TEXT_SIZE = 9;
const CLIENT_TEXT_SIZE = 8.5;

async function loadPdfJs() {
    const pdfjsLib = await import(
        "https://mozilla.github.io/pdf.js/build/pdf.mjs"
    );
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
    return pdfjsLib;
}

function groupTextIntoLines(items) {
    const lines = {};

    for (const item of items) {
        if (!item.str) continue;
        const [x, y] = item.transform.slice(4, 6);
        const roundedY = Math.round(y);
        if (!lines[roundedY]) lines[roundedY] = [];
        lines[roundedY].push({
            x,
            y,
            text: item.str,
            width: item.width || 0,
            height: item.height || 10,
        });
    }

    return Object.entries(lines).map(([yKey, parts]) => {
        const sorted = [...parts].sort((a, b) => a.x - b.x);
        return {
            y: Number(yKey),
            parts: sorted,
            text: sorted.map((part) => part.text).join(""),
        };
    });
}

function findSubstringBox(parts, substring, caseInsensitive = true) {
    const fullText = parts.map((part) => part.text).join("");
    const haystack = caseInsensitive ? fullText.toLowerCase() : fullText;
    const needle = caseInsensitive ? substring.toLowerCase() : substring;
    const startIdx = haystack.indexOf(needle);
    if (startIdx < 0) return null;

    const endIdx = startIdx + substring.length;
    let charCount = 0;
    let startX = null;
    let endX = null;
    let y = parts[0]?.y ?? 0;
    let height = Math.max(...parts.map((part) => part.height), 10);

    for (const part of parts) {
        const partLen = part.text.length;
        const avgCharWidth = partLen > 0 ? part.width / partLen : 5;

        if (startX === null && charCount + partLen > startIdx) {
            const offsetInPart = startIdx - charCount;
            startX = part.x + offsetInPart * avgCharWidth;
            y = part.y;
        }

        if (endX === null && charCount + partLen >= endIdx) {
            const offsetInPart = endIdx - charCount;
            endX = part.x + offsetInPart * avgCharWidth;
        }

        charCount += partLen;
    }

    if (startX === null || endX === null) return null;

    return {
        x: startX,
        y,
        width: Math.max(endX - startX, 1),
        height,
        text: fullText.slice(startIdx, endIdx),
    };
}

function findCharIndexBox(parts, charIndex) {
    let charCount = 0;

    for (const part of parts) {
        const partLen = part.text.length;
        const avgCharWidth = partLen > 0 ? part.width / partLen : 5;

        if (charCount + partLen > charIndex) {
            const offsetInPart = charIndex - charCount;
            return {
                x: part.x + offsetInPart * avgCharWidth,
                y: part.y,
                height: part.height || 10,
            };
        }

        charCount += partLen;
    }

    return null;
}

async function extractPdfPageLines(pdfBytes) {
    const pdfjsLib = await loadPdfJs();
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes.slice(0) });
    const pdf = await loadingTask.promise;
    const pageLines = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const lines = groupTextIntoLines(textContent.items);
        pageLines.push({ pageNum, lines });
    }

    if (loadingTask.destroy) await loadingTask.destroy();
    return pageLines;
}

function findClientNameMatches(pageLines) {
    const matches = [];

    for (const { pageNum, lines } of pageLines) {
        for (const line of lines) {
            const match = findSubstringBox(line.parts, REPLACE_CLIENT_TEXT);
            if (match) {
                matches.push({ pageNum, ...match });
            }
        }
    }

    return matches;
}

function findPatientNameSuffixMatch(pageLines, font, empId) {
    const patientLabelLine = pageLines
        .flatMap(({ pageNum, lines }) => lines.map((line) => ({ pageNum, line })))
        .find(({ line }) => line.text.includes("Patient Name"));

    if (!patientLabelLine) return null;

    const { pageNum, line: labelLine } = patientLabelLine;
    const labelX = labelLine.parts[0]?.x ?? 0;
    const candidateLines = pageLines
        .find((page) => page.pageNum === pageNum)
        ?.lines.filter(
            (line) =>
                line.text.includes("_") &&
                line.y <= labelLine.y + 2 &&
                line.y >= labelLine.y - 24
        ) || [];

    const targetLine =
        candidateLines.find((line) => line.y === labelLine.y) ||
        candidateLines.find((line) => line.parts[0]?.x > labelX + 30) ||
        candidateLines.sort((a, b) => b.y - a.y)[0];

    if (!targetLine) return null;

    const underscoreIdx = targetLine.text.indexOf("_");
    if (underscoreIdx < 0) return null;

    const oldSuffix = targetLine.text.slice(underscoreIdx + 1).trim();
    const suffixStart = findCharIndexBox(targetLine.parts, underscoreIdx + 1);
    if (!suffixStart) return null;

    const suffixWidth = Math.max(
        font.widthOfTextAtSize(oldSuffix, TEXT_SIZE) + 12,
        font.widthOfTextAtSize(String(empId), TEXT_SIZE) + 8
    );

    return {
        pageNum,
        x: suffixStart.x,
        y: suffixStart.y,
        width: suffixWidth,
        height: Math.max(suffixStart.height + 2, 12),
        oldSuffix,
    };
}

function drawTextReplacement(page, font, { x, y, width, height, text, size = TEXT_SIZE }) {
    page.drawRectangle({
        x: x - 1,
        y: y - 2,
        width: 120,
        height: height + 3,
        color: rgb(1, 1, 1),
    });
    page.drawText(text, {
        x,
        y: y + 1,
        size,
        font,
        color: rgb(0, 0, 0),
    });
}

const modifyBloodPdf = async (bloodTestUrl, employee) => {
    const existingPdfBytes = await fetch(bloodTestUrl).then((response) =>
        response.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const empId = `_${String(employee?.empId)}`;

    const pageLines = await extractPdfPageLines(existingPdfBytes);
    const clientMatches = findClientNameMatches(pageLines);
    const patientSuffix = findPatientNameSuffixMatch(pageLines, font, empId);

    for (const match of clientMatches) {
        const page = pdfDoc.getPages()[match.pageNum - 1];
        const newWidth = Math.max(
            match.width + 10,
            font.widthOfTextAtSize(CLIENT_NAME, CLIENT_TEXT_SIZE) + 8
        );

        drawTextReplacement(page, font, {
            x: match.x - 3,
            y: match.y,
            width: newWidth,
            height: match.height,
            text: CLIENT_NAME,
            size: CLIENT_TEXT_SIZE,
        });
    }

    if (patientSuffix) {
        const page = pdfDoc.getPages()[patientSuffix.pageNum - 1];
        drawTextReplacement(page, fontBold, {
            x: patientSuffix.x,
            y: patientSuffix.y,
            width: patientSuffix.width,
            height: patientSuffix.height,
            text: empId,
            size: TEXT_SIZE,
        });
    }

    return pdfDoc.save();
};

const CiplaBommaSandraBloodReport = ({
    corpId = TARGET_CORP_ID,
    campCycleId = TARGET_CAMP_CYCLE_ID,
    fileType = "TMT",
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [list, setList] = useState([]);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [failedEmployees, setFailedEmployees] = useState([]);

    const isTargetBatch =
        corpId === TARGET_CORP_ID && campCycleId === TARGET_CAMP_CYCLE_ID;

    const fetchListOfEmployees = async () => {
        if (!isTargetBatch) {
            enqueueSnackbar("This modifier is locked to the requested corp + camp cycle.", {
                variant: "warning",
            });
            setList([]);
            setTotalEmployees(0);
            return;
        }

        const url = `https://apitest.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
        const result = await getData(url);

        if (result?.data) {
            const filtered = result.data.filter((item) => item?.bloodTestUrl && ["24878", "176666", "175352", "177518", "31000466", "30121", "CIPV11", "CIPV09", "176494", "123875", "CIPV10", "171377", "3599", "3815", "CIPV08"].includes(item.empId));
            const sorted = sortDataByName(filtered);
            setList(sorted);
            setTotalEmployees(sorted.length);
            return;
        }

        enqueueSnackbar("Error fetching employee list", { variant: "error" });
    };

    useEffect(() => {
        fetchListOfEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [corpId, campCycleId]);

    const modifyAndUploadBlood = async (employee) => {
        if (!employee?.bloodTestUrl) {
            throw new Error("Missing Blood URL");
        }

        const modifiedBytes = await modifyBloodPdf(employee.bloodTestUrl, employee);
        const modifiedBlob = new Blob([modifiedBytes], { type: "application/pdf" });

        // const previewUrl = URL.createObjectURL(modifiedBlob);
        // window.open(previewUrl, "_blank");

        const formData = new FormData();
        formData.append(
            "file",
            modifiedBlob,
            `${employee?.bloodTestUrl?.split("/").pop() || `${employee.empId}_blood.pdf`}`
        );

        const uploadUrl = `https://apitest.uno.care/api/org/upload?empId=${employee.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
        const uploadResult = await uploadFile(uploadUrl, formData);

        if (!uploadResult?.data) {
            throw new Error(`Upload failed for ${employee.empId}`);
        }

        setUploadedCount((prev) => prev + 1);
    };

    const handleGeneratePDFs = async () => {
        if (!isTargetBatch) {
            enqueueSnackbar("corpId/campCycleId mismatch for this task.", {
                variant: "error",
            });
            return;
        }

        if (!list.length) {
            enqueueSnackbar("No Blood files found to modify.", { variant: "warning" });
            return;
        }

        setIsProcessing(true);
        setUploadedCount(0);
        setFailedEmployees([]);

        let successCount = 0;

        for (let i = 0; i < list.length; i += 1) {
            const employee = list[i];
            try {
                await modifyAndUploadBlood(employee);
                successCount += 1;
            } catch (error) {
                console.error(`Blood modify/upload failed for ${employee.empId}:`, error);
                setFailedEmployees((prev) => [
                    ...prev,
                    {
                        empId: employee.empId,
                        name: employee.name,
                        error: error?.message || "Unknown error",
                    },
                ]);
            }
        }

        setIsProcessing(false);

        if (successCount === list.length) {
            enqueueSnackbar("Client name and patient name updated for all blood reports.", {
                variant: "success",
            });
        } else if (successCount > 0) {
            enqueueSnackbar(
                `Completed with errors: ${successCount} uploaded, ${list.length - successCount} failed.`,
                { variant: "warning" }
            );
        } else {
            enqueueSnackbar("All blood uploads failed. Check failed employee list.", {
                variant: "error",
            });
        }
    };

    const deleteFiles = async (employee) => {
        const url = `https://apitest.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${employee.empId}`;
        const result = await updateData(url);

        if (!result?.data) {
            enqueueSnackbar(`Delete failed for ${employee.empId}`, {
                variant: "error",
            });
            return;
        }

        enqueueSnackbar(`Deleted ${employee.empId} ${fileType}`, {
            variant: "success",
        });
    };

    const handleDeletePDF = async () => {
        for (let i = 0; i < list.length; i += 1) {
            await deleteFiles(list[i]);
        }
    };

    return (
        <div>
            <h3>Cipla Bommasandra Blood Report Modifier</h3>
            <div>corpId: {corpId}</div>
            <div>campCycleId: {campCycleId}</div>
            <br />
            <button onClick={handleGeneratePDFs} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Start Generating"}
            </button>{" "}
            <br />
            <button onClick={handleDeletePDF} disabled={isProcessing}>
                Delete Files
            </button>
            <div>Total Employees: {totalEmployees}</div> <br />
            <div>Uploaded Files: {uploadedCount}</div> <br />
            {failedEmployees.length > 0 && (
                <>
                    <h4>Failed Employees ({failedEmployees.length})</h4>
                    <ul>
                        {failedEmployees.map((item) => (
                            <li key={item.empId}>
                                {item.empId} - {item.name} ({item.error})
                            </li>
                        ))}
                    </ul>
                </>
            )}
            <br />
            {list.map((item, index) => (
                <div key={item.empId || index} style={{ display: "flex", gap: "8px" }}>
                    <div>{`${index + 1}. ${item.empId} ${item.name}`}</div>
                    {item?.bloodTestUrl ? (
                        <a href={item.bloodTestUrl} target="_blank" rel="noreferrer">
                            {item.bloodTestUrl}
                        </a>
                    ) : (
                        <span>-</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CiplaBommaSandraBloodReport;
