


import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import ForceMotorForm6Template from "./ForceMotorForm6Template";


const ForceMotorForm6Main = ({
    corpId = "94180f9d-b1bf-4794-b81c-5f21a908ad9c",
    campCycleId = "410816",
    fileType = "ANNEXURE",
}) => {
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
                <ForceMotorForm6Template data={data} />
            ).toBlob();

            const formData = new FormData();
            formData.append("file", pdfBlob, `${data?.empId}_form6.pdf`);

            const url = `https://apitest.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
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
            // const url = URL.createObjectURL(pdfBlob);
            // window.open(url, "_blank");
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
            const url = `https://apitest.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
            const result = await getData(url);
            if (result && result.data) {

                // const temp = result?.data
                //     ?.filter((item) => [
                //         "170761"
                //     ]?.includes(item?.empId))

                const staffMap = Object.fromEntries(
                    STAFF_WORKER_LIST.map((val) => [
                        String(val.EmployeeId),
                        val,
                    ])
                );

                console.log({
                    staffEmpList: STAFF_WORKER_LIST.map((item) =>
                        String(item.Employeeid)
                    )
                });


                const temp = result?.data
                    ?.map((item, index) => {
                        const d = staffMap[String(item?.empId)];

                        if (!d) return null;

                        return {
                            ...item,
                            EXTRAS: d,
                            pulseRate:
                                Math.floor(Math.random() * (80 - 72 + 1)) + 72,
                        };
                    })
                    ?.filter(Boolean);
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

    console.log({ list })

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
        const url = `https://apitest.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;
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
                        <div key={index}>{`${index}- ${item.empId} ${item.name} ${item?.age}`}</div>

                        <a href={item.annexureUrl}>
                            <div key={index}>{item.annexureUrl}</div>
                        </a>

                        <br />
                    </div>
                ))}
            </div>

            <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
                <ForceMotorForm6Template data={list[0]} />
            </PDFViewer>
        </Fragment>
    );
};

export default ForceMotorForm6Main;




const STAFF_WORKER_LIST = [


    {
        "LOCATION": "AKURDI",
        "Sno": 924,
        "MainSrNo": 924,
        "EmployeeId": 74502,
        "NAME": "SANJAY R CHAVAN",
        "CC": 6123,
        "Grade": "",
        "DESCRIPTION": "OPERATOR SEMISKILLED",
        "DESIGNATION": "PDC CAST FETTLING",
        "CATEGORY": "STAFF / WORKER",

    },
    {
        "LOCATION": "AKURDI",
        "Sno": 925,
        "MainSrNo": 925,
        "EmployeeId": 73864,
        "NAME": "SUHAS KRISHNA CHAVAN",
        "CC": 6124,
        "Grade": "",
        "DESCRIPTION": "FITTER SEMISKILLED",
        "DESIGNATION": "PDC MACHINING  - AKURDI",
        "CATEGORY": "STAFF / WORKER",

    },
    {
        "LOCATION": "AKURDI",
        "Sno": 926,
        "MainSrNo": 926,
        "EmployeeId": 76368,
        "NAME": "SURENDRA P MALLAH",
        "CC": 6122,
        "Grade": "",
        "DESCRIPTION": "WORKMAN SEMISKILLED",
        "DESIGNATION": "PDC DIE CASTING",
        "CATEGORY": "STAFF / WORKER",

    }
]