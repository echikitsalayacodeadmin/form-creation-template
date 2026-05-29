import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import { addPftReportTitleToPdf } from "./addReportTitle";

const DhootPft = ({
    corpId = "9e46a332-68c9-41d8-8f33-b681111c96f8",
    campCycleId = "414811",
    fileType = "PFT",
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [list, setList] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [uploadedCount, setUploadedCount] = useState(0);

    const fetchListOfEmployees = async () => {
        const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
        const result = await getData(url);

        if (result && result.data) {
            const temp = result.data.filter((item) => item.pftUrl && ["D10000348"].includes(item.empId));
            const sorted = sortDataByName(temp);
            setList(sorted);
            setTotalEmployees(sorted.length);
            console.log("Total PFT employees:", sorted.length);
        } else {
            enqueueSnackbar("Error fetching employee list", { variant: "error" });
        }
    };

    useEffect(() => {
        fetchListOfEmployees();
    }, [corpId, campCycleId]);

    const handleModify = async (data) => {
        try {
            const pftUrl = data?.pftUrl;
            if (!pftUrl) {
                enqueueSnackbar("Missing PFT URL!", { variant: "warning" });
                return;
            }

            const modifiedBlob = await addPftReportTitleToPdf(pftUrl, "Pft Report");

            const previewUrl = URL.createObjectURL(modifiedBlob);
            window.open(previewUrl, "_blank");

            // const formData = new FormData();
            // formData.append("file", modifiedBlob, `PFT_${data?.empId}.pdf`);

            // const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
            // const result = await uploadFile(uploadUrl, formData);

            // if (result && result.data) {
            //     enqueueSnackbar("Successfully uploaded modified PFT PDF!", {
            //         variant: "success",
            //     });
            //     setUploadedCount((prev) => prev + 1);
            // } else {
            //     enqueueSnackbar("Upload failed!", { variant: "error" });
            // }
        } catch (err) {
            console.error("Error modifying/uploading PFT PDF:", err);
            enqueueSnackbar("Error modifying/uploading PFT PDF!", { variant: "error" });
        }
    };

    const handleGeneratePDFs = async () => {
        for (let i = 0; i < 1; i++) {
            await handleModify(list[i]);
        }
    };

    const deleteFiles = async (data) => {
        const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;
        const result = await updateData(url);
        if (result && result.data) {
            enqueueSnackbar("Successfully deleted PDF!", { variant: "success" });
        } else {
            enqueueSnackbar("An error occurred!", { variant: "error" });
        }
    };

    const handleDeletePDF = async () => {
        for (let i = 0; i < list.length; i++) {
            await deleteFiles(list[i]);
        }
    };

    return (
        <div>
            <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
            <button onClick={handleDeletePDF}>Delete Files</button>
            <div>Total Employees: {totalEmployees}</div> <br />
            <div>Uploaded Files: {uploadedCount}</div> <br />
            {list.map((item, index) => (
                <div key={index} style={{ display: "flex" }}>
                    <div>{`${index}- ${item.empId} ${item.name}`}</div>
                    <a href={item.pftUrl}>
                        <div>{item.pftUrl}</div>
                    </a>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default DhootPft;
