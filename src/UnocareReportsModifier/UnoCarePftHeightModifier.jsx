
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
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

async function findHeightLabelPosition(pdfUrl) {
    const pdfjsLib = await loadPdfJs();
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();

    for (const item of textContent.items) {
        const text = item.str?.trim();

        if (text && text.startsWith("Height")) {
            const [x, y] = item.transform.slice(4, 6);

            await pdf.destroy();
            return {
                x,
                y,
                height: item.height || 10,
                text,
            };
        }
    }

    await pdf.destroy();
    return null;
}

async function replaceHeightUsingOffset(pftUrl, newHeight = "") {
    const heightLabel = await findHeightLabelPosition(pftUrl);

    if (!heightLabel) {
        alert("Height label not found");
        return null;
    }

    const pdfBytes = await fetch(pftUrl).then((r) => r.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];

    const VALUE_X = heightLabel.x + 55; // adjust if needed
    const VALUE_Y = heightLabel.y;

    // white out old value
    page.drawRectangle({
        x: VALUE_X,
        y: VALUE_Y,
        width: 40,
        height: heightLabel.height + 0,
        color: rgb(1, 1, 1),
    });

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // ✅ USE data.height here
    page.drawText(`${newHeight} Cms`, {
        x: VALUE_X,
        y: VALUE_Y,
        size: 9,
        font,
        color: rgb(0, 0, 0),
    });

    return new Blob([await pdfDoc.save()], { type: "application/pdf" });
}

// ✅ React Component
const UnoCarePftHeightModifier = ({
    corpId = "3e980884-00a6-470a-bb69-f29dfa0b01c2",
    campCycleId = "390725",
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
            const temp = result?.data?.filter((item) => [
                "C11025", "DTS0644735", "Y0653", "S-657", "Y0679", "526", "A531", "1284", "1346", "791288", "2096024", "Y0729", "1230", "1355254", "S668", "C11026", "Y0667", "S667", "U9511", "S665", "2117967", "1749603", "S599", "1161738", "29004243", "1382335", "1547139", "BK000856", "A231", "SH1494", "W1287", "S - 664", "Y0726", "SH1607", "S - 656", "1227", "SH1611", "S - 658", "C11024", "A405", "1694674", "Y0730"
            ].includes(item?.empId) && item.pftUrl);
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
            const pftUrl = data?.pftUrl;
            if (!pftUrl) {
                enqueueSnackbar("Missing Pft URL!", { variant: "warning" });
                return;
            }


            // Step 2️⃣: Modify the PFT PDF (add rectangle + text)
            const modifiedBlob = await replaceHeightUsingOffset(
                data.pftUrl,
                data?.height || ""
            );

            // Step 3️⃣: Preview the modified PDF (optional)
            // const previewUrl = URL.createObjectURL(modifiedBlob);
            // window.open(previewUrl, "_blank");

            // Step 4️⃣: (Optional) Upload the modified PDF back to server

            const formData = new FormData();
            formData.append("file", modifiedBlob, `ECG_${data?.empId}.pdf`);

            const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;

            const result = await uploadFile(uploadUrl, formData);

            if (result && result.data) {
                enqueueSnackbar("Successfully Uploaded Modified PFT PDF!", {
                    variant: "success",
                });
                setUploadedCount((prevCount) => prevCount + 1);
            } else {
                enqueueSnackbar("Upload failed!", { variant: "error" });
            }
        } catch (err) {
            console.error("Error modifying/uploading PFT PDF:", err);
            enqueueSnackbar("Error modifying/uploading PFT PDF!", {
                variant: "error",
            });
        }
    };

    const handleGeneratePDFs = async () => {
        for (let i = 0; i < list.length; i++) {
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
                    <a href={item.pftUrl}>
                        <div key={index}>{item.pftUrl}</div>
                    </a>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default UnoCarePftHeightModifier;
