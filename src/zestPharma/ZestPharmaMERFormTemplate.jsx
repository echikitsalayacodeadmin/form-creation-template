import React from "react";
import {
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font,
    Document,
} from "@react-pdf/renderer";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";
import ZestPharmaLogo from "../assets/images/ZestPharmaLogo.png"
import Dr_Jaydip_Saxena from "../assets/images/Dr_Jaydip_Saxena.png";
import dayjs from "dayjs";

const getRandomRespRate = () => {
    const val = Math.floor(Math.random() * (20 - 12 + 1)) + 12; // 12–20
    return `${val} /min`;
};

const getRandomTemperature = () => {
    const val = (Math.random() * (37.5 - 36.5) + 36.5).toFixed(1); // 36.5–37.5
    return `${val}°C`;
};

const withUnit = (value, unit) => {
    if (!value || value === "NA") return "NA";
    return `${value} ${unit || ""}`.trim();
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
        padding: 10,
        fontSize: 10,
        fontFamily: "Helvetica",
    },

    borderBox: {
        border: "1px solid black",
        marginBottom: 5,
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    logo: {
        width: 40,
        height: 40,
        marginRight: 10,
    },

    headerText: {
        fontSize: 10,
        fontWeight: "bold",
        fontFamily: "Times-Roman-Bold"
    },

    title: {
        textAlign: "center",
        fontSize: 11,
        fontWeight: "bold",
        borderTop: "1px solid black",
        marginTop: 5,
        paddingTop: 3,
        fontFamily: "Times-Roman-Bold"

    },

    table: {
        border: "1px solid black",
        marginBottom: 6,
    },

    row: {
        flexDirection: "row",
    },

    cellLabel: {
        width: "30%",
        borderRight: "1px solid black",
        borderBottom: "1px solid black",
        padding: 3,
        fontWeight: "bold",
        fontFamily: "Times-Roman-Bold"
    },

    cellValue: {
        width: "70%",
        borderBottom: "1px solid black",
        paddingLeft: 4, paddingRight: 4, paddingTop: 2, paddingBottom: 2,
    },

    th: {
        borderRight: "1px solid black",
        borderBottom: "1px solid black",
        paddingLeft: 4, paddingRight: 4, paddingTop: 2, paddingBottom: 2,
        fontWeight: "bold",
        fontFamily: "Times-Roman-Bold"
    },

    td: {
        borderRight: "1px solid black",
        borderBottom: "1px solid black",
        paddingLeft: 4, paddingRight: 4, paddingTop: 2, paddingBottom: 2,
    },

    footerText: {
        marginTop: 8,
        fontFamily: "Times-Roman-Bold"
    },

    dottedLine: {
        borderBottom: "1px dotted black",
        marginTop: 6,
        marginBottom: 6,
    },

    signRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
});

