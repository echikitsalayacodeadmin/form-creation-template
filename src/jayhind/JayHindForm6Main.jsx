


import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import JayHindForm6Template from "./JayHindForm6Template";


const JayHindForm6Main = ({
    // corpId = "0bcd762b-3523-46eb-90c4-eed8154cd479",
    // campCycleId = "403772",
    corpId = '14dca1f0-fa04-4526-ba01-f5f83e0f2494',
    campCycleId = '401838',
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
        "Sno": 94,
        "MainSrNo": 3,
        "CC": 6172,
        "DESCRIPTION": "IDRA 700 TONNS M/C PDC",
        "Employeeid": 404070,
        "NAME": "NANDKISHOR DNYANDEO BORLE",
        "Grade": 8,
        "DESIGNATION": "DY. MANAGER",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 95,
        "MainSrNo": 5,
        "CC": 6172,
        "DESCRIPTION": "IDRA 700 TONNS M/C PDC",
        "Employeeid": 98343,
        "NAME": "VINOD D JADHAV",
        "Grade": 7,
        "DESIGNATION": "ASST. MANAGER",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 96,
        "MainSrNo": 8,
        "CC": 6172,
        "DESCRIPTION": "IDRA 700 TONNS M/C PDC",
        "Employeeid": 97173,
        "NAME": "AMOL D DEOKATE",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 97,
        "MainSrNo": 10,
        "CC": 6172,
        "DESCRIPTION": "IDRA 700 TONNS M/C PDC",
        "Employeeid": 98755,
        "NAME": "RAKESH BAHADUR PAL",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 98,
        "MainSrNo": 12,
        "CC": 6172,
        "DESCRIPTION": "IDRA 700 TONNS M/C PDC",
        "Employeeid": 98982,
        "NAME": "DAYANAND G BIRADAR",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 99,
        "MainSrNo": 13,
        "CC": 6172,
        "DESCRIPTION": "IDRA 700 TONNS M/C PDC",
        "Employeeid": 99034,
        "NAME": "MAHADEO S LONDHE",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 100,
        "MainSrNo": 14,
        "CC": 6172,
        "DESCRIPTION": "IDRA 700 TONNS M/C PDC",
        "Employeeid": 99035,
        "NAME": "PANDURANG R KAUTKAR",
        "Grade": "W2",
        "DESIGNATION": "OPERATOR - SKILLED B",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 101,
        "MainSrNo": 15,
        "CC": 6172,
        "DESCRIPTION": "IDRA 700 TONNS M/C PDC",
        "Employeeid": 99124,
        "NAME": "NAVNATH B GORE",
        "Grade": "W2",
        "DESIGNATION": "OPERATOR - SKILLED B",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 102,
        "MainSrNo": 22,
        "CC": 6172,
        "DESCRIPTION": "IDRA 700 TONNS M/C PDC",
        "Employeeid": 99746,
        "NAME": "SANTOSH K MAGADUM",
        "Grade": "W2",
        "DESIGNATION": "OPERATOR - SKILLED B",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 103,
        "MainSrNo": 25,
        "CC": 6172,
        "DESCRIPTION": "IDRA 700 TONNS M/C PDC",
        "Employeeid": 99792,
        "NAME": "RAJESH BAHADUR PAL",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 104,
        "MainSrNo": 27,
        "CC": 6172,
        "DESCRIPTION": "IDRA 700 TONNS M/C PDC",
        "Employeeid": 99881,
        "NAME": "RAJESH KUMAR",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 105,
        "MainSrNo": 29,
        "CC": 6172,
        "DESCRIPTION": "IDRA 700 TONNS M/C PDC",
        "Employeeid": 100595,
        "NAME": "PRADEEP KUMAR VISHWAKRMA",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 106,
        "MainSrNo": 82,
        "CC": 6185,
        "DESCRIPTION": "PDC DIE CASTING URSE 2",
        "Employeeid": 97839,
        "NAME": "DINESH V KADAM",
        "Grade": 7,
        "DESIGNATION": "ASST. MANAGER",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 107,
        "MainSrNo": 83,
        "CC": 6185,
        "DESCRIPTION": "PDC DIE CASTING URSE 2",
        "Employeeid": 400540,
        "NAME": "HARPREET SINGH",
        "Grade": 7,
        "DESIGNATION": "ASST. MANAGER",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 108,
        "MainSrNo": 87,
        "CC": 6185,
        "DESCRIPTION": "PDC DIE CASTING URSE 2",
        "Employeeid": 97864,
        "NAME": "VINOD V BHOSALE",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 109,
        "MainSrNo": 90,
        "CC": 6185,
        "DESCRIPTION": "PDC DIE CASTING URSE 2",
        "Employeeid": 98341,
        "NAME": "JAYDEV R CHAUDHARI",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 110,
        "MainSrNo": 93,
        "CC": 6185,
        "DESCRIPTION": "PDC DIE CASTING URSE 2",
        "Employeeid": 98784,
        "NAME": "SUDHAKAR A PATIL",
        "Grade": "W2",
        "DESIGNATION": "OPERATOR - SKILLED B",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 111,
        "MainSrNo": 94,
        "CC": 6185,
        "DESCRIPTION": "PDC DIE CASTING URSE 2",
        "Employeeid": 98971,
        "NAME": "CHANDRAKANT H KAMBLE",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 112,
        "MainSrNo": 97,
        "CC": 6185,
        "DESCRIPTION": "PDC DIE CASTING URSE 2",
        "Employeeid": 99351,
        "NAME": "GORAKH S TURE",
        "Grade": "W2",
        "DESIGNATION": "OPERATOR - SKILLED B",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 113,
        "MainSrNo": 103,
        "CC": 6185,
        "DESCRIPTION": "PDC DIE CASTING URSE 2",
        "Employeeid": 99765,
        "NAME": "ARVIND SINGH",
        "Grade": "W2",
        "DESIGNATION": "OPERATOR - SKILLED B",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 114,
        "MainSrNo": 106,
        "CC": 6185,
        "DESCRIPTION": "PDC DIE CASTING URSE 2",
        "Employeeid": 99983,
        "NAME": "VINOD D DESALE",
        "Grade": "W2",
        "DESIGNATION": "OPERATOR - SKILLED B",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 115,
        "MainSrNo": 109,
        "CC": 6185,
        "DESCRIPTION": "PDC DIE CASTING URSE 2",
        "Employeeid": 100324,
        "NAME": "RITESH KUMAR SINGH",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 116,
        "MainSrNo": 111,
        "CC": 6185,
        "DESCRIPTION": "PDC DIE CASTING URSE 2",
        "Employeeid": 100576,
        "NAME": "BALAJI S JADHAV",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 117,
        "MainSrNo": 121,
        "CC": 6187,
        "DESCRIPTION": "PDC 2 FETTLING URSE",
        "Employeeid": 318581,
        "NAME": "GANESH KEWAT",
        "Grade": "",
        "DESIGNATION": "WORKMAN SEMI SKILLED",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 118,
        "MainSrNo": 130,
        "CC": 6187,
        "DESCRIPTION": "PDC 2 FETTLING URSE",
        "Employeeid": 317829,
        "NAME": "LAXMAN MAHATO",
        "Grade": "",
        "DESIGNATION": "WORKMAN SEMI SKILLED",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 119,
        "MainSrNo": 133,
        "CC": 6187,
        "DESCRIPTION": "PDC 2 FETTLING URSE",
        "Employeeid": 318200,
        "NAME": "ANKIT KUMAR",
        "Grade": "",
        "DESIGNATION": "WORKMAN SEMI SKILLED",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 120,
        "MainSrNo": 136,
        "CC": 6222,
        "DESCRIPTION": "TATA - G.D.C.",
        "Employeeid": 800145,
        "NAME": "AMAR NARAYAN KARN",
        "Grade": 9,
        "DESIGNATION": "MANAGER",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 121,
        "MainSrNo": 138,
        "CC": 6222,
        "DESCRIPTION": "TATA - G.D.C.",
        "Employeeid": 800013,
        "NAME": "RAJENDRA B ASHTEKAR",
        "Grade": 9,
        "DESIGNATION": "MANAGER",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 122,
        "MainSrNo": 143,
        "CC": 6222,
        "DESCRIPTION": "TATA - G.D.C.",
        "Employeeid": 800029,
        "NAME": "VIVEK T PINGALE",
        "Grade": 6,
        "DESIGNATION": "SR. ENGINEER",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 123,
        "MainSrNo": 145,
        "CC": 6222,
        "DESCRIPTION": "TATA - G.D.C.",
        "Employeeid": 800056,
        "NAME": "RAVI KIRAN MURMU",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 124,
        "MainSrNo": 152,
        "CC": 6222,
        "DESCRIPTION": "TATA - G.D.C.",
        "Employeeid": 900012,
        "NAME": "CHANABASAPPA D ANJANALKAR",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 125,
        "MainSrNo": 155,
        "CC": 6222,
        "DESCRIPTION": "TATA - G.D.C.",
        "Employeeid": 900016,
        "NAME": "MACCHINDRA DAMODAR SAYAMBAR",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 126,
        "MainSrNo": 164,
        "CC": 6222,
        "DESCRIPTION": "TATA - G.D.C.",
        "Employeeid": 900062,
        "NAME": "CHANDRAKANT B DHANOKAR",
        "Grade": "W2",
        "DESIGNATION": "OPERATOR - SKILLED B",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 127,
        "MainSrNo": 167,
        "CC": 6222,
        "DESCRIPTION": "TATA - G.D.C.",
        "Employeeid": 900096,
        "NAME": "APPARAO L CHAVAN",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 128,
        "MainSrNo": 170,
        "CC": 6222,
        "DESCRIPTION": "TATA - G.D.C.",
        "Employeeid": 900120,
        "NAME": "AJAY PRATAP SINGH",
        "Grade": "W1",
        "DESIGNATION": "OPERATOR - SKILLED A",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 129,
        "MainSrNo": 171,
        "CC": 6222,
        "DESCRIPTION": "TATA - G.D.C.",
        "Employeeid": 900124,
        "NAME": "VIJAY SHASHIKANTRAO PANDE",
        "Grade": "W2",
        "DESIGNATION": "OPERATOR - SKILLED B",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 130,
        "MainSrNo": 242,
        "CC": 6223,
        "DESCRIPTION": "GDC FETTLING URSE",
        "Employeeid": 318056,
        "NAME": "MD HASIM SIDDIQUE",
        "Grade": "",
        "DESIGNATION": "WORKMAN SEMI SKILLED",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 131,
        "MainSrNo": 243,
        "CC": 6223,
        "DESCRIPTION": "GDC FETTLING URSE",
        "Employeeid": 318011,
        "NAME": "SUBHANKAR MAHATO",
        "Grade": "",
        "DESIGNATION": "WORKMAN SEMI SKILLED",
        "DATE": "15-04-2026",
        "Type": "HAZARDOUS"
    },
    {
        "Sno": 132,
        "MainSrNo": ".",
        "CC": 6222,
        "DESCRIPTION": "TATA - G.D.C.",
        "Employeeid": 407177,
        "NAME": "AJAY TRIPATHI",
        "Grade": "",
        "DESIGNATION": "SR. ENGINEER",
        "DATE": "16-04-2026",
        "Type": "HAZARDOUS"
    }
]