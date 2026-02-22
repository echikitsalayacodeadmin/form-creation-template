import React from "react";
import { View, Text, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({

    container: {
        border: "1 solid black",
        marginTop: 12,
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 10,
    },

    title: {
        textAlign: "center",
        fontSize: 16,
        marginBottom: 15,
    },

    contentRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    textContainer: {
        flex: 4,
        textAlign: "center",
    },

    certifyText: {
        fontSize: 11
    },


    doctorText: {
        fontSize: 8,
        marginTop: 5,
        textAlign: "center",
    },

});

const FitnessCertificateSection = ({ data }) => {

    return (

        <View style={styles.container}>

            {/* TITLE */}
            <Text style={styles.title}>
                Fitness Certificate
            </Text>

            <View style={styles.contentRow}>

                {/* CERTIFICATE TEXT */}
                <View style={styles.textContainer}>
                    <Text style={styles.certifyText}>
                        This is to Certify that {data.employeeName} is Fit to work.
                    </Text>
                </View>





            </View>

        </View>

    );
};

export default FitnessCertificateSection;
