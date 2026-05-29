import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Font,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

Font.register({
    family: "Times",
    fonts: [
        { src: TimeRoman },
        { src: TimeRomanBold, fontWeight: "bold" },
    ],
});

const styles = StyleSheet.create({
    page: {
        padding: 22,
        fontSize: 8.5,
        fontFamily: "Times",
        lineHeight: 1.25,
    },
    title: {
        fontSize: 13,
        fontWeight: "bold",
        textAlign: "center",
        textTransform: "uppercase",
    },
    subtitle: {
        fontSize: 10,
        textAlign: "center",
        marginTop: 2,
        marginBottom: 8,
    },
    sectionTitle: {
        fontWeight: "bold",
        fontSize: 9,
        marginTop: 6,
        marginBottom: 3,
        textTransform: "uppercase",
    },
    table: {
        borderWidth: 1,
        borderColor: "#000",
    },
    row: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderTopColor: "#000",
    },
    cell: {
        borderRightWidth: 1,
        borderRightColor: "#000",
        padding: 4,
    },
    label: {
        fontWeight: "bold",
    },
    qNo: {
        width: "5%",
        textAlign: "center",
        padding: 3,
        borderRightWidth: 1,
        borderRightColor: "#000",
    },
    qText: {
        width: "79%",
        padding: 3,
        borderRightWidth: 1,
        borderRightColor: "#000",
    },
    qYN: {
        width: "8%",
        textAlign: "center",
        padding: 3,
        borderRightWidth: 1,
        borderRightColor: "#000",
        fontWeight: "bold",
        fontSize: 8,
    },
    qYNLast: {
        width: "8%",
        textAlign: "center",
        padding: 3,
        fontWeight: "bold",
        fontSize: 8,
    },
    headerRow: {
        flexDirection: "row",
        backgroundColor: "#f5f5f5",
    },
    note: {
        marginTop: 8,
        fontSize: 10.5,
        lineHeight: 1.35,
    },
    declaration: {
        marginTop: 6,
        fontSize: 10.5,
        fontWeight: "bold",
        lineHeight: 1.35,
        textAlign: "justify",
    },
    signatureRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 14,
        marginBottom: 10,
    },
    signatureText: {
        fontWeight: "bold",
        fontSize: 11,
    },
    footerSectionTitle: {
        fontWeight: "bold",
        fontSize: 11,
        marginTop: 6,
        marginBottom: 3,
        textTransform: "uppercase",
    },
    healthHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
        marginBottom: 4,
        fontWeight: "bold",
        fontSize: 9,
    },
    healthRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 3,
        fontSize: 8.5,
    },
    healthLabel: {
        width: "14%",
        fontWeight: "bold",
    },
    healthContent: {
        width: "78%",
    },
    fitCol: {
        width: "8%",
        textAlign: "right",
        fontWeight: "bold",
    },
    remarkBox: {
        marginTop: 6,
        minHeight: 48,
        borderWidth: 1,
        borderColor: "#000",
        padding: 4,
    },
    page2: {
        fontSize: 10.5,
        lineHeight: 1.35,
    },
    healthHeaderP2: {
        fontSize: 11,
        marginTop: 6,
        marginBottom: 6,
    },
    healthRowP2: {
        fontSize: 10.5,
        marginBottom: 5,
    },
    sectionTitleP2: {
        fontSize: 11,
    },
    remarkBoxP2: {
        fontSize: 10.5,
        minHeight: 56,
        padding: 6,
    },
});

