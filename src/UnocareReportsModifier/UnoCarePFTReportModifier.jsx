

import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";

/* =========================================================
   FILE CONFIG (Offsets differ per report)
========================================================= */
const FILE_CONFIG_AGE = {
    // ECG: {
    //     urlKey: "ecgUrl",
    //     fileType: "ECG",
    //     xOffset: 22,
    //     whiteWidth: 20,
    // },
    PFT: {
        urlKey: "pftUrl",
        fileType: "PFT",
        xOffset: 38,
        whiteWidth: 18,
    },
    AUDIOMETRY: {
        urlKey: "audiometryUrl",
        fileType: "AUDIOMETRY",
        xOffset: 32,
        whiteWidth: 20,
    },
};

const FILE_CONFIG_GENDER = {
    ECG: {
        urlKey: "ecgUrl",
        fileType: "ECG",
        xOffset: 22,
        whiteWidth: 15,
    },
    PFT: {
        urlKey: "pftUrl",
        fileType: "PFT",
        xOffset: 95, // ⬅️ gender is far right in PFT
        whiteWidth: 25,
    },
    AUDIOMETRY: {
        urlKey: "audiometryUrl",
        fileType: "AUDIOMETRY",
        xOffset: 85,
        whiteWidth: 25,
    },
};

/* =========================================================
   PDF.JS LOADER
========================================================= */
async function loadPdfJs() {
    const pdfjsLib = await import(
        "https://mozilla.github.io/pdf.js/build/pdf.mjs"
    );
    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
    return pdfjsLib;
}

/* =========================================================
   FIND AGE LABEL POSITION
========================================================= */
async function findLabelPositions(pdfUrl) {
    const pdfjsLib = await loadPdfJs();
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();

    let ageLabel = null;
    let genderLabel = null;

    for (const item of textContent.items) {
        const text = item.str?.trim().toLowerCase();

        if (!text) continue;

        if (!ageLabel && text.includes("age")) {
            const [x, y] = item.transform.slice(4, 6);
            ageLabel = { x, y, width: item.width || 20, height: item.height || 10 };
        }

        if (!genderLabel && text.includes("gender")) {
            const [x, y] = item.transform.slice(4, 6);
            genderLabel = { x, y, width: item.width || 30, height: item.height || 10 };
        }
    }

    await pdf.destroy();
    return { ageLabel, genderLabel };
}

/* =========================================================
   REPLACE AGE IN PDF
========================================================= */
async function replaceAgeGenderInPdf({
    pdfUrl,
    newAge,
    newGender,
    fileType,
}) {
    const { ageLabel, genderLabel } = await findLabelPositions(pdfUrl);

    if (!ageLabel && !genderLabel) return null;

    const pdfBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // ================= AGE =================
    if (ageLabel) {
        let ageX = ageLabel.x;

        if (fileType === "ECG") ageX = ageLabel.x + 40;
        if (fileType === "PFT") ageX = ageLabel.x + 53;
        if (fileType === "AUDIOMETRY") ageX = ageLabel.x + 20;

        page.drawRectangle({
            x: ageX,
            y: ageLabel.y,
            width: 13,
            height: ageLabel.height + 3,
            color: rgb(1, 1, 1),
        });

        page.drawText(String(newAge), {
            x: ageX + 2,
            y: ageLabel.y,
            size: 9,
            font,
            color: rgb(0, 0, 0),
        });
    }

    // ================= GENDER =================
    if (genderLabel) {
        let genderX = genderLabel.x;

        if (fileType === "ECG") genderX = genderLabel.x + 40;
        if (fileType === "PFT") genderX = genderLabel.x + 63;
        if (fileType === "AUDIOMETRY") genderX = genderLabel.x + 37;

        page.drawRectangle({
            x: genderX,
            y: genderLabel.y,
            width: 40,
            height: genderLabel.height + 0,
            color: rgb(1, 1, 1),
        });

        page.drawText(String(newGender), {
            x: genderX + 2,
            y: genderLabel.y,
            size: 9,
            font,
            color: rgb(0, 0, 0),
        });
    }

    return new Blob([await pdfDoc.save()], { type: "application/pdf" });
}

