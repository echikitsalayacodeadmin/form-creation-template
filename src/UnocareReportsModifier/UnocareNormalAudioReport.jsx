import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getData } from "../assets/services/GetApiCall";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import { useSnackbar } from "notistack";
import normalAudioReportTemplate from "../assets/NormalAudioReport.pdf";
import dayjs from "dayjs";

/* =========================================================
   CUSTOM COORDS — tuned from NormalAudioReport.pdf (612×792)
   rect: white-out box (x,y = bottom-left) | text: draw position
========================================================= */
const AUDIO_CUSTOM_FIELDS = {
    patientId: {
        rect: { x: 111, y: 696, width: 50, height: 12 },
        text: { x: 111, y: 699.6, size: 9 },
    },
    name: {
        rect: { x: 91, y: 684, width: 220, height: 12 },
        text: { x: 91, y: 687.4, size: 9 },
    },
    crNumber: {
        rect: { x: 113, y: 672, width: 130, height: 12 },
        text: { x: 113, y: 675.1, size: 9 },
    },
    registrationDate: {
        rect: { x: 137, y: 660, width: 100, height: 12 },
        text: { x: 137, y: 662.9, size: 9 },
    },
    age: {
        rect: { x: 520, y: 696, width: 25, height: 12 },
        text: { x: 520, y: 699.6, size: 9 },
    },
    gender: {
        rect: { x: 510, y: 684, width: 40, height: 12 },
        text: { x: 510, y: 687.4, size: 9 },
    },
    printDate: {
        rect: { x: 292, y: 35, width: 70, height: 7.5 },
        text: { x: 292, y: 37.8, size: 6 },
    },
};

// Covers static "Age : XX" label and value on NormalAudioReport.pdf
const AUDIO_AGE_WHITE_OUT = { x: 498, y: 696, width: 38, height: 12 };

async function loadTemplateBytes() {
    const res = await fetch(normalAudioReportTemplate);
    if (!res.ok) throw new Error("Failed to load audio report template PDF");
    return new Uint8Array(await res.arrayBuffer());
}

function cloneTemplateBytes(templateBytes) {
    return new Uint8Array(templateBytes);
}

function formatGender(gender) {
    if (gender === "MALE") return "Male";
    if (gender === "FEMALE") return "Female";
    return gender || "";
}

function formatAudioDate(dateValue) {
    const parsed = dayjs(dateValue);
    if (!parsed.isValid()) return "";
    return parsed.format("DD-MMM-YYYY");
}

function formatCrNumber(dateValue) {
    const parsed = dayjs(dateValue);
    if (!parsed.isValid()) return "";
    return `${parsed.format("YYYYMMDD")}104045`;
}

function whiteOutAgeField(page) {
    const { x, y, width, height } = AUDIO_AGE_WHITE_OUT;
    page.drawRectangle({
        x,
        y,
        width,
        height,
        color: rgb(1, 1, 1),
    });
}

function drawCustomField(page, font, fieldConfig, value) {
    if (value === undefined || value === null || value === "") return;

    const { rect, text } = fieldConfig;

    page.drawRectangle({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        color: rgb(1, 1, 1),
    });

    page.drawText(String(value), {
        x: text.x,
        y: text.y,
        size: text.size,
        font,
        color: rgb(0, 0, 0),
    });
}

async function buildAudioPdfFromTemplate({
    templateBytes,
    patientId,
    name,
    crNumber,
    registrationDate,
    age,
    gender,
    printDate,
    removeAge = false,
}) {
    const pdfDoc = await PDFDocument.load(cloneTemplateBytes(templateBytes));
    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    drawCustomField(page, font, AUDIO_CUSTOM_FIELDS.patientId, patientId);
    drawCustomField(page, font, AUDIO_CUSTOM_FIELDS.name, name);
    drawCustomField(page, font, AUDIO_CUSTOM_FIELDS.crNumber, crNumber);
    drawCustomField(page, font, AUDIO_CUSTOM_FIELDS.registrationDate, registrationDate);

    if (removeAge) {
        whiteOutAgeField(page);
    } else {
        drawCustomField(page, font, AUDIO_CUSTOM_FIELDS.age, age ? String(age) : "");
    }

    drawCustomField(page, font, AUDIO_CUSTOM_FIELDS.gender, gender);
    drawCustomField(page, font, AUDIO_CUSTOM_FIELDS.printDate, printDate);

    return new Blob([await pdfDoc.save()], { type: "application/pdf" });
}