const MEDICAL_HISTORY_1_13 = [
    "Have you ever experienced a Fear of Heights, Panic attacks, Vertigo or other phobias",
    "Have you ever experienced or do you suffer from; Fainting attacks, Frequent falls, MS, Meniere's Disease, Dizziness, Dyspraxia or .problems with our co-ordination or balance?",
    "Do you have any history of altered consciousness in the last 12 months? (E.g. Epilepsy, Transient Ischemic Attacks (Mini Stroke), Head Injury, High/Low blood suffer etcl",
    "Do you now, or have you ever had chest pain, heart arrhythmias / heart problems, high blood pressure, Angina or a heart attack?",
    "Have you ever been diagnosed with diabetes?",
    "Have you ever been diagnosed with Hypertension?",
    "Do you take any medicines — prescribed, over the counter, homeopathic or other - either regularly or as required?",
    "Do you suffer from Asthma / Chronic Obstructive Pulmonary Disease or any other breathing problems?",
    "Do you have any problems with your back, neck, knees, feet, joints or have any difficulty moving freely (e.g. injury or arthritis) or accessing your work space ?",
    "Have you ever had any mental health problems, self harmed / attempted suicide or taken medicines for anxiety or depression?",
    "Have you been admitted to hospital / required hospital investigation or treatment in the last 1 year",
    "Do you have any problems with your Vision / Speech / Hearing?",
    "Have you ever taken illicit drugs, or been treated for drug or alcohol problems?",
    "Have you ever suffered episodes of sudden Pain (Abdominal / Irritable Bowel Syndrome / Angina / Migraine)?",
    "Have you ever suffered any condition affecting your understanding (E.g. dementia, brain damage) or your ability to assess risks (E.g. Poor perception, mental handicap)?",
    "Do you have any medical condition or other problem that could be made worse by wearing a fall arrest harness or other PPE (e.g. Inguinal Hernia, Recent Operation)?",
    "Do you consider yourself to have a disability or any other reason that you might not be fit to work at a height?",
];



const QuestionTableHeader = () => (
    <View style={styles.headerRow}>
        <Text style={styles.qNo} />
        <Text style={[styles.qText, styles.label]}> </Text>
        <Text style={styles.qYN}>YES</Text>
        <Text style={styles.qYNLast}>NO</Text>
    </View>
);

const QuestionRow = ({ no, text }) => (
    <View style={styles.row}>
        <Text style={styles.qNo}>{no}</Text>
        <Text style={styles.qText}>{text}</Text>
        <Text style={styles.qYN} />
        <Text style={styles.qYNLast} />
    </View>
);

const HealthRow = ({ label, children, fit = "Y/N", rowStyle, textStyle }) => (
    <View style={[styles.healthRow, rowStyle]}>
        <Text style={[styles.healthLabel, textStyle]}>{label}</Text>
        <Text style={[styles.healthContent, textStyle]}>{children}</Text>
        <Text style={[styles.fitCol, textStyle]}>{fit}</Text>
    </View>
);

const formatAgeSex = (data) => {
    const age = data?.age ? `${data.age} Yrs` : "";
    const sex =
        data?.gender === "MALE"
            ? "Male"
            : data?.gender === "FEMALE"
                ? "Female"
                : data?.gender || "";
    return [age, sex].filter(Boolean).join(" / ");
};

