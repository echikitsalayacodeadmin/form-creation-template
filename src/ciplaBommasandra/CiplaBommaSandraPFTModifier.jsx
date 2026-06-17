import React, { useEffect, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useSnackbar } from "notistack";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import unoHeaderCiplaLtd from "../assets/images/UnoHeaderCIplaLtd.png";

const TARGET_CORP_ID = "b3148da9-7f8a-4712-a9a9-dfe8e3296137";
const TARGET_CAMP_CYCLE_ID = "423157";
const HEADER_HEIGHT = 95;

const modifyPftPdf = async (pftUrl, department) => {
    const pdfBytes = await fetch(pftUrl).then((response) => response.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    if (!pages?.length) {
        throw new Error("PFT PDF has no pages");
    }

    const page = pages[0];
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const safeDepartment = `${department || "-"}`;
    const refByX = 18;
    const refByY = height - 95;
    const refByWidth = 310;
    const refByHeight = 20;

    page.drawRectangle({
        x: 0,
        y: height - HEADER_HEIGHT,
        width,
        height: HEADER_HEIGHT,
        color: rgb(1, 1, 1),
    });

    const headerImageBytes = await fetch(unoHeaderCiplaLtd).then((response) =>
        response.arrayBuffer()
    );
    const headerImage = await pdfDoc.embedPng(headerImageBytes);
    page.drawImage(headerImage, {
        x: 0,
        y: height - HEADER_HEIGHT,
        width,
        height: HEADER_HEIGHT,
    });

    // Template-based replacement for image-like PFTs.
    page.drawRectangle({
        x: refByX,
        y: refByY - 60,
        width: 200,
        height: refByHeight,
        color: rgb(1, 1, 1),
    });

    page.drawText(`Department : ${safeDepartment}`, {
        x: refByX + 3,
        y: refByY - 54,
        size: 18,
        font,
        color: rgb(0, 0, 0),
    });

    return pdfDoc.save();
};

const CiplaBommaSandraPFTModifier = ({
    corpId = TARGET_CORP_ID,
    campCycleId = TARGET_CAMP_CYCLE_ID,
    fileType = "PFT",
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [list, setList] = useState([]);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [manualEmpId, setManualEmpId] = useState("");
    const [manualFile, setManualFile] = useState(null);
    const [isManualUploading, setIsManualUploading] = useState(false);

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

        const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
        const result = await getData(url);

        if (result?.data) {
            const filtered = result.data.filter((item) => item?.empId === "H195637");
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

    const modifyAndUploadPft = async (employee) => {
        if (!employee?.pftUrl) {
            return;
        }

        const modifiedBytes = await modifyPftPdf(
            employee.pftUrl,
            employee?.department
        );
        const modifiedBlob = new Blob([modifiedBytes], { type: "application/pdf" });

        // const previewUrl = URL.createObjectURL(modifiedBlob);
        // window.open(previewUrl, "_blank");

        const formData = new FormData();
        formData.append(
            "file",
            modifiedBlob,
            `${employee?.pftUrl?.split("/").pop() || `${employee.empId}_pft.pdf`}`
        );

        const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${employee.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
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
            enqueueSnackbar("No PFT files found to modify.", { variant: "warning" });
            return;
        }

        setIsProcessing(true);
        setUploadedCount(0);

        try {
            for (let i = 0; i < list.length; i += 1) {
                await modifyAndUploadPft(list[i]);
            }
            enqueueSnackbar("Header and department added for all PFT reports.", {
                variant: "success",
            });
        } catch (error) {
            console.error("PFT modify/upload failed:", error);
            enqueueSnackbar("Stopped due to an error while modifying/uploading PFT.", {
                variant: "error",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const deleteFiles = async (employee) => {
        const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${employee.empId}`;
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

    const handleManualUpload = async () => {
        if (!isTargetBatch) {
            enqueueSnackbar("corpId/campCycleId mismatch for this task.", {
                variant: "error",
            });
            return;
        }

        const trimmedEmpId = manualEmpId.trim();
        if (!trimmedEmpId) {
            enqueueSnackbar("Please enter Employee ID for manual upload.", {
                variant: "warning",
            });
            return;
        }

        if (!manualFile) {
            enqueueSnackbar("Please choose a PFT PDF file.", {
                variant: "warning",
            });
            return;
        }

        const isPdfFile =
            manualFile.type === "application/pdf" ||
            manualFile.name.toLowerCase().endsWith(".pdf");
        if (!isPdfFile) {
            enqueueSnackbar("Only PDF files are allowed for PFT upload.", {
                variant: "warning",
            });
            return;
        }

        setIsManualUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", manualFile, manualFile.name);

            const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${trimmedEmpId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
            const uploadResult = await uploadFile(uploadUrl, formData);

            if (!uploadResult?.data) {
                throw new Error("Manual PFT upload failed");
            }

            setUploadedCount((prev) => prev + 1);
            enqueueSnackbar(`Manual PFT uploaded for ${trimmedEmpId}`, {
                variant: "success",
            });
            setManualFile(null);
        } catch (error) {
            console.error("Manual PFT upload failed:", error);
            enqueueSnackbar("Manual PFT upload failed.", {
                variant: "error",
            });
        } finally {
            setIsManualUploading(false);
        }
    };

    return (
        <div>
            <h3>Cipla Bommasandra PFT Modifier</h3>
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
            <br />
            <br />
            <h4>Manual PFT Upload</h4>
            <input
                type="text"
                placeholder="Enter Employee ID"
                value={manualEmpId}
                onChange={(event) => setManualEmpId(event.target.value)}
                list="manual-pft-emp-id-list"
                disabled={isManualUploading}
            />
            <datalist id="manual-pft-emp-id-list">
                {list.map((item) => (
                    <option key={item.empId} value={item.empId}>
                        {item.name}
                    </option>
                ))}
            </datalist>
            <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => setManualFile(event.target.files?.[0] || null)}
                disabled={isManualUploading}
            />
            <button onClick={handleManualUpload} disabled={isManualUploading}>
                {isManualUploading ? "Uploading..." : "Upload Manual PFT"}
            </button>
            {manualFile && <div>Selected File: {manualFile.name}</div>}
            <div>Total Employees: {totalEmployees}</div> <br />
            <div>Uploaded Files: {uploadedCount}</div> <br />
            {list.map((item, index) => (
                <div key={item.empId || index} style={{ display: "flex", gap: "8px" }}>
                    <div>{`${index + 1}. ${item.empId} ${item.name} | Dept: ${item?.department || "-"}`}</div>
                    {item?.pftUrl ? (
                        <a href={item.pftUrl} target="_blank" rel="noreferrer">
                            {item.pftUrl}
                        </a>
                    ) : (
                        <span>-</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CiplaBommaSandraPFTModifier;
