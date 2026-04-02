


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



const modifyBloodPdf = async (pdfUrl, customDate) => {
    const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();

    // ⚠️ IMPORTANT: Date appears on ALL pages
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();

        // ✅ STEP 1: Cover old date (white rectangle)
        page.drawRectangle({
            x: width - 118,   // tweak this
            y: height - 120,  // tweak this
            width: 55,
            height: 20,
            color: rgb(1, 1, 1),
        });

        // ✅ STEP 2: Add new date text
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        page.drawText(customDate, {
            x: width - 115,
            y: height - 112.5,
            size: 8.5,
            font,
            color: rgb(0, 0, 0),
        });
    }

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: "application/pdf" });
};

// ✅ React Component
const BloodDateModifier = ({
    corpId = "3e875c62-9ecb-49b7-9fda-067379425f75",
    campCycleId = "397403",
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
            const temp = result?.data?.filter((item) => item.bloodTestUrl && [
                "60076", "70055", "IN377", "IN340", "IN252", "IN385", "IN343", "IN306", "IN164", "IN014",
                "M734", "IN263", "IN387", "IN272", "L081", "IN206", "IN140", "P729", "60071", "60065",
                "60041", "80004", "80041", "70104", "80012", "60032", "60051", "60044", "60099", "60077",
                "70014", "60048", "70062", "80007", "60069", "80042", "60060", "60040", "IN257", "IN326",
                "IN353", "IN142", "IN194", "IN351"
            ].includes(item?.empId));
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

            // Step 1️⃣: Find where the line occurs in 
            // Step 2️⃣: Modify the PDF (apply rectangle + image)
            const modifiedBlob = await modifyBloodPdf(
                bloodTestUrl,
                "24-Mar-2026"
            );

            // Step 3️⃣: Open for preview (uncomment if needed)
            // const previewUrl = URL.createObjectURL(modifiedBlob);
            // window.open(previewUrl, "_blank");

            // Step 4️⃣: (Optional) Upload back to server

            const formData = new FormData();
            formData.append("file", modifiedBlob, `PFT_${data?.empId}.pdf`);

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

export default BloodDateModifier;
