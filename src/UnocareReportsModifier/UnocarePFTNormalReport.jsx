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
import prashantDeshmukh from "../assets/images/prashantDeshmukh.png";
import normalPft from "../assets/images/normalPft.png";
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
    corpId = "94180f9d-b1bf-4794-b81c-5f21a908ad9c",
    campCycleId = "396613",
    fileType = "FITNESS_CERTIFICATE_FOOD",
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
            const temp = result?.data?.filter((item) => [
                "400042",
                "60844",
                "170651",
                "508130",
                "170637",
                "170625",
                "170453",
                "27640",
                "170473",
                "36027",
                "28331",
                "14894",
                "16970",
                "35981",
                "405208",
                "405511",
                "170421",
                "170562",
                "170605",
                "508054",
                "508072",
                "401122",
                "400763",
                "400505",
                "405061",
                "28369",
                "400231",
                "400033",
                "400618",
                "400663",
                "405259",
                "170593",
                "404693",
                "401224",
                "170532",
                "170549",
                "400842",
                "36622",
                "400416",
                "400242",
                "400250",
                "400849",
                "401351",
                "36787",
                "170365",
                "170386",
                "170514",
                "508021",
                "170597",
                "400813",
                "507688",
                "33325",
                "404502",
                "400684",
                "401102",
                "401223",
                "401399",
                "401515",
                "403490",
                "403646",
                "403808",
                "403823",
                "404332",
                "404465",
                "404771",
                "404829",
                "405319",
                "405370",
                "405436",
                "405712",
                "405789",
                "405808",
                "405865",
                "406040",
                "406345",
                "406387",
                "507821",
                "250659",
                "170670",
                "170736",
                "170751",
                "170715",
                "170673",
                "508218",
                "31874",
                "401504",
                "405433",
                "170584",
                "96108",
                "508097",
                "29052",
                "400621",
                "28837",
                "35386",
                "402278",
                "26275",
                "170348",
                "507960",
                "507622",
                "508029",
                "99287",
                "28256",
                "170344",
                "170384",
                "170572",
                "36811",
                "404037",
                "10823",
                "34668",
                "36756",
                "402292",
                "402333",
                "402408",
                "402679",
                "404449",
                "405238",
                "406189",
                "406190",
                "406269",
                "406336",
                "170440",
                "508009",
                "170370",
                "250664",
                "250665",
                "401131",
                "403140",
                "404921",
                "404923",
                "400289",
                "507848",
                "507927",
                "400155",
                "404922",
                "27746",
                "34811",
                "402018",
                "170328",
                "170330",
                "250675",
                "170425",
                "170614",
                "28190",
                "400431",
                "402415",
                "403451",
                "404271",
                "405375",
                "406034",
                "406035",
                "406229",
                "507846",
                "508191",
                "170695",
                "170713",
                "406563",
                "170743"
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
                normalPft // ✅ your actual signature
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
