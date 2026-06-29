import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getData } from "../assets/services/GetApiCall";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";
import genericBloodReportSample from "../assets/bloodSampleRusan.pdf";

const BLOOD_CUSTOM_FIELDS = {
    patientName: {
        rect: { x: 107, y: 712, width: 220, height: 15 },
        text: { x: 107, y: 716, size: 9 },
    },
    ageGender: {
        rect: { x: 107, y: 692, width: 175, height: 15 },
        text: { x: 107, y: 692, size: 9 },
    },
    registeredOn: {
        rect: { x: 478, y: 722, width: 130, height: 15 },
        text: { x: 478, y: 729, size: 9 },
    },
    sampleCollectedOn: {
        rect: { x: 478, y: 707, width: 130, height: 15 },
        text: { x: 478, y: 714, size: 9 },
    },
    sampleReportedOn: {
        rect: { x: 478, y: 697, width: 130, height: 15 },
        text: { x: 478, y: 699, size: 9 },
    },
};

const BLOOD_QR_WHITE_OUT_RECTS = [
    { x: 40, y: 30, width: 88, height: 78 },
    { x: 416, y: 30, width: 88, height: 78 },
];

// Static "Age/Gender" template label — white out and replace with "Gender"
const BLOOD_AGE_GENDER_LABEL = {
    rect: { x: 26, y: 688, width: 52, height: 14 },
    text: { x: 26, y: 693, size: 9 },
};

