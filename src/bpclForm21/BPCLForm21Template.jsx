import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";

import Dr_Jaydip_Saxena from "../../src/assets/images/Dr_Jaydip_Saxena.png";
import bpclForm21Logo from "../assets/images/bpclForm21Logo.jpg"

const BORDER = 1;

const styles = StyleSheet.create({
    page: {
        padding: 12,
        fontSize: 9,
        fontFamily: "Helvetica",
    },

    titleContainer: {
        textAlign: "center",
        marginBottom: 6,
    },

    title: {
        fontSize: 10,
        fontWeight: "bold",
    },

    subtitle: {
        fontSize: 9,
        marginTop: 2,
    },

    table: {
        borderWidth: BORDER,
        width: "100%",
    },

    row: {
        flexDirection: "row",
        width: "100%",
    },

    cell: {
        borderRightWidth: BORDER,
        borderBottomWidth: BORDER,
        padding: 4,
        justifyContent: "center",
    },

    hNumber: {
        height: 18,
    },

    numberCell: {
        justifyContent: "center",
        alignItems: "center",
        padding: 0,
    },

    lastCell: {
        borderRightWidth: 0,
    },

    center: {
        textAlign: "center",
    },

    bold: {
        fontWeight: "bold",
    },

    middle: {
        justifyContent: "center",
    },

    /* Column widths */
    c1: { width: "4%" },
    c2: { width: "18%" },
    c3: { width: "16%" },
    c4: { width: "12%" },
    c5: { width: "12%" },
    c6: { width: "12%" },
    c7: { width: "26%" },

    c8: { width: "8%" },
    c9: { width: "24%" },
    c10: { width: "16%" },
    c11: { width: "16%" },
    c12: { width: "16%" },
    c13: { width: "20%" },

    /* Heights */
    hSurgeon: { height: 28 },
    hHeader: { height: 42 },
    hWorker: { height: 45 },
    hMedicalHeader: { height: 60 },
    hMedicalData: { height: 190 },

    medicalSpacing: {
        marginBottom: 8,
    },

    line: {
        borderBottomWidth: 1,
        marginTop: 6,
    },
    underlineField: {
        borderBottomWidth: 1,
        paddingBottom: 2,
        minHeight: 12,
    },

    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
    },

    label: {
        marginRight: 4,
    },

    medicalRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },

    medicalLabel: {
        width: 60,
    },

    medicalValueLine: {
        borderBottomWidth: 1,
        flex: 1,
        paddingBottom: 2,
        minHeight: 12,
    },

    consultationValueLine: {
        borderBottomWidth: 1,
        marginTop: 6,
        minHeight: 14,
        justifyContent: "center",
    },

    doctorSignature: {
        width: 140,
        height: 140,
        marginTop: 10,
        objectFit: "contain",
    },
});

