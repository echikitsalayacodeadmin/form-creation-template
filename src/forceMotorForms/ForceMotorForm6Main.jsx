


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

                const staffMap = Object.fromEntries(
                    STAFF_WORKER_LIST.map((val) => [
                        String(val.employeeid),
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
                <ForceMotorForm6Template data={list[0]} />
            </PDFViewer>
        </Fragment>
    );
};

export default ForceMotorForm6Main;

const STAFF_WORKER_LIST = [
    {
        "type": "DANGEROUS OPERATION",
        "Sno": 24,
        "Cc": 7324,
        "DESCRIPTION": "PRESS SHOP-HIGH BAY",
        "employeeid": 300617,
        "NAME": "SUKESH V INGALE",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 13,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170621,
        "NAME": "SANJAY YADAV",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.SPRAY PAINTER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 20,
        "Cc": 6155,
        "DESCRIPTION": "SCV PAINT SHOP PRE-TREATMENT",
        "employeeid": 404607,
        "NAME": "LIMBAJI VENKATRAO SOLANKE",
        "Vitals date": "26-03-2026",
        "Grade": "S-5",
        "DESIGNATION": "SR. ENGINEER - II"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 33,
        "Cc": 6237,
        "DESCRIPTION": "TRACTOR-LIGHT MACHINE CELL",
        "employeeid": 17509,
        "NAME": "SUDHAKAR NARYAN CHOPADE",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.MACHINIST"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 38,
        "Cc": 6281,
        "DESCRIPTION": "TRACTOR-PLANT MAINTENANCE",
        "employeeid": 27301,
        "NAME": "PRAFUL CHANDRAKANT PARAKH",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 39,
        "Cc": 6281,
        "DESCRIPTION": "TRACTOR-PLANT MAINTENANCE",
        "employeeid": 33783,
        "NAME": "VITTHAL NANA PATIL",
        "Vitals date": "26-03-2026",
        "Grade": "S-6",
        "DESIGNATION": "SR. ENGINEER-I"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 42,
        "Cc": 7033,
        "DESCRIPTION": "COMBUSTION CHAMBER & ROCKER LEVER",
        "employeeid": 10547,
        "NAME": "SUDHIR BHAGWANRAO BARBOLE",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.GRINDER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 45,
        "Cc": 7033,
        "DESCRIPTION": "COMBUSTION CHAMBER & ROCKER LEVER",
        "employeeid": 20605,
        "NAME": "DHARMA BHABUTA JADHAV",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "GRINDER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 49,
        "Cc": 7033,
        "DESCRIPTION": "COMBUSTION CHAMBER & ROCKER LEVER",
        "employeeid": 400731,
        "NAME": "CHANGDEO CHABURAO TALPE",
        "Vitals date": "26-03-2026",
        "Grade": "S-5",
        "DESIGNATION": "SR. OFFICER-II"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 58,
        "Cc": 7037,
        "DESCRIPTION": "GEAR COMPONENTS",
        "employeeid": 400380,
        "NAME": "DNYANESHWAR NATHU MALI",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 59,
        "Cc": 7037,
        "DESCRIPTION": "GEAR COMPONENTS",
        "employeeid": 401138,
        "NAME": "BHARAT MANSING SURYAWANSHI",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 72,
        "Cc": 7132,
        "DESCRIPTION": "SOFT LINE - GEAR,SHAFT & SLEEVES",
        "employeeid": 16947,
        "NAME": "SHIVRAJ NAMDEV CHAVAN",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "MACHINIST"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 103,
        "Cc": 7138,
        "DESCRIPTION": "CROWN WHEEL(HARD)",
        "employeeid": 20608,
        "NAME": "SATISH UTTAM BHADANE",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "GRINDER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 136,
        "Cc": 7194,
        "DESCRIPTION": "CROWN WHEEL(SOFT)",
        "employeeid": 405060,
        "NAME": "PANKAJ PRAKASH NAWALE",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "JR.ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 139,
        "Cc": 7194,
        "DESCRIPTION": "CROWN WHEEL(SOFT)",
        "employeeid": 16931,
        "NAME": "RANJEET ANGADRAO PATIL",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "MACHINIST"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 146,
        "Cc": 7195,
        "DESCRIPTION": "PINION LINE(SOFT)",
        "employeeid": 400746,
        "NAME": "KRISHNAT RATAN KUMBHAR",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 157,
        "Cc": 7221,
        "DESCRIPTION": "FOUNDRY-MELTING",
        "employeeid": 401071,
        "NAME": "AJAY GAJANANRAO GANORKAR",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 159,
        "Cc": 7221,
        "DESCRIPTION": "FOUNDRY-MELTING",
        "employeeid": 403656,
        "NAME": "DEBENDRA KUMAR BHOI",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 163,
        "Cc": 7221,
        "DESCRIPTION": "FOUNDRY-MELTING",
        "employeeid": 170587,
        "NAME": "KARAN SHARMA",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "HELPER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 239,
        "Cc": 7223,
        "DESCRIPTION": "FOUNDRY-CYLINDER HEAD LINE",
        "employeeid": 400846,
        "NAME": "VITHAL BABAN MOHITE",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 241,
        "Cc": 7223,
        "DESCRIPTION": "FOUNDRY-CYLINDER HEAD LINE",
        "employeeid": 401204,
        "NAME": "DEEPAK DATTATRAY PHULE",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 269,
        "Cc": 7224,
        "DESCRIPTION": "FOUNDRY-FETTLING",
        "employeeid": 401114,
        "NAME": "DADARAO TATYABA BARBOLE",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 308,
        "Cc": 7281,
        "DESCRIPTION": "FOUNDRY -PLANT MAINTENANCE",
        "employeeid": 404482,
        "NAME": "KIRAN DAMODHAR AMBHURE",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 310,
        "Cc": 7281,
        "DESCRIPTION": "FOUNDRY -PLANT MAINTENANCE",
        "employeeid": 404711,
        "NAME": "ROHIT SAHADEV LOKHANDE",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 319,
        "Cc": 7281,
        "DESCRIPTION": "FOUNDRY -PLANT MAINTENANCE",
        "employeeid": 507943,
        "NAME": "JAVEED SAJAN TAMBOLI",
        "Vitals date": "26-03-2026",
        "Grade": "T-9",
        "DESIGNATION": "D.E.T."
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 329,
        "Cc": 7381,
        "DESCRIPTION": "PRESS SHOP -PLANT MAINTENANCE",
        "employeeid": 507942,
        "NAME": "MANOHAR HIMMAT PATIL",
        "Vitals date": "26-03-2026",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 332,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170359,
        "NAME": "AAYUSH",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.WELDER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 333,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170387,
        "NAME": "UMESH PATIL",
        "Vitals date": "26-03-2026",
        "Grade": "",
        "DESIGNATION": ""
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 335,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 24282,
        "NAME": "NARENDRA BALIRAM ARU",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "GRINDER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 338,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170337,
        "NAME": "KALPESH RAJENDRA KOLI",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.WELDER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 348,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 405610,
        "NAME": "SANTOSH KUMAR RISHIDEO",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "JR.ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 357,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170416,
        "NAME": "UMESH BABASO SUTAR",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.WELDER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 358,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170417,
        "NAME": "NITIRAJ HANAMANT PAWAR",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.WELDER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 359,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170430,
        "NAME": "DHIRAJ SADASHIV BUKAN",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.WELDER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 360,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170431,
        "NAME": "VIKAS BALU PATIL",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.SPRAY PAINTER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 370,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170555,
        "NAME": "MAYUR EKNATH PATIL",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.WELDER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 372,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170564,
        "NAME": "SHUBHAM GULAB SONAVANE",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.WELDER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 395,
        "Cc": 8603,
        "DESCRIPTION": "HEAT TREATMENT-3",
        "employeeid": 403735,
        "NAME": "DHANAJI ASHOK PATIL",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 398,
        "Cc": 8604,
        "DESCRIPTION": "HEAT TREATMENT TRANSMISSION",
        "employeeid": 157949,
        "NAME": "ANIL YADAVRAO JAGTAP",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.MACHINIST"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 399,
        "Cc": 8604,
        "DESCRIPTION": "HEAT TREATMENT TRANSMISSION",
        "employeeid": 400473,
        "NAME": "SHARAD ARUN PAWAR",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 405,
        "Cc": 8604,
        "DESCRIPTION": "HEAT TREATMENT TRANSMISSION",
        "employeeid": 402950,
        "NAME": "MILON ROY",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 411,
        "Cc": 8621,
        "DESCRIPTION": "MAINTENANCE PLANT SERVICE",
        "employeeid": 27274,
        "NAME": "RAOSAHEB KERU GAIKAWAD",
        "Vitals date": "26-03-2026",
        "Grade": "M-3",
        "DESIGNATION": "MANAGER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 414,
        "Cc": 8621,
        "DESCRIPTION": "MAINTENANCE PLANT SERVICE",
        "employeeid": 400790,
        "NAME": "VISHWAS JAGANNATH PANDIT",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 454,
        "Cc": 8718,
        "DESCRIPTION": "E.D. & C.D. EMISSION LAB",
        "employeeid": 402180,
        "NAME": "NITINRAJ GOVIND JADHAV",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 457,
        "Cc": 8718,
        "DESCRIPTION": "E.D. & C.D. EMISSION LAB",
        "employeeid": 403879,
        "NAME": "VISHAL NAMDEV KALBHOR",
        "Vitals date": "26-03-2026",
        "Grade": "S-6",
        "DESIGNATION": "SR. ENGINEER-I"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 472,
        "Cc": 8720,
        "DESCRIPTION": "ENGINE DEVELOPMENT & TESTING",
        "employeeid": 13462,
        "NAME": "VIJAY TUKARAM JADHAR",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "FITTER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 481,
        "Cc": 8720,
        "DESCRIPTION": "ENGINE DEVELOPMENT & TESTING",
        "employeeid": 401182,
        "NAME": "RAMESH PANDURANG YADAV",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 482,
        "Cc": 8720,
        "DESCRIPTION": "ENGINE DEVELOPMENT & TESTING",
        "employeeid": 401185,
        "NAME": "MILIND VISHNU BHUINGADE",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 483,
        "Cc": 8720,
        "DESCRIPTION": "ENGINE DEVELOPMENT & TESTING",
        "employeeid": 401218,
        "NAME": "RAMLING BHARAT SUTAR",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 499,
        "Cc": 8720,
        "DESCRIPTION": "ENGINE DEVELOPMENT & TESTING",
        "employeeid": 403848,
        "NAME": "ROHIT SUBHASH ROKADE",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 504,
        "Cc": 8720,
        "DESCRIPTION": "ENGINE DEVELOPMENT & TESTING",
        "employeeid": 404010,
        "NAME": "RAHUL SAHEBRAO VIGHE",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 505,
        "Cc": 8720,
        "DESCRIPTION": "ENGINE DEVELOPMENT & TESTING",
        "employeeid": 404025,
        "NAME": "RAHUL ASHOK KAMODKAR",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 507,
        "Cc": 8720,
        "DESCRIPTION": "ENGINE DEVELOPMENT & TESTING",
        "employeeid": 404056,
        "NAME": "JITENDRA NANABHAU JADHAV",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 515,
        "Cc": 8720,
        "DESCRIPTION": "ENGINE DEVELOPMENT & TESTING",
        "employeeid": 404500,
        "NAME": "KUNAL KAILAS NAGE",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 523,
        "Cc": 8720,
        "DESCRIPTION": "ENGINE DEVELOPMENT & TESTING",
        "employeeid": 404847,
        "NAME": "ADAM SIRAJ MULANI",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 532,
        "Cc": 8720,
        "DESCRIPTION": "ENGINE DEVELOPMENT & TESTING",
        "employeeid": 405094,
        "NAME": "MUSTAFA ALTAF ATAR",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "JR.ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 543,
        "Cc": 8720,
        "DESCRIPTION": "ENGINE DEVELOPMENT & TESTING",
        "employeeid": 405487,
        "NAME": "GOPINATH MOHANTA",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 579,
        "Cc": 8720,
        "DESCRIPTION": "ENGINE DEVELOPMENT & TESTING",
        "employeeid": 406467,
        "NAME": "YOGESH SURESH MALI",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 585,
        "Cc": 8720,
        "DESCRIPTION": "ENGINE DEVELOPMENT & TESTING",
        "employeeid": 406526,
        "NAME": "NIVRUTTI KRISHNA PATIL",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 586,
        "Cc": 8723,
        "DESCRIPTION": "SHEET METAL PROTO MFG",
        "employeeid": 400154,
        "NAME": "GANESH VAIJINATH LINGE",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 589,
        "Cc": 8724,
        "DESCRIPTION": "MODEL SHOP",
        "employeeid": 404322,
        "NAME": "MAHENDRA RAJE",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 614,
        "Cc": 8781,
        "DESCRIPTION": "R & D PLANT MAINT",
        "employeeid": 400800,
        "NAME": "SUBHASH SHANKAR KORE",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 615,
        "Cc": 8781,
        "DESCRIPTION": "R & D PLANT MAINT",
        "employeeid": 403695,
        "NAME": "AVNEESH KUMAR SHAINEE",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 616,
        "Cc": 8781,
        "DESCRIPTION": "R & D PLANT MAINT",
        "employeeid": 404194,
        "NAME": "SUMIT LAXMAN SHINDE",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "ENGINEER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 621,
        "Cc": 8781,
        "DESCRIPTION": "R & D PLANT MAINT",
        "employeeid": 507959,
        "NAME": "VISHAL MASHNU KAMBLE",
        "Vitals date": "26-03-2026",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 626,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170667,
        "NAME": "SARTHAK SANTOSH RAHATE",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.WELDER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 638,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170746,
        "NAME": "ANIKET NANASAHEB KARANDE",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.SPRAY PAINTER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 640,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170756,
        "NAME": "GANESH SANTOSH GAVDE",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.SPRAY PAINTER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 641,
        "Cc": 7033,
        "DESCRIPTION": "COMBUSTION CHAMBER & ROCKER LEVER",
        "employeeid": 170731,
        "NAME": "YAGAY BAHADUR CHAUDHARY",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "HELPER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 642,
        "Cc": 7033,
        "DESCRIPTION": "COMBUSTION CHAMBER & ROCKER LEVER",
        "employeeid": 170741,
        "NAME": "ABHISHEK GOVIND SURYAVASHI",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "HELPER"
    },
    {
        "type": "HAZARDOUS PROCESS",
        "Sno": 644,
        "Cc": 7033,
        "DESCRIPTION": "COMBUSTION CHAMBER & ROCKER LEVER",
        "employeeid": 508132,
        "NAME": "PRANEET PRASHANT SALVI",
        "Vitals date": "26-03-2026",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 6,
        "Cc": 6147,
        "DESCRIPTION": "SCV BODY SHOP QUALITY",
        "employeeid": 400762,
        "NAME": "NARENDRA VASANT KALE",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 9,
        "Cc": 6171,
        "DESCRIPTION": "SCV MATERIALS GROUP",
        "employeeid": 28052,
        "NAME": "TANAJI VASANT SOMVANSHI",
        "Vitals date": "26-03-2026",
        "Grade": "M-2",
        "DESIGNATION": "DEPUTY MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 10,
        "Cc": 6171,
        "DESCRIPTION": "SCV MATERIALS GROUP",
        "employeeid": 28352,
        "NAME": "MAHESH ASHOK MAHADIK",
        "Vitals date": "26-03-2026",
        "Grade": "M-2",
        "DESIGNATION": "DEPUTY MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 13,
        "Cc": 6172,
        "DESCRIPTION": "SCV ENGINE ASEEMBLY STORES",
        "employeeid": 170438,
        "NAME": "KHAN SHAHZAD",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "HELPER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 17,
        "Cc": 6173,
        "DESCRIPTION": "SCV VEHICLE ASSEMBLY STORES",
        "employeeid": 402655,
        "NAME": "SHRIRAM ASHOK PAWAR",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 19,
        "Cc": 6173,
        "DESCRIPTION": "SCV VEHICLE ASSEMBLY STORES",
        "employeeid": 170412,
        "NAME": "SANER RAOSAHEB VEDU",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST. FORK LIFT OPTR"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 20,
        "Cc": 6173,
        "DESCRIPTION": "SCV VEHICLE ASSEMBLY STORES",
        "employeeid": 170524,
        "NAME": "RADHESHYAM",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "HELPER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 34,
        "Cc": 7025,
        "DESCRIPTION": "CYLINDER BLOCK OM-616",
        "employeeid": 34187,
        "NAME": "KISHOR VIJAY GHORPADE",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 41,
        "Cc": 7025,
        "DESCRIPTION": "CYLINDER BLOCK OM-616",
        "employeeid": 98020,
        "NAME": "UMESH SITARAMPANT WARUDKAR",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.MECHANIC"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 42,
        "Cc": 7025,
        "DESCRIPTION": "CYLINDER BLOCK OM-616",
        "employeeid": 98666,
        "NAME": "SATISH BHAGWAT GAIKWAD",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "WELDER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 52,
        "Cc": 7025,
        "DESCRIPTION": "CYLINDER BLOCK OM-616",
        "employeeid": 400751,
        "NAME": "NITIN SHANKAR DAWALE",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 55,
        "Cc": 7025,
        "DESCRIPTION": "CYLINDER BLOCK OM-616",
        "employeeid": 400959,
        "NAME": "DHANESH KADAM",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 58,
        "Cc": 7025,
        "DESCRIPTION": "CYLINDER BLOCK OM-616",
        "employeeid": 401121,
        "NAME": "RAMJAN MOHAMMED KIRANGI",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 60,
        "Cc": 7025,
        "DESCRIPTION": "CYLINDER BLOCK OM-616",
        "employeeid": 401155,
        "NAME": "LAXMAN GOKUL KARALE",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 69,
        "Cc": 7025,
        "DESCRIPTION": "CYLINDER BLOCK OM-616",
        "employeeid": 405669,
        "NAME": "RAHUL SANTOSH MAHAJAN",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "JR.ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 73,
        "Cc": 7025,
        "DESCRIPTION": "CYLINDER BLOCK OM-616",
        "employeeid": 170411,
        "NAME": "RUSHIKESH MILIND KOLAMBEKAR",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.FITTER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 95,
        "Cc": 7025,
        "DESCRIPTION": "CYLINDER BLOCK OM-616",
        "employeeid": 508038,
        "NAME": "NILESH SIDDHAMR KALSHETTI",
        "Vitals date": "26-03-2026",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 104,
        "Cc": 7026,
        "DESCRIPTION": "CYLINDER HEAD OM-616",
        "employeeid": 400819,
        "NAME": "RAMESHWAR KISHANRAO GATKAL",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 105,
        "Cc": 7026,
        "DESCRIPTION": "CYLINDER HEAD OM-616",
        "employeeid": 401113,
        "NAME": "KISAN MACHINDRANATH WAGHMARE",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 109,
        "Cc": 7033,
        "DESCRIPTION": "COMBUSTION CHAMBER & ROCKER LEVER",
        "employeeid": 13591,
        "NAME": "ARUN BHANUDAS JADHAV",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "MECHANIC"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 111,
        "Cc": 7033,
        "DESCRIPTION": "COMBUSTION CHAMBER & ROCKER LEVER",
        "employeeid": 170358,
        "NAME": "VISHAL CHAUDHARY",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "HELPER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 127,
        "Cc": 7034,
        "DESCRIPTION": "DECKLE  LINE",
        "employeeid": 28864,
        "NAME": "RAJU MANIKRAO SHIVKAR",
        "Vitals date": "26-03-2026",
        "Grade": "M-4",
        "DESIGNATION": "SR. MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 132,
        "Cc": 7034,
        "DESCRIPTION": "DECKLE  LINE",
        "employeeid": 157948,
        "NAME": "JABAJI BANSHI AWARE",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.TURNER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 135,
        "Cc": 7034,
        "DESCRIPTION": "DECKLE  LINE",
        "employeeid": 170373,
        "NAME": "VAIBHAV SHRIKANT CHINCHALE",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.MACHINIST"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 172,
        "Cc": 7034,
        "DESCRIPTION": "DECKLE  LINE",
        "employeeid": 170535,
        "NAME": "SUDHIR KUMAR",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.MACHINIST"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 174,
        "Cc": 7034,
        "DESCRIPTION": "DECKLE  LINE",
        "employeeid": 170537,
        "NAME": "SHIVAJI TANAJI SOLANKE",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.FITTER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 182,
        "Cc": 7034,
        "DESCRIPTION": "DECKLE  LINE",
        "employeeid": 170607,
        "NAME": "ARUN",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "HELPER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 183,
        "Cc": 7034,
        "DESCRIPTION": "DECKLE  LINE",
        "employeeid": 170631,
        "NAME": "RUPESH KUMAR",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.FITTER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 203,
        "Cc": 7035,
        "DESCRIPTION": "HELLER LINE & FMS AND SPM LINE (VA50)",
        "employeeid": 400467,
        "NAME": "PRABHAKAR DEVIDAS PINGALE",
        "Vitals date": "26-03-2026",
        "Grade": "S-6",
        "DESIGNATION": "SR. ENGINEER-I"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 215,
        "Cc": 7035,
        "DESCRIPTION": "HELLER LINE & FMS AND SPM LINE (VA50)",
        "employeeid": 403709,
        "NAME": "BABASAHEB SHIVANAND MUSKE",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 232,
        "Cc": 7043,
        "DESCRIPTION": "ENGINE-STANDARD ROOM",
        "employeeid": 33923,
        "NAME": "ANANTKUMAR NIVRUTTI PANDAV",
        "Vitals date": "26-03-2026",
        "Grade": "S-6",
        "DESIGNATION": "SR.ENGINEER - I"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 241,
        "Cc": 7052,
        "DESCRIPTION": "OM 616 ENGINE + DECKEL & HELLER QUALITY",
        "employeeid": 34125,
        "NAME": "CH. V. RAVI KUMAR",
        "Vitals date": "26-03-2026",
        "Grade": "M-4",
        "DESIGNATION": "SR. MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 249,
        "Cc": 7052,
        "DESCRIPTION": "OM 616 ENGINE + DECKEL & HELLER QUALITY",
        "employeeid": 400581,
        "NAME": "SALIM BABASO MUJAWAR",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 254,
        "Cc": 7052,
        "DESCRIPTION": "OM 616 ENGINE + DECKEL & HELLER QUALITY",
        "employeeid": 402922,
        "NAME": "NITIN MAHADEV PATIL",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 259,
        "Cc": 7054,
        "DESCRIPTION": "OM 616 ENGINE ASSEMBLY & TESTING QUALITY",
        "employeeid": 400631,
        "NAME": "HOUSARAM SAMBHAJI DOLE",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 271,
        "Cc": 7081,
        "DESCRIPTION": "ENGINE-PLANT MAINTENANCE",
        "employeeid": 400812,
        "NAME": "AJAY RAMESH CHAVAN",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 291,
        "Cc": 7083,
        "DESCRIPTION": "OM 616 ENGINE + DECKEL & MAINT",
        "employeeid": 25702,
        "NAME": "PRAKASH GOKULDAS BHANDARI",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 311,
        "Cc": 7132,
        "DESCRIPTION": "SOFT LINE - GEAR,SHAFT & SLEEVES",
        "employeeid": 28838,
        "NAME": "BALASAHEB KRISHNA KHOT",
        "Vitals date": "26-03-2026",
        "Grade": "M-3",
        "DESIGNATION": "MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 324,
        "Cc": 7136,
        "DESCRIPTION": "MISCELLANEOUS COMPONENTS",
        "employeeid": 27725,
        "NAME": "UMESH SINGH",
        "Vitals date": "26-03-2026",
        "Grade": "M-2",
        "DESIGNATION": "DEPUTY MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 337,
        "Cc": 7162,
        "DESCRIPTION": "5 SPEED GEAR BOX QUALITY",
        "employeeid": 29071,
        "NAME": "DHANANJAY NARAYAN CHAVAN",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 353,
        "Cc": 7181,
        "DESCRIPTION": "TRANSMISSION-PLANT MAINTENANCE",
        "employeeid": 36309,
        "NAME": "ARVIND SHANTARAM BORUDE",
        "Vitals date": "26-03-2026",
        "Grade": "S-5",
        "DESIGNATION": "SR.ENGINEER II"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 360,
        "Cc": 7181,
        "DESCRIPTION": "TRANSMISSION-PLANT MAINTENANCE",
        "employeeid": 508100,
        "NAME": "PRATIK MANOHAR SHENDARE",
        "Vitals date": "26-03-2026",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 362,
        "Cc": 7184,
        "DESCRIPTION": "5 SPEED GEAR BOX MAINTENANCE",
        "employeeid": 400506,
        "NAME": "DILIP JANARDAN KAWALE",
        "Vitals date": "26-03-2026",
        "Grade": "S-5",
        "DESIGNATION": "SR. OFFICER-II"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 364,
        "Cc": 7372,
        "DESCRIPTION": "STEEL SHEETS and BLANKS - STORES",
        "employeeid": 402551,
        "NAME": "SWAPNIL SUDHAKAR THORAT",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 369,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 25667,
        "NAME": "SURESH KISAN DIVEKAR",
        "Vitals date": "26-03-2026",
        "Grade": "M-6",
        "DESIGNATION": "DIVISIONAL MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 371,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 26045,
        "NAME": "SUNIL ZUMBARLAL SHELOT",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 377,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 28776,
        "NAME": "RAHUL PRAKASH BARDIYA",
        "Vitals date": "26-03-2026",
        "Grade": "M-3",
        "DESIGNATION": "MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 387,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 36604,
        "NAME": "FAKIRA BUDHA PATIL",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 392,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 36827,
        "NAME": "DEEPAK SAKHARAM GHORPADE",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 397,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 36895,
        "NAME": "YOGESH ANANT RATNAPARKHI",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 417,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 250656,
        "NAME": "RUSHIKESH NIVAL HARE",
        "Vitals date": "26-03-2026",
        "Grade": "A-0",
        "DESIGNATION": "TR APP-FITTER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 450,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 400624,
        "NAME": "RAJESH SOMNATH PAWAR",
        "Vitals date": "26-03-2026",
        "Grade": "S-5",
        "DESIGNATION": "SR. ENGINEER - II"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 469,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 402659,
        "NAME": "SHASHIKANT ABA CHAVAN",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 473,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 403105,
        "NAME": "UMESH BHAUSAHEB DARANDALE",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 503,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 404480,
        "NAME": "AMIT BHALCHANDRA JOSHI",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 524,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 405241,
        "NAME": "VILAS DINKAR AHIRE",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "JR.ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 525,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 405434,
        "NAME": "SURAJ RAJKUMAR THORAT",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 527,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 405729,
        "NAME": "AJAY KUMAR",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "JR.ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 588,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 507887,
        "NAME": "YASH KHUSHAL POTPHODE",
        "Vitals date": "26-03-2026",
        "Grade": "T-9",
        "DESIGNATION": "G.E.T."
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 602,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170413,
        "NAME": "SWAPNIL VIKAS BAGUL",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "HELPER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 603,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170414,
        "NAME": "RAKESH KUMAR",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "HELPER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 641,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 507962,
        "NAME": "SANIKA SHITAL MADIWAL",
        "Vitals date": "26-03-2026",
        "Grade": "T-9",
        "DESIGNATION": "TR. TECHNICIAN"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 648,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 508001,
        "NAME": "HARSHAL SANTOSH MANDAVKAR",
        "Vitals date": "26-03-2026",
        "Grade": "T-9",
        "DESIGNATION": "D.E.T."
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 649,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 508002,
        "NAME": "MOHIT MURLIDHAR KHADKE",
        "Vitals date": "26-03-2026",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 652,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 508030,
        "NAME": "RUTUJA HANMANT BHOSALE",
        "Vitals date": "26-03-2026",
        "Grade": "T-9",
        "DESIGNATION": "D.E.T."
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 661,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 508044,
        "NAME": "PRAMOD GANPAT GHALME",
        "Vitals date": "26-03-2026",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 663,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 508047,
        "NAME": "VISHAL RAJENDRA VARTE",
        "Vitals date": "26-03-2026",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 664,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 508048,
        "NAME": "SANSKAR PRAKASH GAIKWAD",
        "Vitals date": "26-03-2026",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 674,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 508082,
        "NAME": "KUNAL ADHIKAR BAGAL",
        "Vitals date": "26-03-2026",
        "Grade": "T-1",
        "DESIGNATION": "TR. TECHNICIAN"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 687,
        "Cc": 8623,
        "DESCRIPTION": "RECONDITIONING SECTION",
        "employeeid": 400632,
        "NAME": "KUBERDAS ARJUN KACHARE",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 688,
        "Cc": 8623,
        "DESCRIPTION": "RECONDITIONING SECTION",
        "employeeid": 170552,
        "NAME": "RUSHIKESH PANDURANG ANUSE",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.ELECTRICIAN"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 689,
        "Cc": 8623,
        "DESCRIPTION": "RECONDITIONING SECTION",
        "employeeid": 170613,
        "NAME": "KSHITIJ KUMAR",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.ELECTRICIAN"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 690,
        "Cc": 8686,
        "DESCRIPTION": "LABORATORY",
        "employeeid": 35507,
        "NAME": "NANASAHEB KARBHARI TAMBE",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 692,
        "Cc": 8686,
        "DESCRIPTION": "LABORATORY",
        "employeeid": 401531,
        "NAME": "RAGHVENDRA RAMCHANDRA DESHPANDE",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 693,
        "Cc": 8686,
        "DESCRIPTION": "LABORATORY",
        "employeeid": 401839,
        "NAME": "SEEMA DHANANJAY BHARAMBE",
        "Vitals date": "26-03-2026",
        "Grade": "S-5",
        "DESIGNATION": "SR. OFFICER-II"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 694,
        "Cc": 8686,
        "DESCRIPTION": "LABORATORY",
        "employeeid": 403570,
        "NAME": "JAGANNATH DWARKANATH MALI",
        "Vitals date": "26-03-2026",
        "Grade": "S-5",
        "DESIGNATION": "SR.ENGINEER II"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 696,
        "Cc": 8686,
        "DESCRIPTION": "LABORATORY",
        "employeeid": 405021,
        "NAME": "VIKAS BALU PAWAR",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 699,
        "Cc": 8723,
        "DESCRIPTION": "SHEET METAL PROTO MFG",
        "employeeid": 36859,
        "NAME": "PRADIP SUKHADEO GAIKWAD",
        "Vitals date": "26-03-2026",
        "Grade": "S-6",
        "DESIGNATION": "SR. OFFICER - I"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 739,
        "Cc": 8726,
        "DESCRIPTION": "PROTOTYPE MFG-FABRICATION",
        "employeeid": 404327,
        "NAME": "SANDIP HARI MALI",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "JR.ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 790,
        "Cc": 8744,
        "DESCRIPTION": "R&D NVH - CAE & TESTING",
        "employeeid": 250676,
        "NAME": "GANESH LAXMAN POL",
        "Vitals date": "26-03-2026",
        "Grade": "A-0",
        "DESIGNATION": "TR APP-ELECTRICIAN"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 798,
        "Cc": 8744,
        "DESCRIPTION": "R&D NVH - CAE & TESTING",
        "employeeid": 406066,
        "NAME": "MANOJ MADHUKAR KALE",
        "Vitals date": "26-03-2026",
        "Grade": "S-5",
        "DESIGNATION": "JR. ENGINEERING MANAGER-II"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 800,
        "Cc": 8744,
        "DESCRIPTION": "R&D NVH - CAE & TESTING",
        "employeeid": 507852,
        "NAME": "PRATIK BHARAT SONAWANE",
        "Vitals date": "26-03-2026",
        "Grade": "T-9",
        "DESIGNATION": "G.E.T."
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 801,
        "Cc": 8744,
        "DESCRIPTION": "R&D NVH - CAE & TESTING",
        "employeeid": 507854,
        "NAME": "ABHAY SANJAY NARWADE",
        "Vitals date": "26-03-2026",
        "Grade": "T-9",
        "DESIGNATION": "G.E.T."
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 802,
        "Cc": 8744,
        "DESCRIPTION": "R&D NVH - CAE & TESTING",
        "employeeid": 507855,
        "NAME": "GITANJALI RAVINDRA PATHAK",
        "Vitals date": "26-03-2026",
        "Grade": "T-9",
        "DESIGNATION": "G.E.T."
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 803,
        "Cc": 8744,
        "DESCRIPTION": "R&D NVH - CAE & TESTING",
        "employeeid": 507878,
        "NAME": "HARSH SHARNAPPA DHOL",
        "Vitals date": "26-03-2026",
        "Grade": "T-9",
        "DESIGNATION": "G.E.T."
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 819,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 28361,
        "NAME": "ANIL POPATRAO BHOITE",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 825,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 32504,
        "NAME": "VISHNU VASANT HAKE",
        "Vitals date": "26-03-2026",
        "Grade": "S-6",
        "DESIGNATION": "SR. ENGINEER - I"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 828,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 32737,
        "NAME": "ATUL HANUMANT KHOPADE",
        "Vitals date": "26-03-2026",
        "Grade": "S-6",
        "DESIGNATION": "SR. ENGINEER - I"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 847,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 400495,
        "NAME": "VIKRANT JANARDHAN ATHAWALE",
        "Vitals date": "26-03-2026",
        "Grade": "S-5",
        "DESIGNATION": "JR. ENGINEERING MANAGER - II"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 850,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 401118,
        "NAME": "ARVIND MUKHRAM JAISWAR",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 852,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 401273,
        "NAME": "PRITVIRAJ RATHOD",
        "Vitals date": "26-03-2026",
        "Grade": "S-6",
        "DESIGNATION": "JR. ENGINEERING MANAGER - I"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 853,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 401334,
        "NAME": "TEJAS UDAY KHALADKAR",
        "Vitals date": "26-03-2026",
        "Grade": "S-6",
        "DESIGNATION": "SR. ENGINEER - I"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 861,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 403177,
        "NAME": "LAXMIKANT  VASANT GHADGE",
        "Vitals date": "26-03-2026",
        "Grade": "S-6",
        "DESIGNATION": "JR. ENGINEERING MANAGER - I"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 866,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 403450,
        "NAME": "MARUTI RAGHUNATH SALUNKHE",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 868,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 403488,
        "NAME": "HIMESH MURLIDHAR TONDARE",
        "Vitals date": "26-03-2026",
        "Grade": "M-1",
        "DESIGNATION": "ASST. MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 870,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 403871,
        "NAME": "SACHIN SUBHASHRAO JADHAV",
        "Vitals date": "26-03-2026",
        "Grade": "M-4",
        "DESIGNATION": "SR. MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 871,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 403886,
        "NAME": "EJAJ M. SHARIF ATTAR",
        "Vitals date": "26-03-2026",
        "Grade": "M-2",
        "DESIGNATION": "DY. MANAGER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 876,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 404163,
        "NAME": "RAJESH MADHUKANT THAKKAR",
        "Vitals date": "26-03-2026",
        "Grade": "S-6",
        "DESIGNATION": "JR. ENGINEERING MANAGER - I"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 880,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 404369,
        "NAME": "SUBHASH BABU BOLKE",
        "Vitals date": "26-03-2026",
        "Grade": "S-5",
        "DESIGNATION": "SR. OFFICER - II"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 881,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 404370,
        "NAME": "YUVRAJ SUBHASH GURAV",
        "Vitals date": "26-03-2026",
        "Grade": "S-5",
        "DESIGNATION": "SR. OFFICER - II"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 883,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 404494,
        "NAME": "ANAND MOHAN PAWAR",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 886,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 404518,
        "NAME": "SANTOSH SITARAM NAVALE",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 889,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 404830,
        "NAME": "NIKHIL MANIK SAWANT",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "ASST. ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 894,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 404862,
        "NAME": "YUVARAJ ANANDARAO MALI",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "JR. ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 898,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 404894,
        "NAME": "MANE SHANKAR RAMCHANDRA",
        "Vitals date": "26-03-2026",
        "Grade": "S-3",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 899,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 404904,
        "NAME": "PATRE PARBHAKAR",
        "Vitals date": "26-03-2026",
        "Grade": "S-2",
        "DESIGNATION": "OFFICER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 903,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 405113,
        "NAME": "KUNAL PRAKASH PATIL",
        "Vitals date": "26-03-2026",
        "Grade": "S-5",
        "DESIGNATION": "JR. ENGINEERING MANAGER - II"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 904,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 405121,
        "NAME": "NARAYAN SHRIRANG KAKADE",
        "Vitals date": "26-03-2026",
        "Grade": "S-4",
        "DESIGNATION": "ENGINEER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 910,
        "Cc": 8716,
        "DESCRIPTION": "VEHICLE EVALUATION DVN",
        "employeeid": 405587,
        "NAME": "AKSHAY SUNIL KADAM",
        "Vitals date": "26-03-2026",
        "Grade": "S-5",
        "DESIGNATION": "JR. ENGINEERING MANAGER - II"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 928,
        "Cc": 6173,
        "DESCRIPTION": "SCV VEHICLE ASSEMBLY STORES",
        "employeeid": 170672,
        "NAME": "ROHAN KISAN KAMBLE",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "HELPER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 929,
        "Cc": 6173,
        "DESCRIPTION": "SCV VEHICLE ASSEMBLY STORES",
        "employeeid": 170738,
        "NAME": "UDAY KULKARNI",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "HELPER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 941,
        "Cc": 7026,
        "DESCRIPTION": "CYLINDER HEAD OM-616",
        "employeeid": 170726,
        "NAME": "RAMCHANDRA HANSDAH",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "HELPER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 945,
        "Cc": 7034,
        "DESCRIPTION": "DECKLE  LINE",
        "employeeid": 170732,
        "NAME": "SUSHANT SHRIKANT PATIL",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.MACHINIST"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 946,
        "Cc": 7034,
        "DESCRIPTION": "DECKLE  LINE",
        "employeeid": 170742,
        "NAME": "SANDIP KUMAR MAHATO",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.ELECTRICIAN"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 948,
        "Cc": 7034,
        "DESCRIPTION": "DECKLE  LINE",
        "employeeid": 170753,
        "NAME": "ARBIND KUMAR",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.ELECTRICIAN"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 956,
        "Cc": 7081,
        "DESCRIPTION": "ENGINE-PLANT MAINTENANCE",
        "employeeid": 170733,
        "NAME": "AVINASH MAHADEV PATIL",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.MECHANIC"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 969,
        "Cc": 7421,
        "DESCRIPTION": "TOOL ROOM - SHOP",
        "employeeid": 170704,
        "NAME": "DHIRAJ MONDAL",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "ASST.FITTER"
    },
    {
        "type": "STAFF / WORKERS",
        "Sno": 984,
        "Cc": 8686,
        "DESCRIPTION": "LABORATORY",
        "employeeid": 170674,
        "NAME": "DEEPU KUMAR",
        "Vitals date": "26-03-2026",
        "Grade": "W-0",
        "DESIGNATION": "HELPER"
    }
]