import React, { useEffect, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useSnackbar } from "notistack";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import ciplaAudioUnoHeader from "../assets/images/ciplaAudioUnoHeader.png";

// const TARGET_CORP_ID = "928c489f-29e9-4612-be11-9b1a27ecb996";
// const TARGET_CAMP_CYCLE_ID = "423119";
const TARGET_CORP_ID = "b3148da9-7f8a-4712-a9a9-dfe8e3296137";
const TARGET_CAMP_CYCLE_ID = "423157";



const modifyAudioPdf = async (audiometryUrl, department, empId) => {
    const pdfBytes = await fetch(audiometryUrl).then((response) => response.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    if (!pages?.length) {
        throw new Error("Audio PDF has no pages");
    }

    const page = pages[0];
    const { height, width } = page.getSize();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontNormal = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const safeDepartment = (department || "");

    const headerImageBytes = await fetch(ciplaAudioUnoHeader).then((response) =>
        response.arrayBuffer()
    );

    const headerImage = await pdfDoc.embedPng(headerImageBytes);

    page.drawImage(headerImage, {
        x: width - 440,
        y: height - 50,
        width: 250,
        height: 50,
    });

    // // With Header
    const departmentX = 62;
    const departmentY = height - 255;
    const departmentWidth = 260;
    const departmentHeight = 10;

    page.drawRectangle({
        x: departmentX,
        y: departmentY,
        width: departmentWidth,
        height: departmentHeight,
        color: rgb(1, 1, 1),
    });

    page.drawText(`EMP CODE`, {
        x: 299,
        y: departmentY + 3,
        size: 7,
        font: fontBold,
        color: rgb(0, 0, 0),
    });
    page.drawText(`: ${empId}`, {
        x: 420,
        y: departmentY + 3,
        size: 7,
        font: fontNormal,
        color: rgb(0, 0, 0),
    });

    page.drawText(`DEPARTMENT`, {
        x: departmentX + 2,
        y: departmentY + 3,
        size: 7,
        font: fontBold,
        color: rgb(0, 0, 0),
    });
    page.drawText(`: ${safeDepartment}`, {
        x: 122 + 2,
        y: departmentY + 3,
        size: 7,
        font: fontNormal,
        color: rgb(0, 0, 0),
    });

    // // Without Header
    // page.drawImage(headerImage, {
    //     x: width - 440,
    //     y: height - 50,
    //     width: 250,
    //     height: 50,
    // });
    // const departmentX = 10;
    // const departmentY = height - 135;
    // const departmentWidth = 500;
    // const departmentHeight = 10;

    // page.drawRectangle({
    //     x: departmentX,
    //     y: departmentY,
    //     width: departmentWidth,
    //     height: departmentHeight,
    //     color: rgb(1, 1, 1),
    // });

    // page.drawText(`EMP CODE`, {
    //     x: 330,
    //     y: departmentY + 1,
    //     size: 9,
    //     font: fontBold,
    //     color: rgb(0, 0, 0),
    // });
    // page.drawText(`: ${empId}`, {
    //     x: 452,
    //     y: departmentY + 1,
    //     size: 9,
    //     font: fontNormal,
    //     color: rgb(0, 0, 0),
    // });

    // page.drawText(`DEPARTMENT`, {
    //     x: departmentX,
    //     y: departmentY + 1,
    //     size: 9,
    //     font: fontBold,
    //     color: rgb(0, 0, 0),
    // });
    // page.drawText(`:  ${safeDepartment}`, {
    //     x: 98 + 2,
    //     y: departmentY + 1,
    //     size: 9,
    //     font: fontNormal,
    //     color: rgb(0, 0, 0),
    // });

    return pdfDoc.save();
};

const CiplaBommaSandraAudioModifier = ({
    corpId = TARGET_CORP_ID,
    campCycleId = TARGET_CAMP_CYCLE_ID,
    fileType = "AUDIOMETRY",
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [list, setList] = useState([]);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [manualEmpId, setManualEmpId] = useState("");
    const [manualFile, setManualFile] = useState(null);
    const [isManualUploading, setIsManualUploading] = useState(false);
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

        const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
        const result = await getData(url);

        if (result?.data) {
            const filtered = result.data.filter(
                (item) =>
                (item?.audiometryUrl && [
                    "41000362",
                    "41000276",
                    "41000352",
                    "41000351",
                    "41000343",
                    "41000161",
                    "41000490",
                    "41000546",
                    "168420",
                    "166917",
                    "41000342",
                    "169688",
                    "41000606",
                    "162545",
                    "41000344",
                    "NE002"
                ].includes(item?.empId))

            );
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

    const modifyAndUploadAudio = async (employee) => {
        if (!employee?.audiometryUrl) {
            throw new Error("Missing Audiometry URL");
        }

        const modifiedBytes = await modifyAudioPdf(
            employee.audiometryUrl,
            employee?.department,
            employee.empId
        );
        const modifiedBlob = new Blob([modifiedBytes], { type: "application/pdf" });

        // const previewUrl = URL.createObjectURL(modifiedBlob);
        // window.open(previewUrl, "_blank");


        const formData = new FormData();
        formData.append(
            "file",
            modifiedBlob,
            `${`${employee.empId}_audiometry.pdf`}`
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
            enqueueSnackbar("No Audio files found to modify.", { variant: "warning" });
            return;
        }

        setIsProcessing(true);
        setUploadedCount(0);
        setFailedEmployees([]);

        let successCount = 0;

        for (let i = 0; i < list.length; i += 1) {
            const employee = list[i];
            try {
                await modifyAndUploadAudio(employee);
                successCount += 1;
            } catch (error) {
                console.error(`Audio modify/upload failed for ${employee.empId}:`, error);
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
            enqueueSnackbar("Department added for all Audio reports.", {
                variant: "success",
            });
        } else if (successCount > 0) {
            enqueueSnackbar(
                `Completed with errors: ${successCount} uploaded, ${list.length - successCount} failed.`,
                { variant: "warning" }
            );
        } else {
            enqueueSnackbar("All Audio uploads failed. Check failed employee list.", {
                variant: "error",
            });
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
            enqueueSnackbar("Please choose an Audio PDF file.", {
                variant: "warning",
            });
            return;
        }

        const isPdfFile =
            manualFile.type === "application/pdf" ||
            manualFile.name.toLowerCase().endsWith(".pdf");
        if (!isPdfFile) {
            enqueueSnackbar("Only PDF files are allowed for Audio upload.", {
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
                throw new Error("Manual Audio upload failed");
            }

            setUploadedCount((prev) => prev + 1);
            enqueueSnackbar(`Manual Audio uploaded for ${trimmedEmpId}`, {
                variant: "success",
            });
            setManualFile(null);
        } catch (error) {
            console.error("Manual Audio upload failed:", error);
            enqueueSnackbar("Manual Audio upload failed.", {
                variant: "error",
            });
        } finally {
            setIsManualUploading(false);
        }
    };

    return (
        <div>
            <h3>Cipla Bommasandra Audio Modifier</h3>
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
            <h4>Manual Audio Upload</h4>
            <input
                type="text"
                placeholder="Enter Employee ID"
                value={manualEmpId}
                onChange={(event) => setManualEmpId(event.target.value)}
                list="manual-audio-emp-id-list"
                disabled={isManualUploading}
            />
            <datalist id="manual-audio-emp-id-list">
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
                {isManualUploading ? "Uploading..." : "Upload Manual Audio"}
            </button>
            {manualFile && <div>Selected File: {manualFile.name}</div>}
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
                    <div>{`${index + 1}. ${item.empId} ${item.name} | Dept: ${item?.department || "-"}`}</div>
                    {item?.audiometryUrl ? (
                        <a href={item.audiometryUrl} target="_blank" rel="noreferrer">
                            {item.audiometryUrl}
                        </a>
                    ) : (
                        <span>-</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CiplaBommaSandraAudioModifier;
