


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
    campCycleId = "396613",
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

                // const temp = result?.data
                //     ?.filter((item) => [
                //         "170761"
                //     ]?.includes(item?.empId))

                const staffMap = Object.fromEntries(
                    STAFF_WORKER_LIST.map((val) => [
                        String(val.Employeeid),
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
                    ?.filter(Boolean)?.filter((item) => item.empId === '508164');
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
        "Sno": 800,
        "MainSrNo": 112,
        "Employeeid": 170398,
        "CC": 7033,
        "DESCRIPTION": "COMBUSTION CHAMBER & ROCKER LEVER",
        "NAME": "SARJERAO KALAPPA SHELAKE",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "W-0",
        "DESIGNATION": "ASST.TURNER",
        "Vitals date": "4/13/26"
    },
    {
        "Sno": 801,
        "MainSrNo": 116,
        "Employeeid": 170543,
        "CC": 7033,
        "DESCRIPTION": "COMBUSTION CHAMBER & ROCKER LEVER",
        "NAME": "SAINATH HANMANT BARTAKKE",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "W-0",
        "DESIGNATION": "ASST.FITTER",
        "Vitals date": "4/11/26"
    },
    {
        "Sno": 802,
        "MainSrNo": 169,
        "Employeeid": 170481,
        "CC": 7034,
        "DESCRIPTION": "DECKLE LINE",
        "NAME": "SANJAY KUMAR",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "W-0",
        "DESIGNATION": "HELPER",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 803,
        "MainSrNo": 178,
        "Employeeid": 170580,
        "CC": 7034,
        "DESCRIPTION": "DECKLE LINE",
        "NAME": "MOHD SUHEL",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "W-0",
        "DESIGNATION": "ASST.ELECTRICIAN",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 804,
        "MainSrNo": 217,
        "Employeeid": 404213,
        "CC": 7035,
        "DESCRIPTION": "HELLER LINE & FMS AND SPM LINE (VA50)",
        "NAME": "SAURABH SUBHASH SATRE",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "S-2",
        "DESIGNATION": "JR.ENGINEER",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 805,
        "MainSrNo": 242,
        "Employeeid": 35006,
        "CC": 7052,
        "DESCRIPTION": "OM 616 ENGINE + DECKEL & HELLER QUALITY",
        "NAME": "SANJAY BHASKAR PALHADE",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "S-5",
        "DESIGNATION": "SR. ENGINEER - II",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 806,
        "MainSrNo": 258,
        "Employeeid": 404411,
        "CC": 7052,
        "DESCRIPTION": "OM 616 ENGINE + DECKEL & HELLER QUALITY",
        "NAME": "AKSHAY RAVIRAJ THAKUR",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "S-2",
        "DESIGNATION": "JR.ENGINEER",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 807,
        "MainSrNo": 265,
        "Employeeid": 170326,
        "CC": 7081,
        "DESCRIPTION": "ENGINE-PLANT MAINTENANCE",
        "NAME": "SHEKH ADEEL SHEKH MAHEBUB",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "W-0",
        "DESIGNATION": "ASST.FITTER",
        "Vitals date": "4/11/26"
    },
    {
        "Sno": 808,
        "MainSrNo": 280,
        "Employeeid": 170381,
        "CC": 7081,
        "DESCRIPTION": "ENGINE-PLANT MAINTENANCE",
        "NAME": "RAHUL KUMAR",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "W-0",
        "DESIGNATION": "ASST.ELECTRICIAN",
        "Vitals date": "4/13/26"
    },
    {
        "Sno": 809,
        "MainSrNo": 284,
        "Employeeid": 170534,
        "CC": 7081,
        "DESCRIPTION": "ENGINE-PLANT MAINTENANCE",
        "NAME": "ABDALLAH MUKHTAR THAKUR",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "W-0",
        "DESIGNATION": "HELPER",
        "Vitals date": "4/11/26"
    },
    {
        "Sno": 810,
        "MainSrNo": 317,
        "Employeeid": 507957,
        "CC": 7132,
        "DESCRIPTION": "SOFT LINE - GEAR,SHAFT & SLEEVES",
        "NAME": "ROHIT KUMAR",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 811,
        "MainSrNo": 342,
        "Employeeid": 33015,
        "CC": 7171,
        "DESCRIPTION": "TRANSMISSION-MATERIALS GROUP",
        "NAME": "AMOL JAWAHARLAL KATARIYA",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 812,
        "MainSrNo": 388,
        "Employeeid": 36666,
        "CC": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "NAME": "SWAPAN KUMAR MAHATO",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 813,
        "MainSrNo": 551,
        "Employeeid": 406358,
        "CC": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "NAME": "SUJAN MANDAL",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "S-2",
        "DESIGNATION": "JR. ENGINEER",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 814,
        "MainSrNo": 565,
        "Employeeid": 507620,
        "CC": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "NAME": "SHAUNAK SURESH MADDEL",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN",
        "Vitals date": "4/11/26"
    },
    {
        "Sno": 815,
        "MainSrNo": 574,
        "Employeeid": 507665,
        "CC": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "NAME": "SOHEL AKHTAR",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 816,
        "MainSrNo": 589,
        "Employeeid": 507906,
        "CC": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "NAME": "ANIRBAN GHOSH",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "T-9",
        "DESIGNATION": "D.E.T.",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 817,
        "MainSrNo": 624,
        "Employeeid": 170647,
        "CC": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "NAME": "ANIL KUMAR KUSHWAHA",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "W-0",
        "DESIGNATION": "HELPER",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 818,
        "MainSrNo": 639,
        "Employeeid": 507958,
        "CC": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "NAME": "AKSHAYLAL SINGH",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 819,
        "MainSrNo": 644,
        "Employeeid": 507971,
        "CC": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "NAME": "SHAIKH FAIJAN SHAIKH FAYYAZ AHMED",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 820,
        "MainSrNo": 667,
        "Employeeid": 508051,
        "CC": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "NAME": "SOFIYA PRAVEEN",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "T-9",
        "DESIGNATION": "D.E.T.",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 821,
        "MainSrNo": 770,
        "Employeeid": 401277,
        "CC": 8729,
        "DESCRIPTION": "COMPONENT TESTING",
        "NAME": "ASHLESH ANANDRAO MENGADE",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "S-6",
        "DESIGNATION": "JR. ENGINEERING MANAGER-I",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 822,
        "MainSrNo": 791,
        "Employeeid": 403468,
        "CC": 8744,
        "DESCRIPTION": "R&D NVH - CAE & TESTING",
        "NAME": "VIKAS RAMDAS PAWAR",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "M-3",
        "DESIGNATION": "MANAGER",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 823,
        "MainSrNo": 792,
        "Employeeid": 405120,
        "CC": 8744,
        "DESCRIPTION": "R&D NVH - CAE & TESTING",
        "NAME": "SAAHIL SAXENA",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "M-6",
        "DESIGNATION": "DY. GENERAL MANAGER",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 824,
        "MainSrNo": 799,
        "Employeeid": 406300,
        "CC": 8744,
        "DESCRIPTION": "R&D NVH - CAE & TESTING",
        "NAME": "ABHAY VINOD KESARE",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "S-5",
        "DESIGNATION": "JR. ENGINEERING MANAGER-II",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 825,
        "MainSrNo": 813,
        "Employeeid": 27611,
        "CC": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "NAME": "PRITHVIRAJ NAGUSA CHAVAN.",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "M-3",
        "DESIGNATION": "MANAGER",
        "Vitals date": "4/13/26"
    },
    {
        "Sno": 826,
        "MainSrNo": 833,
        "Employeeid": 250658,
        "CC": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "NAME": "DNYANESWAR PANDURANG KUMBHAR",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "A-0",
        "DESIGNATION": "TR APP-ELECTRICIAN",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 827,
        "MainSrNo": 841,
        "Employeeid": 400193,
        "CC": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "NAME": "SANDIP JOTIRAM GAVALI",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER",
        "Vitals date": "4/13/26"
    },
    {
        "Sno": 828,
        "MainSrNo": 849,
        "Employeeid": 400792,
        "CC": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "NAME": "SUNIL EKNATH RASKAR.",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER",
        "Vitals date": "4/13/26"
    },
    {
        "Sno": 829,
        "MainSrNo": 859,
        "Employeeid": 402503,
        "CC": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "NAME": "BALASAHEB BABURAO KESKAR",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "S-4",
        "DESIGNATION": "OFFICER",
        "Vitals date": "4/13/26"
    },
    {
        "Sno": 830,
        "MainSrNo": 913,
        "Employeeid": 405890,
        "CC": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "NAME": "SHITAL RAJANAND WAGHMARE",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "S-6",
        "DESIGNATION": "JR. ENGINEERING MANAGER - I",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 831,
        "MainSrNo": 914,
        "Employeeid": 405996,
        "CC": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "NAME": "RONAK SUNIL LODHA",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "S-4",
        "DESIGNATION": "ENGINEER",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 832,
        "MainSrNo": 923,
        "Employeeid": 507905,
        "CC": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "NAME": "OM SURYAKIRAN VADHANE",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "T-9",
        "DESIGNATION": "G.E.T.",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 833,
        "MainSrNo": "",
        "Employeeid": 170805,
        "CC": 7421,
        "DESCRIPTION": "",
        "NAME": "ABHISHEK KUMAR YADAV",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "",
        "DESIGNATION": "Assistant fitter",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 834,
        "MainSrNo": "",
        "Employeeid": 170804,
        "CC": 7421,
        "DESCRIPTION": "",
        "NAME": "AKSHAY OHAL",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "",
        "DESIGNATION": "",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 835,
        "MainSrNo": "",
        "Employeeid": 170788,
        "CC": 8726,
        "DESCRIPTION": "",
        "NAME": "ATUL HABBU RATHOD",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "",
        "DESIGNATION": "Asst. Fitter",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 836,
        "MainSrNo": "",
        "Employeeid": 507826,
        "CC": 8746,
        "DESCRIPTION": "",
        "NAME": "AVANTIKA BHOSALE",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "",
        "DESIGNATION": "GET",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 837,
        "MainSrNo": "",
        "Employeeid": 507892,
        "CC": 8712,
        "DESCRIPTION": "",
        "NAME": "BHAVANA MAMILLAPALLI",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "",
        "DESIGNATION": "GET",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 838,
        "MainSrNo": "",
        "Employeeid": 406580,
        "CC": 7421,
        "DESCRIPTION": "",
        "NAME": "KHARAT ROHIT JAGANNATH",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "",
        "DESIGNATION": "Engeneer",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 839,
        "MainSrNo": "",
        "Employeeid": 508164,
        "CC": 8859,
        "DESCRIPTION": "",
        "NAME": "MD SANJAR ALAM",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "",
        "DESIGNATION": "Tr. Technician",
        "Vitals date": "4/13/26"
    },
    {
        "Sno": 840,
        "MainSrNo": "",
        "Employeeid": 170814,
        "CC": 7421,
        "DESCRIPTION": "",
        "NAME": "ROHIT JAISWAL",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "",
        "DESIGNATION": "",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 841,
        "MainSrNo": "",
        "Employeeid": 400216,
        "CC": 7201,
        "DESCRIPTION": "",
        "NAME": "SANDEEP KUNTAL",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "",
        "DESIGNATION": "Senior manager",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 842,
        "MainSrNo": "",
        "Employeeid": 170798,
        "CC": 7421,
        "DESCRIPTION": "",
        "NAME": "UDAY PUNHASE",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "",
        "DESIGNATION": "Welder",
        "Vitals date": "4/10/26"
    },
    {
        "Sno": 843,
        "MainSrNo": "",
        "Employeeid": 170288,
        "CC": 8726,
        "DESCRIPTION": "",
        "NAME": "VIVEK KURUNKAR",
        "CATEGORY": "STAFF / WORKER",
        "Grade": "",
        "DESIGNATION": "Asst. Welder",
        "Vitals date": "4/10/26"
    }
]