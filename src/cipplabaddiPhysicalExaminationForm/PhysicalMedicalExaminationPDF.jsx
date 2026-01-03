// MedicalExamFormWithBorders.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import CiplaBaddiLogo from "./CiplaBaddiLogo.png";
import token1Sign from "./token1Sign.png";
import aditiThakur from "./aditiThakur.png";
import arjunPrasher from "./arjunPrasher.png";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";
import tick from "./tick.png";

Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

const styles = StyleSheet.create({
  page: {
    padding: 18,
    fontSize: 10,
    fontFamily: "Times-Roman-Normal",
  },
  title: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    fontFamily: "Times-Roman-Bold",
  },
  subheading: {
    textAlign: "center",
    marginBottom: 8,
    fontSize: 10,
  },

  // Table container with outer border
  table: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    marginBottom: 8,
  },

  // Generic row: we won't set borderBottom here, cells will have bottom border
  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  // Generic cell with right and bottom borders
  cell: {
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderRightStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },

  // Cells with different widths
  cellLarge: {
    flex: 2,
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
  },
  cellMedium: {
    flex: 1.3,
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
  },
  cellSmall: {
    flex: 0.9,
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: "#000",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
  },

  // For last cell in a row (no right border)
  cellLast: {
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },

  // Section header that spans full width (no right border between pseudo-cells)
  sectionHeaderContainer: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    borderTopStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    padding: 6,
    backgroundColor: "#fff",
  },
  sectionHeaderText: {
    fontWeight: "bold",
    fontFamily: "Times-Roman-Bold",
  },

  remarkBox: {
    marginTop: 8,
    paddingTop: 6,
    paddingBottom: 6,
  },

  fitRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 18,
  },
  fitBox: {
    borderWidth: 1,
    borderColor: "#000",
    borderStyle: "solid",
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: 110,
    textAlign: "center",
  },

  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 6,
  },

  footerCenter: { textAlign: "center", marginTop: 12 },
  footerRight: { position: "absolute", bottom: 18, right: 18, fontSize: 9 },
});

