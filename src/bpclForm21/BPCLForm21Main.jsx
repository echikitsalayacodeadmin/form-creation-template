
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import BPCLForm21Template from "./BPCLForm21Template";
import { uploadFile } from "../assets/services/PostApiCall";

const BPCLForm21Main = ({
    corpId = "ae492300-db66-467f-90c9-dad37f31b2cb",
    campCycleId = "376455",
    fileType = "ANNEXURE", }) => {
    const { enqueueSnackbar } = useSnackbar();

    const [list, setList] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [errorEmpCount, setErrorEmpCount] = useState(0);
    const [errorEmpIDs, setErrorEmpIDs] = useState([]);

    const generatePDF = async (data, index) => {
        console.log({ data });
        try {
            const pdfBlob = await pdf(
                <BPCLForm21Template data={data} companyName="ACG Capsules" />
            ).toBlob();


            // const url2 = URL.createObjectURL(pdfBlob);
            // window.open(url2, "_blank");

            const formData = new FormData();
            formData.append("file", pdfBlob, `${data?.empId}_FORM_21.pdf`);



            const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
            const result = await uploadFile(url, formData);



            if (result && result.data) {
                enqueueSnackbar("Successfully Uploaded PDF!", {
                    variant: "success",
                });
                setUploadedCount((prevCount) => prevCount + 1);
            } else {
                enqueueSnackbar("An error Occurred!", {
                    variant: "error",
                });
                setErrorEmpCount((prevCount) => prevCount + 1);
                setErrorEmpIDs((prev) => [...prev, data?.empId]);
            }

        } catch (error) {
            console.error("Error generating/uploading PDF:", error);
            enqueueSnackbar("Error generating/uploading PDF", {
                variant: "error",
            });
            setErrorEmpCount((prevCount) => prevCount + 1);
            setErrorEmpIDs((prev) => [...prev, data?.empId]);
        }
    };

    const fetchListOfEmployees = async () => {
        if (!corpId || !campCycleId) return;

        try {
            const vitalsUrl = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;

            const form21Url = `https://apibackend.uno.care/api/org/form21?corpId=${corpId}&campCycleId=${campCycleId}`;

            // fetch both APIs together
            const [vitalsResult, form21Result] = await Promise.all([
                getData(vitalsUrl),
                getData(form21Url),
            ]);

            const vitalsData = vitalsResult?.data || [];
            const form21Data = form21Result?.data || [];

            // Create map of form21 data using empId
            const form21Map = {};
            form21Data.forEach((item) => {
                form21Map[item.empId] = item;
            });

            // merge both data
            const mergedData = vitalsData
                .filter((item) => item?.vitalsCreatedDate)
                .map((vital) => ({
                    ...vital,
                    form21: form21Map[vital.empId] || null,
                }));

            const sorted = sortDataByName(mergedData);

            setList(sorted);
            setTotalEmployees(sorted.length);

        } catch (error) {
            console.error("Error fetching employee list:", error);
            setList([]);
            setTotalEmployees(0);
        }
    };
    useEffect(() => {
        fetchListOfEmployees();
    }, [corpId, campCycleId]);

    const handleGeneratePDFs = async () => {
        for (let i = 0; i < list.length; i++) {
            await generatePDF(list[i], i);
        }
    };
    const handleDeletePDF = async () => {
        for (let i = 0; i < list.length; i++) {
            await deleteFiles(list[i]);
        }
    };

    const deleteFiles = async (data) => {
        const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;
        const result = await updateData(url);
        if (result && result.data) {
            enqueueSnackbar("Successfully Uploaded PDF!", {
                variant: "success",
            });
            setUploadedCount((prevCount) => prevCount + 1);
        } else {
            enqueueSnackbar("An error Occurred!", {
                variant: "error",
            });
        }
    };

    return (
        <Fragment>
            <div>
                <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
                <button onClick={handleDeletePDF}>Delete Files</button>
                <div>Total Employees: {totalEmployees}</div> <br />
                <div>Uploaded Files: {uploadedCount}</div> <br />
                <div>Error Files: {errorEmpCount}</div> <br />
                <div>
                    Error EmpID: {errorEmpIDs?.map((item) => item).join(",")}
                </div>{" "}
                <br />
                {list.map((item, index) => (
                    <div key={index} style={{ display: "flex" }}>
                        <div key={index}>{`${index}- ${item.empId} ${item.name}`}</div>

                        <a href={item.annexureUrl}>
                            <div key={index}>{item.annexureUrl}</div>
                        </a>

                        <br />
                    </div>
                ))}
            </div>
            <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
                <BPCLForm21Template data={list[0]} companyName="ACG Capsules" />
            </PDFViewer>
        </Fragment>
    );
};

export default BPCLForm21Main;
