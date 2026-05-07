
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import JayHindForm2Template from "./JayHindForm2Template";


const JayHindForm2Main = ({
    // corpId = "0bcd762b-3523-46eb-90c4-eed8154cd479",
    // campCycleId = "403772",
    corpId = '14dca1f0-fa04-4526-ba01-f5f83e0f2494',
    campCycleId = '401838',
    fileType = "TMT",
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
                <JayHindForm2Template data={data} />
            ).toBlob();
            console.log({ pdfBlob })
            const formData = new FormData();
            formData.append("file", pdfBlob, `${data?.empId}_MER_FORM.pdf`);

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


                const temp = result?.data?.filter((item) => [
                    "406645",
                    "406711",
                    "800005",
                    "407121",
                    "900052",
                    "900049",
                    "900067",
                    "900101",
                    "900090",
                    "900082",
                    "900087",
                    "97950",
                    "900071",
                    "318507",
                    "900072",
                    "900061",
                    "900058",
                    "318299",
                    "900040",
                    "100383",
                    "318466",
                    "900022",
                    "900023",
                    "406088",
                    "900050",
                    "800008",
                    "318545",
                    "318315",
                    "318238",
                    "900118",
                    "800149",
                    "318514",
                    "900003",
                    "406798",
                    "406797",
                    "900060",
                    "900027",
                    "900085",
                    "800148",
                    "318373",
                    "406724",
                    "406723",
                    "406826",
                    "406751",
                    "317964",
                    "406713",
                    "318117",
                    "406865",
                    "406337",
                    "406588",
                    "406702",
                    "318081",
                    "318082",
                    "318118",
                    "406669",
                    "406923",
                    "406101"
                ]?.includes(item?.empId))

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

                        <a href={item.tmtUrl}>
                            <div key={index}>{item.tmtUrl}</div>
                        </a>

                        <br />
                    </div>
                ))}
            </div>

            <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
                <JayHindForm2Template data={list[0]} />
            </PDFViewer>
        </Fragment>
    );
};

export default JayHindForm2Main;
