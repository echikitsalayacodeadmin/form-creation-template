import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },

    title: {
        textAlign: "center",
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 6,
        textDecoration: "underline",
    },

    row: {
        flexDirection: "row",
        gap: 10
    },

    column: {
        flex: 1,
        border: "1 solid black",
    },

    columnTitle: {
        fontWeight: "bold",
        padding: 4,
        borderBottom: "1 solid black",
        fontSize: 9,
    },

    fieldRow: {
        flexDirection: "row",
    },

    label: {
        width: "55%",
        borderRight: "1 solid black",
        borderBottom: "1 solid black",
        padding: 4,
        fontSize: 8,
    },

    value: {
        width: "45%",
        borderBottom: "1 solid black",
        padding: 4,
        fontSize: 8,
    },

    valueCenter: {
        flex: 1,
        borderRight: "1 solid black",
        borderBottom: "1 solid black",
        padding: 4,
        fontSize: 8,
        textAlign: "center",
    },

    valueLast: {
        flex: 1,
        borderBottom: "1 solid black",
        padding: 4,
        fontSize: 8,
        textAlign: "center",
    },

    fullRow: {
        borderBottom: "1 solid black",
        padding: 4,
        fontSize: 8,
    },

    subHeader: {
        borderBottom: "1 solid black",
        padding: 4,
        fontSize: 8,
        fontWeight: "bold",
    },
});

const OfficialUseSection = ({ data }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>OFFICIAL USE :</Text>

            <View style={styles.row}>

                {/* GENERAL EXAMINATION */}
                <View style={styles.column}>

                    <Text style={styles.columnTitle}>
                        GENERAL EXAMINATION
                    </Text>

                    {[
                        ["HEIGHT", data.height],
                        ["WEIGHT", data.weight],
                        ["PULSE", data.pulse],
                        ["B.P:", data.bp],
                        ["EAR", data.ear],
                        ["NOSE", data.nose],
                        ["THROAT", data.throat],
                        ["TEETH", data.teeth],
                        ["NAILS", data.nails],
                        ["SKIN", data.skin],
                        ["LYMPH NODES", data.lymphNodes],
                        ["HERNIA", data.hernia],
                        ["PHYMOSIS", data.phymosis],
                    ].map((item, i) => (
                        <View key={i} style={styles.fieldRow}>
                            <Text style={styles.label}>{item[0]} </Text>
                            <Text style={styles.value}>{item[1]}</Text>
                        </View>
                    ))}
                </View>

                {/* VISION TESTS */}
                <View style={styles.column}>

                    <Text style={styles.columnTitle}>
                        VISION TESTS:
                    </Text>

                    {/* EYES DV */}
                    <View style={styles.fieldRow}>
                        <Text style={styles.label}>EYES : D.V :</Text>
                        <Text style={styles.valueCenter}>
                            RT : {data.dvRt}
                        </Text>
                        <Text style={styles.valueLast}>
                            LT : {data.dvLt}
                        </Text>
                    </View>

                    {/* NV */}
                    <View style={styles.fieldRow}>
                        <Text style={styles.label}>N.V :</Text>
                        <Text style={styles.valueCenter}>
                            RT : {data.nvRt}
                        </Text>
                        <Text style={styles.valueLast}>
                            LT : {data.nvLt}
                        </Text>
                    </View>

                    <Text style={styles.fullRow}>
                        Without Glass
                    </Text>

                    {/* Diseases header */}
                    <Text style={styles.subHeader}>
                        Diseases
                    </Text>

                    {[
                        ["SQUINT", data.squint],
                        ["NYSTAGMUS", data.nystagmus],
                        ["COLOUR BLINDNESS", data.colourBlindness],
                    ].map((item, i) => (
                        <View key={i} style={styles.fieldRow}>
                            <Text style={styles.label}>{item[0]} </Text>
                            <Text style={styles.value}>{item[1]}</Text>
                        </View>
                    ))}

                    {/* SYSTEMATIC */}
                    <Text style={styles.subHeader}>
                        SYSTEMATIC EXAMINATION
                    </Text>

                    {[
                        ["RS", data.rs],
                        ["CNS", data.cns],
                        ["CVS", data.cvs],
                        ["GIS", data.gis],
                        ["MUSCULO-SKELETON SYSTEM", data.musculo],
                    ].map((item, i) => (
                        <View key={i} style={styles.fieldRow}>
                            <Text style={styles.label}>{item[0]} </Text>
                            <Text style={styles.value}>{item[1]}</Text>
                        </View>
                    ))}

                </View>

                {/* BODY PARAMETERS */}
                <View style={styles.column}>

                    <Text style={styles.columnTitle}>
                        BODY PARAMETERS
                    </Text>

                    {[
                        ["BMI", data.bmi],
                        ["IDEAL WEIGHT", data.idealWeight],
                        ["BODY TYPE", data.bodyType],
                        ["EXCESS WEIGHT", data.excessWeight],
                    ].map((item, i) => (
                        <View key={i} style={styles.fieldRow}>
                            <Text style={styles.label}>{item[0]} </Text>
                            <Text style={styles.value}>{item[1]}</Text>
                        </View>
                    ))}

                    <Text style={styles.subHeader}>
                        VACCINATION
                    </Text>

                    {[
                        ["TYPHOID", data.typhoid],
                        ["CHOLERA", data.cholera],
                        ["Hepatitis-A", data.hepatitis],
                        ["T.T", data.tt],
                        ["STOOL", data.stool],
                    ].map((item, i) => (
                        <View key={i} style={styles.fieldRow}>
                            <Text style={styles.label}>{item[0]} </Text>
                            <Text style={styles.value}>{item[1]}</Text>
                        </View>
                    ))}

                </View>

            </View>
        </View>
    );
};

export default OfficialUseSection;
