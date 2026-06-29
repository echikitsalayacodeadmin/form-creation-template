import React, { Fragment, useEffect, useState } from "react";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import SamsungForm27Template from "./SamsungForm27Template";

const SamsungForm27 = ({
    corpId = '33525031-d147-41e3-8dc6-c330be785f88',
    campCycleId = '428775',
    fileType = "ANNEXURE",
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [list, setList] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [errorEmpCount, setErrorEmpCount] = useState(0);
    const [errorEmpIDs, setErrorEmpIDs] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const generatePDF = async (data) => {
        try {
            const pdfBlob = await pdf(
                <SamsungForm27Template data={data} />
            ).toBlob();

            // const url2 = URL.createObjectURL(pdfBlob);
            // window.open(url2, "_blank");

            const formData = new FormData();
            formData.append("file", pdfBlob, `${data?.empId}_FORM27.pdf`);

            const url = `https://apitest.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
            const result = await uploadFile(url, formData);

            if (result?.data) {
                enqueueSnackbar(`Form 27 uploaded for ${data.empId}`, {
                    variant: "success",
                });
                setUploadedCount((prev) => prev + 1);
            } else {
                enqueueSnackbar(`Upload failed for ${data.empId}`, {
                    variant: "error",
                });
                setErrorEmpCount((prev) => prev + 1);
                setErrorEmpIDs((prev) => [...prev, data.empId]);
            }
        } catch (error) {
            console.error("Error generating/uploading Form 27:", error);
            enqueueSnackbar(`Error for ${data?.empId}`, { variant: "error" });
            setErrorEmpCount((prev) => prev + 1);
            setErrorEmpIDs((prev) => [...prev, data.empId]);
        }
    };

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
            const temp = result.data.filter((item) => item.empId === "8512638");
            const sorted = sortDataByName(temp);
            setList(sorted);
            setTotalEmployees(sorted.length);
            return;
        }

        enqueueSnackbar("Error fetching employee list", { variant: "error" });
        setList([]);
        setTotalEmployees(0);
    };

    useEffect(() => {
        fetchListOfEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [corpId, campCycleId]);

    const handleGeneratePDFs = async () => {
        if (!list.length) {
            enqueueSnackbar("No employees found.", { variant: "warning" });
            return;
        }

        setIsProcessing(true);
        setUploadedCount(0);
        setErrorEmpCount(0);
        setErrorEmpIDs([]);

        for (let i = 0; i < list.length; i += 1) {
            await generatePDF(list[i]);
        }

        setIsProcessing(false);
    };

    const deleteFiles = async (data) => {
        const url = `https://apitest.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;
        const result = await updateData(url);

        if (result?.data) {
            enqueueSnackbar(`Deleted ${data.empId}`, { variant: "success" });
        } else {
            enqueueSnackbar(`Delete failed for ${data.empId}`, { variant: "error" });
        }
    };

    const handleDeletePDF = async () => {
        for (let i = 0; i < list.length; i += 1) {
            await deleteFiles(list[i]);
        }
    };

    return (
        <Fragment>
            <div>
                <h3>Samsung Form 27 Health Register</h3>
                <div>corpId: {corpId || "-"}</div>
                <div>campCycleId: {campCycleId || "-"}</div>
                <br />
                <button onClick={handleGeneratePDFs} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Start Generating"}
                </button>{" "}
                <button onClick={handleDeletePDF} disabled={isProcessing}>
                    Delete Files
                </button>
                <div>Total Employees: {totalEmployees}</div>
                <div>Uploaded Files: {uploadedCount}</div>
                <div>Error Files: {errorEmpCount}</div>
                <div>Error EmpIDs: {errorEmpIDs.join(", ")}</div>
                <br />
                {list.map((item, index) => (
                    <div key={item.empId || index}>
                        {index + 1}. {item.empId} - {item.name} :
                        <a href={item.annexureUrl}>{item.annexureUrl}</a>
                        <br />
                    </div>
                ))}
            </div>

            {list[0] && (
                <PDFViewer style={{ width: "100%", height: "calc(100vh - 220px)" }}>
                    <SamsungForm27Template data={list[0]} />
                </PDFViewer>
            )}
        </Fragment>
    );
};

export default SamsungForm27;
