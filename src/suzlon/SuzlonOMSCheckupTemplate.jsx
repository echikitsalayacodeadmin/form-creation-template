import React from "react";
import {
    Document,
    Font,
    Page,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

Font.register({
    family: "Times-Roman-Normal",
    src: TimeRoman,
});

Font.register({
    family: "Times-Roman-Bold",
    src: TimeRomanBold,
});

const COMPANY_NAME = "Suzlon Energy Ltd.(OMS Div)2026";
const COMPANY_ADDRESS =
    "Gut no.216/4, 217/2, Village-Titane, Tal-Sakri, Dist-Dhule 424305.";

const styles = StyleSheet.create({
    page: {
        padding: 10,
        fontSize: 10,
        fontFamily: "Times-Roman-Normal",
        lineHeight: 1.25,
    },
    outerBorder: {
        border: "1pt solid #000",
        flex: 1,
    },
    row: {
        flexDirection: "row",
        borderBottom: "1pt solid #000",
    },
    rowLast: {
        flexDirection: "row",
    },
    cell: {
        borderRight: "1pt solid #000",
        padding: 5,
        justifyContent: "center",
    },
    cellLast: {
        padding: 5,
        justifyContent: "center",
    },
    bold: { fontFamily: "Times-Roman-Bold" },
    center: { textAlign: "center" },
    title: {
        fontFamily: "Times-Roman-Bold",
        fontSize: 11,
        textAlign: "center",
        paddingVertical: 4,
    },
    subtitle: {
        fontSize: 10,
        textAlign: "center",
        paddingBottom: 3,
    },
    sectionLabel: {
        fontFamily: "Times-Roman-Bold",
        padding: 5,
        fontSize: 10,
    },
    bodyText: {
        fontFamily: "Times-Roman-Normal",
        fontSize: 10,
    },
    fieldRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
    },
    fieldLabel: {
        fontFamily: "Times-Roman-Bold",
        fontSize: 10,
    },
    fieldValue: {
        fontFamily: "Times-Roman-Normal",
        fontSize: 10,
    },
    twoCol: {
        flexDirection: "row",
        borderBottom: "1pt solid #000",
    },
    colHalf: {
        width: "50%",
        padding: 5,
    },
    colHalfLeft: {
        width: "50%",
        borderRight: "1pt solid #000",
        padding: 5,
    },
    labRow: {
        flexDirection: "row",
        marginBottom: 2,
    },
    labLabel: {
        flexDirection: "row",
        flexWrap: "wrap",
        width: "58%",
        fontSize: 10,
    },
    labRange: {
        width: "30%",
        textAlign: "right",
        fontSize: 10,
    },
    page2Title: {
        fontFamily: "Times-Roman-Bold",
        fontSize: 11,
        textAlign: "center",
        paddingVertical: 4,
        borderBottom: "1pt solid #000",
    },
    sectionHeading: {
        fontFamily: "Times-Roman-Bold",
        padding: 5,
        borderBottom: "1pt solid #000",
        fontSize: 10,
    },
});

const Cell = ({ label, value, children, width, last = false, style }) => (
    <View style={[last ? styles.cellLast : styles.cell, width ? { width } : { flex: 1 }, style]}>
        {children != null ? (
            children
        ) : (
            <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>{label}</Text>
                {value != null && value !== "" ? (
                    <Text style={styles.fieldValue}>{value}</Text>
                ) : null}
            </View>
        )}
    </View>
);

const LabLine = ({ label, value = "", unit = "", range = "" }) => (
    <View style={styles.labRow}>
        <View style={styles.labLabel}>
            <Text style={styles.fieldLabel}>{label} : </Text>
            {(value || unit) ? (
                <Text style={styles.fieldValue}>
                    {value ? ` ${value}` : ""}{unit ? ` ${unit}` : ""}
                </Text>
            ) : null}
        </View>
        <Text style={styles.labRange}>{range ? `N:${range}` : ""}</Text>
    </View>
);

