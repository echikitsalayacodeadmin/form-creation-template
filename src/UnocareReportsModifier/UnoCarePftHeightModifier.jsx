
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

    const VALUE_X = heightLabel.x + 50; // adjust if needed
    const VALUE_Y = heightLabel.y;

    // white out old value
    page.drawRectangle({
        x: VALUE_X,
        y: VALUE_Y,
        width: 45,
        height: heightLabel.height + 1,
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
    corpId = "f62fa674-0710-47c9-9a5e-b76b731a22e3",
    campCycleId = "404052",
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
                "SH472",
                "113732",
                "114296",
                "112765",
                "117915C",
                "114227",
                "114215",
                "111522",
                "112758",
                "113889",
                "113877",
                "114008",
                "111640",
                "112759",
                "SH070",
                "111146",
                "SH325",
                "112964",
                "SH190",
                "113048",
                "101607",
                "114013",
                "111744",
                "112331",
                "114221",
                "112446",
                "113119",
                "100387",
                "SH141",
                "114341",
                "114478",
                "SH403",
                "113891",
                "114487",
                "106973",
                "113860",
                "112332",
                "113862",
                "22159",
                "112965",
                "113749",
                "SH061",
                "112562",
                "SH179",
                "114279",
                "101288",
                "CMLD388",
                "180274U",
                "113874",
                "113487",
                "111909",
                "SH046",
                "114212",
                "113515",
                "114005",
                "114333",
                "112336",
                "112966",
                "114370",
                "114360",
                "BNG23306",
                "114278",
                "113272",
                "114443",
                "SH143",
                "112968",
                "112967",
                "114229",
                "114126",
                "114281",
                "114277",
                "SH022",
                "113895",
                "113738",
                "114230",
                "114012",
                "113643",
                "114019",
                "114028",
                "SH041",
                "114004",
                "SH424",
                "SH076",
                "SH314",
                "113415",
                "113857",
                "113525",
                "113423",
                "114087",
                "SH005",
                "SH140",
                "111645",
                "107122",
                "111917",
                "112513",
                "111918",
                "114217",
                "113092",
                "112339",
                "112755",
                "111138",
                "100304",
                "23584",
                "113861",
                "111649",
                "114424",
                "113859",
                "114345",
                "111923",
                "103101C",
                "112971",
                "111134",
                "SH206",
                "111520",
                "114226",
                "19737",
                "113629",
                "114139",
                "109501",
                "SH360",
                "114228",
                "107692",
                "111756",
                "SH496",
                "113492",
                "111652",
                "113493",
                "SH168",
                "114102",
                "114125",
                "114339",
                "114010",
                "113175",
                "113881",
                "114336",
                "113055",
                "112347",
                "24261",
                "111757",
                "111758",
                "114077",
                "114350",
                "113258",
                "113163",
                "100710",
                "112349",
                "113486",
                "SH481",
                "112764",
                "114027",
                "114282",
                "113309",
                "113665",
                "114017",
                "112352",
                "SH493",
                "112353",
                "113038",
                "SH336",
                "113858",
                "111135",
                "SH442",
                "114335",
                "114207",
                "114223",
                "114061",
                "113368",
                "111659",
                "113421",
                "113491",
                "113866",
                "111660",
                "114337",
                "114344"
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
