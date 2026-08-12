import React, { useEffect, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useSnackbar } from "notistack";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";

const TEXT_SIZE = 9;

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

function findAgeNumberBox(parts, font, newAge) {
    const fullText = parts.map((part) => part.text).join("");
    const match = fullText.match(/(\d{1,3})\s*Years/i);
    if (!match) return null;

    const oldAge = match[1];
    const startIdx = match.index;
    let charCount = 0;
    let startX = null;
    let y = parts[0]?.y ?? 0;
    let height = Math.max(...parts.map((part) => part.height), 10);

    for (const part of parts) {
        const partLen = part.text.length;
        const avgCharWidth = partLen > 0 ? part.width / partLen : 5;

        if (charCount + partLen > startIdx) {
            const offsetInPart = startIdx - charCount;
            startX = part.x + offsetInPart * avgCharWidth;
            y = part.y;
            break;
        }

        charCount += partLen;
    }

    if (startX === null) return null;

    const width = Math.max(
        font.widthOfTextAtSize(oldAge, TEXT_SIZE) + 6,
        font.widthOfTextAtSize(String(newAge), TEXT_SIZE) + 6
    );

    return { x: startX, y, width, height, oldAge };
}

// Right-hand column headers that sit on the same visual line as "Name"
const NEXT_FIELD_LABEL =
    /(Reg\.?\s*No|Reg\.?\s*Date|Collection|Received|Report|Barcode|Age\s*[\\/]?\s*Sex|Referred\s*By|Referral\s*Dr)/i;

function charIndexToPosition(parts, targetIdx) {
    let charCount = 0;

    for (const part of parts) {
        const partLen = part.text.length;

        if (charCount + partLen > targetIdx) {
            const avgCharWidth = partLen > 0 ? part.width / partLen : 5;
            return {
                x: part.x + (targetIdx - charCount) * avgCharWidth,
                y: part.y,
                height: part.height,
            };
        }

        charCount += partLen;
    }

    const last = parts[parts.length - 1];
    if (!last) return null;

    return { x: last.x + last.width, y: last.y, height: last.height };
}

function findColumnBreakX(parts, afterX) {
    for (let i = 1; i < parts.length; i += 1) {
        const prevEnd = parts[i - 1].x + parts[i - 1].width;
        if (parts[i].x > afterX && parts[i].x - prevEnd > 15) {
            return parts[i].x;
        }
    }

    return null;
}

function findNameValueBox(parts) {
    const fullText = parts.map((part) => part.text).join("");
    const match = fullText.match(/\bName\s*:\s*/i);
    if (!match) return null;

    const valueStart = match.index + match[0].length;
    const rest = fullText.slice(valueStart);
    const nextLabel = rest.match(NEXT_FIELD_LABEL);
    const valueEnd = nextLabel ? valueStart + nextLabel.index : fullText.length;

    const rawValue = fullText.slice(valueStart, valueEnd);
    const oldName = rawValue.trim();
    if (!oldName) return null;

    const start = charIndexToPosition(parts, valueStart);
    const end = charIndexToPosition(parts, valueStart + rawValue.trimEnd().length);
    if (!start || !end) return null;

    const labelLimit = charIndexToPosition(parts, valueEnd);
    const columnBreak = findColumnBreakX(parts, start.x);
    const limitCandidates = [labelLimit?.x, columnBreak].filter(
        (value) => typeof value === "number" && value > start.x
    );

    return {
        x: start.x,
        y: start.y,
        width: Math.max(end.x - start.x, 10),
        limitX: limitCandidates.length ? Math.min(...limitCandidates) : end.x,
        height: Math.max(...parts.map((part) => part.height), 10),
        oldName,
    };
}

async function findMatchesPerPage(pdfBytes, font, newAge) {
    const pdfjsLib = await loadPdfJs();
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes.slice(0) });
    const pdf = await loadingTask.promise;
    const ageMatches = [];
    const nameMatches = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
        const page = await pdf.getPage(pageNum);
        const lines = groupTextIntoLines((await page.getTextContent()).items);
        const ageLabelLine = lines.find(
            (line) => /age/i.test(line.text) && /sex/i.test(line.text)
        );

        let pageMatch = null;

        for (const line of lines) {
            const box = findAgeNumberBox(line.parts, font, newAge);
            if (!box) continue;

            if (ageLabelLine && Math.abs(line.y - ageLabelLine.y) > 8) {
                continue;
            }

            pageMatch = box;
            break;
        }

        if (pageMatch) {
            ageMatches.push({ pageNum, ...pageMatch });
        }

        for (const line of lines) {
            const box = findNameValueBox(line.parts);
            if (!box) continue;

            nameMatches.push({ pageNum, ...box });
            break;
        }
    }

    if (loadingTask.destroy) await loadingTask.destroy();
    return { ageMatches, nameMatches };
}

