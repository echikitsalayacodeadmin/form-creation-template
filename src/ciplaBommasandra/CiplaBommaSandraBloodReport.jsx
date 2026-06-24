import React, { useEffect, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { useSnackbar } from "notistack";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";

const TARGET_CORP_ID = "b3148da9-7f8a-4712-a9a9-dfe8e3296137";
const TARGET_CAMP_CYCLE_ID = "423157";
const CLIENT_NAME = "Cipla Limited Bommasandra";

const modifyBloodPdf = async (bloodTestUrl, employee) => {
    const existingPdfBytes = await fetch(bloodTestUrl).then((response) =>
        response.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const patientName = `${employee?.name || "-"}_${employee?.empId || "-"}`;

    for (let i = 0; i < pages.length; i += 1) {
        const page = pages[i];
        const { height } = page.getSize();

        // Patient Name -> name_empId
        page.drawRectangle({
            x: 85,
            y: height - 134,
            width: 170,
            height: 18,
            color: rgb(1, 1, 1),
        });
        page.drawText(patientName, {
            x: 87,
            y: height - 129,
            size: 9,
            font,
            color: rgb(0, 0, 0),
        });

        // Client Name -> Cipla Ltd bommasandra
        page.drawRectangle({
            x: 85,
            y: height - 182,
            width: 120,
            height: 16,
            color: rgb(1, 1, 1),
        });
        page.drawText(CLIENT_NAME, {
            x: 86,
            y: height - 175,
            size: 8.5,
            font,
            color: rgb(0, 0, 0),
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

        const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
        const result = await getData(url);

        if (result?.data) {
            const filtered = result.data.filter((item) => item?.bloodTestUrl);
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