const SuzlonOMSCheckupTemplate = ({ model = {} }) => {
    const p = model.pathology || {};
    const checkUpDateValue = `${model.checkUpDateFrom || ""} To ${model.checkUpDateTo || ""}`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.outerBorder}>
                    <View style={styles.row}>
                        <View style={[styles.cellLast, { width: "100%" }]}>
                            <Text style={styles.title}>MEDICAL CHECK-UP REPORT</Text>
                            <Text style={styles.subtitle}>(ANNUAL/ PERIODIC EXAMINATION)</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.cellLast, { width: "100%" }]}>
                            <Text style={[styles.center, styles.bold]}>{COMPANY_NAME}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.cellLast, { width: "100%" }]}>
                            <Text style={styles.center}>{COMPANY_ADDRESS}</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.cellLast, { width: "100%" }]}>
                            <View style={[styles.fieldRow, styles.center]}>
                                <Text style={styles.fieldLabel}>Check-Up Date: </Text>
                                <Text style={styles.fieldValue}>{checkUpDateValue}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Cell width="75%" label="Employee Name :  " value={model.name} />
                        <Cell width="25%" last label="Sr.No :  " value={model.serialNo} />
                    </View>

                    <View style={styles.row}>
                        <Cell width="25%" label="M/S :  " value={model.maritalStatus} />
                        <Cell width="25%" label="DOJ :  " value={model.dateOfJoining} />
                        <Cell width="25%" label="AGE :  " value={model.age} />
                        <Cell width="25%" last label="Emp Code :  " value={model.empId} />
                    </View>

                    <View style={styles.row}>
                        <Cell width="33%" label="Working Since :  " value={model.workingSince} />
                        <Cell width="34%" label="Department Name :  " value={model.department} />
                        <Cell width="33%" last label="Sex :  " value={model.gender} />
                    </View>

                    <View style={styles.row}>
                        <Cell last label="Present Complaints :  " value={model.presentComplaints} />
                    </View>

                    <View style={styles.row}>
                        <Cell last label="Past History :  " value={model.pastHistory} />
                    </View>

                    <View style={styles.row}>
                        <Cell last label="Family History :  " value={model.familyHistory} />
                    </View>

                    <View style={styles.row}>
                        <Cell width="50%" label="Allergic to :  " value={model.allergicTo} />
                        <Cell width="50%" last label="Identification Mark :  " value={model.identificationMark} />
                    </View>

                    <View style={styles.row}>
                        <Cell last label="Habbits :  " value={model.habits} />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.cellLast, { width: "100%" }]}>
                            <Text style={styles.sectionLabel}>General Examination:</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Cell
                            width="25%"
                            label="Height :  "
                            value={model.height ? `${model.height} cms` : ""}
                        />
                        <Cell
                            width="25%"
                            label="Weight :  "
                            value={model.weight ? `${model.weight} kgs` : ""}
                        />
                        <Cell width="25%" label="Tonsils :  " value={model.tonsils} />
                        <Cell width="25%" last label="Nose :  " value={model.nose} />
                    </View>

                    <View style={styles.row}>
                        <Cell last>
                            <View style={styles.fieldRow}>
                                <Text style={styles.fieldLabel}>BMI: </Text>
                                <Text style={styles.fieldValue}>
                                    {model.bmi} (NL-16.50 To 24.49) {model.bmiStatus}
                                </Text>
                            </View>
                        </Cell>
                    </View>

                    <View style={styles.row}>
                        <Cell
                            width="50%"
                            label="Pulse :  "
                            value={model.pulseRate ? `${model.pulseRate} /mt(N-60 To 90)` : ""}
                        />
                        <Cell
                            width="50%"
                            last
                            label="BP :  "
                            value={
                                model.bp
                                    ? `${model.bp} / / mm of Hg (Normal Value: 90-130/60-90 mm of Hg)`
                                    : ""
                            }
                        />
                    </View>

                    <View style={styles.row}>
                        <Cell width="25%" label="Teeth :  " value={model.teeth} />
                        <Cell width="25%" label="Nails :  " value={model.nails} />
                        <Cell width="25%" label="Skin :  " value={model.skin} />
                        <Cell width="25%" last label="Throat :  " value={model.throat} />
                    </View>

                    <View style={styles.row}>
                        <Cell width="50%" label="EYE VISION :  " value={model.eyeVision} />
                        <Cell width="50%" last label="Colour Vision :  " value={model.colourVision} />
                    </View>

                    <View style={styles.row}>
                        <Cell width="50%" label="Near Right Eye" value={model.nearRightEye} />
                        <Cell width="50%" last label="Far Right Eye" value={model.farRightEye} />
                    </View>

                    <View style={styles.row}>
                        <Cell width="50%" label="Near Left Eye" value={model.nearLeftEye} />
                        <Cell width="50%" last label="Far Left Eye" value={model.farLeftEye} />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.cellLast, { width: "100%" }]}>
                            <Text style={styles.sectionLabel}>Systematic Examination:</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Cell width="33%" label="RS :  " value={model.rs} />
                        <Cell width="34%" label="CVS :  " value={model.cvs} />
                        <Cell width="33%" last label="GIT :  " value={model.git} />
                    </View>

                    <View style={styles.row}>
                        <Cell width="33%" label="CNS :  " value={model.cns} />
                        <Cell width="34%" label="GUS :  " value={model.gus} />
                        <Cell width="33%" last label="MS :  " value={model.ms} />
                    </View>

                    <View style={styles.row}>
                        <View style={[styles.cellLast, { width: "100%" }]}>
                            <Text style={styles.sectionLabel}>Other Investigation:</Text>
                        </View>
                    </View>

                    <View style={styles.row}>
                        <Cell last label="ECG :  " value={model.ecg} />
                    </View>

                    <View style={styles.row}>
                        <Cell last label="Lung Function Test(Spirometry) :  " value={model.pft} />
                    </View>

                    <View style={styles.row}>
                        <Cell last label="Audiometry :  " />
                    </View>

                    <View style={styles.row}>
                        <Cell width="50%" label="Left Ear :  " value={model.audiometryLeft} />
                        <Cell width="50%" last label="Right Ear :  " value={model.audiometryRight} />
                    </View>

                    <View style={styles.row}>
                        <Cell width="50%" label="X-Ray :  " value={model.xray} />
                        <Cell width="50%" last label="Blood Exam :  " value={model.bloodExam} />
                    </View>

                    <View style={styles.row}>
                        <Cell last label="Advice :  " value={model.advice} />
                    </View>

                    <View style={styles.rowLast}>
                        <Cell last label="Remark :  " value={model.remark} />
                    </View>
                </View>
            </Page>

            <Page size="A4" style={styles.page}>
                <View style={styles.outerBorder}>
                    <View style={styles.row}>
                        <Cell width="40%" label="Name of Employee :  " value={model.name} />
                        <Cell width="20%" label="Age :  " value={model.age ? `${model.age}Yrs` : ""} />
                        <Cell width="20%" label="Sex :  " value={model.gender} />
                        <Cell width="20%" last label="Sr.No :  " value={model.serialNo} />
                    </View>

                    <View style={styles.row}>
                        <Cell last label="Name of Company :  " value={COMPANY_NAME} />
                    </View>

                    <View style={styles.row}>
                        <Cell last>
                            <View style={styles.fieldRow}>
                                <Text style={styles.fieldLabel}>Check-Up Date :  </Text>
                                <Text style={styles.fieldValue}>{checkUpDateValue}</Text>
                            </View>
                        </Cell>
                    </View>

                    <Text style={styles.page2Title}>PATHOLOGICAL TEST</Text>
                    <Text style={[styles.subtitle, { fontFamily: "Times-Roman-Bold", borderBottom: "1pt solid #000", paddingVertical: 3 }]}>
                        Blood-Examination:
                    </Text>

                    <View style={{ borderBottom: "1pt solid #000", padding: 5 }}>
                        <Text style={styles.sectionHeading}>Haemogram</Text>
                        <View style={styles.twoCol}>
                            <View style={styles.colHalfLeft}>
                                <LabLine label="Haemoglobin" value={p.haemoglobin} unit="gms%" range="M:13-18/F:12-16" />
                                <LabLine label="RBC Count" value={p.rbc} unit="X10^6ul" range="M:4.50-5.50/F:4.00-5.00" />
                                <LabLine label="P.C.V." value={p.pcv} unit="%" range="M:42.0-52.0/F:36.0-46.0" />
                                <LabLine label="Platelet" value={p.platelet} unit="/cumm" range="M:1.5.-4.5/F:1.5-4.5" />
                                <LabLine label="E.S.R." value={p.esr} unit="mm/hr" range="M:0-15/F0-20" />
                                <LabLine label="Blood-Group" value={p.bloodGroup} />
                            </View>
                            <View style={styles.colHalf}>
                                <LabLine label="WBC Count" value={p.wbc} unit="cumm" range="4000-11,000" />
                                <LabLine label="Neutrophils" value={p.neutrophils} unit="%" range="40-70" />
                                <LabLine label="Lymphocytes" value={p.lymphocytes} unit="%" range="20-40" />
                                <LabLine label="Monocytes" value={p.monocytes} unit="%" range="00-10" />
                                <LabLine label="Eosinophils" value={p.eosinophils} unit="%" range="00-06" />
                                <LabLine label="Basophils" value={p.basophils} unit="%" range="00-01" />
                            </View>
                        </View>
                    </View>

                    <View style={{ borderBottom: "1pt solid #000", padding: 5 }}>
                        <Text style={styles.sectionHeading}>Biochemical Test</Text>
                        <View style={styles.twoCol}>
                            <View style={styles.colHalfLeft}>
                                <LabLine label="Blood-Sugar(R)" value={p.bloodSugarRandom} unit="mg/dl" range="70-140" />
                                <LabLine label="S.G.O.T" value={p.sgot} unit="IU/L" range="00-50" />
                                <LabLine label="Blood-Urea" value={p.bloodUrea} unit="mg/dl" range="10-50" />
                                <LabLine label="Sr. Cholesterol" value={p.cholesterol} unit="mg/dl" range="125-225" />
                                <LabLine label="Other Test 1" value={p.otherTest1} />
                            </View>
                            <View style={styles.colHalf}>
                                <LabLine label="Sr. Billirubin" value={p.bilirubin} unit="mg/dl" range="00-1.20" />
                                <LabLine label="S.G.P.T" value={p.sgpt} unit="IU/L" range="00-50" />
                                <LabLine label="Sr. Creatinine" value={p.creatinine} unit="mg/dl" range="00-1.50" />
                                <LabLine label="Sr. Triglyceride" value={p.triglyceride} unit="mg/dl" range="25.160" />
                                <LabLine label="Other Test 2" value={p.otherTest2} />
                            </View>
                        </View>
                    </View>

                    <View style={{ borderBottom: "1pt solid #000", padding: 5 }}>
                        <Text style={styles.sectionHeading}>Urine Examination</Text>
                        <View style={styles.twoCol}>
                            <View style={styles.colHalfLeft}>
                                <LabLine label="Colour" value={p.urineColour} />
                                <LabLine label="Proteins" value={p.urineProtein} />
                                <LabLine label="Ketones" value={p.urineKetones} />
                                <LabLine label="Occult Blood" value={p.urineOccultBlood} />
                                <LabLine label="Epithelial Cells" value={p.epithelialCells} />
                                <LabLine label="RBC" value={p.urineRbc} />
                            </View>
                            <View style={styles.colHalf}>
                                <LabLine label="Reaction" value={p.urineReaction} />
                                <LabLine label="Sugar" value={p.urineSugar} />
                                <LabLine label="Bile Salt" value={p.bileSalt} />
                                <LabLine label="Bile Pigments" value={p.bilePigments} />
                                <LabLine label="Pus Cells" value={p.pusCells} />
                                <LabLine label="Crystals" value={p.crystals} />
                            </View>
                        </View>
                    </View>

                    <View style={{ borderBottom: "1pt solid #000", padding: 5 }}>
                        <Text style={styles.sectionHeading}>Special Test</Text>
                        <View style={styles.twoCol}>
                            <View style={styles.colHalfLeft}>
                                <LabLine label="Au Ag Test" value={p.auAgTest} />
                                <LabLine label="V.D.R.L. Test" value={p.vdrlTest} />
                                <LabLine label="Other Special Test" value={p.otherSpecialTest} />
                            </View>
                            <View style={styles.colHalf}>
                                <LabLine label="Widal Test" value={p.widalTest} />
                                <LabLine label="Stool Exam" value={p.stoolExam} />
                            </View>
                        </View>
                    </View>

                    <View style={{ padding: 5 }}>
                        <View style={styles.fieldRow}>
                            <Text style={styles.fieldLabel}>Advice: </Text>
                            <Text style={styles.fieldValue}>{p.advice}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default SuzlonOMSCheckupTemplate;
