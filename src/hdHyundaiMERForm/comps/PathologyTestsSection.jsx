import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({

    container: {
        marginBottom: 12,
        borderBottom: "1px solid black"
    },

    title: {
        fontWeight: "bold",
        padding: 4,

    },

    row: {
        flexDirection: "row",
        borderRight: "1px solid black",
        borderLeft: "1px solid black",

    },

    label: {
        width: "12%",
        borderRight: "1 solid black",
        borderTop: "1 solid black",
        padding: 4,
        fontSize: 8
    },

    valueWide: {
        width: "18%",
        borderRight: "1 solid black",
        borderTop: "1 solid black",
        padding: 4,
        fontSize: 8
    },

    labelMid: {
        width: "14%",
        borderRight: "1 solid black",
        borderTop: "1 solid black",
        padding: 4,
        fontSize: 8
    },

    valueMid: {
        width: "16%",
        borderRight: "1 solid black",
        borderTop: "1 solid black",
        padding: 4,
    },

    labelSmall: {
        width: "14%",
        borderRight: "1 solid black",
        borderTop: "1 solid black",
        padding: 4,
        fontSize: 8
    },

    valueSmall: {
        width: "12%",
        borderTop: "1 solid black",
        padding: 4,
        fontSize: 8
    },

});

const PathologyTestsSection = ({ data }) => {

    return (

        <View style={styles.container}>

            {/* TITLE */}
            <Text style={styles.title}>
                PATHOLOGY TESTS:
            </Text>

            {/* ROW 1 */}
            <View style={styles.row}>

                <Text style={styles.label}>
                    HB :
                </Text>

                <Text style={styles.valueWide}>
                    {data.hb}
                </Text>

                <Text style={styles.labelMid}>
                    WBC :
                </Text>

                <Text style={styles.valueMid}>
                    {data.wbc}
                </Text>

                <Text style={styles.labelMid}>
                    PLATELET :
                </Text>

                <Text style={styles.valueMid}>
                    {data.platelet}
                </Text>

                <Text style={styles.labelSmall}>
                    BSL-R :
                </Text>

                <Text style={styles.valueSmall}>
                    {data.bslr}
                </Text>

            </View>

            {/* ROW 2 */}
            <View style={styles.row}>

                <Text style={styles.label}>
                </Text>

                <Text style={styles.valueWide}>
                    {data.hbFemaleRange}
                </Text>

                <Text style={styles.labelMid}>
                    BLOOD GROUP
                </Text>

                <Text style={styles.valueMid}>
                    {data.bloodGroup}
                </Text>

                <Text style={styles.labelMid}>
                    URINE SUGAR
                </Text>

                <Text style={styles.valueMid}>
                    {data.urineSugar}
                </Text>

                <Text style={styles.labelSmall}>
                    CHOLESTEROL
                </Text>

                <Text style={styles.valueSmall}>
                    {data.cholesterol}
                </Text>

            </View>

            {/* ROW 3 */}
            <View style={styles.row}>

                <Text style={styles.label}>
                    CREATININE
                </Text>

                <Text style={styles.valueWide}>
                    {data.creatinine}
                </Text>

                <Text style={styles.labelMid}>
                    SGPT
                </Text>

                <Text style={styles.valueMid}>
                    {data.sgpt}
                </Text>

                <Text style={styles.labelMid}>
                    SGOT
                </Text>

                <Text style={styles.valueMid}>
                    {data.sgot}
                </Text>

                <Text style={styles.labelSmall}>
                    STOOL
                </Text>

                <Text style={styles.valueSmall}>
                    {data.stool}
                </Text>

            </View>

        </View>

    );
};

export default PathologyTestsSection;