async function processEmployee({
    employee,
    templateBytes,
    enqueueSnackbar,
    corpId,
    campCycleId,
    previewOnly = false,
    removeAge = false,
    customDate = "",
}) {
    try {
        const patientName = `${employee?.name || ""} ${employee?.empId || ""}`.trim();
        const formattedDate = formatAudioDate(customDate);

        const modifiedBlob = await buildAudioPdfFromTemplate({
            templateBytes,
            patientId: employee?.empId,
            name: patientName,
            crNumber: formatCrNumber(customDate),
            registrationDate: formattedDate,
            age: employee?.age,
            gender: formatGender(employee?.gender),
            printDate: formattedDate,
            removeAge,
        });

        if (previewOnly) {
            const previewUrl = URL.createObjectURL(modifiedBlob);
            window.open(previewUrl, "_blank");
            return;
        }

        const formData = new FormData();
        formData.append("file", modifiedBlob, `AUDIOMETRY_${employee.empId}.pdf`);

        const uploadUrl = `https://apitest.uno.care/api/org/upload?empId=${employee.empId}&fileType=AUDIOMETRY&corpId=${corpId}&campCycleId=${campCycleId}`;

        await uploadFile(uploadUrl, formData);

        enqueueSnackbar(`Audiometry report uploaded for ${employee.empId}`, {
            variant: "success",
        });
    } catch (err) {
        console.error("Audiometry report modify failed", err);
        enqueueSnackbar(`Audiometry report failed for ${employee.empId}`, {
            variant: "error",
        });
    }
}

const UnocareNormalAudioReport = ({
    corpId = "38b5388c-4d5d-4388-847e-cc8d6f6dc939",
    campCycleId = "394171",
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [employees, setEmployees] = useState([]);
    const [processed, setProcessed] = useState(0);
    const [templateBytes, setTemplateBytes] = useState(null);
    const [templateReady, setTemplateReady] = useState(false);
    const [removeAge, setRemoveAge] = useState(false);
    const [customDate, setCustomDate] = useState("2026-03-13");

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                const bytes = await loadTemplateBytes();
                setTemplateBytes(bytes);
                setTemplateReady(true);
            } catch (err) {
                console.error("Failed to load audio report template", err);
                enqueueSnackbar("Failed to load NormalAudioReport.pdf", {
                    variant: "error",
                });
            }
        };
        loadTemplate();
    }, [enqueueSnackbar]);

    useEffect(() => {
        const fetchEmployees = async () => {
            const url = `https://apitest.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
            const res = await getData(url);

            const filteredData =
                res?.data?.filter((item) =>
                    [
                        "601002",
                        "601003",
                        "601044",
                        "601045",
                        "601114",
                        "601125",
                        "C01",
                        "C02",
                        "C03",
                        "C04",
                        "C05",
                        "C06",
                        "C07",
                        "C08",
                        "C09",
                        "C010",
                        "C011",
                        "C012",
                        "C013",
                    ].includes(item?.empId)
                ) || [];

            setEmployees(sortDataByName(filteredData));
        };
        fetchEmployees();
    }, [corpId, campCycleId]);

    const handleStart = async () => {
        if (!templateBytes) {
            enqueueSnackbar("Audio template not loaded yet", { variant: "warning" });
            return;
        }

        for (let i = 0; i < employees.length; i += 1) {
            await processEmployee({
                employee: employees[i],
                templateBytes,
                enqueueSnackbar,
                corpId,
                campCycleId,
                removeAge,
                customDate,
            });
            setProcessed((p) => p + 1);
        }
    };

    const handlePreviewFirst = async () => {
        if (!employees.length) return;
        if (!templateBytes) {
            enqueueSnackbar("Audio template not loaded yet", { variant: "warning" });
            return;
        }

        await processEmployee({
            employee: employees[0],
            templateBytes,
            enqueueSnackbar,
            corpId,
            campCycleId,
            previewOnly: true,
            removeAge,
            customDate,
        });
    };

    return (
        <div>
            <label style={{ display: "block", marginBottom: 8 }}>
                <input
                    type="checkbox"
                    checked={removeAge}
                    onChange={(e) => setRemoveAge(e.target.checked)}
                />{" "}
                Remove Age
            </label>

            <label style={{ display: "block", marginBottom: 8 }}>
                Custom Date:{" "}
                <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                />
            </label>

            <button onClick={handleStart} disabled={!templateReady || !customDate}>
                Modify & Upload Audiometry Reports
            </button>
            <button
                onClick={handlePreviewFirst}
                style={{ marginLeft: 8 }}
                disabled={!templateReady || !employees.length || !customDate}
            >
                Preview First Employee
            </button>

            <div>
                Template: {templateReady ? "Loaded" : "Loading..."} | Employees:{" "}
                {employees.length} | Processed: {processed}
            </div>

            {employees.map((e, i) => (
                <div key={i}>
                    {i + 1}. {e.empId} - {e.name} {e?.age || "_"} yrs |{" "}
                    {e?.gender || "_"} | URL -{" "}
                    <a href={e?.audiometryUrl || ""} target="_blank" rel="noreferrer">
                        {e?.audiometryUrl || ""}
                    </a>
                </div>
            ))}
        </div>
    );
};

export default UnocareNormalAudioReport;
