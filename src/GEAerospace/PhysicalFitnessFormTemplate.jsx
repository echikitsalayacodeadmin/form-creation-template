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

const PhysicalFitnessFormTemplate = ({
    data,
    companyName,
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
                            {companyName}
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
                            Employee ID
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }]}>
                            {data?.empId || ""}
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
                            Department
                        </Text>
                        <Text style={[styles.cell, { width: "25%" },]}>
                            {data?.department || ""}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >Designation</Text>
                        <Text
                            style={[styles.cell, { width: "25%" }, styles.cellNoRight]}
                        >
                            {data?.designation || ""}
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
                            Contractor Name
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }]}>
                            {data?.contractorName || ""}
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
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Pulse Rate
                        </Text>
                        <Text style={[styles.cell, { width: "25%", },]}>
                            {data?.pulseRate ? data?.pulseRate + " bpm" : ""}
                        </Text>
                        <Text
                            style={[styles.cell, { width: "25%", fontFamily: "Times-Roman-Bold" },]}
                        >
                        </Text>
                        <Text
                            style={[styles.cell, styles.cellNoRight, { width: "25%", },]}
                        ></Text>
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
                            Health History Details
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
                            Medical conditions
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }]}>
                            {data?.healthHistoryFormData?.medicalCondition?.replace(
                                /\\/,
                                ""
                            ) || ""}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Alcohol
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>
                            {data?.healthHistoryFormData?.alcoholHabit}
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
                            Tobacco
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }]}>
                            {data?.healthHistoryFormData?.tobaccoHabit}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Smoking
                        </Text>
                        <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>
                            {data?.healthHistoryFormData?.smokingHabit}
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
                            {fitnessRemark}
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

export default PhysicalFitnessFormTemplate;