const ForceMotorsPuneVertigoFormTemplate = ({ data = {} }) => {
    const companyName =
        data?.companyName ||
        data?.EXTRAS?.companyName ||
        "FORCE MOTORS LTD - PUNE PLANT";
    const jobProfile =
        data?.jobProfile ||
        data?.EXTRAS?.DESIGNATION ||
        data?.department ||
        "";
    const aadhar =
        data?.aadharNo || data?.aadhar || data?.EXTRAS?.aadhar || "";
    const examDate = data?.vitalsCreatedDate
        ? dayjs(data.vitalsCreatedDate).format("DD-MM-YYYY")
        : "";

    return (
        <Document>
            {/* PAGE 1 */}
            <Page size="A4" style={styles.page}>
                <Text style={styles.title}>Medical Examination Proforma</Text>
                <Text style={styles.subtitle}>For Fitness to work at heights</Text>

                <Text style={styles.sectionTitle}>Personal Details:</Text>
                <View style={styles.table}>
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "18%" }, styles.label]}>
                            Name:
                        </Text>
                        <Text style={[styles.cell, { width: "82%", borderRightWidth: 0 }]}>
                            {data?.name || ""}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "18%" }, styles.label]}>
                            Age/Sex :
                        </Text>
                        <Text style={[styles.cell, { width: "32%" }]}>
                            {formatAgeSex(data)}
                        </Text>
                        <Text style={[styles.cell, { width: "18%" }, styles.label]}>
                            AADHAR NO:
                        </Text>
                        <Text style={[styles.cell, { width: "32%", borderRightWidth: 0 }]}>
                            {aadhar}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "28%" }, styles.label]}>
                            Name of company :
                        </Text>
                        <Text style={[styles.cell, { width: "72%", borderRightWidth: 0 }]}>
                            {companyName}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "18%" }, styles.label]}>
                            Job profile :
                        </Text>
                        <Text style={[styles.cell, { width: "82%", borderRightWidth: 0 }]}>
                            {jobProfile}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>
                    Medical History: Self Declaration by Employee
                </Text>
                <View style={styles.table}>
                    <QuestionTableHeader />
                    {MEDICAL_HISTORY_1_13.map((question, index) => (
                        <QuestionRow key={index} no={index + 1} text={question} />
                    ))}
                </View>

                <Text style={styles.note}>
                    <Text style={styles.label}>Note:- </Text>
                    I have Examined Mr.{" "}
                    <Text style={styles.label}>{data?.name || "________________"}</Text>
                    , at present he is not having any signs and symptoms of COVUD-19,
                    SARS or Flu like illness.
                </Text>

                <Text style={[styles.sectionTitle, styles.footerSectionTitle, { marginTop: 10 }]}>
                    Additional Information
                </Text>
                <View style={{ minHeight: 28, borderBottomWidth: 1, borderBottomColor: "#000" }} />

                <Text style={[styles.sectionTitle, styles.footerSectionTitle, { marginTop: 8 }]}>
                    Declaration
                </Text>
                <Text style={styles.declaration}>
                    I hereby declare that all the medical information given by me is true
                    and accurate to the best of my knowledge and I have not omitted
                    anything which might have a bearing on the outcome of this examination.
                    I undertake to advise my manager of any change to my health which may
                    Impact on my ability to Work-at-Height, and will refrain from such work
                    until further advice has been sought.
                </Text>

                <View style={styles.signatureRow}>
                    <Text style={styles.signatureText}>Signature of employee</Text>
                    <Text style={styles.signatureText}>
                        Date {examDate ? `: ${examDate}` : ""}
                    </Text>
                </View>
            </Page>

            {/* PAGE 2 */}
            <Page size="A4" style={[styles.page, styles.page2]}>

                <View style={[styles.healthHeader, styles.healthHeaderP2]}>
                    <Text style={styles.healthHeaderP2}>Health Assessment</Text>
                    <Text style={styles.healthHeaderP2}>FIT</Text>
                </View>

                <HealthRow label="1 — Vision:" rowStyle={styles.healthRowP2} textStyle={styles.healthRowP2}>
                    Specs: Right eye {data?.rightEye || "N"}   Left eye{" "}
                    {data?.leftEye || "N"}   Colour Y/N
                </HealthRow>
                <HealthRow label="2 — Hearing:" rowStyle={styles.healthRowP2} textStyle={styles.healthRowP2}>
                    Whisper Test Pass Y/N   Audiology Required Y/N
                </HealthRow>
                <HealthRow label="3 — Cardio:" rowStyle={styles.healthRowP2} textStyle={styles.healthRowP2}>
                    B.P. {data?.bp ? `${data.bp} mmHg` : ""}   Pulse{" "}
                    {data?.pulseRate ? `${data.pulseRate} bpm` : ""}
                </HealthRow>
                <HealthRow label="4 — Lung Function:" rowStyle={styles.healthRowP2} textStyle={styles.healthRowP2}>
                    Normal Spiro Y/N
                </HealthRow>
                <HealthRow label="5 — C.N.S. :" rowStyle={styles.healthRowP2} textStyle={styles.healthRowP2} />
                <HealthRow label="6 — Musculoskeletal :" rowStyle={styles.healthRowP2} textStyle={styles.healthRowP2} />
                <HealthRow label="7 — Urinalysis:" rowStyle={styles.healthRowP2} textStyle={styles.healthRowP2}>Glucose Y/N</HealthRow>
                <HealthRow label="8 — Mental Health:" rowStyle={styles.healthRowP2} textStyle={styles.healthRowP2}>
                    Mental health issues of Concern Y/N
                </HealthRow>
                <HealthRow label="9 — Medication:" rowStyle={styles.healthRowP2} textStyle={styles.healthRowP2}>
                    Ant Contradicted Effects/ side effects Y/N
                </HealthRow>
                <HealthRow label="10 — Drug & Alcohol:" rowStyle={styles.healthRowP2} textStyle={styles.healthRowP2}>
                    Recent/ Current D & A problems Y/N
                </HealthRow>

                <Text style={[styles.sectionTitle, styles.sectionTitleP2, { marginTop: 10 }]}>
                    Remark:
                </Text>
                <View style={[styles.remarkBox, styles.remarkBoxP2]}>
                    <Text style={styles.remarkBoxP2}>{data?.remark || data?.doctorRemark || ""}</Text>
                </View>
            </Page>
        </Document>
    );
};

export default ForceMotorsPuneVertigoFormTemplate;
