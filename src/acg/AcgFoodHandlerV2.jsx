
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import AcgFoodHandlerV2Template from "./AcgFoodHandlerV2Template";

const AcgFoodHandlerV2 = ({
    corpId = "c6027796-37d6-4bfc-a9ab-c2c69187cdd7",
    campCycleId = "194485",
    fileType = "FITNESS_CERTIFICATE_FOOD", }) => {
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
                <AcgFoodHandlerV2Template data={data} companyName="ACG Capsules" />
            ).toBlob();


            const url2 = URL.createObjectURL(pdfBlob);
            window.open(url2, "_blank");

            const formData = new FormData();
            formData.append("file", pdfBlob, `${data?.empId}_MER_FORM.pdf`);



            // const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
            // const result = await uploadFile(url, formData);



            // if (result && result.data) {
            //     enqueueSnackbar("Successfully Uploaded PDF!", {
            //         variant: "success",
            //     });
            //     setUploadedCount((prevCount) => prevCount + 1);
            // } else {
            //     enqueueSnackbar("An error Occurred!", {
            //         variant: "error",
            //     });
            //     setErrorEmpCount((prevCount) => prevCount + 1);
            //     setErrorEmpIDs((prev) => [...prev, data?.empId]);
            // }

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
        if (corpId && campCycleId) {
            const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
            const result = await getData(url);
            if (result && result.data) {
                const temp = result?.data?.filter((item) => item?.vitalsCreatedDate);
                const length = temp.length;
                const sorted = sortDataByName(temp);
                setList(sorted);
                setTotalEmployees(length);
            } else {
                console.log("An error Occurred");
                setList([]);
                setTotalEmployees("");
            }
        }
    };

    useEffect(() => {
        fetchListOfEmployees();
    }, [corpId, campCycleId]);

    const handleGeneratePDFs = async () => {
        for (let i = 0; i < 1; i++) {
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

                        <a href={item.medicalFitnessFoodUrl}>
                            <div key={index}>{item.medicalFitnessFoodUrl}</div>
                        </a>

                        <br />
                    </div>
                ))}
            </div>
            <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
                <AcgFoodHandlerV2Template data={list[0]} companyName="ACG Capsules" />
            </PDFViewer>
        </Fragment>
    );
};

export default AcgFoodHandlerV2;
