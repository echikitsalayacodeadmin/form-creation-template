import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    section: {
        marginBottom: 12,
    },
    container: {
        borderRight: '1px solid black',
        borderLeft: '1px solid black',
        borderBottom: '1px solid black',

    },

    title: {
        fontSize: 10,
        fontWeight: "bold",
        marginBottom: 4,
        textDecoration: "underline",
    },

    row: {
        flexDirection: "row",
    },

    labelCell: {
        width: "18%",
        borderRight: "1 solid black",
        borderTop: "1 solid black",
        padding: 4,
        fontSize: 8
    },

    valueCell: {
        width: "7%",
        borderRight: "1 solid black",
        borderTop: "1 solid black",
        padding: 4,
        textAlign: "center",
        fontSize: 8
    },

    lastLabelCell: {
        width: "18%",
        borderTop: "1 solid black",
        borderRight: "1 solid black",
        padding: 4,
        fontSize: 8
    },

    lastValueCell: {
        width: "7%",
        borderTop: "1 solid black",
        padding: 4,
        textAlign: "center",
        fontSize: 8
    },

    fullLabel: {
        width: "25%",
        borderRight: "1 solid black",
        borderTop: "1 solid black",
        padding: 4,
        fontSize: 8
    },

    fullValue: {
        width: "75%",
        borderTop: "1 solid black",
        padding: 4,
        fontSize: 8
    },

});

const CurrentPastHistorySection = ({ data }) => {

    const rows = [
        ["POLIO", data.polio, "SURGERY", data.surgery, "PSYCHIATRIC ILLNESS", data.psychiatric, "TOBACCO", data.tobacco],
        ["ASTHAMA", data.asthma, "ALLERGIES", data.allergies, "HYPERTENSION(BP)", data.hypertension, "SMOKING", data.smoking],
        ["T.B", data.tb, "HEART DISEASE", data.heartDisease, "DIABETES(SUGAR)", data.diabetes, "ALCOHOL", data.alcohol],
        ["EPILEPSY", data.epilepsy, "Past Complaints", data.pastComplaints, "Any Other", data.anyOther, "", ""],
    ];

    return (
        <View style={styles.section}>

            <Text style={styles.title}>
                CURRENT AND PAST HISTORY: To be filled by candidate (Tick appropriate) Yes/No
            </Text>
            <View style={styles.container}>
                <View>

                    {rows.map((row, i) => (
                        <View style={styles.row} key={i}>

                            {/* Column 1 */}
                            <Text style={styles.labelCell}>{row[0]}</Text>
                            <Text style={styles.valueCell}>{row[1]}</Text>

                            {/* Column 2 */}
                            <Text style={styles.labelCell}>{row[2]}</Text>
                            <Text style={styles.valueCell}>{row[3]}</Text>

                            {/* Column 3 */}
                            <Text style={styles.labelCell}>{row[4]}</Text>
                            <Text style={styles.valueCell}>{row[5]}</Text>

                            {/* Column 4 */}
                            {row[6] !== "" ? (
                                <>
                                    <Text style={styles.lastLabelCell}>{row[6]}</Text>
                                    <Text style={styles.lastValueCell}>{row[7]}</Text>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.lastLabelCell}></Text>
                                    <Text style={styles.lastValueCell}></Text>
                                </>
                            )}

                        </View>
                    ))}

                    {/* YES THAN DETAILS */}
                    <View style={styles.row}>
                        <Text style={styles.fullLabel}>Yes Than Details</Text>
                        <Text style={styles.fullValue}>{data.yesDetails}</Text>
                    </View>

                    {/* FAMILY HISTORY */}
                    <View style={styles.row}>
                        <Text style={styles.fullLabel}>FAMILY HISTORY</Text>
                        <Text style={styles.fullValue}>{data.familyHistory}</Text>
                    </View>

                </View>

            </View>
        </View>
    );
};

export default CurrentPastHistorySection;
