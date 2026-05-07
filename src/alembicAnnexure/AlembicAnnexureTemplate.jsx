import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font,
} from "@react-pdf/renderer";
import AlembicLogo from "../assets/images/alembiclogo.png"; // your logo path
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

const styles = StyleSheet.create({
    page: {
        padding: 10,
        fontSize: 9,
        fontFamily: "Helvetica",
    },

    header: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 5,
    },

    logo: {
        width: 120,
    },

    title: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 4,
        fontFamily: "Times-Roman-Bold",
    },

    sectionTitle: {
        textAlign: "center",
        fontWeight: "bold",
        border: "1px solid black",
        padding: 3,
        backgroundColor: "#FFFFFF",
        fontFamily: "Times-Roman-Bold",
    },

    row: {
        flexDirection: "row",
        borderLeft: "1px solid black",
        borderRight: "1px solid black",
        borderBottom: "1px solid black",
    },

    cell: {
        flex: 1,
        padding: 4,
        borderRight: "1px solid black",
    },

    label: {
        fontWeight: "bold",
        fontFamily: "Times-Roman-Bold",
    },

    smallCell: {
        flex: 0.5,
        padding: 4,
        borderRight: "1px solid black",
    },

    fullWidth: {
        flex: 1,
        padding: 4
    },
});

const Row = ({ children, style }) => (
    <View style={[styles.row, style]}>
        {children}
    </View>
);
const Cell = ({ label, style }) => (
    <View style={styles.cell}>
        <Text style={[style]}>{label}</Text>
    </View>
);

