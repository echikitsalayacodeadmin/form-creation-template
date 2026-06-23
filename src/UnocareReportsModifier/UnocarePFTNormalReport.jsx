// import React, { Fragment } from 'react'

// const UnocarePFTNormalReport = () => {
//   return (
//     <Fragment>

//     </Fragment>
//   )
// }

// export default UnocarePFTNormalReport



import { useSnackbar } from "notistack";
import { PDFDocument } from "pdf-lib";
import React, { useEffect, useState } from "react";
import normalPftWithoutSign from "../assets/images/normalPftWithoutSign.png";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";

// ✅ Load official PDF.js build + worker from CDN dynamically
async function loadPdfJs() {
    const pdfjsLib = await import(
        "https://mozilla.github.io/pdf.js/build/pdf.mjs"
    );
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
    return pdfjsLib;
}

// const modifyPftPdf = async (pdfUrl, signatureImage) => {
//     // 1. Fetch existing PDF
//     const existingPdfBytes = await fetch(pdfUrl).then((res) =>
//         res.arrayBuffer()
//     );

//     // 2. Load PDF
//     const pdfDoc = await PDFDocument.load(existingPdfBytes);

//     // 3. Get last page (important for reports)
//     const pages = pdfDoc.getPages();
//     const page = pages[pages.length - 1];

//     const { width, height } = page.getSize();

//     // 4. Fetch signature image
//     const signatureBytes = await fetch(signatureImage).then((res) =>
//         res.arrayBuffer()
//     );

//     // 5. Embed image
//     const signature = await pdfDoc.embedPng(signatureBytes);

//     // 6. Resize (IMPORTANT)
//     const scaled = signature.scale(0.30);

//     // 7. Draw at bottom-right (adjusted for YOUR report layout)
//     page.drawImage(signature, {
//         x: width - scaled.width - 40, // right margin
//         y: 70, // slightly above footer text (important)
//         width: scaled.width,
//         height: scaled.height,
//     });

//     // 8. Save
//     const pdfBytes = await pdfDoc.save();

//     return new Blob([pdfBytes], { type: "application/pdf" });
// };

const modifyPftPdf = async (pdfUrl, normalPftImage) => {
    // 1. Fetch existing PDF
    const existingPdfBytes = await fetch(pdfUrl).then((res) =>
        res.arrayBuffer()
    );

    // 2. Load PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // 3. Get last page
    const pages = pdfDoc.getPages();
    const page = pages[pages.length - 1];

    const { width, height } = page.getSize();

    // 4. Load ECG image
    const imageBytes = await fetch(normalPftImage).then((res) =>
        res.arrayBuffer()
    );

    const image = await pdfDoc.embedPng(imageBytes);

    // 🔥 Calculate height from top 200 to bottom
    const targetHeight = height - 107;

    // 🔥 Scale image to fit full width & target height
    const scaled = image.scale(width / image.width);

    // Adjust height manually to fill area
    const finalHeight = targetHeight;

    // 5. Draw image
    page.drawImage(image, {
        x: 0,
        y: 0, // start from bottom
        width: width + 1,
        height: finalHeight,
    });

    // 6. Save PDF
    const pdfBytes = await pdfDoc.save();

    return new Blob([pdfBytes], { type: "application/pdf" });
};



// ✅ React Component
const UnocarePFTNormalReport = ({
    corpId = '058c1ace-4ade-4dab-a13e-4f75c49339f2',
    campCycleId = '424248',
    // corpId = "94180f9d-b1bf-4794-b81c-5f21a908ad9c",
    // campCycleId = "396613",
    // corpId = "0bcd762b-3523-46eb-90c4-eed8154cd479",
    // campCycleId = "403772",
    fileType = "PFT",
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
            const temp = result?.data
                ?.filter((item) => [
                    "54201653",
                    "AL1",
                    "AL5",
                    "54201574",
                    "54201414",
                    "54201413",
                    "54201623",
                    "54201283",
                    "54201153",
                    "54201218",
                    "54201311",
                    "54201466",
                    "54201529",
                    "54201444",
                    "54201487",
                    "54201507",
                    "54201211",
                    "54101463",
                    "54201289",
                    "54201315",
                    "54201251",
                    "54201510",
                    "54201157",
                    "54201418",
                    "54201675",
                    "54201243",
                    "54201270",
                    "54201208",
                    "54201599",
                    "54201598",
                    "54201673",
                    "54201627",
                    "54201612",
                    "AL2",
                    "54201642",
                    "54201691",
                    "AL14",
                    "54201643",
                    "54201618",
                    "54201573",
                    "54201692"
                ]?.includes(item?.empId) && item?.pftUrl);
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
            const pftUrl = data?.pftUrl;
            if (!pftUrl) {
                enqueueSnackbar("Missing PFT URL!", { variant: "warning" });
                return;
            }

            // Step 1️⃣: Find where the line occurs in 
            // Step 2️⃣: Modify the PDF (apply rectangle + image)
            const modifiedBlob = await modifyPftPdf(
                pftUrl,
                normalPftWithoutSign // ✅ your actual signature
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
                    <a href={item.pftUrl}>
                        <div key={index}>{item.pftUrl}</div>
                    </a>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default UnocarePFTNormalReport;