async function loadTemplateBytes() {
    const res = await fetch(genericBloodReportSample);
    if (!res.ok) throw new Error("Failed to load blood report template PDF");
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

function formatBloodDateTime(dateValue, timeLabel) {
    const parsed = dayjs(dateValue);
    if (!parsed.isValid()) return "";
    return `${parsed.format("DD-MMM-YYYY")} ${timeLabel}`;
}

function toSafePdfText(value = "") {
    const text = String(value ?? "");

    const mapped = text
        .replace(/А/g, "A")
        .replace(/В/g, "B")
        .replace(/Е/g, "E")
        .replace(/К/g, "K")
        .replace(/М/g, "M")
        .replace(/Н/g, "H")
        .replace(/О/g, "O")
        .replace(/Р/g, "P")
        .replace(/С/g, "C")
        .replace(/Т/g, "T")
        .replace(/Х/g, "X")
        .replace(/а/g, "a")
        .replace(/е/g, "e")
        .replace(/о/g, "o")
        .replace(/р/g, "p")
        .replace(/с/g, "c")
        .replace(/у/g, "y")
        .replace(/х/g, "x");

    return mapped.replace(/[^\x20-\x7E]/g, "");
}

function getUploadErrorDetails(err) {
    const status = err?.response?.status;
    const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unknown error";
    return { status, serverMessage };
}

function drawCustomField(page, font, fieldConfig, value) {
    if (value === undefined || value === null || value === "") return;

    const { rect, text } = fieldConfig;
    const safeText = toSafePdfText(value);
    if (!safeText) return;

    page.drawRectangle({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        color: rgb(1, 1, 1),
    });

    page.drawText(safeText, {
        x: text.x,
        y: text.y,
        size: text.size,
        font,
        color: rgb(0, 0, 0),
    });
}

function whiteOutBottomQrs(page) {
    BLOOD_QR_WHITE_OUT_RECTS.forEach((rect) => {
        page.drawRectangle({
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            color: rgb(1, 1, 1),
        });
    });
}

function replaceAgeGenderLabelWithGender(page, font) {
    const { rect, text } = BLOOD_AGE_GENDER_LABEL;

    page.drawRectangle({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        color: rgb(1, 1, 1),
    });

    page.drawText("Gender", {
        x: text.x,
        y: text.y,
        size: text.size,
        font,
        color: rgb(0, 0, 0),
    });
}

function formatAgeGenderText(age, gender, genderOnly) {
    if (genderOnly) return gender || "";
    return age ? `${age} Yrs / ${gender}` : "";
}

async function buildBloodPdfFromTemplate({
    templateBytes,
    patientName,
    age,
    gender,
    genderOnly = false,
    registeredOn,
    sampleCollectedOn,
    sampleReportedOn,
}) {
    const pdfDoc = await PDFDocument.load(cloneTemplateBytes(templateBytes));
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    pages.forEach((page) => {
        drawCustomField(page, font, BLOOD_CUSTOM_FIELDS.patientName, patientName);
        if (genderOnly) {
            replaceAgeGenderLabelWithGender(page, font);
        }
        drawCustomField(
            page,
            font,
            BLOOD_CUSTOM_FIELDS.ageGender,
            formatAgeGenderText(age, gender, genderOnly)
        );
        drawCustomField(page, font, BLOOD_CUSTOM_FIELDS.registeredOn, registeredOn);
        drawCustomField(
            page,
            font,
            BLOOD_CUSTOM_FIELDS.sampleCollectedOn,
            sampleCollectedOn
        );
        drawCustomField(
            page,
            font,
            BLOOD_CUSTOM_FIELDS.sampleReportedOn,
            sampleReportedOn
        );
        whiteOutBottomQrs(page);
    });

    return new Blob([await pdfDoc.save()], { type: "application/pdf" });
}

async function processEmployee({
    employee,
    templateBytes,
    enqueueSnackbar,
    corpId,
    campCycleId,
    previewOnly = false,
    genderOnly = false,
}) {
    try {
        const patientName = `${employee?.name || ""} ${employee?.empId || ""}`.trim();
        const baseDate = '2026-05-13';
        const formattedGender = formatGender(employee?.gender);

        const modifiedBlob = await buildBloodPdfFromTemplate({
            templateBytes,
            patientName,
            age: employee?.age,
            gender: formattedGender,
            genderOnly,
            registeredOn: formatBloodDateTime(baseDate, "05:30 PM"),
            sampleCollectedOn: formatBloodDateTime(baseDate, "05:45 PM"),
            sampleReportedOn: formatBloodDateTime(baseDate, "11:55 AM"),
        });

        if (previewOnly) {
            const previewUrl = URL.createObjectURL(modifiedBlob);
            window.open(previewUrl, "_blank");
            return;
        }

        const formData = new FormData();
        formData.append("file", modifiedBlob, `BLOOD_${employee.empId}.pdf`);

        const uploadUrl = `https://apitest.uno.care/api/org/upload?empId=${employee.empId}&fileType=BLOODTEST&corpId=${corpId}&campCycleId=${campCycleId}`;
        await uploadFile(uploadUrl, formData);

        enqueueSnackbar(`Blood report uploaded for ${employee.empId}`, {
            variant: "success",
        });
    } catch (err) {
        const { status, serverMessage } = getUploadErrorDetails(err);
        console.error(`Blood report modify failed for ${employee?.empId}`, {
            status,
            serverMessage,
            error: err,
        });
        enqueueSnackbar(
            `Blood report failed for ${employee.empId}${status ? ` (${status})` : ""}: ${serverMessage}`,
            {
                variant: "error",
            }
        );
    }
}

const GenericBloodReportGenerator = ({
    corpId = "38b5388c-4d5d-4388-847e-cc8d6f6dc939",
    campCycleId = "394171",
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [employees, setEmployees] = useState([]);
    const [processed, setProcessed] = useState(0);
    const [templateBytes, setTemplateBytes] = useState(null);
    const [templateReady, setTemplateReady] = useState(false);
    const [genderOnly, setGenderOnly] = useState(false);

    useEffect(() => {
        const loadTemplate = async () => {
            try {
                const bytes = await loadTemplateBytes();
                setTemplateBytes(bytes);
                setTemplateReady(true);
            } catch (err) {
                console.error("Failed to load blood report template", err);
                enqueueSnackbar("Failed to load genericBloodReportSample.pdf", {
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
                        "601002", "601003", "601044", "601045", "601114", "601125", "C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C010", "C011", "C012", "C013"
                    ].includes(item?.empId)
                ) || [];

            setEmployees(sortDataByName(filteredData));
        };
        fetchEmployees();
    }, [corpId, campCycleId]);

    const handleStart = async () => {
        if (!templateBytes) {
            enqueueSnackbar("Blood template not loaded yet", { variant: "warning" });
            return;
        }

        for (let i = 0; i < employees.length; i += 1) {
            await processEmployee({
                employee: employees[i],
                templateBytes,
                enqueueSnackbar,
                corpId,
                campCycleId,
                genderOnly,
            });
            setProcessed((p) => p + 1);
        }
    };

    const handlePreviewFirst = async () => {
        if (!employees.length) return;
        if (!templateBytes) {
            enqueueSnackbar("Blood template not loaded yet", { variant: "warning" });
            return;
        }

        await processEmployee({
            employee: employees[0],
            templateBytes,
            enqueueSnackbar,
            corpId,
            campCycleId,
            previewOnly: true,
            genderOnly,
        });
    };

    return (
        <div>
            <label style={{ display: "block", marginBottom: 8 }}>
                <input
                    type="checkbox"
                    checked={genderOnly}
                    onChange={(e) => setGenderOnly(e.target.checked)}
                />{" "}
                Gender Only
            </label>

            <button onClick={handleStart} disabled={!templateReady}>
                Generate & Upload Blood Reports
            </button>
            <button
                onClick={handlePreviewFirst}
                style={{ marginLeft: 8 }}
                disabled={!templateReady || !employees.length}
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
                    <a href={e?.bloodTestUrl || ""} target="_blank" rel="noreferrer">
                        {e?.bloodTestUrl || ""}
                    </a>
                </div>
            ))}
        </div>
    );
};

export default GenericBloodReportGenerator;
