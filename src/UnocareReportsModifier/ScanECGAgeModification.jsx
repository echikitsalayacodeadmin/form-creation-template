
import { PDFDocument, rgb, degrees } from "pdf-lib";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { sortDataByName } from "../assets/utils";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";



async function loadPdfJs() {
    const pdfjsLib = await import(
        "https://mozilla.github.io/pdf.js/build/pdf.mjs"
    );
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
    return pdfjsLib;
}


async function removeAgeFromECGPDF(pdfUrl) {
    try {
        // Load PDF
        const pdfBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer());
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const page = pdfDoc.getPages()[0];
        const { width, height } = page.getSize();

        // 🧠 STEP 1: Fix rotation (VERY IMPORTANT)
        // Try 0, 90, 270 depending on alignment
        // page.setRotation(degrees(0));
        // If misaligned, try:
        // page.setRotation(degrees(90));
        page.setRotation(degrees(270));

        // 🧠 STEP 2: Coordinates for RIGHT SIDE AGE
        // Based on your uploaded ECG :contentReference[oaicite:0]{index=0}
        let AGE_X = width - 115;
        let AGE_Y = height - 150;

        let AGE_WIDTH = 14;
        let AGE_HEIGHT = 90;

        // 🧪 DEBUG (optional - use red box to tune position)
        // page.drawRectangle({
        //     x: AGE_X,
        //     y: AGE_Y,
        //     width: AGE_WIDTH,
        //     height: AGE_HEIGHT,
        //     color: rgb(1, 0, 0),
        // });

        // 🧼 FINAL WHITE OUT
        page.drawRectangle({
            x: AGE_X,
            y: AGE_Y,
            width: AGE_WIDTH,
            height: AGE_HEIGHT,
            color: rgb(1, 1, 1),
        });

        // Save PDF
        const modifiedPdfBytes = await pdfDoc.save();

        return new Blob([modifiedPdfBytes], {
            type: "application/pdf",
        });

    } catch (error) {
        console.error("Error removing age from ECG PDF:", error);
        return null;
    }
}
// ✅ React Component
const ScanECGAgeModification = ({
    corpId = "b4055483-4ae1-4c35-851c-6922940bfa80",
    campCycleId = "385039",
    fileType = "ECG",
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
                "112401", "138514C", "111388", "40000960", "V061", "V088", "V129", "V100", "V979",
                "DTSS0388251", "DTSS0388240", "DTSS0261678", "DTSS0261630", "DTSS0261719",
                "TME1014", "DTSS0261716", "DTSS0261727", "V127", "V614", "V017", "V070", "V052",
                "TME1004", "DTSS0481560", "V723", "V119", "V045", "DTSS0388233", "DTSS0261662",
                "DTSS0403879", "TME1019", "SV1055", "SV1010", "SV1065", "TME1011", "TME1022",
                "DTSS0261623", "TME1007", "DTSS0261679", "V1004", "DTSS0261674", "DTSS0359874",
                "V035", "TME1003", "V130", "TME1006", "V782", "TME1013", "DTSS0261617",
                "DTSS0261723", "DTSS0448600", "DTSS0261722", "V019", "V058", "V101",
                "DTSS0388258", "V148", "DTSS0261681", "DTSS0261627", "V1009", "V1011",
                "V092", "V528", "V056", "V425", "V221", "V188", "V693", "V1025", "V095",
                "SV1012", "SV1054", "V073", "V428", "TME1017", "V084", "V605", "V026",
                "V900", "V947", "DTSS0261671", "TME1018", "V404", "V001", "V029",
                "SV1009", "DTSS0261667", "V689", "V937"
            ].includes(item?.empId) && item.ecgUrl);
            const sorted = sortDataByName(temp);
            setList(sorted);
            console.log("Total Pft employees:", sorted.length);
            setTotalEmployees(sorted.length);
        } else {
            enqueueSnackbar("Error fetching employee list", { variant: "error" });
        }
    };

    useEffect(() => {
        fetchListOfEmployees();
    }, [corpId, campCycleId]);

    const handleEcgModify = async (data) => {
        try {
            const ecgUrl = data?.ecgUrl;
            if (!ecgUrl) {
                enqueueSnackbar("Missing Pft URL!", { variant: "warning" });
                return;
            }


            // Step 2️⃣: Modify the PFT PDF (add rectangle + text)
            const modifiedBlob = await removeAgeFromECGPDF(
                data.ecgUrl,
            );

            // Step 3️⃣: Preview the modified PDF (optional)
            const previewUrl = URL.createObjectURL(modifiedBlob);
            window.open(previewUrl, "_blank");

            // Step 4️⃣: (Optional) Upload the modified PDF back to server

            // const formData = new FormData();
            // formData.append("file", modifiedBlob, `ECG_${data?.empId}.pdf`);

            // const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;

            // const result = await uploadFile(uploadUrl, formData);

            // if (result && result.data) {
            //     enqueueSnackbar("Successfully Uploaded Modified PFT PDF!", {
            //         variant: "success",
            //     });
            //     setUploadedCount((prevCount) => prevCount + 1);
            // } else {
            //     enqueueSnackbar("Upload failed!", { variant: "error" });
            // }
        } catch (err) {
            console.error("Error modifying/uploading PFT PDF:", err);
            enqueueSnackbar("Error modifying/uploading PFT PDF!", {
                variant: "error",
            });
        }
    };

    const handleGeneratePDFs = async () => {
        for (let i = 0; i < 10; i++) {
            await handleEcgModify(list[i], i);
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
                    <div key={index}>{`${index}- ${item.empId} ${item.name} SYS: ${item.height} RH: ${item?.cholestrolData?.["height"]}`}</div>
                    <a href={item.ecgUrl}>
                        <div key={index}>{item.ecgUrl}</div>
                    </a>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default ScanECGAgeModification;
