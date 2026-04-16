
import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Font,
    Image,
} from "@react-pdf/renderer";
import uncareheader from "../assets/images/uncareheader.png";
import prashantDeshmukh from "../assets/images/prashantDeshmukh.png";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";
import dayjs from "dayjs";

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
        padding: 12,
        fontSize: 11,
        fontFamily: "Helvetica",
    },

    header: {
        textAlign: "center",
        marginBottom: 6,
        border: "1 px solid #000000",
        padding: 10
    },

    title: {
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Times-Roman-Bold",
        marginBottom: 3
    },

    sub: {
        fontSize: 12,
        fontFamily: "Times-Roman-Bold",
        marginBottom: 3
    },

    table: {
        border: "1px solid #000",
    },

    row: {
        flexDirection: "row",

    },

    cell: {
        borderRight: "1px solid #000",
        borderTop: "1px solid #000",
        padding: 5,
    },

    label: {
        fontWeight: "bold",
        fontFamily: "Times-Roman-Bold",
    },

    section: {
        textAlign: "center",
        fontWeight: "bold",
        borderTop: "1px solid #000",
        padding: 5,
        fontFamily: "Times-Roman-Bold",
    },
});

const JayHindForm6Template = ({ data }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* HEADER */}

                <Image style={styles.logo} src={uncareheader} />


                {/* TABLE */}
                <View style={styles.table}>

                    {/* FORM + DATE */}
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "100%", borderTop: 0, borderBottom: 0, textAlign: 'center', borderRight: 0, padding: 2 }, styles.label]}>FORM 6</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "100%", borderTop: 0, borderBottom: 0, textAlign: 'center', borderRight: 0, padding: 2 }, styles.label]}>(See Rule 18)</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "100%", borderTop: 0, textAlign: 'center', borderRight: 0, padding: 2 }, styles.label]}>Certificate Of Fitness</Text>

                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%", }, styles.label]}>FORM NO</Text>
                        <Text style={[styles.cell, { width: "20%", }]}>1</Text>
                        <Text style={[styles.cell, { width: "30%", }, styles.label]}>DATE OF EXAMINATION</Text>
                        <Text style={[styles.cell, { width: "30%", borderRight: 0 }]}>{dayjs(data?.vitalsCreatedDate).format("DD-MM-YYYY")}</Text>
                    </View>

                    {/* ORG */}
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>NAME OF ORGANISATION</Text>
                        <Text style={[styles.cell, { width: "80%", borderRight: 0 }]}>
                            JAYA HIND INDUSTRY PVT LTD - URSE
                        </Text>
                    </View>

                    {/* NAME */}
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>NAME</Text>
                        <Text style={[styles.cell, { width: "80%", borderRight: 0 }]}>
                            {data?.name}
                        </Text>
                    </View>

                    {/* AGE + DEPT */}
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>AGE & SEX</Text>
                        <Text style={[styles.cell, { width: "20%" },]}>{data?.age} YEAR & {data?.gender}</Text>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>DEPARTMENT</Text>
                        <Text style={[styles.cell, { width: "40%", borderRight: 0 }]}>
                            {data?.department}
                        </Text>
                    </View>

                    {/* DESIGNATION */}
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>DESIGNATION</Text>
                        <Text style={[styles.cell, { width: "20%" }]}> {data?.EXTRAS?.DESIGNATION || ""}</Text>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>GRADE</Text>
                        <Text style={[styles.cell, { width: "40%", borderRight: 0 }]}>{data?.EXTRAS?.Grade}</Text>
                    </View>

                    {/* CC */}
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>CC NUMBER</Text>
                        <Text style={[styles.cell, { width: "20%" }]}>{data?.EXTRAS?.CC}</Text>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>EMP ID</Text>
                        <Text style={[styles.cell, { width: "40%", borderRight: 0 }]}>{data?.empId}</Text>
                    </View>

                    {/* PLAN */}
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>MAIN SR NO</Text>
                        <Text style={[styles.cell, { width: "20%" }]}>{data?.EXTRAS?.SR}</Text>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>CATEGORY</Text>
                        <Text style={[styles.cell, { width: "40%", borderRight: 0 }]}>{data?.EXTRAS?.CATEGORY}</Text>
                    </View>

                    {/* PHYSICAL */}
                    <Text style={styles.section}>PHYSICAL EXAMINATION</Text>

                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>HEIGHT</Text>
                        <Text style={[styles.cell, { width: "15%" }]}>{data?.height}</Text>
                        <Text style={[styles.cell, { width: "25%" }, styles.label]}>CM</Text>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>BP</Text>
                        <Text style={[styles.cell, { width: "20%", borderRight: 0 }]}>{data?.bp ? `${data?.bp} MMHG` : ""} </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>WEIGHT</Text>
                        <Text style={[styles.cell, { width: "15%" }]}>{data?.weight}</Text>
                        <Text style={[styles.cell, { width: "25%" }, styles.label]}>KG</Text>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>PULSE</Text>
                        <Text style={[styles.cell, { width: "20%", borderRight: 0 }]}>{data?.pulseRate ? `${data?.pulseRate} BPM` : ""} </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>BMI</Text>
                        <Text style={[styles.cell, { width: "80%", borderRight: 0 }]}>
                            {data?.bmi}
                        </Text>
                    </View>

                    {/* SYSTEMIC */}
                    <Text style={styles.section}>SYSTEMIC EXAMINATION</Text>

                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "25%" }, styles.label]}>RESPIRATORY SYSTEM</Text>
                        <Text style={[styles.cell, { width: "25%" }]}>AEBE, CLEAR</Text>
                        <Text style={[styles.cell, { width: "25%" }, styles.label]}>C.V.S</Text>
                        <Text style={[styles.cell, { width: "25%", borderRight: 0 }]}>NORMAL</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "25%" }, styles.label]}>C.N.S</Text>
                        <Text style={[styles.cell, { width: "25%", }]}>WELL ORIENTED</Text>
                        <Text style={[styles.cell, { width: "25%" }, styles.label]}>A.S</Text>
                        <Text style={[styles.cell, { width: "25%", borderRight: 0 }]}>WNL</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>SKIN</Text>
                        <Text style={[styles.cell, { width: "80%", borderRight: 0 }]}>
                            SKIN IS NORMAL AND OTHER COMMUNICABLE DISEASES NOT OBSERVED
                        </Text>
                    </View>

                    {/* VISION */}
                    <Text style={styles.section}>VISION TEST</Text>

                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%" }]}></Text>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>RT</Text>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>LT</Text>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>COLOUR VISION : </Text>
                        <Text style={[styles.cell, { width: "20%", borderRight: 0 }]}>{data?.colourVision}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>DISTANT VISION</Text>
                        <Text style={[styles.cell, { width: "20%" }]}>{data?.farRightEyeSight}</Text>
                        <Text style={[styles.cell, { width: "20%" }]}>{data?.farLeftEyeSight}</Text>
                        <Text style={[styles.cell, { width: "40%", borderRight: 0 }]}></Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%" }, styles.label]}>NEAR VISION</Text>
                        <Text style={[styles.cell, { width: "20%" }]}>{data?.nearRightEyeSight}</Text>
                        <Text style={[styles.cell, { width: "20%" }]}>{data?.nearLeftEyeSight}</Text>
                        <Text style={[styles.cell, { width: "40%", borderRight: 0 }]}></Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%", }, styles.label]}>
                            AUDIOMETRY:
                        </Text>
                        <Text style={[styles.cell, { width: "20%", }]}>
                            NORMAL
                        </Text>
                        <Text style={[styles.cell, { width: "20%", }, styles.label]}>
                            PFT:
                        </Text>
                        <Text style={[styles.cell, { width: "40%", borderRight: 0 }]}>
                            NORMAL
                        </Text>
                    </View>

                    {/* FINAL */}
                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%", }, styles.label]}>
                            ADVICE:
                        </Text>
                        <Text style={[styles.cell, { width: "80%", borderRight: 0 }]}>
                            NAD
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={[styles.cell, { width: "20%", }, styles.label]}>
                            REMARK:
                        </Text>
                        <Text style={[styles.cell, { width: "80%", borderRight: 0 }]}>
                            FIT FOR JOB
                        </Text>
                    </View>

                </View>

                <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>

                    <View>
                        <Text style={[{ fontSize: 14, textAlign: 'right' }, styles.label,]}>
                            Stamp
                        </Text>
                        <Image src={prashantDeshmukh} style={{ height: 100, width: 130, marginTop: 0 }} />
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default JayHindForm6Template;