export default function MedicalExamFormWithBorders({ data = {}, fit }) {
  console.log({ fit });
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Image
            src={CiplaBaddiLogo}
            style={{ height: 40, width: 50, position: "absolute", top: -10 }}
          />
        </View>
        <Text style={styles.title}>Physical Medical Examination</Text>

        <Text style={styles.subheading}>
          <Text style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}>
            Type of Medical Examination:{" "}
          </Text>
          Pre-employment/ Half Yearly/{" "}
          <Text style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}>
            Annual
          </Text>
        </Text>

        {/* TABLE START */}
        <View style={[styles.table, { borderRightWidth: 0 }]}>
          {/* Row 1 */}
          <View style={styles.row}>
            <View
              style={[
                styles.cellLarge,
                { flexDirection: "row", gap: 8, alignItems: "center" },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                Name:
              </Text>
              <Text>{data?.name || ""}</Text>
            </View>
            <View
              style={[
                styles.cellMedium,
                styles.cellLast,
                { flexDirection: "row", gap: 8, alignItems: "center" },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                Date:
              </Text>
              <Text>{data?.vitalsCreatedDate || ""}</Text>
            </View>
          </View>

          {/* Row 2 */}
          <View style={styles.row}>
            <View
              style={[
                styles.cellLarge,
                { flexDirection: "row", gap: 8, alignItems: "center" },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                Designation:
              </Text>
              <Text>{data?.designation || "NA"}</Text>
            </View>
            <View
              style={[
                styles.cellMedium,
                styles.cellLast,
                { flexDirection: "row", gap: "10px" },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                Age:
              </Text>
              <Text
                style={{
                  borderBottom: 1,
                  borderBottomColor: "#000",
                  width: 35,
                  minHeight: 10,
                  marginRight: 20,
                  textAlign: "center",
                }}
              >
                {data?.age || "NA"}
              </Text>
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                {data?.gender || "NA"}
              </Text>
            </View>
          </View>

          {/* Row 3 */}
          <View style={styles.row}>
            <View
              style={[
                styles.cellLarge,
                { flexDirection: "row", gap: "10px", alignItems: "center" },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                E code/Contractor Name:
              </Text>
              <Text
                style={{
                  maxWidth: "60mm", // 🔥 required for wrapping
                  lineHeight: 1.2,
                  wordBreak: "break-word", // handles long words
                }}
              >
                <Text>{data?.empId || ""}</Text> /{" "}
                {data?.contractorName || "NA"}
              </Text>
            </View>
            <View
              style={[
                styles.cellMedium,
                styles.cellLast,
                { flexDirection: "row", gap: "10px", alignItems: "center" },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                Unit/Department:
              </Text>
              <Text>{data?.department || "NA"}</Text>
            </View>
          </View>

          {/* Row 4 */}
          <View style={styles.row}>
            <View
              style={[
                styles.cellLarge,
                {
                  flexDirection: "row",
                  gap: "10px",
                  alignItems: "center",
                  borderBottomWidth: 0,
                },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                Blood Group:
              </Text>
              <Text>{data?.bloodGroup || "NA"}</Text>
            </View>
            <View
              style={[
                styles.cellMedium,
                styles.cellLast,
                {
                  flexDirection: "row",
                  gap: "10px",
                  alignItems: "center",
                  borderBottomWidth: 0,
                },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                Marital Status:
              </Text>
              <Text>{data?.maritalStatus || "NA"}</Text>
            </View>
          </View>

          {/* Section Header: Medical History (full width) */}
          <View style={[styles.row, { borderRightWidth: 1 }]}>
            <View style={{ flex: 1 }}>
              <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionHeaderText}>Medical History</Text>
              </View>
            </View>
          </View>

          {/* Complaints row (single wide cell) */}
          <View style={styles.row}>
            <View style={[styles.cellSmall, { flex: 0.2 }]}>
              <Text style={{ fontWeight: "bold" }}>Complaints (if any)</Text>
            </View>
            <View
              style={[
                {
                  flex: 1,
                  padding: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  borderRightWidth: 1,
                },
              ]}
            >
              <Text style={{ fontWeight: "bold" }}>NA</Text>
            </View>
          </View>

          {/* Past Medical vs HTN/DM... */}
          <View style={styles.row}>
            <View style={[styles.cellLarge]}>
              <Text style={{ fontWeight: "bold" }}>
                Past Medical/Occupational History : NA
              </Text>
            </View>
            <View style={[styles.cellMedium, styles.cellLast]}>
              <Text>HTN/DM/CAD/TB/Other- NA</Text>
            </View>
          </View>

          {/* Addictions / Allergy */}
          <View style={styles.row}>
            <View
              style={[styles.cellLarge, { flexDirection: "row", gap: "10px" }]}
            >
              <Text style={{ fontWeight: "bold" }}>
                Addictions (Smoking/Alcohol)
              </Text>
              <Text style={{ fontWeight: "bold" }}>
                {data?.healthHistoryFormData?.alcoholHabit
                  ? `${data?.healthHistoryFormData?.alcoholHabit || "NA"}`
                  : "NA"}
                {/* {data?.healthHistoryFormData?.alcoholHabit
                  ? `Alcohol : ${
                      data?.healthHistoryFormData?.alcoholHabit || "NA"
                    }`
                  : "NA"} */}
              </Text>
              <Text>/</Text>
              <Text style={{ fontWeight: "bold" }}>
                {data?.healthHistoryFormData?.smokingHabit
                  ? `${data?.healthHistoryFormData?.smokingHabit || "NA"}`
                  : "NA"}
                {/* {data?.healthHistoryFormData?.smokingHabit
                  ? `Smoking : ${
                      data?.healthHistoryFormData?.smokingHabit || "NA"
                    }`
                  : "NA"} */}
              </Text>
            </View>
            <View
              style={[
                styles.cellMedium,
                styles.cellLast,
                { flexDirection: "row", gap: "10px" },
              ]}
            >
              <Text style={{ fontWeight: "bold" }}>Allergy:</Text>
              <Text style={{ fontWeight: "bold" }}>{"NA"}</Text>
            </View>
          </View>

          {/* Any other condition / Family History */}
          <View style={styles.row}>
            <View style={[styles.cellLarge, { borderBottomWidth: 0 }]}>
              <Text style={{ fontWeight: "bold" }}>
                Any other condition:{" "}
                {data?.healthHistoryFormData?.medicalCondition || "NA"}
              </Text>
            </View>
            <View
              style={[
                styles.cellMedium,
                styles.cellLast,
                { borderBottomWidth: 0 },
              ]}
            >
              <Text style={{ fontWeight: "bold" }}>
                Family History:{" "}
                {data?.healthHistoryFormData?.familyHistory || "NA"}{" "}
              </Text>
            </View>
          </View>

          {/* Section Header: Physical Medical Examination */}
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <View
                style={[styles.sectionHeaderContainer, { borderRightWidth: 1 }]}
              >
                <Text style={styles.sectionHeaderText}>
                  Physical Medical Examination (Systemic Examination)
                </Text>
              </View>
            </View>
          </View>

          {/* General Appearance / Height Weight */}
          <View style={styles.row}>
            <View style={[styles.cellLarge]}>
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                General Appearance
              </Text>
            </View>
            <View
              style={[
                styles.cellMedium,
                styles.cellLast,
                { flexDirection: "row", gap: "10px" },
              ]}
            >
              <Text style={{ fontWeight: "bold" }}>Height (cms): </Text>
              <Text
                style={{
                  borderBottom: 1,
                  borderBottomColor: "#000",
                  width: 35,
                  minHeight: 10,
                  textAlign: "center",
                  marginLeft: 10,
                }}
              >
                {data?.height || ""}
              </Text>
              <Text style={{ fontWeight: "bold" }}>Weight (kgs): </Text>
              <Text
                style={{
                  borderBottom: 1,
                  borderBottomColor: "#000",
                  width: 35,
                  minHeight: 10,
                  marginRight: 20,
                  textAlign: "center",
                  marginLeft: 10,
                }}
              >
                {data?.weight || ""}
              </Text>
            </View>
          </View>

          {/* BMI */}
          <View style={styles.row}>
            <View style={[styles.cellLarge]}>
              <Text style={{ fontWeight: "bold" }}>BMI: {data?.bmi || ""}</Text>
            </View>
            <View style={[styles.cellMedium, styles.cellLast]} />
          </View>

          {/* Pulse / BP */}

          <View style={styles.row}>
            <View
              style={[styles.cellLarge, { flexDirection: "row", gap: "10px" }]}
            >
              <Text style={{ fontWeight: "bold" }}>Pulse :</Text>
              <Text
                style={{
                  borderBottom: 1,
                  borderBottomColor: "#000",
                  width: 35,
                  minHeight: 10,
                  textAlign: "center",
                  marginLeft: 10,
                }}
              >
                {data?.pulseRate || ""}
              </Text>
              <Text>/min</Text>
            </View>
            <View
              style={[
                styles.cellMedium,
                styles.cellLast,
                { flexDirection: "row", gap: "10px" },
              ]}
            >
              <Text>BP:</Text>
              <Text
                style={{
                  borderBottom: 1,
                  borderBottomColor: "#000",
                  width: 35,
                  minHeight: 10,
                  textAlign: "center",
                  marginLeft: 10,
                }}
              >
                {data?.bp || ""}
              </Text>
              <Text>mm of Hg</Text>
            </View>
          </View>

          {/* Eye */}
          <View style={styles.row}>
            <View
              style={[
                {
                  flex: 1,
                  padding: 6,
                  borderRightWidth: 1,
                  borderRightColor: "#000",
                  borderRightStyle: "solid",
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                },
              ]}
            >
              <View
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontFamily: "Times-Roman-Bold",
                    }}
                  >
                    Eye :
                  </Text>
                </View>
                <View>
                  <View style={{ flexDirection: "row", gap: "10px" }}>
                    <Text>Visual Acuity: </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <Text>Far (R)</Text>

                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: "#000",
                          width: 50,
                          minHeight: 12,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ textAlign: "center" }}>
                          {data?.farRightEyeSight ||
                            data?.farRightEyeSightWithGlasses ||
                            ""}
                        </Text>
                      </View>

                      <Text>(L)</Text>

                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: "#000",
                          width: 50,
                          minHeight: 12,
                          justifyContent: "center",
                        }}
                      >
                        <Text style={{ textAlign: "center" }}>
                          {data?.farLeftEyeSight ||
                            data?.farLeftEyeSightWithGlasses ||
                            ""}
                        </Text>
                      </View>
                    </View>

                    <Text>Colour Vision: </Text>
                    <Text
                      style={{
                        borderBottom: 1,
                        borderBottomColor: "#000",
                        width: 100,
                        minHeight: 10,
                        textAlign: "center",
                      }}
                    >
                      {"Normal"}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text>Near (R)</Text>

                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#000",
                        width: 50,
                        minHeight: 12,
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ textAlign: "center" }}>
                        {data?.nearRightEyeSight ||
                          data?.nearRightEyeSightWithGlasses ||
                          ""}
                      </Text>
                    </View>

                    <Text>(L)</Text>

                    <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#000",
                        width: 50,
                        minHeight: 12,
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ textAlign: "center" }}>
                        {data?.nearLeftEyeSight ||
                          data?.nearLeftEyeSightWithGlasses ||
                          ""}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* ENT header */}
          <View style={styles.row}>
            <View
              style={[
                {
                  flex: 1,
                  padding: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  borderRightWidth: 1,
                  flexDirection: "row",
                  gap: "10px",
                },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                ENT:
              </Text>
              <Text>NAD</Text>
            </View>
          </View>

          {/* Chest & Respiratory */}
          <View style={styles.row}>
            <View
              style={[
                {
                  flex: 1,
                  padding: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  borderRightWidth: 1,
                  flexDirection: "row",
                  gap: "10px",
                },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                Chest & Respiratory System:
              </Text>
              <Text>{"NAD"}</Text>
            </View>
          </View>

          {/* Cardiovascular */}
          <View style={styles.row}>
            <View
              style={[
                {
                  flex: 1,
                  padding: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  borderRightWidth: 1,
                  flexDirection: "row",
                  gap: "10px",
                },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                Cardiovascular System:
              </Text>
              <Text>{"NAD"}</Text>
            </View>
          </View>

          {/* Abdomen & Genitourinary */}
          <View style={styles.row}>
            <View
              style={[
                {
                  flex: 1,
                  padding: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  borderRightWidth: 1,
                  flexDirection: "row",
                  gap: "10px",
                },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                Abdomen & Genitourinary System:
              </Text>
              <Text>{"NAD"}</Text>
            </View>
          </View>

          {/* Central Nervous System */}
          <View style={styles.row}>
            <View
              style={[
                {
                  flex: 1,
                  padding: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  borderRightWidth: 1,
                },
              ]}
            >
              <View
                style={{
                  display: "flex",
                  gap: "10px",
                  flexDirection: "row",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontFamily: "Times-Roman-Bold",
                    }}
                  >
                    Central Nervous System:
                  </Text>
                </View>
                <View>
                  <Text>
                    H/o of Epilepsy: Yes/No; If yes give details{" "}
                    {data?.doctorConsultationFormData
                      ?.centralNervousSystemStatus || "NAD"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Skin */}
          <View style={styles.row}>
            <View
              style={[
                {
                  flex: 1,
                  padding: 6,
                  borderBottomWidth: 1,
                  borderBottomColor: "#000",
                  borderBottomStyle: "solid",
                  borderRightWidth: 1,
                  flexDirection: "row",
                  gap: "10px",
                },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                Skin Examination:
              </Text>
              <Text>
                {data?.doctorConsultationFormData?.skinExaminationStatus ||
                  "NAD"}
              </Text>
            </View>
          </View>

          {/* Gynaecology */}
          <View style={styles.row}>
            <View
              style={[
                {
                  flex: 1,
                  padding: 6,
                  borderBottomWidth: 0,
                  borderBottomColor: "#000",
                  borderRightWidth: 1,
                  flexDirection: "row",
                  gap: "10px",
                },
              ]}
            >
              <Text
                style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}
              >
                Gynaecology & Obstetrics Examination (For females only):
              </Text>
              <Text>{data?.gender === "MALE" ? "NA" : "NAD"}</Text>
            </View>
          </View>
        </View>
        {/* TABLE END */}

        {/* Remarks section (outside the inner table but still in page) */}
        <View style={[styles.remarkBox]}>
          <Text style={{ fontWeight: "bold", fontFamily: "Times-Roman-Bold" }}>
            Remarks:
          </Text>
          <Text style={{ marginTop: 6 }}>
            I hereby certify that I have examined{" "}
            <Text
              style={{
                textDecoration:
                  data?.gender === "FEMALE" ? "line-through" : "none",
              }}
            >
              Mr
            </Text>
            /
            <Text
              style={{
                textDecoration:
                  data?.gender === "MALE" ? "line-through" : "none",
              }}
            >
              Ms
            </Text>{" "}
            <Text style={{ textDecoration: "underline" }}>
              {data?.name || ""}
            </Text>{" "}
            for{" "}
            <Text style={{ textDecoration: "line-through" }}>
              pre-employment
            </Text>
            /periodical medical examination, I have{" "}
            <Text style={{ textDecoration: "line-through" }}>found</Text>/not
            found any disease, illness, contagious illness, tuberculosis or any
            other significant abnormalities during the medical examination.
          </Text>
          <View style={{ flexDirection: "row", gap: "5px" }}>
            <Text style={{ marginTop: 6 }}>
              I certify that employee is medically
            </Text>
            <Text
              style={{
                borderBottom: 1,
                borderBottomColor: "#000",
                paddingBottom: 1,
                marginTop: 6,
              }}
            >
              Fit
              {/* with Consultation advised with FMO & Follow up. */}
            </Text>
          </View>
        </View>

        {/* Fit / Unfit */}
        <View style={styles.fitRow}>
          <View
            style={[
              styles.fitBox,
              { alignItems: "center", flexDirection: "row" },
            ]}
          >
            {fit === "fit" && (
              <Image
                src={tick}
                style={{ width: 12, height: 12, marginRight: 4 }}
              />
            )}
            <Text>Fit</Text>
          </View>

          <View
            style={[
              styles.fitBox,
              { alignItems: "center", flexDirection: "row" },
            ]}
          >
            {fit === "unfit" && (
              <Image
                src={tick}
                style={{ width: 12, height: 12, marginRight: 4 }}
              />
            )}
            <Text>Unfit</Text>
          </View>

          <View
            style={[
              styles.fitBox,
              { alignItems: "center", flexDirection: "row" },
            ]}
          >
            {fit === "temporaryUnfit" && (
              <Image
                src={tick}
                style={{ width: 12, height: 12, marginRight: 4 }}
              />
            )}
            {/* Add condition if needed */}
            <Text>Temporarily Unfit</Text>
          </View>
        </View>
        <Text style={{ marginTop: 8 }}>
          I hereby declare that the above information furnished by me is true
          and correct.
        </Text>

        {/* Signatures */}
        <View style={styles.signatureRow}>
          <View>
            <Text>Signature of employee</Text>
            <Image
              src={aditiThakur}
              style={{
                height: 60,
                width: 80,
                position: "absolute",
                marginTop: 10,
              }}
            />
          </View>
          <View>
            <Text>
              Signature & Seal of Medical Examiner{"\n"}
              with Registration No.{" "}
              <Text style={{ textDecoration: "underline" }}>9247 </Text>
            </Text>

            <Image
              src={arjunPrasher}
              style={{
                height: 60,
                width: 80,
                position: "absolute",
                marginTop: 23,
              }}
            />
          </View>
        </View>

        <Text style={[styles.footerCenter, { fontFamily: "Times-Roman-Bold" }]}>
          Page 1 of 1
        </Text>
        <Text style={[styles.footerRight, { fontFamily: "Times-Roman-Bold" }]}>
          (1035-G-0266/F2)
        </Text>
      </Page>
    </Document>
  );
}
