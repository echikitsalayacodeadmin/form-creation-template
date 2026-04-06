
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import ForceMotorForm2Template from "./ForceMotorForm2Template";


const ForceMotorForm2Main = ({
    corpId = "94180f9d-b1bf-4794-b81c-5f21a908ad9c",
    campCycleId = "396613",
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
                <ForceMotorForm2Template data={data} />
            ).toBlob();

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
                    "300617", "170621", "404607", "17509", "27301", "33783", "10547", "20605", "400731", "400380",
                    "401138", "16947", "20608", "405060", "16931", "400746", "401071", "403656", "170587", "400846",
                    "401204", "401114", "404482", "404711", "507943", "507942", "170359", "170387", "24282", "170337",
                    "405610", "170416", "170417", "170430", "170431", "170555", "170564", "403735", "157949", "400473",
                    "402950", "27274", "400790", "402180", "403879", "13462", "401182", "401185", "401218", "403848",
                    "404010", "404025", "404056", "404500", "404847", "405094", "405487", "406467", "406526", "400154",
                    "404322", "400800", "403695", "404194", "507959", "170667", "170746", "170756", "170731", "170741",
                    "508132", "400762", "28052", "28352", "170438", "402655", "170412", "170524", "34187", "98020",
                    "98666", "400751", "400959", "401121", "401155", "405669", "170411", "508038", "400819", "401113",
                    "13591", "170358", "28864", "157948", "170373", "170535", "170537", "170607", "170631", "400467",
                    "403709", "33923", "34125", "400581", "402922", "400631", "400812", "25702", "28838", "27725",
                    "29071", "36309", "508100", "400506", "402551", "25667", "26045", "28776", "36604", "36827",
                    "36895", "250656", "400624", "402659", "403105", "404480", "405241", "405434", "405729", "507887",
                    "170413", "170414", "507962", "508001", "508002", "508030", "508044", "508047", "508048", "508082",
                    "400632", "170552", "170613", "35507", "401531", "401839", "403570", "405021", "36859", "404327",
                    "250676", "406066", "507852", "507854", "507855", "507878", "28361", "32504", "32737", "400495",
                    "401118", "401273", "401334", "403177", "403450", "403488", "403871", "403886", "404163", "404369",
                    "404370", "404494", "404518", "404830", "404862", "404894", "404904", "405113", "405121", "405587",
                    "170672", "170738", "170726", "170732", "170742", "170753", "170733", "170704", "170674"
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
                <ForceMotorForm2Template data={list[0]} />
            </PDFViewer>
        </Fragment>
    );
};

export default ForceMotorForm2Main;
