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
const HEADER_HEIGHT_PAGE_1 = 110;
const HEADER_HEIGHT_PAGE_2 = 60;

const toPascalCaseWords = (value = "") =>
    `${value}`
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

const modifyEcgPdf = async (ecgUrl, employee) => {
    const pdfBytes = await fetch(ecgUrl).then((response) => response.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    if (!pages?.length) {
        throw new Error("ECG PDF has no pages");
    }

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const headerImageBytes = await fetch(unoHeaderCiplaLtd).then((response) =>
        response.arrayBuffer()
    );
    const headerImage = await pdfDoc.embedPng(headerImageBytes);

    const department = toPascalCaseWords(
        employee?.department || employee?.deparment || "-"
    );
    const employeeName = toPascalCaseWords(employee?.name || "-");
    const nameWithDepartment = `${employeeName}   Department: ${department}`;

    pages.forEach((page, pageIndex) => {
        const { width, height } = page.getSize();
        const headerHeight = pageIndex === 0 ? HEADER_HEIGHT_PAGE_1 : HEADER_HEIGHT_PAGE_2;

        // Add header on every page
        page.drawRectangle({
            x: 0,
            y: height - headerHeight,
            width,
            height: headerHeight,
            color: rgb(1, 1, 1),
        });
        page.drawImage(headerImage, {
            x: 0,
            y: height - headerHeight,
            width,
            height: headerHeight,
        });

        // White-out and rewrite Name section on both pages (template coordinates)
        if (pageIndex === 0) {
            page.drawRectangle({
                x: 228,
                y: height - 150,
                width: 320,
                height: 18,
                color: rgb(1, 1, 1),
            });
            page.drawText(`${nameWithDepartment}`, {
                x: 232,
                y: height - 145,
                size: 11,
                font,
                color: rgb(0, 0, 0),
            });
        } else {
            page.drawRectangle({
                x: 40,
                y: height - 95,
                width: 200,
                height: 25,
                color: rgb(1, 1, 1),
            });
            page.drawText(`Name: ${nameWithDepartment}`, {
                x: 40,
                y: height - 92,
                size: 11,
                font,
                color: rgb(0, 0, 0),
            });
        }
    });

    return pdfDoc.save();
};

const CiplaBommaSandraECGModifier = ({
    corpId = TARGET_CORP_ID,
    campCycleId = TARGET_CAMP_CYCLE_ID,
    fileType = "ECG",
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [list, setList] = useState([]);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

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

    const modifyAndUploadEcg = async (employee) => {
        if (!employee?.ecgUrl) {
            return;
        }

        const modifiedBytes = await modifyEcgPdf(employee.ecgUrl, employee);
        const modifiedBlob = new Blob([modifiedBytes], { type: "application/pdf" });

        // const previewUrl = URL.createObjectURL(modifiedBlob);
        // window.open(previewUrl, "_blank");

        const formData = new FormData();
        formData.append(
            "file",
            modifiedBlob,
            `${employee?.ecgUrl?.split("/").pop() || `${employee.empId}_ecg.pdf`}`
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
            enqueueSnackbar("No ECG files found to modify.", { variant: "warning" });
            return;
        }

        setIsProcessing(true);
        setUploadedCount(0);

        try {
            for (let i = 0; i < list.length; i += 1) {
                await modifyAndUploadEcg(list[i]);
            }
            enqueueSnackbar("Header and department added on both ECG pages.", {
                variant: "success",
            });
        } catch (error) {
            console.error("ECG modify/upload failed:", error);
            enqueueSnackbar("Stopped due to an error while modifying/uploading ECG.", {
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

    return (
        <div>
            <h3>Cipla Bommasandra ECG Modifier</h3>
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
            {list.map((item, index) => (
                <div key={item.empId || index} style={{ display: "flex", gap: "8px" }}>
                    <div>{`${index + 1}. ${item.empId} ${item.name} | Dept: ${item?.department || item?.deparment || "-"
                        }`}</div>
                    {item?.ecgUrl ? (
                        <a href={item.ecgUrl} target="_blank" rel="noreferrer">
                            {item.ecgUrl}
                        </a>
                    ) : (
                        <span>-</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CiplaBommaSandraECGModifier;