/* =========================================================
   PROCESS ALL FILES FOR ONE EMPLOYEE
========================================================= */
async function processEmployee({
    employee,
    enqueueSnackbar,
    corpId, campCycleId
}) {
    for (const key of Object.keys(FILE_CONFIG_AGE)) {
        const config = FILE_CONFIG_AGE[key];
        const pdfUrl = employee?.[config.urlKey];
        if (!pdfUrl) continue;

        try {
            const modifiedBlob = await replaceAgeGenderInPdf({
                pdfUrl,
                newAge: employee?.age,
                newGender: employee.gender === "MALE" ? "Male" : employee.gender === "FEMALE" ? "Female" : "",
                fileType: config.fileType,
            });

            if (!modifiedBlob) {
                enqueueSnackbar(`Age not found in ${key} for ${employee.empId}`, {
                    variant: "warning",
                });
                continue;
            }

            const formData = new FormData();
            formData.append("file", modifiedBlob, `${key}_${employee.empId}.pdf`);

            // const previewUrl = URL.createObjectURL(modifiedBlob);
            // window.open(previewUrl, "_blank");

            const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${employee.empId}&fileType=${config.fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;

            await uploadFile(uploadUrl, formData);

            enqueueSnackbar(`${key} uploaded for ${employee.empId}`, {
                variant: "success",
            });
        } catch (err) {
            console.error(`${key} failed`, err);
            enqueueSnackbar(`${key} failed for ${employee.empId}`, {
                variant: "error",
            });
        }
    }
}

/* =========================================================
   MAIN COMPONENT
========================================================= */
const UnoCarePFTReportModifier = ({
    corpId = "94180f9d-b1bf-4794-b81c-5f21a908ad9c",
    campCycleId = "396613",
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [employees, setEmployees] = useState([]);
    const [processed, setProcessed] = useState(0);

    useEffect(() => {
        const fetchEmployees = async () => {
            const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
            const res = await getData(url);

            // const excludedDates = ["2025-11-19", "2025-11-18", "2025-11-17"];
            // const includedDates = ["2025-12-01", "2025-12-02"];

            // const filteredData =
            //   res?.data?.filter(
            //     (item) =>
            //       // ["40030981", "40032255", "611024"].includes(item?.empId) &&
            //       includedDates.includes(item?.vitalsCreatedDate) &&
            //       item?.bloodTestUrl
            //   ) || [];

            const filteredData =
                res?.data?.filter(
                    (item) => [
                        "507803", "170500", "170501", "170490", "507798", "507806", "508073", "507796", "507799", "507800", "507909", "170494", "170495", "170648", "507951", "507953", "507955", "507969", "507987", "507988", "508031", "508042", "508043", "508046", "508049", "508050", "508084", "508102", "508103", "508146"
                    ]?.includes(item?.empId)
                    // item?.bloodTestUrl &&
                    // dayjs(item.vitalsCreatedDate).isAfter("2025-11-30")
                ) || [];

            setEmployees(sortDataByName(filteredData));
        };
        fetchEmployees();
    }, [corpId, campCycleId]);

    const handleStart = async () => {
        for (let i = 0; i < employees.length; i++) {
            await processEmployee({
                employee: employees[i],
                enqueueSnackbar,
                corpId, campCycleId
            });
            setProcessed((p) => p + 1);
        }
    };

    return (
        <div>
            <button onClick={handleStart}>
                Modify & Upload ECG + PFT + AUDIOMETRY
            </button>

            <div>Total Employees: {employees.length}</div>
            <div>Processed: {processed}</div>

            {employees.map((e, i) => (
                <div key={i}>
                    {i + 1}. {e.empId} - {e.name}{" "}
                    {employees[i]?.age || "_"}{" "}  {employees[i]?.gender || "_"}
                </div>
            ))}
        </div>
    );
};

export default UnoCarePFTReportModifier;
