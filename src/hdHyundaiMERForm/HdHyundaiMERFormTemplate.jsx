import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from "@react-pdf/renderer";
import PersonalInformationSection from "./comps/PersonalInformationSection";
import CurrentPastHistorySection from "./comps/CurrentPastHistorySection";
import OfficialUseSection from "./comps/OfficialUseSection";
import OtherTestsSection from "./comps/OtherTestsSection";
import PathologyTestsSection from "./comps/PathologyTestsSection";
import AdviceRemarksSection from "./comps/AdviceRemarksSection";
import FitnessCertificateSection from "./comps/FitnessCertificateSection";

const styles = StyleSheet.create({
    page: {
        padding: 10,
        fontSize: 9,
        fontFamily: "Helvetica",
    },

    // Header
    header: {
        textAlign: "center",
        marginBottom: 6,
    },
    title: {
        fontSize: 12,
        fontWeight: "bold",
        textDecoration: "underline",
    },

    section: {
        border: "1 solid black",
        marginBottom: 6,
    },

    sectionTitle: {
        borderBottom: "1 solid black",
        padding: 3,
        fontWeight: "bold",
        backgroundColor: "#f2f2f2",
    },

    row: {
        flexDirection: "row",
    },

    cell: {
        borderRight: "1 solid black",
        borderBottom: "1 solid black",
        padding: 3,
    },

    cellNoBorderRight: {
        borderBottom: "1 solid black",
        padding: 3,
    },

    label: {
        width: "40%",
    },

    value: {
        width: "60%",
    },

    col3: {
        width: "33.33%",
        borderRight: "1 solid black",
    },

    col3Last: {
        width: "33.33%",
    },

    tableRow: {
        flexDirection: "row",
    },

    tableCell: {
        borderRight: "1 solid black",
        borderBottom: "1 solid black",
        padding: 3,
        flex: 1,
    },

    tableCellLast: {
        borderBottom: "1 solid black",
        padding: 3,
        flex: 1,
    },

    footer: {
        border: "1 solid black",
        padding: 10,
        textAlign: "center",
        marginTop: 8,
    },

    bold: {
        fontWeight: "bold",
    },
});

const safe = (val, suffix = "") => {
    if (val === undefined || val === null || val === "") return "";
    return `${val}${suffix}`;
};

const HdHyundaiMERFormTemplate = ({ data }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.title}>
                    MEDICAL HEALTH CHECK-UP SUMMARY
                </Text>
            </View>

            {/* PERSONAL INFORMATION */}

            <PersonalInformationSection
                data={{
                    name: safe(data?.name),
                    ageSex: safe(data?.age) && safe(data?.gender)
                        ? `${safe(data?.age)} / ${safe(data?.gender)}`
                        : "",
                    contact: safe(data?.mobile),
                    companyName:
                        data?.employmentType === "CONTRACTOR"
                            ? safe(data?.contractorName)
                            : "HD Hyundai Pvt Ltd",
                    designation: safe(data?.designation),
                    employeeId: safe(data?.empId),
                }}
            />


            {/* CURRENT & PAST HISTORY */}

            <CurrentPastHistorySection
                data={{
                    polio: "No",
                    surgery: "No",
                    psychiatric: "No",
                    tobacco: safe(data?.healthHistoryFormData?.tobaccoHabit),

                    asthma: "No",
                    allergies: "No",
                    hypertension: "No",
                    smoking: safe(data?.healthHistoryFormData?.smokingHabit),

                    tb: "No",
                    heartDisease: "No",
                    diabetes: "No",
                    alcohol: safe(data?.healthHistoryFormData?.alcoholHabit),

                    epilepsy: "No",
                    pastComplaints: "No",
                    anyOther: "No",

                    yesDetails: "",
                    familyHistory: safe(data?.healthHistoryFormData?.familyHistory),
                }}
            />



            {/* OFFICIAL USE */}

            <OfficialUseSection
                data={{
                    height: safe(data?.height, " cm"),
                    weight: safe(data?.weight, " kg"),
                    pulse: safe(data?.pulseRate, " /min"),
                    bp: safe(data?.bp, " /mmHg"),
                    ear: "RT:N LT:N",
                    nose: "Normal",
                    throat: "Normal",
                    teeth: "Normal",
                    nails: "Normal",
                    skin: "Normal",
                    lymphNodes: "Nonpalpable",
                    hernia: "No",
                    phymosis: "No",

                    dvRt: safe(data?.farRightEyeSight),
                    dvLt: safe(data?.farLeftEyeSight),
                    nvRt: safe(data?.nearRightEyeSight),
                    nvLt: safe(data?.nearLeftEyeSight),
                    squint: "No",
                    nystagmus: "No",
                    colourBlindness: "No",
                    rs: "Normal",
                    cns: "Normal",
                    cvs: "Normal",
                    gis: "Normal",
                    musculo: "Normal",

                    bmi: safe(data?.bmi),
                    idealWeight: safe("72", " kg"),
                    bodyType: "",
                    excessWeight: "",
                    typhoid: "Not Done",
                    cholera: "Not Done",
                    hepatitis: "Not Done",
                    tt: "Done",
                    stool: "NA",
                }}
            />



            {/* OTHER TESTS */}

            <OtherTestsSection
                data={{
                    audiometry: "Normal",
                    lungFunction: "Normal",
                    ecg: "Normal",
                    xray: "Normal",
                }}
            />



            {/* PATHOLOGY */}

            <PathologyTestsSection
                data={{
                    hb: safe(data?.cholestrolData?.["HB"], " gm/dl"),
                    hbFemaleRange: "(F:12-15gm/dl)",
                    wbc: safe(data?.cholestrolData?.["WBC"], " uL"),
                    platelet: safe(data?.cholestrolData?.["PLATELET"], ' uL'),

                    bslr: safe(
                        data?.cholestrolData?.["BLOOD SUGAR RANDOM"],
                        " mg/dl"
                    ),

                    bloodGroup: safe(data?.cholestrolData?.['Blood Group']),

                    urineSugar: safe(
                        data?.cholestrolData?.["URINE.GLUCOSE"], ' mg/dL'
                    ),

                    cholesterol: safe(
                        data?.cholestrolData?.["S.CHOLESTEROL"], " mg/dL"
                    ),

                    creatinine: safe(
                        data?.cholestrolData?.["S.CREATININE"], " mg/dL"
                    ),

                    sgpt: safe(data?.cholestrolData?.["SGPT"], " U/L"),

                    sgot: safe(data?.cholestrolData?.["SGOT"], " U/L"),

                    stool: "Normal",
                }}
            />


            <AdviceRemarksSection
                data={{
                    advice: "",
                    remarks: "FIT",
                }}
            />


            <FitnessCertificateSection
                data={{
                    employeeName: data?.name,
                }}
            />
        </Page>
    </Document>
);

export default HdHyundaiMERFormTemplate;
