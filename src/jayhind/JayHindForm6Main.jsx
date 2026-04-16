


import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import JayHindForm6Template from "./JayHindForm6Template";


const JayHindForm6Main = ({
    corpId = "14dca1f0-fa04-4526-ba01-f5f83e0f2494",
    campCycleId = "401838",
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
                <JayHindForm6Template data={data} />
            ).toBlob();

            const formData = new FormData();
            formData.append("file", pdfBlob, `${data?.empId}_form6.pdf`);

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
            const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
            const result = await getData(url);
            if (result && result.data) {

                const staffMap = Object.fromEntries(
                    STAFF_WORKER_LIST.map((val) => [
                        String(val.EMP_NO),
                        val,
                    ])
                );

                const temp = result?.data
                    ?.map((item) => {
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

                console.log({ EMPLOYEE_LIST: temp?.map((item) => item?.empId) })
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
                <JayHindForm6Template data={list[0]} />
            </PDFViewer>
        </Fragment>
    );
};

export default JayHindForm6Main;


const STAFF_WORKER_LIST = [
    {
        "SR": "",
        "CC": 6187,
        "DESCRIPTION": "PDC 2 FETTLING URSE",
        "EMP_NO": 318365,
        "NAME": "ARBIND KUMAR",
        "Grade": "",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "2026-04-06",
        "CATEGORY": "STAFF"
    },
    {
        "SR": "",
        "CC": 8859,
        "DESCRIPTION": "",
        "EMP_NO": 508186,
        "NAME": "BHASKAR ROY",
        "Grade": "",
        "DESIGNATION": "ASST. MANAGER",
        "DATE": "2026-04-06",
        "CATEGORY": "STAFF"
    },
    {
        "SR": "",
        "CC": "",
        "DESCRIPTION": "",
        "EMP_NO": "PSS11",
        "NAME": "Datta baburao bhosle",
        "Grade": "",
        "DESIGNATION": "",
        "DATE": "2026-04-06",
        "CATEGORY": "STAFF"
    },
    {
        "SR": "",
        "CC": "",
        "DESCRIPTION": "",
        "EMP_NO": "PSS12",
        "NAME": "Laxman Sutar",
        "Grade": "",
        "DESIGNATION": "Material Handling",
        "DATE": "2026-04-06",
        "CATEGORY": "STAFF"
    },
    {
        "SR": "",
        "CC": 6124,
        "DESCRIPTION": "",
        "EMP_NO": 100692,
        "NAME": "ASHOK KUMAR KORI",
        "Grade": "",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "2026-04-07",
        "CATEGORY": "STAFF"
    },
    {
        "SR": "",
        "CC": 6196,
        "DESCRIPTION": "STANDARD ROOM",
        "EMP_NO": 407170,
        "NAME": "BHUPENDRA MATHANKAR",
        "Grade": "",
        "DESIGNATION": "ASST. MANAGER",
        "DATE": "2026-04-08",
        "CATEGORY": "STAFF"
    },
    {
        "SR": "",
        "CC": 6135,
        "DESCRIPTION": "",
        "EMP_NO": 400014,
        "NAME": "BHUSHAN PATIL",
        "Grade": "",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "2026-04-08",
        "CATEGORY": "STAFF"
    },
    {
        "SR": "",
        "CC": 6222,
        "DESCRIPTION": "",
        "EMP_NO": 407274,
        "NAME": "GULSHAN",
        "Grade": "",
        "DESIGNATION": "ASST. MANAGER",
        "DATE": "2026-04-08",
        "CATEGORY": "STAFF"
    },
    {
        "SR": "",
        "CC": 6173,
        "DESCRIPTION": "FETTLING P.D.C.",
        "EMP_NO": 318462,
        "NAME": "PRAKASH PRADHAN",
        "Grade": "",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "2026-04-08",
        "CATEGORY": "STAFF"
    },
    {
        "SR": "",
        "CC": 6187,
        "DESCRIPTION": "PDC 2 FETTLING URSE",
        "EMP_NO": 318542,
        "NAME": "PRONAB MUKHARJEE",
        "Grade": "",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "2026-04-08",
        "CATEGORY": "STAFF"
    },
    {
        "SR": "",
        "CC": 6216,
        "DESCRIPTION": "UR GDC ELECT MAINT",
        "EMP_NO": 407151,
        "NAME": "SHUBHAM JADHAV",
        "Grade": "",
        "DESIGNATION": "ASST. MANAGER",
        "DATE": "2026-04-08",
        "CATEGORY": "STAFF"
    },
    {
        "SR": "",
        "CC": 6222,
        "DESCRIPTION": "",
        "EMP_NO": 407263,
        "NAME": "SOUMENDU PANJA",
        "Grade": "",
        "DESIGNATION": "ASST. MANAGER",
        "DATE": "2026-04-08",
        "CATEGORY": "STAFF"
    },
    {
        "SR": "",
        "CC": 8859,
        "DESCRIPTION": "",
        "EMP_NO": 508010,
        "NAME": "SURAJIT JANA",
        "Grade": "",
        "DESIGNATION": "ASST. MANAGER",
        "DATE": "2026-04-08",
        "CATEGORY": "STAFF"
    },
    {
        "SR": "",
        "CC": 6172,
        "DESCRIPTION": "",
        "EMP_NO": 317916,
        "NAME": "SUSANTA MAHATO",
        "Grade": "",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "2026-04-08",
        "CATEGORY": "STAFF"
    }
]