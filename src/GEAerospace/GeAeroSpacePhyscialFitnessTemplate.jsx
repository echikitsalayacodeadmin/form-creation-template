import {
    Document,
    Font,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";
import React from "react";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import drPratibhaVBandekar from "../assets/images/drPratibhaVBandekar.png";
import uncareheader from "../assets/images/uncareheader.png";

const TOKEN_NUMBERS_STRIP_FIT_FROM_RECOMMENDATION = new Set([
    "288",
    "322",
    "693",
    "794",
    "823",
    "1121",
    "1224",
    "1279",
    "1239",
    "1318",
    "1532",
    "1596",
]);

const tokenNumberContainsStripFitToken = (tokenNumber) => {
    const parts = String(tokenNumber ?? "")
        .split(/\D+/)
        .filter(Boolean);
    return parts.some((p) => TOKEN_NUMBERS_STRIP_FIT_FROM_RECOMMENDATION.has(p));
};

/** Removes trailing "Fit for work" / "Fit to work" style phrases (case-insensitive). */
const stripFitWorkFromRecommendationText = (msg) => {
    if (!msg || typeof msg !== "string") return msg;
    let out = msg
        .replace(/\s*\.?\s*Fit\s+to\s+work\.?/gi, "")
        .replace(/\s*\.?\s*Fit\s+for\s+work\.?/gi, "")
        .trim();
    out = out.replace(/\s+\./g, ".").replace(/\s{2,}/g, " ").trim();
    out = out.replace(/\s*,\s*$/g, "").trim();
    return out;
};

/**
 * Severe / Stage 2 / Stage 1 / Low only (no comment for Elevated or Normal).
 * Priority: severe > stage2 > stage1 > low.
 */
const getBpCategory = (bpStr) => {
    const [sysRaw, diasRaw] = String(bpStr ?? "")
        .trim()
        .split("/")
        .map((s) => s.trim());
    const sys = Number(sysRaw);
    const dias = Number(diasRaw);
    if (Number.isNaN(sys) || Number.isNaN(dias)) return null;

    if (sys > 180 || dias > 120) return "severe";
    if (sys >= 140 || dias >= 90) return "stage2";
    if (sys < 90 || dias < 60) return "low";
    return null;
};

const addBpRecommendation = (add, bpStr) => {
    const cat = getBpCategory(bpStr);
    if (!cat) return;
    if (cat === "low") {
        add("Consult Doctor.");
    } else {
        add("Monitor BP");
    }
};

const parseLabNumeric = (raw) => {
    if (raw == null || raw === "") return NaN;
    if (typeof raw === "number" && !Number.isNaN(raw)) return raw;
    const m = String(raw).trim().match(/-?\d+\.?\d*/);
    return m ? Number(m[0]) : Number(raw);
};

const isFemaleForHb = (gender) => {
    const s = String(gender ?? "").trim().toLowerCase();
    return (
        s === "female"
    );
};

const isMaleForHb = (gender) => {
    const s = String(gender ?? "").trim().toLowerCase();
    return (
        s === "male"
    );
};

/** Haemoglobin: male 13–17 g/dL, female 12–15; outside band → lifestyle (per spec). */
const addHbRecommendation = (add, gender, hbRaw) => {
    const hb = parseLabNumeric(hbRaw);
    if (Number.isNaN(hb)) return;

    if (isFemaleForHb(gender)) {
        if (hb > 15 || hb < 13) {
            add("Lifestyle changes advised.");
        }
    } else if (isMaleForHb(gender)) {
        if (hb > 17 || hb < 13) {
            add("Lifestyle changes advised.");
        }
    }
};

/** Platelets in lakhs-style units (e.g. 1.5–4.1); normal inclusive between bounds. */
const addPlateletRecommendation = (add, plateletRaw) => {
    const plt = parseLabNumeric(plateletRaw);
    if (Number.isNaN(plt)) return;
    if (plt > 4.1) {
        add("Consult doctor");
    } else if (plt < 1.5) {
        add("Consult doctor");
    }
};

/** True if text already asks for consult / medical consultation (avoid repeating "and consult doctor"). */
const consultDoctorPhrasePresent = (text) =>
    /\bconsult\s+doctor\b/i.test(text) ||
    /\bmedical\s+consultation\b/i.test(text);

/** Dedupe advice lines: case-insensitive, ignore trailing full stops (e.g. "Consult doctor" vs "Consult Doctor."). */
const uniqueRecommendationMessages = (messages) => {
    const seen = new Set();
    return messages.filter((m) => {
        const key = m
            .trim()
            .toLowerCase()
            .replace(/\.+$/, "");
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
    });
};

const getFinalRecommendation = (data) => {
    const rbs = Number(data?.cholestrolData?.["BLOOD SUGAR RANDOM"]);
    const sgpt = Number(data?.cholestrolData?.["SGPT"]);
    const sgot = Number(data?.cholestrolData?.["SGOT"]);
    const creatinine = Number(data?.cholestrolData?.["S.CREATININE"]);
    const bmi = Number(data?.bmi);

    const messages = [];

    const add = (text) => {
        messages.push(text);
    };

    addBpRecommendation(add, data?.bp);
    addHbRecommendation(add, data?.gender, data?.cholestrolData?.["HB"]);
    addPlateletRecommendation(
        add,
        data?.cholestrolData?.["PLATELET"] ?? data?.cholestrolData?.["PLATELETS"]
    );

    if (rbs >= 200) {
        add("Medical consultation required.");
    }

    if (creatinine > 1.3) {
        add("Lifestyle changes advised.");
    }

    if (rbs >= 140 && rbs < 200) {
        add("Consult doctor for follow-up.");
    }

    if (sgpt > 40 || sgot > 40) {
        add("Dietry adjustment required , low fat diet.");
    }

    if (bmi > 25) {
        add("Monitor diet and keep it balanced.");
    }

    if (bmi < 18.5) {
        add("Monitor diet and keep it balanced.");
    }

    if (rbs < 70) {
        add("Monitor your sugar intake");
    }

    const unique = uniqueRecommendationMessages(messages);

    const stripFit = tokenNumberContainsStripFitToken(data?.tokenNumber);

    let message;
    if (unique.length > 0) {
        const core = unique
            .map((m) => m.trim().replace(/\.+$/, ""))
            .filter(Boolean)
            .join("; ");
        const needConsultSuffix = !consultDoctorPhrasePresent(core);
        if (stripFit) {
            message = needConsultSuffix
                ? `${core}, and consult doctor.`
                : core;
        } else if (needConsultSuffix) {
            message = `${core}, and consult doctor. Fit to work.`;
        } else {
            const body = /[.!?]$/.test(core.trim()) ? core : `${core}.`;
            message = `${body} Fit to work.`;
        }
    } else if (rbs >= 70 && rbs < 140) {
        message = "Fit to work.";
    } else {
        message = "Fit for work.";
    }

    if (stripFit) {
        message = stripFitWorkFromRecommendationText(message);
    }
    return message;
};

/** WHO-style PTA average (dB HL): left/right from `cholestrolData`. */
export const getAudiometryHearingCategory = (raw) => {
    const db = Number(raw);
    if (raw === null || raw === undefined || raw === "" || Number.isNaN(db)) {
        return "NA";
    }
    if (db <= 25) return "NORMAL";
    if (db <= 40) return "MILD HEARING LOSS";
    if (db <= 55) return "MODERATE";
    if (db <= 70) return "MODERATELY SEVERE";
    if (db <= 90) return "SEVERE";
    return "PROFOUND";
};

const getColourVisionDisplay = (data) => {
    const cv = data?.colourVision;
    if (cv != null && String(cv).trim() !== "") {
        const lower = String(cv).toLowerCase().trim();
        if (lower === "nad") return "Normal";
        return String(cv).trim();
    }
    const left = data?.leftEyeColourVision;
    const right = data?.rightEyeColourVision;
    const leftStr =
        left != null && String(left).trim() !== "" ? String(left).trim() : null;
    const rightStr =
        right != null && String(right).trim() !== ""
            ? String(right).trim()
            : null;
    if (leftStr || rightStr) {
        return `Left: ${leftStr ?? "NA"} , Right: ${rightStr ?? "NA"}`;
    }
    return "NA";
};

// Register fonts
Font.register({
    family: "Times-Roman-Normal",
    src: TimeRoman,
});

Font.register({
    family: "Times-Roman-Bold",
    src: TimeRomanBold,
});

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 16,
        fontSize: 11,
        fontFamily: "Times-Roman",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",

    },
    logo: {
        width: "100%",
        height: 70,
        marginRight: 12,
    },
    unoCareText: {
        fontSize: 10,
        color: "#2e4fa2",
        fontWeight: "bold",
        marginBottom: 2,
    },
    regOffice: {
        fontSize: 8,
        marginBottom: 2,
        maxWidth: 130,
    },
    dateRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    table: {
        display: "table",
        width: "100%",
        border: "1px solid #000",
        margin: "0 auto",
        marginTop: 10,
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: "row",
    },
    cell: {
        borderRight: "1px solid #000",
        borderBottom: "1px solid #000",
        padding: 4,
        fontSize: 11,
        minHeight: 18,
        justifyContent: "center",
        flexGrow: 1,
    },
    cellNoRight: {
        borderRight: "none",
    },
    cellNoBottom: {
        borderBottom: "none",
    },
    cellHeader: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 12,
        paddingVertical: 2,
    },
    cellSection: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 11,
        paddingVertical: 2,
    },
    cellLabel: {
        fontWeight: "bold",
    },
    cellCenter: {
        textAlign: "center",
    },
    cellRight: {
        textAlign: "right",
    },
    cellLeft: {
        textAlign: "left",
    },
    fitnessCert: {
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 11,
        padding: 4,
        borderBottom: "1px solid #000",
    },
    fitnessText: {
        textAlign: "center",
        padding: 4,
        fontSize: 11,
    },
    signatureBlock: {
        marginTop: 40,
        alignItems: "flex-end",
    },
    signatureText: {
        fontSize: 14,
        marginBottom: 2,
    },
    signDetails: {
        fontSize: 10,
        textAlign: "right",
        lineHeight: 1.2,
    },
    unoCareSign: {
        color: "#2e4fa2",
        fontWeight: "bold",
        fontSize: 10,
        textAlign: "right",
    },
});

