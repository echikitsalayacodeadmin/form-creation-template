import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { sortDataByName } from "../assets/utils";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";

const replaceHeightInPft = async (pftUrl, newHeight = "") => {
    const pdfBytes = await fetch(pftUrl).then((response) => response.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];
    const { height } = page.getSize();

    // Template coordinates for RMS/UNO PFT (image-like PDFs)
    const heightValueX = 275;
    const heightValueY = height - 78;
    const heightValueWidth = 60;
    const heightValueHeight = 10;

    page.drawRectangle({
        x: heightValueX,
        y: heightValueY,
        width: heightValueWidth,
        height: heightValueHeight,
        color: rgb(1, 1, 1),
    });

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    page.drawText(`${newHeight} Cms`, {
        x: heightValueX + 2,
        y: heightValueY + 2,
        size: 9,
        font,
        color: rgb(0, 0, 0),
    });

    return new Blob([await pdfDoc.save()], { type: "application/pdf" });
};

const ModifyHeightInPFT = ({
    corpId = "35693879-486b-44b6-8a6a-15d57f111a08",
    campCycleId = "410953",
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
            const temp = result?.data?.filter(
                (item) =>
                    [
                        "40050977",
                        "40036018",
                        "40036686",
                        "40035118",
                        "40051048",
                        "40035535",
                        "40037329",
                        "40035910",
                        "40036867",
                        "40035529",
                        "40035425",
                        "40035754",
                        "40035951",
                        "40035441",
                        "40036333",
                        "40036209",
                        "40035337",
                        "40035301",
                        "40037003",
                        "40036366",
                        "40036063",
                        "40036101",
                        "40037506",
                        "40037507",
                        "40036259",
                        "40035730",
                        "40037456",
                        "40036056",
                        "35777",
                        "40037473",
                        "40035280",
                        "40036396",
                        "40035243",
                        "40036351",
                        "40037009",
                        "40035283",
                        "40035088",
                        "40036061",
                        "40036360",
                        "40035137",
                        "40036103",
                        "40035185",
                        "40037479",
                        "40035771",
                        "40036179",
                        "40035515",
                        "40036032",
                        "40036160",
                        "40035967",
                        "40035428",
                        "40036267",
                        "40035345",
                        "741584",
                        "40035776",
                        "40035462",
                        "40035369",
                        "40035091",
                        "40051120",
                        "40035931",
                        "40035876",
                        "40035026",
                        "40036490",
                        "40038307",
                        "40050964",
                        "40036180",
                        "40038293",
                        "40035188",
                        "40036284",
                        "40036282",
                        "40037994",
                        "40036208",
                        "40036557",
                        "40050955",
                        "40036109",
                        "40036266",
                        "40037179",
                        "40036055",
                        "40035333",
                        "40051279",
                        "40036185",
                        "40036010",
                        "40035962",
                        "40035357",
                        "40035085",
                        "40035783",
                        "40035291",
                        "40035317",
                        "40035443",
                        "40035334",
                        "40050966",
                        "40035239",
                        "40035775",
                    ].includes(item?.empId) && item.pftUrl
            );
            const sorted = sortDataByName(temp);
            setList(sorted);
            setTotalEmployees(sorted.length);
        } else {
            enqueueSnackbar("Error fetching employee list", { variant: "error" });
        }
    };

    useEffect(() => {
        fetchListOfEmployees();
    }, [corpId, campCycleId]);

    const handlePftModify = async (data) => {
        try {
            const pftUrl = data?.pftUrl;
            if (!pftUrl) {
                enqueueSnackbar("Missing PFT URL!", { variant: "warning" });
                return;
            }

            const heightValue =
                data?.height || data?.cholestrolData?.["height"] || "";
            const modifiedBlob = await replaceHeightInPft(pftUrl, heightValue);

            // Step 3️⃣: Preview the modified PDF (optional)
            // const previewUrl = URL.createObjectURL(modifiedBlob);
            // window.open(previewUrl, "_blank");

            // Step 4️⃣: (Optional) Upload the modified PDF back to server


            const formData = new FormData();
            formData.append("file", modifiedBlob, `PFT_${data?.empId}.pdf`);

            const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
            const result = await uploadFile(uploadUrl, formData);

            if (result && result.data) {
                enqueueSnackbar("Successfully uploaded modified PFT PDF!", {
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
        for (let i = 0; i < list.length; i += 1) {
            await handlePftModify(list[i]);
        }
    };

    const deleteFiles = async (data) => {
        const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;
        const result = await updateData(url);
        if (result && result.data) {
            enqueueSnackbar("Successfully deleted PDF!", {
                variant: "success",
            });
            setUploadedCount((prevCount) => prevCount + 1);
        } else {
            enqueueSnackbar("An error occurred!", {
                variant: "error",
            });
        }
    };

    const handleDeletePDF = async () => {
        for (let i = 0; i < list.length; i += 1) {
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
                    <div>{`${index}- ${item.empId} ${item.name} SYS: ${item.height} RH: ${item?.cholestrolData?.["height"]}`}</div>
                    <a href={item.pftUrl}>{item.pftUrl}</a>
                    <br />
                </div>
            ))}
        </div>
    );
};

export default ModifyHeightInPFT;
