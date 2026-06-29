
import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getData } from "../assets/services/GetApiCall";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import { useSnackbar } from "notistack";
import pftReportTemplate from "../assets/pftReportTemplate.pdf";
import dayjs from "dayjs";

/* =========================================================
   CUSTOM COORDS — tuned from pftReportTemplate.pdf (612×792)
   rect: white-out box (x,y = bottom-left) | text: draw position
========================================================= */
const PFT_CUSTOM_FIELDS = {
    patient: {
        rect: { x: 52 + 10, y: 725.5, width: 125, height: 14 },
        text: { x: 52 + 10, y: 728.52, size: 9 },
    },
    age: {
        rect: { x: 260 + 10, y: 725.5, width: 58, height: 14 },
        text: { x: 268 + 10, y: 728.52, size: 9 },
    },
    height: {
        rect: { x: 272, y: 714, width: 55, height: 14 },
        text: { x: 278, y: 717.12, size: 9 },
    },
    weight: {
        rect: { x: 272, y: 702.5, width: 52, height: 14 },
        text: { x: 278, y: 705.84, size: 9 },
    },
    gender: {
        rect: { x: 426 + 10, y: 725.5, width: 48, height: 14 },
        text: { x: 433 + 10, y: 728.52, size: 9 },
    },
    vitalsCreatedDate: {
        rect: { x: 52 + 10, y: 725.5 - 35, width: 125, height: 14 },
        text: { x: 52 + 10, y: 728.52 - 35, size: 9 },
    }

};

// Covers static "Age" label and value area on pftReportTemplate.pdf
const PFT_AGE_WHITE_OUT = { x: 224, y: 725.5, width: 92, height: 14 };

async function loadTemplateBytes() {
    const res = await fetch(pftReportTemplate);
    if (!res.ok) throw new Error("Failed to load PFT template PDF");
    // Keep a stable copy — pdf.js detaches buffers passed to getDocument()
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

function formatPftDate(dateValue) {
    const parsed = dayjs(dateValue);
    if (!parsed.isValid()) return "";
    return parsed.format("DD MMM YYYY");
}

function whiteOutAgeField(page) {
    const { x, y, width, height } = PFT_AGE_WHITE_OUT;
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
/* =========================================================
   FILL TEMPLATE WITH EMPLOYEE DATA
========================================================= */
async function buildPftPdfFromTemplate({
    templateBytes,
    name,
    age,
    gender,
    height,
    weight,
    vitalsCreatedDate,
    removeAge = false,
}) {
    const pdfDoc = await PDFDocument.load(cloneTemplateBytes(templateBytes));
    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    drawCustomField(page, font, PFT_CUSTOM_FIELDS.patient, name);
    if (removeAge) {
        whiteOutAgeField(page);
    } else {
        drawCustomField(page, font, PFT_CUSTOM_FIELDS.age, age ? `${age} Yrs` : "");
    }
    drawCustomField(
        page,
        font,
        PFT_CUSTOM_FIELDS.height,
        height ? `${height} Cms` : ""
    );
    drawCustomField(
        page,
        font,
        PFT_CUSTOM_FIELDS.weight,
        weight ? `${weight} Kgs` : ""
    );
    drawCustomField(page, font, PFT_CUSTOM_FIELDS.gender, gender);
    drawCustomField(page, font, PFT_CUSTOM_FIELDS.vitalsCreatedDate, vitalsCreatedDate);

    page.drawRectangle({
        x: 172 + 10,
        y: 725.5 - 37,
        width: 180,
        height: 14,
        color: rgb(1, 1, 1),
    });


    return new Blob([await pdfDoc.save()], { type: "application/pdf" });
}

/* =========================================================
   PROCESS PFT FOR ONE EMPLOYEE
========================================================= */
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

        const modifiedBlob = await buildPftPdfFromTemplate({
            templateBytes,
            name: patientName,
            age: employee?.age,
            gender: formatGender(employee?.gender),
            height: employee?.height,
            weight: employee?.weight,
            vitalsCreatedDate: formatPftDate(customDate),
            removeAge,
        });

        if (previewOnly) {
            const previewUrl = URL.createObjectURL(modifiedBlob);
            window.open(previewUrl, "_blank");
            return;
        }

        const formData = new FormData();
        formData.append("file", modifiedBlob, `PFT_${employee.empId}.pdf`);

        const uploadUrl = `https://apitest.uno.care/api/org/upload?empId=${employee.empId}&fileType=PFT&corpId=${corpId}&campCycleId=${campCycleId}`;

        await uploadFile(uploadUrl, formData);

        enqueueSnackbar(`PFT uploaded for ${employee.empId}`, {
            variant: "success",
        });
    } catch (err) {
        console.error("PFT modify failed", err);
        enqueueSnackbar(`PFT failed for ${employee.empId}`, { variant: "error" });
    }
}

/* =========================================================
   MAIN COMPONENT
========================================================= */
const UnocarePFTReportsIndependent = ({
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
                console.error("Failed to load PFT template", err);
                enqueueSnackbar("Failed to load pftReportTemplate.pdf", {
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
                res?.data?.filter(item =>
                    [
                        "601002", "601003", "601044", "601045", "601114", "601125", "C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C010", "C011", "C012", "C013"
                    ].includes(item?.empId)
                )

            setEmployees(sortDataByName(filteredData));
        };
        fetchEmployees();
    }, [corpId, campCycleId]);

    const handleStart = async () => {
        if (!templateBytes) {
            enqueueSnackbar("PFT template not loaded yet", { variant: "warning" });
            return;
        }

        for (let i = 0; i < employees.length; i++) {
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
            enqueueSnackbar("PFT template not loaded yet", { variant: "warning" });
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
                Modify & Upload PFT Reports
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
                    {i + 1}. {e.empId} - {e.name}{" "}
                    {e?.age || "_"} yrs | {e?.gender || "_"} | H: {e?.height || "_"}{" "}
                    | W: {e?.weight || "_"} URL - <a href={e?.pftUrl || ""} target="_blank">{e?.pftUrl || ""}</a>
                </div>
            ))}
        </div>
    );
};

export default UnocarePFTReportsIndependent;
