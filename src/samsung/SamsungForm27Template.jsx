import React from "react";
import {
    Document,
    Font,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";
import checkmark from "../assets/images/checkmark.png";
import dr_kunal_stamp_sign from "../assets/images/dr_kunal_stamp_sign.png";

const formatColourVisionValue = (value) => {
    if (value == null || String(value).trim() === "") return null;
    const trimmed = String(value).trim();
    if (trimmed.toLowerCase() === "nad" || trimmed.toLowerCase() === "normal")
        return "Normal";
    return "Abnormal";
};

const hasVisionRemark = (data) => {
    const remark = data?.visionRemark;
    return remark != null && String(remark).trim() !== "";
};


export const getColourVisionDisplay = (data) => {
    if (!hasVisionRemark(data)) return "NA";

    const colourVision = formatColourVisionValue(data?.colourVision);
    if (colourVision) return colourVision;

    return "Normal";
};

Font.register({
    family: "Times",
    fonts: [
        { src: TimeRoman },
        { src: TimeRomanBold, fontWeight: "bold" },
    ],
});

const styles = StyleSheet.create({
    page: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingHorizontal: 14,
        fontSize: 11,
        fontFamily: "Times",
        lineHeight: 1.45,
    },
    borderedPage: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 12,
        fontSize: 11,
        fontFamily: "Times",
        lineHeight: 1.45,
        border: "1pt solid #000",
    },
    bold: { fontWeight: "bold" },
    underline: { textDecoration: "underline" },
    center: { textAlign: "center" },
    row: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 8,
    },
    rowSplit: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    halfRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        width: "48%",
    },
    label: { marginRight: 4 },
    dotted: {
        borderBottom: "1pt dotted #000",
        flex: 1,
        minHeight: 14,
        justifyContent: "flex-end",
    },
    dottedText: {
        fontSize: 11,
        marginBottom: 1,
    },
    dottedBlock: {
        borderBottom: "1pt dotted #000",
        minHeight: 22,
        marginTop: 3,
        marginBottom: 7,
    },
    checkbox: {
        width: 10,
        height: 10,
        border: "1pt solid #000",
        marginRight: 4,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 8,
    },
    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    table: {
        border: "1pt solid #000",
        marginTop: 6,
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "1pt solid #000",
    },
    tableRowLast: {
        flexDirection: "row",
    },
    tableHeaderCell: {
        flex: 1,
        borderRight: "1pt solid #000",
        padding: 4,
        textAlign: "center",
        fontWeight: "bold",
        backgroundColor: "#f0f0f0",
        fontSize: 10,
    },
    tableCell: {
        flex: 1,
        borderRight: "1pt solid #000",
        padding: 4,
        textAlign: "center",
        fontSize: 10,
        minHeight: 22,
    },
    tableCellLast: {
        flex: 1,
        padding: 4,
        textAlign: "center",
        fontSize: 10,
        minHeight: 22,
    },
    tableLabelCell: {
        width: 78,
        borderRight: "1pt solid #000",
        padding: 4,
        fontSize: 10,
        fontWeight: "bold",
    },
    sectionTitle: {
        fontWeight: "bold",
        fontSize: 11,
        marginTop: 9,
        marginBottom: 6,
    },
    serialNo: {
        textAlign: "right",
        marginBottom: 6,
        fontSize: 11,
    },
    signatureBlock: {
        marginTop: 28,
    },
});

const DottedField = ({ value = "", style }) => (
    <View style={[styles.dotted, style]}>
        <Text style={styles.dottedText}>{value || " "}</Text>
    </View>
);


const DottedFieldImage = ({ value = "", style }) => (
    <View style={[styles.dotted, style]}>
        <Image src={value} style={{ width: 100, height: 70 }} />
    </View>
);

const CheckBox = ({ checked, label }) => (
    <View style={styles.checkboxRow}>
        <View style={styles.checkbox}>
            {checked && <Image src={checkmark} style={{ width: 10, height: 10 }} />}
        </View>
        <Text style={{ marginLeft: 4 }}>{label}</Text>
    </View>
);

const formatDate = (value) =>
    value && dayjs(value).isValid() ? dayjs(value).format("DD-MMM-YYYY") : "";

const formatDOB = (value) =>
    value && dayjs(value).isValid() ? dayjs(value).format("DD/MM/YYYY") : "";

const getTestStatus = (data = {}) => ({
    physical: Boolean(data?.height || data?.weight || data?.vitalsCreatedDate),
    pft: Boolean(data?.pftUrl),
    xray: Boolean(data?.xrayUrl || data?.xrayFilmUrl),
    cbc: Boolean(data?.bloodTestUrl),
    vision: Boolean(
        data?.nearVision ||
        data?.distanceVision ||
        data?.colorVision ||
        data?.visionUrl
    ),
    audiometry: Boolean(data?.audiometryUrl),
});

const markDone = (done) => (done ? "Yes" : "No");

