// import React from 'react'
import { useSnackbar } from "notistack";
import { PDFDocument } from "pdf-lib";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import { uploadFile } from "../assets/services/PostApiCall";
import venoGopalSealSign from "../assets/images/venoGopalSealSign.png";



const addBottomRightSignature = async (
    pdfUrl,
    signatureImageBytes
) => {
    // Load existing PDF
    const pdfBytes = await fetch(pdfUrl).then((r) =>
        r.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(pdfBytes);

    // First page
    const page = pdfDoc.getPages()[0];

    // Embed image
    let signatureImage;

    try {
        signatureImage = await pdfDoc.embedPng(
            signatureImageBytes
        );
    } catch (e) {
        signatureImage = await pdfDoc.embedJpg(
            signatureImageBytes
        );
    }

    // Page dimensions
    const { width, height } = page.getSize();

    // Signature size
    const signWidth = 170;
    const signHeight = 100;

    // Bottom-right positioning
    const x = width - signWidth - 200;
    const y = 20;

    // Draw signature
    page.drawImage(signatureImage, {
        x,
        y,
        width: signWidth,
        height: signHeight,
    });

    // Return modified PDF blob
    return new Blob([await pdfDoc.save()], {
        type: "application/pdf",
    });
};




const ThreemElectronicCity2DEcho = ({
    corpId = "5ac601f7-9279-401c-bc51-ad90985a9968",
    campCycleId = "406207",
    fileType = "TWO_D_ECHO",
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
                    item.twoDEchoUrl
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
            if (!data?.twoDEchoUrl) {
                enqueueSnackbar("Missing Eye Test URL!", {
                    variant: "warning",
                });
                return;
            }

            // Load signature image
            const signatureBytes = await fetch(
                venoGopalSealSign
            ).then((r) => r.arrayBuffer());

            // Modify PDF
            const modifiedBlob =
                await addBottomRightSignature(
                    data.twoDEchoUrl,
                    signatureBytes
                );

            // Preview
            // const previewUrl =
            //     URL.createObjectURL(modifiedBlob);

            // window.open(previewUrl, "_blank");


            const formData = new FormData();
            formData.append("file", modifiedBlob, `Two_D_Echo_Report_${data?.empId}.pdf`);

            const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;

            const result = await uploadFile(uploadUrl, formData);

            if (result && result.data) {
                enqueueSnackbar("Successfully Uploaded Modified Two D Echo PDF!", {
                    variant: "success",
                });
                setUploadedCount((prevCount) => prevCount + 1);
            } else {
                enqueueSnackbar("Upload failed!", { variant: "error" });
            }


        } catch (err) {
            console.error(err);

            enqueueSnackbar(
                "Error modifying/uploading Two D Echo PDF!",
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
        const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;

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
                        href={item.twoDEchoUrl}
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

export default ThreemElectronicCity2DEcho;