function drawAgeReplacement(page, font, match, newAge) {
    page.drawRectangle({
        x: match.x - 1,
        y: match.y - 2,
        width: 12,
        height: match.height + 3,
        color: rgb(1, 1, 1),
    });

    page.drawText(String(newAge), {
        x: match.x,
        y: match.y + 1,
        size: TEXT_SIZE,
        font,
        color: rgb(0, 0, 0),
    });
}

const NAME_TITLE = /^(MR|MRS|MS|MISS|DR|SMT|SHRI)\.?\s*/i;

function buildCorrectedName(oldName, employeeName) {
    const titleMatch = oldName.match(NAME_TITLE);
    const title = titleMatch ? titleMatch[1].toUpperCase() : "";
    const prefix = title ? `${title}.` : "";

    return `${prefix}${employeeName.toUpperCase()}`;
}

function drawNameReplacement(page, font, match, newName) {
    page.drawRectangle({
        x: match.x - 1,
        y: match.y - 2,
        width: match.width + 2,
        height: match.height + 3,
        color: rgb(1, 1, 1),
    });

    const availableWidth = Math.max(match.limitX - match.x - 2, 20);
    let size = TEXT_SIZE;

    while (size > 5 && font.widthOfTextAtSize(newName, size) > availableWidth) {
        size -= 0.5;
    }

    page.drawText(newName, {
        x: match.x,
        y: match.y + 1,
        size,
        font,
        color: rgb(0, 0, 0),
    });
}

const modifyBloodPdf = async (bloodTestUrl, employee) => {
    const newAge = employee?.age;
    if (newAge === undefined || newAge === null || newAge === "") {
        throw new Error("Missing employee age");
    }

    const employeeName = String(employee?.name || "").trim();
    if (!employeeName) {
        throw new Error("Missing employee name");
    }

    const pdfBytes = await fetch(bloodTestUrl).then((response) =>
        response.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const { ageMatches, nameMatches } = await findMatchesPerPage(
        pdfBytes,
        font,
        newAge
    );

    if (!ageMatches.length) {
        throw new Error("Age value not found in PDF");
    }

    if (!nameMatches.length) {
        throw new Error("Name value not found in PDF");
    }

    const pages = pdfDoc.getPages();

    for (const match of ageMatches) {
        drawAgeReplacement(pages[match.pageNum - 1], font, match, newAge);
    }

    for (const match of nameMatches) {
        drawNameReplacement(
            pages[match.pageNum - 1],
            font,
            match,
            buildCorrectedName(match.oldName, employeeName)
        );
    }

    return pdfDoc.save();
};

const BrigdeStoneChakanBloodModify = ({
    corpId = '1f084b0a-0423-47ec-a812-345500977336',
    campCycleId = '425856',
    fileType = "BLOODTEST",
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [list, setList] = useState([]);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [failedEmployees, setFailedEmployees] = useState([]);

    const fetchListOfEmployees = async () => {
        if (!corpId || !campCycleId) {
            enqueueSnackbar("Set corpId and campCycleId props.", { variant: "warning" });
            setList([]);
            setTotalEmployees(0);
            return;
        }

        const url = `https://apitest.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
        const result = await getData(url);

        if (result?.data) {
            const filtered = result.data.filter((item) => item?.bloodTestUrl && ["2026-07-31"].includes(item?.vitalsCreatedDate));
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
        if (!corpId || !campCycleId) {
            enqueueSnackbar("corpId and campCycleId are required.", { variant: "error" });
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
                console.error(`Blood age/name modify failed for ${employee.empId}:`, error);
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
            enqueueSnackbar("Age and name updated for all blood reports.", {
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
            <h3>Bridgestone Chakan Blood Age &amp; Name Modifier</h3>
            <div>corpId: {corpId || "-"}</div>
            <div>campCycleId: {campCycleId || "-"}</div>
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
                    <div>{`${index + 1}. ${item.empId} ${item.name} (age: ${item?.age ?? "-"})`}</div>
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

export default BrigdeStoneChakanBloodModify;