const BPCLForm21Template = ({ data }) => {
    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>

                {/* TITLE */}
                <View style={styles.titleContainer}>

                    <Image src={bpclForm21Logo} style={{ width: '100%', height: 90 }} />

                    <Text style={styles.title}> Form 21</Text>
                    <Text style={styles.title}>Prescribed Under Rule 19</Text>
                    <Text style={styles.title}>Health Register</Text>
                    <Text style={styles.subtitle}>
                        (In respect of persons employed in occupations declared to be dangerous operations under Section 87)
                    </Text>
                </View>

                {/* SURGEON ROW */}
                <View style={[styles.table, styles.row, styles.hSurgeon]}>

                    <View style={[styles.cell, { width: "26%" }]}>
                        <Text>Name of Certifying Surgeon</Text>
                    </View>

                    <View style={[styles.cell, { width: "34%" }]}>

                        <View style={styles.rowBetween}>
                            <Text style={styles.label}>Mr.</Text>

                            <View style={[styles.underlineField, { flex: 1 }]}>
                                <Text>{"Jaydip Saxsena"}</Text>
                            </View>
                        </View>

                    </View>


                    <View style={[styles.cell, styles.lastCell, { width: "40%" }]}>

                        <View style={styles.rowBetween}>

                            <Text style={styles.label}>Date: </Text>

                            <View style={[styles.underlineField, { width: 150 }]}>
                                <Text>{data?.vitalsCreatedDate}</Text>
                            </View>
                        </View>

                    </View>


                </View>

                {/* MAIN TABLE */}
                <View style={styles.table}>

                    {/* HEADER */}
                    <View style={[styles.row, styles.hHeader]}>

                        <View style={[styles.cell, styles.c1]}>
                            <Text>Sr. No</Text>
                        </View>

                        <View style={[styles.cell, styles.c2]}>
                            <Text>Name of Worker</Text>
                        </View>

                        <View style={[styles.cell, styles.c3]}>
                            <Text>Age (last birth day)</Text>
                        </View>

                        <View style={[styles.cell, styles.c4]}>
                            <Text>Date of employment on present work</Text>
                        </View>

                        <View style={[styles.cell, styles.c5]}>
                            <Text>Date of leaving or transfer to other work</Text>
                        </View>

                        <View style={[styles.cell, styles.c6]}>
                            <Text>Reason for leaving, transfer or discharge</Text>
                        </View>

                        <View style={[styles.cell, styles.c7, styles.lastCell]}>
                            <Text>Nature of job or occupation</Text>
                        </View>

                    </View>

                    {/* HEADER NUMBERS */}
                    <View style={[styles.row, styles.hNumber]}>

                        {[styles.c1, styles.c2, styles.c3, styles.c4, styles.c5, styles.c6, styles.c7].map((col, i) => (
                            <View key={i} style={[styles.cell, styles.numberCell, col, i === 6 && styles.lastCell]}>
                                <Text>({i + 1})</Text>
                            </View>
                        ))}

                    </View>

                    {/* WORKER EMPTY */}
                    <View style={[styles.row, styles.hWorker]}>

                        <View style={[styles.cell, styles.c1]}>1</View>
                        <View style={[styles.cell, styles.c2]}><Text style={styles.center}>{data?.name || ""}</Text></View>
                        <View style={[styles.cell, styles.c3]}><Text style={styles.center}>{data?.age || "NA"}</Text></View>
                        <View style={[styles.cell, styles.c4]}><Text style={styles.center}>{data?.form21?.dateOfJoining || "NA"}</Text></View>

                        <View style={[styles.cell, styles.c5]}>
                            <Text style={styles.center}>{data?.form21?.dateOfLeavingOrTransfer || "NA"}</Text>
                        </View>

                        <View style={[styles.cell, styles.c6]}>
                            <Text style={styles.center}>{data?.form21?.reasonsForLeavingOrTransfer || "NA"}</Text>
                        </View>

                        <View style={[styles.cell, styles.c7, styles.lastCell]}>
                            <Text>{data?.form21?.occupation || "NA"}</Text>
                        </View>

                    </View>

                    {/* MEDICAL HEADER */}
                    <View style={[styles.row, styles.hMedicalHeader]}>

                        <View style={[styles.cell, styles.c8]}>
                            <Text>Raw material or product handled</Text>
                        </View>

                        <View style={[styles.cell, styles.c9]}>
                            <Text>
                                Date of Medical Examination by Certifying Surgeon and result of Medical Examination
                            </Text>
                        </View>

                        <View style={[styles.cell, styles.c10]}>
                            <Text>
                                If suspended from work, state period of suspension with detailed reasons
                            </Text>
                        </View>

                        <View style={[styles.cell, styles.c11]}>
                            <Text>
                                Recertified fit to resume duty on (with signature of certifying surgeon)
                            </Text>
                        </View>

                        <View style={[styles.cell, styles.c12]}>
                            <Text>
                                If certificate of unfitness or suspension issued to work
                            </Text>
                        </View>

                        <View style={[styles.cell, styles.c13, styles.lastCell]}>
                            <Text>Signature with date of certifying Surgeon</Text>
                        </View>

                    </View>

                    {/* MEDICAL NUMBERS */}
                    <View style={[styles.row, styles.hNumber]}>

                        {[styles.c8, styles.c9, styles.c10, styles.c11, styles.c12, styles.c13].map((col, i) => (
                            <View key={i} style={[styles.cell, col, i === 5 && styles.lastCell]}>
                                <Text style={styles.center}>({i + 8})</Text>
                            </View>
                        ))}

                    </View>

                    {/* MEDICAL DATA */}
                    <View style={[styles.row, styles.hMedicalData]}>

                        <View style={[styles.cell, styles.c8]} >
                            <Text style={styles.center}>NA</Text>
                        </View>

                        <View style={[styles.cell, styles.c9]}>

                            <View style={styles.medicalRow}>
                                <Text style={styles.medicalLabel}>Weight</Text>
                                <View style={styles.medicalValueLine}>
                                    <Text>{data?.weight}</Text>
                                </View>
                            </View>

                            <View style={styles.medicalRow}>
                                <Text style={styles.medicalLabel}>Height</Text>
                                <View style={styles.medicalValueLine}>
                                    <Text>{data?.height}</Text>
                                </View>
                            </View>

                            <View style={styles.medicalRow}>
                                <Text style={styles.medicalLabel}>BP</Text>
                                <View style={styles.medicalValueLine}>
                                    <Text>{data?.bp}</Text>
                                </View>
                            </View>

                            <View style={styles.medicalRow}>
                                <Text style={styles.medicalLabel}>Sugar</Text>
                                <View style={styles.medicalValueLine}>
                                    <Text>{data?.cholestrolData?.["BLOOD SUGAR RANDOM"]}</Text>
                                </View>
                            </View>

                            <View style={styles.medicalRow}>
                                <Text style={styles.medicalLabel}>Eye</Text>
                                <View style={styles.medicalValueLine}>
                                    <Text>{data?.visionRemark}</Text>
                                </View>
                            </View>

                            <Text style={{ marginTop: 6 }}>Surgeon Consultation</Text>

                            <View style={styles.consultationValueLine}>
                                <Text>{data?.consultation3}</Text>
                            </View>



                        </View>

                        <View style={[styles.cell, styles.c10, styles.middle]}>
                            <Text style={styles.center}>NA</Text>
                        </View>

                        <View style={[styles.cell, styles.c11, styles.middle]}>
                            <Text style={styles.center}>NA</Text>
                        </View>

                        <View style={[styles.cell, styles.c12, styles.middle]}>
                            <Text style={styles.center}>NA</Text>
                        </View>

                        <View style={[styles.cell, styles.c13, styles.lastCell]}>
                            <Image
                                style={styles.doctorSignature}
                                src={Dr_Jaydip_Saxena}
                            />
                        </View>

                    </View>

                </View>

            </Page>
        </Document>
    );
};

export default BPCLForm21Template;