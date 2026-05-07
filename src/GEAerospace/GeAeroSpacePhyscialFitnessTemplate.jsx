import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image,
} from "@react-pdf/renderer";
import drPratibhaVBandekar from "../assets/images/drPratibhaVBandekar.png";
import prashantDeshmukh from "../assets/images/prashantDeshmukh.png";
import DrSwapnilDevidas from "../assets/images/DrSwapnilDevidas.png";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";
import uncareheader from "../assets/images/uncareheader.png";
import Dr_Jaydip_Saxena from "../assets/images/Dr_Jaydip_Saxena.png";
import dr_kunal_stamp_sign from "../assets/images/dr_kunal_stamp_sign.png";


const getFinalRecommendation = (data) => {
    const rbs = Number(data?.cholestrolData?.["BLOOD SUGAR RANDOM"]);
    const sgpt = Number(data?.cholestrolData?.["SGPT"]);
    const creatinine = Number(data?.cholestrolData?.["S.CREATININE"]);
    const bmi = Number(data?.bmi);

    const [systolic, diastolic] = (data?.bp || "")
        .split("/")
        .map(Number);

    let best = {
        severity: 0,
        message: "FIT for work",
    };

    const check = (severity, message) => {
        if (severity > best.severity) {
            best = { severity, message };
        }
    };

    // 🔴 CRITICAL (5)
    if (rbs >= 200) {
        check(5, "Potential diabetes; medical evaluation required. Fit for work");
    }

    if (creatinine > 1.3) {
        check(5, "Hydrate, avoid NSAIDs, check BP, limit red meat. Fit for work");
    }

    if (systolic > 130 || diastolic > 80) {
        check(5, "Reduce sodium, increase aerobic activity, monitor stress. Fit for work");
    }

    // 🟠 HIGH (4)
    if (rbs >= 140 && rbs < 200) {
        check(4, "Consult doctor for follow-up tests (A1c/Fasting). Fit for work");
    }

    // 🟡 MEDIUM (3)
    if (sgpt > 40) {
        check(3, "Abstain from alcohol, review hepatotoxic meds, manage BMI. Fit for work");
    }

    // 🟢 LOW (2)
    if (bmi > 25) {
        check(2, "Increase fiber/protein, reduce sugar, cardio + strength. Fit for work");
    }

    if (bmi < 18.5) {
        check(2, "Add healthy fats, strength training. Fit for work");
    }

    if (rbs < 70) {
        check(2, "Fast-acting sugar + re-test in 15 mins. Fit for work");
    }

    if (systolic < 90 || diastolic < 60) {
        check(2, "Increase hydration, add salt, change positions slowly. Fit for work");
    }

    // ✅ NORMAL (1)
    if (rbs >= 70 && rbs < 140 && best.severity === 0) {
        check(1, "Maintain healthy habits. Fit for work");
    }

    return best.message;
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
        paddingHorizontal: 24,
        fontSize: 11,
        fontFamily: "Times-Roman",
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
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
        marginBottom: 4,
    },
    table: {
        display: "table",
        width: "100%",
        border: "1px solid #000",
        margin: "0 auto",
        marginTop: 20,
        marginBottom: 20,
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
                                { width: "50%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            PFT (Pulmonary Function Test): Result:
                        </Text>
                        <Text style={[styles.cell, { width: "50%" }]}>Within Normal Limits</Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "50%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Audiometry (Hearing Test): Result:
                        </Text>
                        <Text style={[styles.cell, styles.cellNoRight, { width: "50%" }]}>Within Normal Limits</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "50%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Eye Examination:
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Left
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel, styles.cellNoRight,
                                { width: "25%", fontFamily: "Times-Roman-Bold" },
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
                                { width: "50%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Distant Vision
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", },
                            ]}
                        >
                            {data?.["farLeftEyeSight"]}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel, styles.cellNoRight,
                                { width: "25%", },
                            ]}
                        >
                            {data?.["farRightEyeSight"]}

                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "50%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Near Vision
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", },
                            ]}
                        >
                            {data?.["nearLeftEyeSight"]}

                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel, styles.cellNoRight,
                                { width: "25%", },
                            ]}
                        >
                            {data?.["nearRightEyeSight"]}
                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "50%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Color Vision
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel, styles.cellNoRight,
                                { width: "25%", },
                            ]}
                        >
                            {data?.colourVision?.toLowerCase() === "nad" ? "Normal" : data?.colourVision}
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel, styles.cellNoRight,
                                { width: "25%", },
                            ]}
                        >

                        </Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "50%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Remarks
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "25%", },
                            ]}
                        >

                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel, styles.cellNoRight,
                                { width: "25%", },
                            ]}
                        >

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
                            {data?.tetanusDose1 ? "Vaccinated" : "No"}
                        </Text>
                    </View>
                    {/* Recommendation */}
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "35%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Final Recommendations
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                { width: "65%", textAlign: "center" },
                                styles.cellNoRight,
                            ]}
                        >
                            {getFinalRecommendation(data)}
                        </Text>
                        <Text
                            style={[styles.cell, { width: 0 }, styles.cellNoRight]}
                        ></Text>
                        <Text
                            style={[styles.cell, { width: 0 }, styles.cellNoRight]}
                        ></Text>
                    </View>

                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "35%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Doctor's  Name:
                        </Text>
                        <Text
                            style={[
                                styles.cell,
                                { width: "65%", },
                                styles.cellNoRight,
                            ]}
                        >
                            Dr. Pratibha
                        </Text>
                        <Text
                            style={[styles.cell, { width: 0 }, styles.cellNoRight]}
                        ></Text>
                        <Text
                            style={[styles.cell, { width: 0 }, styles.cellNoRight]}
                        ></Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text
                            style={[
                                styles.cell,
                                styles.cellLabel,
                                { width: "35%", fontFamily: "Times-Roman-Bold" },
                            ]}
                        >
                            Signature &  Seal
                        </Text>
                        <View
                            style={[
                                styles.cell,
                                { width: "65%", textAlign: "center" },
                                styles.cellNoRight,
                            ]}
                        >
                            <Image src={drPratibhaVBandekar} style={{ height: 80, width: 120 }} />
                        </View>
                        <Text
                            style={[styles.cell, { width: 0 }, styles.cellNoRight]}
                        ></Text>
                        <Text
                            style={[styles.cell, { width: 0 }, styles.cellNoRight]}
                        ></Text>
                    </View>

                </View>

            </Page>
        </Document>
    );
};

export default GeAeroSpacePhyscialFitnessTemplate;