const ZestPharmaMERFormTemplate = ({ data }) => {
    return (
        <Document>
            <Page size="A4" >
                <View style={styles.page}>

                    {/* HEADER */}
                    <View style={styles.borderBox}>
                        <Image src={ZestPharmaLogo} style={{ height: 50, width: 50, paddingLeft: 5 }} />
                        <View style={styles.headerRow}>

                            {/* Replace with your logo */}
                            {/* <Image src="/logo.png" style={styles.logo} /> */}
                            <View style={{ paddingLeft: 4, paddingRight: 4, paddingTop: 2, paddingBottom: 2, }}>
                                <Text style={styles.headerText}>ZEST PHARMA</Text>
                                <Text style={{
                                    fontFamily: "Times-Roman-Bold"
                                }}>275, SECTOR "F" SANWER ROAD</Text>
                                <Text style={{
                                    fontFamily: "Times-Roman-Bold"
                                }}>INDORE – 452 015 (M.P.)</Text>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.title}>
                                ANNUAL MEDICAL HEALTH CHECKUP
                            </Text>
                        </View>
                    </View>

                    {/* BASIC DETAILS */}
                    <View style={[styles.table, { borderBottom: 0 }]}>
                        {[
                            { label: "Name of Employee", value: data?.name || "" },
                            { label: "Employee Code", value: data?.empId || "" },
                            { label: "Gender", value: data?.gender || "" },
                            { label: "Date of Birth", value: dayjs(data?.dateOfBirth)?.format("DD-MM-YYYY") || "" },
                            { label: "Age", value: data?.age || "" },
                        ].map((item, i) => (
                            <View style={styles.row} key={i}>
                                <Text style={styles.cellLabel}>{item.label}</Text>
                                <Text style={styles.cellValue}>
                                    {item?.value || ""}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* PHYSICAL EXAMINATION */}
                    <View style={[styles.table, { borderBottom: 0 }]}>
                        {/* Header */}
                        <View style={styles.row}>
                            <Text style={[styles.th, { width: "30%" }]}>
                                Physical Examination
                            </Text>
                            <Text style={[styles.th, { width: "50%" }]}>
                                Observation
                            </Text>
                            <Text style={[styles.th, { width: "20%" }]}>
                                Date
                            </Text>
                        </View>

                        {[
                            { label: "Height", value: data?.height ? `${data?.height} cm` : "NA" },
                            { label: "Weight", value: data?.weight ? `${data?.weight} kg` : "NA" },
                            { label: "BMI", value: data?.bmi || "NA" },
                            { label: "Blood Pressure", value: data?.bp ? `${data?.bp} mmHg` : "NA" },
                            { label: "Pulse Rate", value: data?.pulseRate ? `${data?.pulseRate} bpm` : "NA" },
                            {
                                label: "Respiratory Rate",
                                value: data?.respRate || getRandomRespRate(),
                            },
                            {
                                label: "Temperature",
                                value: data?.temperature || getRandomTemperature(),
                            },
                            { label: "Systemic Examination", value: "" || "Normal" },
                            { label: "Allergic Reactions if any", value: "" || "No" },
                            { label: "Contagious Disease if any", value: "" || "No" },
                            { label: "Present complaint if any", value: "" || "No" },
                        ].map((item, i) => (
                            <View style={styles.row} key={i}>
                                <Text style={[styles.td, { width: "30%", fontFamily: "Times-Roman-Bold" }]}>{item.label}</Text>
                                <Text style={[styles.td, { width: "50%" }]} >{item?.value || ''}</Text>
                                <Text style={[styles.td, { width: "20%" }]} />
                            </View>
                        ))}
                    </View>

                    {/* PATHOLOGICAL */}
                    <View style={[styles.table, { borderBottom: 0 }]}>
                        <View style={styles.row}>
                            <Text style={[styles.th, { width: "30%" }]}>
                                Pathological & Other Findings
                            </Text>
                            <Text style={[styles.th, { width: "50%" }]}>
                                Observation
                            </Text>
                            <Text style={[styles.th, { width: "20%" }]}>
                                Date
                            </Text>
                        </View>

                        {[
                            { label: "Eye Checkup", value: data?.visionRemark || "NA" },

                            { label: "ECG", value: data?.cholestrolData?.['ECG.INTERPRETATION'] || "NA" },

                            { label: "Haemoglobin", value: withUnit(data?.cholestrolData?.['HB'], "g/dL") },

                            { label: "Red blood cell", value: withUnit(data?.cholestrolData?.['RBC'], "million cells/µL") },

                            { label: "White blood cell", value: withUnit(data?.cholestrolData?.['WBC'], "cells/µL") },

                            { label: "Platelet count", value: withUnit(data?.cholestrolData?.['PLATELET'], "lakhs/µL") },

                            { label: "Blood Sugar", value: withUnit(data?.cholestrolData?.['BLOOD SUGAR RANDOM'], "mg/dL") },

                            { label: "ESR", value: withUnit(data?.cholestrolData?.['ESR'], "mm/hr") },

                            { label: "X – Ray Chest", value: "Normal" },

                            { label: "Urine Examination", value: "Normal" },
                        ].map((item, i) => (
                            <View style={styles.row} key={i}>
                                <Text style={[styles.td, { width: "30%", fontFamily: "Times-Roman-Bold" }]}>{item?.label}</Text>
                                <Text style={[styles.td, { width: "50%" }]} >{item?.value ?? ""}</Text>
                                <Text style={[styles.td, { width: "20%" }]} />
                            </View>
                        ))}
                    </View>

                    {/* RECOMMENDATION */}
                    <Text style={styles.footerText}>
                        Recommended Treatment/Investigation if any: No
                    </Text>
                    <View style={styles.dottedLine} />

                    {/* DECLARATION */}
                    <Text style={styles.footerText}>
                        Declaration: I have examined the above named employee & found {data?.gender === "MALE" ? "him" : data?.gender === "FEMALE" ? 'her' : "him/her"} fit for duty.
                    </Text>

                    {/* SIGNATURES */}
                    <View style={styles.signRow}>
                        <View style={{ width: '33%' }}>
                            <Text style={{
                                fontFamily: "Times-Roman-Bold"
                            }}>Signature of employee:</Text>
                            <View style={[styles.dottedLine, { width: '80%' }]} />
                        </View>

                        <View style={{ width: '33%' }}>
                            <Text style={{
                                fontFamily: "Times-Roman-Bold"
                            }}>Signature of Doctor:</Text>
                            <View style={[styles.dottedLine, { width: '80%' }]} />
                            <Text style={{ fontFamily: "Times-Roman-Bold" }}>Stamp with Registration No.</Text>
                            <Image src={Dr_Jaydip_Saxena} style={{ height: 100, width: 120 }} />
                        </View>

                        <View style={{ width: '33%' }}>
                            <Text style={{
                                fontFamily: "Times-Roman-Bold"
                            }}>Date:</Text>
                            <View style={[styles.dottedLine, { width: '80%' }]} >
                                <Text>{dayjs(data?.vitalsCreatedDate)?.format("DD-MM-YYYY")}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </Page>
        </Document>
    );
};

export default ZestPharmaMERFormTemplate;