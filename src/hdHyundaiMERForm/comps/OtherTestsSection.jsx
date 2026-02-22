import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({

    container: {
        marginBottom: 12
    },

    title: {
        fontWeight: "bold",
        padding: 4,
        borderBottom: "1 solid black",
    },

    row: {
        flexDirection: "row",
        borderRight: "1px solid black",
        borderLeft: "1px solid black",
        borderBottom: "1px solid black"
    },

    label: {
        width: "18%",
        borderRight: "1 solid black",
        padding: 4,
        fontSize: 8
    },

    value: {
        width: "32%",
        borderRight: "1 solid black",
        padding: 4,
        fontSize: 8
    },

    labelSmall: {
        width: "18%",
        borderRight: "1 solid black",
        padding: 4,
        fontSize: 8
    },

    valueSmall: {
        width: "12%",
        borderRight: "1 solid black",
        padding: 4,
        fontSize: 8
    },

    lastValue: {
        width: "20%",
        padding: 4,
        fontSize: 8
    },

});

const OtherTestsSection = ({ data }) => {
    return (

        <View style={styles.container}>

            {/* TITLE */}
            <Text style={styles.title}>
                OTHER TESTS
            </Text>

            {/* ROW */}
            <View style={styles.row}>

                <Text style={styles.labelSmall}>
                    AUDIOMETRY
                </Text>

                <Text style={styles.labelSmall}>
                    {data.audiometry}
                </Text>

                <Text style={styles.value}>
                    LUNG FUNCTION TEST
                </Text>

                <Text style={styles.valueSmall}>
                    {data.lungFunction}
                </Text>

                <Text style={styles.labelSmall}>
                    ECG
                </Text>

                <Text style={styles.valueSmall}>
                    {data.ecg}
                </Text>

                <Text style={styles.labelSmall}>
                    X-RAY
                </Text>

                <Text style={styles.lastValue}>
                    {data.xray}
                </Text>

            </View>

        </View>

    );
};

export default OtherTestsSection;
