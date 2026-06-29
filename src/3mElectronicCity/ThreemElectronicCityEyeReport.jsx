import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { sortDataByName } from "../assets/utils";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import chanchanAgarwalSealSign from "../assets/images/chanchanAgarwalSealSign.png";
import { uploadFile } from "../assets/services/PostApiCall";

const replaceColourBlindnessUsingOffset = async (
    eyeTestUrl,
    signatureImageBytes
) => {
    const pdfBytes = await fetch(eyeTestUrl).then((r) => r.arrayBuffer());

    const pdfDoc = await PDFDocument.load(pdfBytes);

    const page = pdfDoc.getPages()[0];

    // Fixed coordinates
    const VALUE_X = 36;
    const VALUE_Y = 398;

    // Remove old text
    page.drawRectangle({
        x: VALUE_X,
        y: VALUE_Y - 2,
        width: 110,
        height: 20,
        color: rgb(1, 1, 1),
    });

    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // New text
    page.drawText("Colour Vision:", {
        x: VALUE_X,
        y: VALUE_Y - 1,
        size: 14,
        font,
        color: rgb(0, 0, 0),
    });

    // Signature image
    let signatureImage;

    try {
        signatureImage = await pdfDoc.embedPng(signatureImageBytes);
    } catch (e) {
        signatureImage = await pdfDoc.embedJpg(signatureImageBytes);
    }

    // Signature position
    page.drawImage(signatureImage, {
        x: VALUE_X + 300,
        y: VALUE_Y - 140,
        width: 200,
        height: 150,
    });

    return new Blob([await pdfDoc.save()], {
        type: "application/pdf",
    });
};

const ThreemElectronicCityEyeReport = ({
    corpId = "5ac601f7-9279-401c-bc51-ad90985a9968",
    campCycleId = "406207",
    fileType = "EYE_TEST",
}) => {
    const { enqueueSnackbar } = useSnackbar();

    const [list, setList] = useState([]);
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [uploadedCount, setUploadedCount] = useState(0);

    const fetchListOfEmployees = async () => {
        const url = `https://apitest.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;

        const result = await getData(url);

        if (result && result.data) {
            const temp = result?.data?.filter(
                (item) =>
                    item.eyeTestUrl
            );

            const sorted = sortDataByName(temp);

            setList(sorted);
            setTotalEmployees(sorted.length);
        } else {
            enqueueSnackbar("Error fetching employee list", {
                variant: "error",
            });
        }
    };

    useEffect(() => {
        fetchListOfEmployees();
    }, [corpId, campCycleId]);

    const handleEcgModify = async (data) => {
        try {
            if (!data?.eyeTestUrl) {
                enqueueSnackbar("Missing Eye Test URL!", {
                    variant: "warning",
                });
                return;
            }

            // Load signature image
            const signatureBytes = await fetch(
                chanchanAgarwalSealSign
            ).then((r) => r.arrayBuffer());

            // Modify PDF
            const modifiedBlob =
                await replaceColourBlindnessUsingOffset(
                    data.eyeTestUrl,
                    signatureBytes
                );

            // Preview
            // const previewUrl =
            //     URL.createObjectURL(modifiedBlob);

            // window.open(previewUrl, "_blank");


            const formData = new FormData();
            formData.append("file", modifiedBlob, `Eye_Test_Report_${data?.empId}.pdf`);

            const uploadUrl = `https://apitest.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;

            const result = await uploadFile(uploadUrl, formData);

            if (result && result.data) {
                enqueueSnackbar("Successfully Uploaded Modified Eye Test PDF!", {
                    variant: "success",
                });
                setUploadedCount((prevCount) => prevCount + 1);
            } else {
                enqueueSnackbar("Upload failed!", { variant: "error" });
            }


        } catch (err) {
            console.error(err);

            enqueueSnackbar(
                "Error modifying/uploading Eye Test PDF!",
                {
                    variant: "error",
                }
            );
        }
    };

    const handleGeneratePDFs = async () => {
        for (let i = 0; i < list.length; i++) {
            await handleEcgModify(list[i]);
        }
    };

    const handleDeletePDF = async () => {
        for (let i = 0; i < list.length; i++) {
            await deleteFiles(list[i]);
        }
    };

    const deleteFiles = async (data) => {
        const url = `https://apitest.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;

        const result = await updateData(url);

        if (result && result.data) {
            enqueueSnackbar("Successfully Deleted PDF!", {
                variant: "success",
            });

            setUploadedCount((prev) => prev + 1);
        } else {
            enqueueSnackbar("An error occurred!", {
                variant: "error",
            });
        }
    };

    return (
        <div>
            <button onClick={handleGeneratePDFs}>
                Start Generating
            </button>

            <br />

            <button onClick={handleDeletePDF}>
                Delete Files
            </button>

            <div>Total Employees: {totalEmployees}</div>

            <br />

            <div>Uploaded Files: {uploadedCount}</div>

            <br />

            {list.map((item, index) => (
                <div
                    key={index}
                    style={{ display: "flex" }}
                >
                    <div>
                        {`${index} - ${item.empId} ${item.name}`}
                    </div>

                    <a
                        href={item.eyeTestUrl}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Open PDF
                    </a>
                </div>
            ))}
        </div>
    );
};

export default ThreemElectronicCityEyeReport;