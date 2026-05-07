import {
    FormControlLabel,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
    Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { pdf, PDFViewer } from "@react-pdf/renderer";
import { useSnackbar } from "notistack";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import GeAeroSpacePhyscialFitnessTemplate from "./GeAeroSpacePhyscialFitnessTemplate";

const GeAeroSpacePhyscialFitnessMain = ({
    corpId = "c97b2b3a-a847-4d76-bdce-747b6cb9687e",
    campCycleId = "405334",
    fileType = "PHYSICAL_FITNESS_FORM",
}) => {

    const { enqueueSnackbar } = useSnackbar();
    const batchSize = 50;
    const [list, setList] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [uploadedCount, setUploadedCount] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);


    const generatePDF = async (data, index) => {
        try {
            console.log({ data });

            const pdfBlob = await pdf(
                <GeAeroSpacePhyscialFitnessTemplate data={data} />
            ).toBlob();

            const formData = new FormData();
            formData.append(
                "file",
                pdfBlob,
                `${data?.empId}_PhysicalFitnessForm.pdf`
            );

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
            }
        } catch (error) {
            console.error("Error generating/uploading PDF:", error);
            enqueueSnackbar("Error generating/uploading PDF", {
                variant: "error",
            });
        }
    };

    const fetchListOfEmployees = async () => {
        const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
        const result = await getData(url);
        if (result && result.data) {
            console.log("Fetched Data successfully");

            const temp = result?.data?.filter((item) =>
                item?.vitalsCreatedDate === "2026-04-21"
                ||
                item?.vitalsCreatedDate === "2026-04-22" ||
                item?.vitalsCreatedDate === "2026-04-23" ||
                item?.vitalsCreatedDate === "2026-04-24" ||
                item?.vitalsCreatedDate === "2026-04-25" ||
                item?.vitalsCreatedDate === "2026-04-26" ||
                item?.vitalsCreatedDate === "2026-04-27"
            );

            const length = temp.length;
            console.log({ length });
            const sorted = sortDataByName(temp);
            setList(sorted);

            console.log({ empLisy: sorted });
        } else {
            console.log("An error Occurred");
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
                {list.map((item, index) => (
                    <div key={index} style={{ display: "flex" }}>
                        <div key={index}>{`${index}- ${item.empId} ${item.name}`}</div>
                        <a href={item.physicalFitnessFormUrl}>
                            <div key={index}>{item.physicalFitnessFormUrl}</div>
                        </a>
                        <br />
                    </div>
                ))}
            </div>

            <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
                <GeAeroSpacePhyscialFitnessTemplate
                    data={list[0]}
                />
            </PDFViewer>
        </Fragment>
    );
};

export default GeAeroSpacePhyscialFitnessMain