const AlembicAnnexureTemplate = ({ data }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* Logo */}
                <View style={styles.header}>
                    <Image src={AlembicLogo} style={styles.logo} />
                </View>

                {/* Title */}
                <Text style={styles.title}>MEDICAL EXAMINATION REPORT</Text>

                {/* PERSONAL DETAILS */}
                <Text style={styles.sectionTitle}>PERSONAL DETAILS</Text>

                <Row style={{ borderRight: 0 }}>
                    <Cell label={`Name of Employee : ${data?.name}`} />
                    <Cell label={`Employee No. : ${data?.empId}`} />
                </Row>

                <Row style={{ borderRight: 0 }}>
                    <Cell label={`Father's / Husband's Name : ${data?.fathersName}`} />
                    <Cell label={`Date of Birth : ${data?.dateOfBirth}`} />
                </Row>

                <Row style={{ borderRight: 0, borderBottom: 0 }}>
                    <Cell label={`Department : ${data?.department}`} />
                    <Cell label={`Designation : ${data?.designation}`} />
                    <Cell label={`DOJ : ${data?.department}`} />
                </Row>

                {/* PHYSICAL DETAILS */}
                <Text style={styles.sectionTitle}>PHYSICAL DETAILS</Text>

                <Row style={{ borderRight: 0 }}>
                    <Cell label={`Height : ${data?.height ? data?.height + " cm" : ""}`} />
                    <Cell label={`Weight in Kgs : ${data?.height ? data?.height + " kg" : ""}`} />
                    <Cell label={`Blood Group : ${data?.bloodGroup}`} />
                </Row>

                <Row style={{ borderRight: 0 }}>
                    <Cell label={`B. P. : ${data?.bp ? data?.bp + " mmHg" : ""}`} />
                    <Cell label={`Pulse : ${data?.pulseRate ? data?.pulseRate + " bpm" : ""}`} />
                </Row>

                <Row style={{ borderRight: 0, borderBottom: 0 }}>
                    <Cell
                        label={`Addictions Smoking / Alcohol / Tobacco / Other : Alcohol: ${data?.healthHistoryFormData?.alcoholHabit || "-"}, Smoking: ${data?.healthHistoryFormData?.smokingHabit || "-"}, Tobacco: ${data?.healthHistoryFormData?.tobaccoHabit || "-"}`}
                    />
                </Row>

                {/* MEDICAL HISTORY */}
                <Text style={styles.sectionTitle}>MEDICAL HISTORY</Text>

                <Row style={{ borderRight: 0 }}>
                    <Cell label="" />
                    <Cell label="Self" style={{ fontFamily: "Times-Roman-Bold", }} />
                    <Cell label="Family" style={{ fontFamily: "Times-Roman-Bold", }} />
                </Row>

                {[
                    { field: "Present Illness (Contagious / Operational)", valueSelf: data?.healthHistoryFormData?.medicalCondition, valueFamily: "" },
                    { field: "Past illness (Contagious / Operational)", valueSelf: "", valueFamily: data?.healthHistoryFormData?.familyHistory },
                    { field: "Complaint of any allergies", valueSelf: "", valueFamily: "" },
                    { field: "HBP / DM / BA / Arthritis / Epilepsy / Renal Disease", valueSelf: "", valueFamily: "" },
                    { field: "Tuberculosis", valueSelf: "", valueFamily: "" },
                    { field: "Any communicable disease", valueSelf: "", valueFamily: "" }
                ].map((item, i) => (
                    <Row key={i}
                        style={{ borderRight: 0, borderBottom: i === 5 ? 0 : '1px solid black' }}>
                        <Cell label={item?.field} />
                        <Cell label={item?.valueSelf} />
                        <Cell label={item?.valueFamily} />
                    </Row>
                ))}

                {/* GENERAL MEDICAL EXAMINATION */}
                <Text style={styles.sectionTitle}>
                    GENERAL MEDICAL EXAMINATION
                </Text>

                <Row style={{ borderRight: 0 }}>
                    <Cell label="Audiological / ENT" />
                    <Cell label="Genito Urinary System:" />
                </Row>

                <Row style={{ borderRight: 0 }}>
                    <Cell label="Cardiovascular System:" />
                    <Cell label="Oral Cavity / Dental:" />
                </Row>

                <Row style={{ borderRight: 0 }}>
                    <Cell label="Central Nervous System:" />
                    <Cell label="Respiratory System:" />
                </Row>

                <Row style={{ borderRight: 0 }}>
                    <Cell label="Digestive System:" />
                    <Cell label="Skin Conditions:" />
                </Row>

                <Row style={{ borderRight: 0, borderBottom: 0 }}>
                    <Cell label="Eye:" />
                    <Cell label="Vision:" />
                    <Cell label="Colour Blindness:" />
                </Row>

                {/* INVESTIGATION DETAILS */}
                <Text style={styles.sectionTitle}>
                    INVESTIGATION DETAILS - BLOOD, URINE, X-RAY & ECG (If applicable)
                </Text>

                <Row style={{ borderRight: 0 }}>
                    <Cell label="Blood Test Report:" />
                </Row>

                <Row style={{ borderRight: 0 }}>
                    <Cell label="Hemoglobin:" />
                    <Cell label="RBC:" />
                    <Cell label="Packed Cell Volume:" />
                    <Cell label="MCV:" />
                </Row>

                <Row style={{ borderRight: 0 }}>
                    <Cell label="MCHC:" />
                    <Cell label="MCH:" />
                    <Cell label="Total Leucocyte Count:" />
                </Row>

                <Row style={{ borderRight: 0 }}>
                    <Cell label="Lymphocyte:" />
                    <Cell label="Monocytes:" />
                    <Cell label="Eosinophil:" />
                    <Cell label="Neutrophils:" />
                </Row>

                <Row style={{ borderRight: 0 }}>
                    <Cell label="ESR:" />
                    <Cell label="Platelet Count:" />
                    <Cell label="Blood Sugar:" />
                </Row>

                <Row style={{ borderRight: 0 }}>
                    <Cell label="Urine Test Report :" />
                </Row>

                <Row style={{ borderRight: 0, borderBottom: 0 }}>
                    <Cell label="Chest X-Ray (PA view):" />
                    <Cell label="ECG (40 Years & Above):" />
                </Row>

                {/* FITNESS CERTIFICATE */}
                <Text style={styles.sectionTitle}>
                    MEDICAL FITNESS CERTIFICATE
                </Text>

                <Row style={{ borderRight: 0 }}>
                    <Cell label={`After examining ${data?.gender === "MALE" ? "Mr." : data?.gender === "FEMALE" ? "Ms." : "Mr. / Ms."} ${data?.name}`} />
                </Row>

                <Row style={{ borderRight: 0 }}>
                    <Cell label={`I hereby certify that ${data?.gender === "MALE" ? "he" : data?.gender === "FEMALE" ? "she." : "he / she"} is FIT / UNFIT for Job.`} />
                </Row>

                <Row style={{ borderRight: 0 }}>
                    <Cell label="Name of Doctor :" />
                </Row>

                <Row style={{ borderRight: 0 }}>
                    <Cell label="Date :" />
                    <Cell label="Signature & Seal :" />
                </Row>

            </Page>
        </Document>
    );
};

export default AlembicAnnexureTemplate;