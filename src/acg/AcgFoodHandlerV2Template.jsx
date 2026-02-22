

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


const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingBottom: 40,
        paddingHorizontal: 50,
        fontSize: 11,
        fontFamily: "Helvetica",
        lineHeight: 1.6,
    },

    title: {
        fontSize: 16,
        textAlign: "center",
        fontWeight: "bold",
        marginBottom: 6,
        textTransform: "uppercase",
    },

    subtitle: {
        textAlign: "center",
        fontSize: 10,
        marginBottom: 20,
    },

    section: {
        marginBottom: 10,
    },

    paragraph: {
        flexDirection: "row",
        flexWrap: "wrap",
        textAlign: "justify",
        marginBottom: 12,
        alignItems: "baseline",
    },
    dottedLine: {
        borderBottomWidth: 1,
        borderBottomStyle: "dotted",
        borderBottomColor: "#000",
        minWidth: 120,
        display: "inline-block",
    },

    dottedLong: {
        borderBottomWidth: 1,
        borderBottomStyle: "dotted",
        borderBottomColor: "#000",
        width: "100%",
        height: 12,
    },

    inline: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "baseline",
    },

    listContainer: {
        marginTop: 15,
        marginBottom: 20,
    },

    listItem: {
        marginBottom: 6,
    },

    signatureContainer: {
        marginTop: 40,
        alignItems: "flex-end",
    },

    signatureText: {
        textAlign: "center",
    },
});

const AcgFoodHandlerV2Template = ({ data, companyName, year = "2026" }) => {
    const valueOrDots = (value, width = 120) => (
        <Text style={{ borderBottomWidth: 1, borderBottomStyle: "dotted", width }}>
            {value || ""}
        </Text>
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* TITLE */}
                <Text style={styles.title}>
                    MEDICAL FITNESS CERTIFICATE FOR FOOD HANDLERS
                </Text>

                <Text style={styles.subtitle}>
                    For the year {year}
                </Text>

                <Text style={styles.subtitle}>
                    (See Para No. 10.1.2, Part-II, Schedule - 4 of FSS Regulation, 2011)
                </Text>

                {/* MAIN PARAGRAPH */}
                {/* MAIN PARAGRAPH */}
                <View style={styles.paragraph}>

                    <Text>It is certified that Shri. / Smt. / Miss </Text>

                    <DottedField value={data?.name} />

                    <Text>{" "}(Name and address) employed with M/s </Text>

                    <DottedField value={companyName} />

                    <Text>
                        , coming in direct contact with food items, has been carefully examined by me on{" "}
                    </Text>
                    <DottedField value={data?.vitalsCreatedDate} />
                    <Text>{" "} (date). Based on the medical examination conducted, he / she is found free from any</Text>
                    <Text>{" "}infectious or communicable diseases and the person is fit to work in the above-mentioned
                        food establishment.
                    </Text>

                </View>



                {/* SIGNATURE */}
                <View style={styles.signatureContainer}>
                    <Text style={styles.signatureText}>
                        Name and signature with Seal{"\n"}
                        of Registered Medical Practitioner / Civil Surgeon
                    </Text>
                    <Image
                        src={Dr_Jaydip_Saxena}
                        style={{
                            height: 100,
                            width: 120,
                        }}
                    />
                </View>

                {/* EXAMINATION LIST */}
                <View style={styles.listContainer}>
                    <Text>Medical examination to be conducted</Text>

                    <Text style={styles.listItem}>
                        1. Physical examination
                    </Text>

                    <Text style={styles.listItem}>
                        2. Eye test
                    </Text>

                    <Text style={styles.listItem}>
                        3. Skin examination
                    </Text>

                    <Text style={styles.listItem}>
                        4. Compliance with schedule of vaccine to be inoculated against enteric group of diseases
                    </Text>

                    <Text style={styles.listItem}>
                        5. Any test required to confirm any communicable or infectious disease which the person suspected to be suffering from on clinical examination
                    </Text>

                </View>

            </Page>
        </Document >
    );
};

export default AcgFoodHandlerV2Template;


const DottedField = ({ value, width = 150 }) => {

    return (

        <Text style={{ textDecoration: 'underline' }}>{value || " "}</Text>


    );
};