const SamsungForm27Template = ({ data = {} }) => {
    const isMale = data?.gender === "MALE";
    const isFemale = data?.gender === "FEMALE";
    const tests = getTestStatus(data);
    const examDate = formatDate(data?.vitalsCreatedDate);
    const dobOrAge = data?.dateOfBirth
        ? formatDOB(data.dateOfBirth)
        : data?.age
            ? `${data.age} Years`
            : "";

    return (
        <Document>
            <Page size="A4" style={styles.borderedPage}>
                <Text style={styles.serialNo}>
                    Serial No. {data?.empId || "................"}
                </Text>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableLabelCell}> </Text>
                        {["Physical", "PFT", "X Ray", "CBC", "Vision", "Audiometry"].map(
                            (header) => (
                                <Text key={header} style={styles.tableHeaderCell}>
                                    {header}
                                </Text>
                            )
                        )}
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableLabelCell}>Applicable</Text>
                        <Text style={styles.tableCell}>Yes</Text>
                        <Text style={styles.tableCell}>Yes</Text>
                        <Text style={styles.tableCell}>Yes</Text>
                        <Text style={styles.tableCell}>Yes</Text>
                        <Text style={styles.tableCell}>Yes</Text>
                        <Text style={styles.tableCellLast}>Yes</Text>
                    </View>
                    <View style={styles.tableRowLast}>
                        <Text style={styles.tableLabelCell}>Completed</Text>
                        <Text style={styles.tableCell}>{markDone(data.height)}</Text>
                        <Text style={styles.tableCell}>{markDone(data.pft)}</Text>
                        <Text style={styles.tableCell}>{markDone(data.xray)}</Text>
                        <Text style={styles.tableCell}>{markDone(data.bloodTest)}</Text>
                        <Text style={styles.tableCell}>{markDone(data.visionRemark)}</Text>
                        <Text style={styles.tableCellLast}>
                            {markDone(data.audiometry)}
                        </Text>
                    </View>
                </View>

                <Text style={[styles.center, styles.bold, { fontSize: 17, marginTop: 8 }]}>
                    FORM 27
                </Text>
                <Text style={[styles.center, { fontSize: 10, marginTop: 3 }]}>
                    (Prescribed under schedule specified under Rule 109)
                </Text>
                <Text
                    style={[
                        styles.center,
                        styles.bold,
                        styles.underline,
                        { fontSize: 14, marginTop: 5, marginBottom: 12 },
                    ]}
                >
                    HEALTH REGISTER
                </Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Date of Exam</Text>
                    <DottedField value={examDate} />
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Employee ID : / Contract Agency :</Text>
                    <DottedField value={data?.empId || ""} />
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Name of employee :</Text>
                    <DottedField value={data?.name || ""} />
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Father&apos;s / Mother&apos;s name :</Text>
                    <DottedField
                        value={data?.fathersName || ""}
                    />
                </View>

                <View style={styles.rowSplit}>
                    <View style={[styles.halfRow, styles.checkboxRow]}>
                        <Text style={styles.label}>Sex-</Text>
                        <CheckBox checked={isMale} label="Male /" />
                        <CheckBox checked={isFemale} label="Female" />
                    </View>
                    <View style={styles.halfRow}>
                        <Text style={styles.label}>Age / Date of Birth :</Text>
                        <DottedField value={dobOrAge} />
                    </View>
                </View>

                <View style={styles.rowSplit}>
                    <View style={styles.halfRow}>
                        <Text style={styles.label}>Plant :</Text>
                        <DottedField value={data?.address || ""} />
                    </View>
                    <View style={styles.halfRow}>
                        <Text style={styles.label}>Department :</Text>
                        <DottedField value={data?.department || ""} />
                    </View>
                </View>

                <View style={styles.rowSplit}>
                    <View style={styles.halfRow}>
                        <Text style={styles.label}>Designation :</Text>
                        <DottedField value={data?.designation || ""} />
                    </View>
                    <View style={styles.halfRow}>
                        <Text style={styles.label}>Date of joining :</Text>
                        <DottedField
                            value={formatDate(data?.dateOfJoining) || ""}
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Nature of work:</Text>
                    <DottedField value={data?.natureOfWork || data?.designation || ""} />
                </View>

                <Text style={{ marginTop: 8, marginBottom: 6, fontSize: 10 }}>
                    Past work history (in chronological order, most recent being first) [
                    <Text style={styles.bold}> </Text>] Yes / [ <Text style={styles.bold}> </Text>
                    ] NO
                </Text>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        {[
                            "Type of industry",
                            "Duration",
                            "Nature of work",
                            "Possible Exposures",
                        ].map((header, index) => (
                            <Text
                                key={header}
                                style={
                                    index === 3
                                        ? styles.tableCellLast
                                        : styles.tableHeaderCell
                                }
                            >
                                {header}
                            </Text>
                        ))}
                    </View>
                    <View style={styles.tableRowLast}>
                        <Text style={styles.tableCell}> </Text>
                        <Text style={styles.tableCell}> </Text>
                        <Text style={styles.tableCell}> </Text>
                        <Text style={styles.tableCellLast}> </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Social history</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>a. Marital history :</Text>
                    <DottedField value={data?.maritalStatus || ""} />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>b. Tobacco / Alcohol usage :</Text>
                    <DottedField value={data?.healthHistoryFormData?.tobaccoHabit || data?.healthHistoryFormData?.alcoholHabit || ""} />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>c. Past medical history :</Text>
                    <DottedField value={""} />
                </View>

                <Text style={styles.sectionTitle}>
                    Present medical complaint, if any:
                </Text>
                <View style={styles.dottedBlock}>
                    <Text>{data?.healthHistoryFormData?.medicalCondition || ""}</Text>
                </View>
                <View style={styles.dottedBlock}>
                    <Text> </Text>
                </View>
            </Page>

            <Page size="A4" style={styles.page}>
                <Text style={styles.sectionTitle}>Clinical examination:</Text>

                <View style={styles.rowSplit}>
                    <View style={styles.halfRow}>
                        <Text style={styles.label}>Height :</Text>
                        <DottedField value={data?.height ? `${data.height} cm` : ""} />

                    </View>
                    <View style={[styles.halfRow, { width: "30%" }]}>
                        <Text style={styles.label}>Weight:</Text>
                        <DottedField value={data?.weight ? `${data.weight} Kg` : ""} />
                    </View>
                    <View style={[styles.halfRow, { width: "22%" }]}>
                        <Text style={styles.label}>BMI:</Text>
                        <DottedField value={data?.bmi || ""} />
                    </View>
                </View>

                <View style={styles.rowSplit}>
                    <View style={styles.halfRow}>
                        <Text style={styles.label}>Pulse Rate :</Text>
                        <DottedField value={data?.pulseRate ? `${data.pulseRate} bpm` : ""} />
                    </View>
                    <View style={styles.halfRow}>
                        <Text style={styles.label}>Blood Pressure:</Text>
                        <DottedField value={data?.bp ? `${data.bp} mmHg` : ""} />
                    </View>
                </View>

                <Text style={{ marginBottom: 10 }}>
                    Pallor / Cyanosis / Jaundice / Edema / Clubbing / Lymph nodes / others,
                    specify : None
                </Text>

                <Text style={styles.sectionTitle}>Visual examination:</Text>
                <View style={styles.rowSplit}>
                    <View style={styles.halfRow}>
                        <Text style={styles.label}>Near vision :</Text>
                        <DottedField value={`Right : ${data.nearRightEyeSight} Left : ${data.nearLeftEyeSight}`} />
                    </View>
                    <View style={styles.halfRow}>
                        <Text style={styles.label}>Distance vision:</Text>
                        <DottedField
                            value={`Right : ${data.farRightEyeSight} Left : ${data.farLeftEyeSight}`}
                        />
                    </View>
                </View>
                <View style={styles.rowSplit}>
                    <View style={styles.halfRow}>
                        <Text style={styles.label}>Color vision :</Text>
                        <DottedField value={getColourVisionDisplay(data)} />
                    </View>
                    <View style={styles.halfRow}>
                        <Text style={styles.label}>Eye signs :</Text>
                        <DottedField value={data?.eyeSigns || "NA"} />
                    </View>
                </View>

                <Text style={{ marginTop: 10, marginBottom: 10 }}>
                    Systemic examination (based upon exposures)
                </Text>

                <Text style={styles.sectionTitle}>Investigations:</Text>
                <Text style={{ marginBottom: 2 }}>Pulmonary Function Testing</Text>
                <View style={styles.dottedBlock}>
                    <Text>{data?.pftUrl ? "Yes" : "NA"}</Text>
                </View>

                <Text style={styles.sectionTitle}>Clinical diagnosis</Text>
                <View style={styles.dottedBlock}>
                    <Text>{"Normal"}</Text>
                </View>

                <Text style={styles.sectionTitle}>Recommendations</Text>
                <View style={styles.dottedBlock}>
                    <Text>{"No"}</Text>
                </View>

                <Text style={styles.sectionTitle}>Audiometry examination:</Text>
                <View style={styles.dottedBlock}>
                    <Text>{data?.audiometryUrl ? "Yes" : "NA"}</Text>
                </View>

                <View style={styles.signatureBlock}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Signature of employee:</Text>
                        <DottedFieldImage value={'https://storage-echikitsalaya.s3.ap-south-1.amazonaws.com/org/33525031-d147-41e3-8dc6-c330be785f88/SIGNATURE/1cc929ea-9816-4bdb-9a73-c24aae856a7a/IMG_20260623_185146.jpg'} />
                    </View>
                    <View style={[styles.row, { marginTop: 14 }]}>
                        <Text style={styles.label}>
                            Signature of Certifying Surgeon with date:
                        </Text>
                        <DottedFieldImage value={dr_kunal_stamp_sign} />
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default SamsungForm27Template;
