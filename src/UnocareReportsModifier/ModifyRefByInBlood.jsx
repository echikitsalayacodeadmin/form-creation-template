


import { useSnackbar } from "notistack";
import { PDFDocument } from "pdf-lib";
import React, { useEffect, useState } from "react";
import { rgb, StandardFonts } from "pdf-lib";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import { uploadFile } from "../assets/services/PostApiCall";

// ✅ Load official PDF.js build + worker from CDN dynamically
async function loadPdfJs() {
    const pdfjsLib = await import(
        "https://mozilla.github.io/pdf.js/build/pdf.mjs"
    );
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
    return pdfjsLib;
}



const modifyRefDoctor = async (pdfUrl) => {
    const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();

        // ⚠️ Coordinates based on your PDF (adjust slightly if needed)

        // ✅ Step 1: Cover "DR. SELF"
        page.drawRectangle({
            x: 107,                // tweak if misaligned
            y: height - 175,       // tweak based on page
            width: 125,
            height: 25,
            color: rgb(1, 1, 1),
        });

        // ✅ Step 2: Draw "Uno.care"
        page.drawText("Uno.care", {
            x: 110,
            y: height - 168,
            size: 10,
            font,
            color: rgb(0, 0, 0),
        });
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: "application/pdf" });
};

// ✅ React Component
const ModifyRefByInBlood = ({
    corpId = "1a635706-7168-4474-b221-86e272985b0a",
    campCycleId = "403631",
    fileType = "BLOODTEST",
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [list, setList] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [uploadedCount, setUploadedCount] = useState(0);

    // Fetch employee list
    const fetchListOfEmployees = async () => {
        const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
        const result = await getData(url);
        if (result && result.data) {
            const temp = result?.data?.filter((item) => item.bloodTestUrl);
            const sorted = sortDataByName(temp);
            setList(sorted);
            console.log("Total PFT employees:", sorted.length);
            setTotalEmployees(sorted.length);
        } else {
            enqueueSnackbar("Error fetching employee list", { variant: "error" });
        }
    };

    useEffect(() => {
        fetchListOfEmployees();
    }, [corpId, campCycleId]);

    const handleModify = async (data) => {
        try {
            const bloodTestUrl = data?.bloodTestUrl;
            if (!bloodTestUrl) {
                enqueueSnackbar("Missing BLOOD URL!", { variant: "warning" });
                return;
            }

            const modifiedBlob = await modifyRefDoctor(
                bloodTestUrl,

            );

            // const previewUrl = URL.createObjectURL(modifiedBlob);
            // window.open(previewUrl, "_blank");
            const formData = new FormData();
            formData.append("file", modifiedBlob, `BLOOD_${data?.empId}.pdf`);

            const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;

            const result = await uploadFile(uploadUrl, formData);

            if (result && result.data) {
                enqueueSnackbar("Successfully Uploaded Modified PDF!", {
                    variant: "success",
                });
                setUploadedCount((prev) => prev + 1);
            } else {
                enqueueSnackbar("Upload failed!", { variant: "error" });
            }
        } catch (err) {
            console.error("Error modifying/uploading PDF:", err);
            enqueueSnackbar("Error modifying/uploading PDF!", { variant: "error" });
        }
    };

    const handleGeneratePDFs = async () => {
        for (let i = 0; i < list.length; i++) {
            await handleModify(list[i], i);
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
        <div>
            <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
            <button onClick={handleDeletePDF}>Delete Files</button>
            <div>Total Employees: {totalEmployees}</div> <br />
            <div>Uploaded Files: {uploadedCount}</div> <br />
            {list.map((item, index) => (
                <div key={index} style={{ display: "flex" }}>
                    <div key={index}>{`${index}- ${item.empId} ${item.name}`}</div>
                    <a href={item.bloodTestUrl}>
                        <div key={index}>{item.bloodTestUrl}</div>
                    </a>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default ModifyRefByInBlood;
