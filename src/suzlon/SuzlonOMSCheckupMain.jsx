import React, { Fragment, useEffect, useState } from "react";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import SuzlonOMSCheckupTemplate from "./SuzlonOMSCheckupTemplate";
import { mapSuzlonOMSCheckupData } from "./SuzlonOMSCheckupMapper";

const SUZLON_HARDCODED_PATHOLOGY = {
    "2481": {
        haemoglobin: "16.9",
        pcv: "54.2",
        platelet: "3.18 Lakh",
        wbc: "7650",
        neutrophils: "55",
        monocytes: "07",
        eosinophils: "03",
        basophils: "00",
    },
    "RTSFS02461": {
        haemoglobin: "11.4",
        pcv: "38.4",
        platelet: "3.01 Lakh",
        wbc: "6800",
        neutrophils: "60",
        monocytes: "05",
        eosinophils: "03",
        basophils: "00",
    },
};

const applyHardcodedPathology = (model, empId) => {
    const hardcodedPathology = SUZLON_HARDCODED_PATHOLOGY[empId];
    if (!hardcodedPathology) return model;

    return {
        ...model,
        pathology: {
            ...model.pathology,
            ...hardcodedPathology,
        },
    };
};

const SuzlonOMSCheckupMain = ({
    corpId = "5cc0376c-1038-4260-9fc3-ee553bfc33b1",
    campCycleId = "433841",
    fileType = "ANNEXURE",
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [list, setList] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [errorEmpCount, setErrorEmpCount] = useState(0);
    const [errorEmpIDs, setErrorEmpIDs] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const generatePDF = async (data, serialNo) => {
        try {
            const model = applyHardcodedPathology(
                mapSuzlonOMSCheckupData(data, serialNo),
                data?.empId
            );
            const pdfBlob = await pdf(
                <SuzlonOMSCheckupTemplate model={model} />
            ).toBlob();


            // const url = URL.createObjectURL(pdfBlob);
            // window.open(url, "_blank");

            const formData = new FormData();
            formData.append("file", pdfBlob, `${data?.empId}_consolidatedReport.pdf`);

            const url = `https://apitest.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
            const result = await uploadFile(url, formData);

            if (result?.data) {
                enqueueSnackbar(`Report uploaded for ${data.empId}`, {
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
            console.error("Error generating/uploading report:", error);
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
            const sorted = sortDataByName(result.data.filter(item => ["RTSFS02461", "2481", "2194", "RTSFS06140"].includes(item.empId)));
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
            await generatePDF(list[i], i + 1);
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
                <h3>Suzlon OMS Medical Check-up Report</h3>
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
                        {index + 1}. {item.empId} - {item.name} BMI: {item.bmi}
                        {item.annexureUrl ? (
                            <>
                                {" "}
                                : <a href={item.annexureUrl}>{item.annexureUrl}</a>
                            </>
                        ) : null}
                        <br />
                    </div>
                ))}
            </div>
        </Fragment>
    );
};

export default SuzlonOMSCheckupMain;