const GeAeroSpacePhyscialFitnessTemplate = ({
    data,
    company,
}) => {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header with logo and address */}
                <View style={styles.headerRow}>
                    <Image style={styles.logo} src={uncareheader} />
                </View>
                {/* <Text style={styles.regOffice}>
          Regd. Office: 253, Shri Krishna Avenue, Phase-1, Limbodi Khandwa Road,
          Indore-452001
        </Text> */}
                <Text
                    style={[
                        styles.dateRow,
                        {
                            width: "100%",
                            borderRight: 0,
                            fontFamily: "Times-Roman-Bold",
                            textAlign: "center",
                            fontSize: 14,
                        },
                    ]}
                >
                    Physical Fitness Form
                </Text>
                <View style={styles.dateRow}>
                    <Text>Date: {data?.vitalsCreatedDate || ""}</Text>
                </View>
                {/* Main Table */}
                <View style={styles.table}>
                    {/* Health Check-UP PROGRAMME */}
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellHeader,
                                {
                                    width: "100%",
                                    borderRight: 0,
                                    fontFamily: "Times-Roman-Bold",
                                },
                            ]}
                        >
                            Health Check-UP PROGRAMME
                        </Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellHeader,
                                {
                                    width: "100%",
                                    borderRight: 0,
                                    fontFamily: "Times-Roman-Bold",
                                },
                            ]}
                        >
                            GE Aerospace( GE India industrial Pvt Ltd)
                        </Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                    </View>
                    {/* Personal Detail */}
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellSection,
                                {
                                    width: "100%",
                                    borderRight: 0,
                                    fontFamily: "Times-Roman-Bold",
                                },
                            ]}
                        >
                            Personal Detail
                        </Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Employee Name
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }]}>
                            {data?.name || ""}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Age
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>
                            {data?.age || ""}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Employee ID
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }]}>
                            {data?.empId || ""}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Department
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>
                            {data?.department || ""}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Gender
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }]}>
                            {data?.gender || ""}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        ></Text>
                        <Text
                            style={[styles.cell, { width: "25%" }, styles.cellNoRight]}
                        ></Text>
                    </View>
                    {/* Physical Details */}
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellSection,
                                {
                                    width: "100%",
                                    borderRight: 0,
                                    fontFamily: "Times-Roman-Bold",
                                },
                            ]}
                        >
                            Physical Details
                        </Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Blood Pressure:
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }]}>
                            {data?.bp ? data?.bp + " mmHg" : ""}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            BMI:
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>
                            {data?.bmi || ""}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Weight:
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }]}>
                            {data?.weight ? data?.weight + " kg" : ""}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Height:
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>
                            {data?.height ? data?.height + " cm" : ""}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "40%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Additional:Smoking/Alcohol/Tabacco/Other
                        </Text>
                        <Text style={[styles.cell, { width: "10%" },]}>
                            {"No"}
                        </Text>
                        <Text
                            style={[styles.cell, { width: "25%", fontFamily: "Times-Roman-Bold" },]}
                        >
                            Pulse Rate
                        </Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: "25%", },]}
                        >{data?.pulseRate ? data?.pulseRate + " bpm" : ""}</Text>
                    </View>
                    {/* Additional Pathology */}
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellSection,
                                {
                                    width: "100%",
                                    borderRight: 0,
                                    fontFamily: "Times-Roman-Bold",
                                },
                            ]}
                        >
                            Additional Pathology
                        </Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Hemoglobin (HB)
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }]}>
                            {data?.cholestrolData?.["HB"] ? data?.cholestrolData?.["HB"] + "" : ""}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Platelets
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>
                            {data?.cholestrolData?.["PLATELET"] ? data?.cholestrolData?.["PLATELET"] + "" : ""}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Blood Sugar Level (R)
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }]}>
                            {data?.cholestrolData?.["BLOOD SUGAR RANDOM"] ? data?.cholestrolData?.["BLOOD SUGAR RANDOM"] + "" : ""}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            ALT/SGPT:
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>
                            {data?.cholestrolData?.["SGPT"] ? data?.cholestrolData?.["SGPT"] + "" : ""}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Creatinine
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }]}>
                            {data?.cholestrolData?.["S.CREATININE"] ? data?.cholestrolData?.["S.CREATININE"] + "" : ""}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Urine Pus Cells
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>
                            {data?.cholestrolData?.["URINE.PUS_CELLS"] ? data?.cholestrolData?.["URINE.PUS_CELLS"] + "" : ""}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Urine Sugar:
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }]}>
                            {data?.cholestrolData?.["URINE.GLUCOSE"] ? data?.cholestrolData?.["URINE.GLUCOSE"] + "" : ""}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >

                        </Text>
                        <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>

                        </Text>
                    </View>
                    {/* General medical Examination */}
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellSection,
                                {
                                    width: "100%",
                                    borderRight: 0,
                                    fontFamily: "Times-Roman-Bold",
                                },
                            ]}
                        >
                            Clinical Test Summary
                        </Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: 0 }]}
                        ></Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            PFT (Pulmonary Function Test): Result:
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }]}>
                            {data?.pftRemark || "NA"}
                        </Text>


                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Audiometry (Hearing Test): Result:
                        </Text>
                        <Text style={[styles.cell, styles.cellNoRight, { width: "25%" }]}>
                            Left:{" "}
                            {getAudiometryHearingCategory(
                                data?.cholestrolData?.AUDIOMETRY_AVG_LEFT
                            )}{" "}
                            {"\n"}
                            Right:{" "}
                            {getAudiometryHearingCategory(
                                data?.cholestrolData?.AUDIOMETRY_AVG_RIGHT
                            )}
                            {"\n"}
                        </Text>

                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25.3%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Eye Examination:
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "38%", fontFamily: "Times-Roman-Bold", textAlign: "center" },
                            ]}
                        >
                            Without Glasses
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel, styles.cellNoRight,
                                { width: "38%", fontFamily: "Times-Roman-Bold", textAlign: "center" },
                            ]}
                        >
                            With Glasses
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25.3%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >

                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "19%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Left
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "19%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Right
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "19%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Left
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel, styles.cellNoRight,
                                { width: "19%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Right
                        </Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25.3%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Distant Vision
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "19%", },
                            ]}
                        >
                            {data?.["farLeftEyeSight"] || "NA"}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "19%", },
                            ]}
                        >
                            {data?.["farRightEyeSight"] || "NA"}

                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "19%", },
                            ]}
                        >
                            {data?.["farLeftEyeSightWithGlasses"] || "NA"}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel, styles.cellNoRight,
                                { width: "19%", },
                            ]}
                        >
                            {data?.["farRightEyeSightWithGlasses"] || "NA"}

                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25.3%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Near Vision
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "19%", },
                            ]}
                        >
                            {data?.["nearLeftEyeSight"] || "NA"}

                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "19%", },
                            ]}
                        >
                            {data?.["nearRightEyeSight"] || "NA"}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "19%", },
                            ]}
                        >
                            {data?.["nearLeftEyeSightWithGlasses"] || "NA"}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel, styles.cellNoRight,
                                { width: "19%", },
                            ]}
                        >
                            {data?.["nearRightEyeSightWithGlasses"] || "NA"}
                        </Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Remarks
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                styles.cellNoRight,
                                { width: "75%", },
                            ]}
                        >
                            {data?.eyeRemark || "NA"}
                        </Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Color Vision
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel, styles.cellNoRight,
                                { width: "75%", },
                            ]}
                        >
                            {getColourVisionDisplay(data)}

                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            VACCINATION Name
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", },
                            ]}
                        >Tetanus Vaccine (TT)

                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Company  Name:
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel, styles.cellNoRight,
                                { width: "25%", },
                            ]}
                        >DANO-TT (Dano Vaccines & Biologicals)
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Exp date :
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", },
                            ]}
                        > July 2028

                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Tetanus :
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel, styles.cellNoRight,
                                { width: "25%", },
                            ]}
                        >
                            Vaccinated
                        </Text>
                    </View>
                    {/* Recommendation */}
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Final Recommendations
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                { width: "75%", textAlign: "center" },
                                styles.cellNoRight,

                            ]}
                        >
                            {getFinalRecommendation(data) || "Fit to work."}
                        </Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Doctor's  Name:
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                { width: "75%", },
                                styles.cellNoRight,
                            ]}
                        >
                            Dr. Pratibha
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Signature &  Seal
                        </Text>
                        <View
                            style={[
                                styles.cell,
                                { width: "75%", textAlign: "center" },
                                styles.cellNoRight,
                            ]}
                        >
                            <Image src={drPratibhaVBandekar} style={{ height: 80, width: 120 }} />
                        </View>
                    </View>

                </View>

            </Page>
        </Document >
    );
};

export default GeAeroSpacePhyscialFitnessTemplate;
