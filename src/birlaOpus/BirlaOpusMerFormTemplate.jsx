import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 9,
    fontFamily: "Times-Roman-Normal",
    lineHeight: 1.2,
  },
  header: {
    textAlign: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 11,
    marginBottom: 10,
  },
  tableContainer: {
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  tableRowLast: {
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  cell: {
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 4,
    fontSize: 9,
    minHeight: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cellLast: {
    borderRightWidth: 0,
    padding: 4,
    fontSize: 9,
    minHeight: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  cellBold: {
    fontWeight: "bold",
  },
  cellHeader: {
    backgroundColor: "#f5f5f5",
    fontWeight: "bold",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "Times-Roman-Bold",
    backgroundColor: "#e0e0e0",
    padding: 5,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
  },
  bmiTableContainer: {
    borderWidth: 1,
    borderColor: "#000",
  },
  bmiRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  bmiCell: {
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 3,
    fontSize: 8,
    textAlign: "center",
    minHeight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bmiCellLast: {
    borderRightWidth: 0,
    padding: 3,
    fontSize: 8,
    textAlign: "center",
    minHeight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  bmiHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  bulletPoint: {
    fontSize: 9,
    marginBottom: 2,
  },
  impressionBox: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    marginTop: 10,
    minHeight: 30,
  },
  impressionText: {
    fontSize: 9,
    fontFamily: "Times-Roman-Bold",
  },
});

const BirlaOpusMerFormTemplate = ({ data = {} }) => {
  console.log({ data });
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MEDICAL EXAMINATION REPORT</Text>
          <Text style={styles.subtitle}>M/s Grasim Industries Limited</Text>
        </View>

        {/* Top Information Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                {
                  width: "50%",
                  alignItems: "flex-start",
                },
              ]}
            >
              <Image
                source={{ uri: `${data?.imageUrl}?empId=${data?.empId}` }}
                style={{ height: 50, width: 100 }}
              />
            </View>

            <View
              style={[
                styles.cell,
                styles.cellBold,
                {
                  width: "50%",
                  alignItems: "flex-start",
                  fontFamily: "Times-Roman-Bold",
                  borderRightWidth: 0,
                },
              ]}
            >
              <Text>
                Company : {data?.company || "M/s Grasim Industries Limited"}
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                {
                  width: "50%",
                  alignItems: "flex-start",
                  fontFamily: "Times-Roman-Bold",
                },
              ]}
            >
              <Text>E. NO : {data?.empId || ""}</Text>
            </View>

            <View
              style={[
                styles.cell,
                styles.cellBold,
                {
                  width: "50%",
                  alignItems: "flex-start",
                  fontFamily: "Times-Roman-Bold",
                  borderRightWidth: 0,
                },
              ]}
            >
              <Text>Barcode : {data?.barcode || ""}</Text>
            </View>
          </View>
          <View style={[styles.tableRowLast, { borderBottomWidth: 0 }]}>
            <View
              style={[
                styles.cell,
                {
                  width: "50%",
                  alignItems: "flex-start",
                  fontFamily: "Times-Roman-Bold",
                },
              ]}
            >
              <Text>Patient ID : {data?.patientId || ""}</Text>
            </View>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                {
                  width: "50%",
                  alignItems: "flex-start",
                  fontFamily: "Times-Roman-Bold",
                  borderRightWidth: 0,
                },
              ]}
            >
              <Text>Location : {data?.location || "Chamarajanagar"}</Text>
            </View>
          </View>
        </View>

        {/* Personal History Table */}
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                { width: "50%", flexDirection: "row", gap: 10 },
              ]}
            >
              <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                PERSONAL HISTORY
              </Text>{" "}
              <Text style={{ fontFamily: "Times-Roman-Normal" }}>
                (H/O Alcohol /Smoking/Tobacco in any form)
              </Text>
            </View>
            <View style={[styles.cell, { width: "25%" }]}>
              <Text>
                Alcohol - {data?.healthHistoryFormData?.alcoholHabit || ""}
              </Text>
            </View>
            <View style={[styles.cellLast, { width: "25%" }]}>
              <Text>
                Tobacco - {data?.healthHistoryFormData?.tobaccoHabit || ""}
              </Text>
            </View>
          </View>
          <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                { width: "50%", alignItems: "flex-start" },
              ]}
            >
              <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                PREVIOUS MEDICAL HISTORY
              </Text>
              <Text>
                Any History of Jaundice/Typhoid/Thyroid/Any Surgeries/
                Convulsions or fits/Hospitalization/visual disturbances/Hearing
                problem/surgeries/skin problem/Bleeding or pain while passing
                urine or stool
              </Text>
            </View>
            <View style={[styles.cellLast, { width: "50%" }]}>
              <Text>{data?.healthHistoryFormData?.medicalCondition || ""}</Text>
            </View>
          </View>
        </View>

        {/* Family History Table */}
        <View style={styles.tableContainer}>
          <View style={[styles.tableRow, { borderBottom: 0 }]}>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                {
                  width: "50%",
                  flexDirection: "row",
                  gap: 5,
                  flexWrap: "wrap",
                },
              ]}
            >
              <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                FAMILY HISTORY{" "}
              </Text>
              <Text>
                (Any history of Diabetes/ Hyper tension/Heart problem / Cancer)
              </Text>
            </View>
            <View style={[styles.cellLast, { width: "50%" }]}>
              <Text>{data?.healthHistoryFormData?.familyHistory || ""}</Text>
            </View>
          </View>
        </View>

        {/* Other Observations */}
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <View style={[styles.cell, { width: "5%" }]}>
              <Text style={{ fontFamily: "Times-Roman-Bold" }}>3.</Text>
            </View>
            <View
              style={[
                styles.cell,
                {
                  width: "45%",
                  flexDirection: "row",
                  flexWrap: "wrap",
                },
              ]}
            >
              <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                Skin infection
              </Text>
              <Text>
                on hands, arms and face-Boils, septic fingers or any other
                infections, Discharge from eyes, ear, nose, gums /mouth
              </Text>
            </View>
            <View style={[styles.cellLast, { width: "50%" }]}>
              <Text>{data?.skinInfection || "No Abnormalities Detected"}</Text>
            </View>
          </View>
          <View style={styles.tableRowLast}>
            <View style={[styles.cell, { width: "5%" }]}>
              <Text>4.</Text>
            </View>
            <View style={[styles.cell, { width: "45%" }]}>
              <Text>Vibration Perception Threshold</Text>
            </View>
            <View style={[styles.cellLast, { width: "50%" }]}>
              <Text>{data?.vibrationThreshold || "Normal"}</Text>
            </View>
          </View>
        </View>

        {/* General Physical Examination */}
        <Text style={[styles.sectionTitle, { borderBottomWidth: 0 }]}>
          GENERAL PHYSICAL EXAMINATION
        </Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                { width: "33%", alignItems: "flex-start" },
              ]}
            >
              <Text>HEIGHT : {data?.height ? data?.height + " Cms" : ""}</Text>
            </View>

            <View
              style={[
                styles.cell,
                styles.cellBold,
                { width: "33%", alignItems: "flex-start" },
              ]}
            >
              <Text>WEIGHT : {data?.weight ? data?.weight + " Kg" : ""} </Text>
            </View>

            <View
              style={[
                styles.cell,
                styles.cellBold,
                { width: "33%", alignItems: "flex-start", borderRightWidth: 0 },
              ]}
            >
              <Text>BODY MASS INDEX : {data?.bmi || ""}</Text>
            </View>
          </View>
          <View style={styles.tableRowLast}>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                { width: "33%", alignItems: "flex-start" },
              ]}
            >
              <Text>
                PULSE RATE :{" "}
                {data?.pulseRate ? data?.pulseRate + " /min (CPT)" : ""}
              </Text>
            </View>

            <View
              style={[
                styles.cell,
                styles.cellBold,
                { width: "33%", alignItems: "flex-start" },
              ]}
            >
              <Text>BP : {data?.bp ? data?.bp + " mm/hg" : ""} </Text>
            </View>

            <View
              style={[
                styles.cell,
                styles.cellBold,
                { width: "33%", alignItems: "flex-start", borderRightWidth: 0 },
              ]}
            >
              <Text>Ideal Weight : {data?.idealWeight || ""}</Text>
            </View>
          </View>
        </View>

        {/* BMI Interpretation and Visual Acuity Side by Side */}
        <View style={{ flexDirection: "row" }}>
          {/* BMI Interpretation */}
          <View style={{ width: "55%", marginRight: 10 }}>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                { textAlign: "left", padding: 2, borderLeftWidth: 1 },
              ]}
            >
              <Text>Your BMI : Interpreting Your BODY MASS INDEX</Text>
            </View>
            <View style={styles.bmiTableContainer}>
              <View style={styles.bmiRow}>
                <View
                  style={[styles.bmiCell, styles.bmiHeader, { width: "40%" }]}
                >
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>Adult</Text>
                </View>
                <View
                  style={[styles.bmiCell, styles.bmiHeader, { width: "30%" }]}
                >
                  <Text>Women</Text>
                </View>
                <View
                  style={[
                    styles.bmiCellLast,
                    styles.bmiHeader,
                    { width: "30%" },
                  ]}
                >
                  <Text>Men</Text>
                </View>
              </View>
              <View style={styles.bmiRow}>
                <View style={[styles.bmiCell, { width: "40%" }]}>
                  <Text>Underweight</Text>
                </View>
                <View style={[styles.bmiCell, { width: "30%" }]}>
                  <Text>&lt;19.1</Text>
                </View>
                <View style={[styles.bmiCellLast, { width: "30%" }]}>
                  <Text>&lt;20.7</Text>
                </View>
              </View>
              <View style={styles.bmiRow}>
                <View style={[styles.bmiCell, { width: "40%" }]}>
                  <Text>In normal range</Text>
                </View>
                <View style={[styles.bmiCell, { width: "30%" }]}>
                  <Text>19.1-25.8</Text>
                </View>
                <View style={[styles.bmiCellLast, { width: "30%" }]}>
                  <Text>20.7-26.4</Text>
                </View>
              </View>
              <View style={styles.bmiRow}>
                <View style={[styles.bmiCell, { width: "40%" }]}>
                  <Text>Marginally overweight</Text>
                </View>
                <View style={[styles.bmiCell, { width: "30%" }]}>
                  <Text>25.8-27.3</Text>
                </View>
                <View style={[styles.bmiCellLast, { width: "30%" }]}>
                  <Text>26.4-27.8</Text>
                </View>
              </View>
              <View style={styles.bmiRow}>
                <View style={[styles.bmiCell, { width: "40%" }]}>
                  <Text>Overweight</Text>
                </View>
                <View style={[styles.bmiCell, { width: "30%" }]}>
                  <Text>27.3-32.3</Text>
                </View>
                <View style={[styles.bmiCellLast, { width: "30%" }]}>
                  <Text>27.8-31.1</Text>
                </View>
              </View>
              <View style={[styles.bmiRow, { borderBottomWidth: 0 }]}>
                <View style={[styles.bmiCell, { width: "40%" }]}>
                  <Text>Very overweight or obese</Text>
                </View>
                <View style={[styles.bmiCell, { width: "30%" }]}>
                  <Text>&gt;32.3</Text>
                </View>
                <View style={[styles.bmiCellLast, { width: "30%" }]}>
                  <Text>&gt;31.1</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Visual Acuity */}
          <View style={{ width: "45%" }}>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                styles.cellHeader,
                { textAlign: "center", padding: 2, borderLeftWidth: 1 },
              ]}
            >
              <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                Visual Acuity
              </Text>
            </View>
            <View style={styles.bmiTableContainer}>
              <View style={styles.bmiRow}>
                <View style={[styles.bmiCell, { width: "20%" }]}></View>
                <View
                  style={[styles.bmiCell, styles.bmiHeader, { width: "20%" }]}
                >
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                    Distance Vision
                  </Text>
                </View>
                <View
                  style={[styles.bmiCell, styles.bmiHeader, { width: "20%" }]}
                >
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                    Color Vision
                  </Text>
                </View>
                <View
                  style={[styles.bmiCell, styles.bmiHeader, { width: "20%" }]}
                >
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                    Near Vision
                  </Text>
                </View>
                <View
                  style={[
                    styles.bmiCellLast,
                    styles.bmiHeader,
                    { width: "20%" },
                  ]}
                >
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>Styes</Text>
                </View>
              </View>
              <View style={styles.bmiRow}>
                <View
                  style={[styles.bmiCell, styles.cellBold, { width: "20%" }]}
                >
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>Right</Text>
                </View>
                <View style={[styles.bmiCell, { width: "20%" }]}>
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                    {data?.farRightEyeSight ||
                      data?.farRightEyeSightWithGlasses ||
                      ""}
                  </Text>
                </View>
                <View style={[styles.bmiCell, { width: "20%" }]}>
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                    {data?.rightEyeColourVision || "Normal"}
                  </Text>
                </View>
                <View style={[styles.bmiCell, { width: "20%" }]}>
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                    {data?.nearRightEyeSight ||
                      data?.nearRightEyeSightWithGlasses ||
                      ""}
                  </Text>
                </View>
                <View style={[styles.bmiCellLast, { width: "20%" }]}>
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                    {data?.rightEyeStyes || "Normal"}
                  </Text>
                </View>
              </View>
              <View style={[styles.bmiRow, { borderBottomWidth: 0 }]}>
                <View
                  style={[styles.bmiCell, styles.cellBold, { width: "20%" }]}
                >
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>Left</Text>
                </View>
                <View style={[styles.bmiCell, { width: "20%" }]}>
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                    {data?.farLeftEyeSight ||
                      data?.farLeftEyeSightWithGlasses ||
                      ""}
                  </Text>
                </View>
                <View style={[styles.bmiCell, { width: "20%" }]}>
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                    {data?.leftEyeColourVision || "Normal"}
                  </Text>
                </View>
                <View style={[styles.bmiCell, { width: "20%" }]}>
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                    {data?.nearLeftEyeSight ||
                      data?.nearLeftEyeSightWithGlasses ||
                      ""}
                  </Text>
                </View>
                <View style={[styles.bmiCellLast, { width: "20%" }]}>
                  <Text style={{ fontFamily: "Times-Roman-Bold" }}>
                    {data?.leftEyeStyes || "Normal"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Systematic Examination */}
        <Text style={[styles.sectionTitle, { borderBottomWidth: 0 }]}>
          SYSTEMATIC EXAMINATION
        </Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                { width: "30%", alignItems: "flex-start" },
              ]}
            >
              <Text
                style={{
                  fontFamily: "Times-Roman-Bold",
                }}
              >
                RESPIRATORY SYSTEM
              </Text>
            </View>
            <View
              style={[
                styles.cellLast,
                { width: "70%", alignItems: "flex-start" },
              ]}
            >
              <Text
                style={[styles.bulletPoint, { fontFamily: "Times-Roman-Bold" }]}
              >
                • Respiratory System: NA
              </Text>
              <Text
                style={[styles.bulletPoint, { fontFamily: "Times-Roman-Bold" }]}
              >
                • Nose / Throat : NA
              </Text>
              <Text
                style={[styles.bulletPoint, { fontFamily: "Times-Roman-Bold" }]}
              >
                • On Auscultation : NA
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                { width: "30%", alignItems: "flex-start" },
              ]}
            >
              <Text
                style={{
                  fontFamily: "Times-Roman-Bold",
                }}
              >
                CARDIO – VASCULAR SYSTEM
              </Text>
            </View>
            <View
              style={[
                styles.cellLast,
                { width: "70%", alignItems: "flex-start" },
              ]}
            >
              <Text
                style={[styles.bulletPoint, { fontFamily: "Times-Roman-Bold" }]}
              >
                • Hear Sound : NA
              </Text>
              <Text
                style={[styles.bulletPoint, { fontFamily: "Times-Roman-Bold" }]}
              >
                • Murmurs : NA
              </Text>
            </View>
          </View>
          <View style={styles.tableRow}>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                { width: "30%", alignItems: "flex-start" },
              ]}
            >
              <Text
                style={{
                  fontFamily: "Times-Roman-Bold",
                }}
              >
                CENTRAL NERVOUS SYSTEM
              </Text>
            </View>
            <View
              style={[
                styles.cellLast,
                { width: "70%", alignItems: "flex-start" },
              ]}
            >
              <Text
                style={[styles.bulletPoint, { fontFamily: "Times-Roman-Bold" }]}
              >
                • CNR (Central nervous System): NA
              </Text>
              <Text
                style={[styles.bulletPoint, { fontFamily: "Times-Roman-Bold" }]}
              >
                • Peripheral System : NA
              </Text>
            </View>
          </View>
          <View style={styles.tableRowLast}>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                { width: "30%", alignItems: "flex-start" },
              ]}
            >
              <Text
                style={{
                  fontFamily: "Times-Roman-Bold",
                }}
              >
                SKIN
              </Text>
            </View>
            <View
              style={[
                styles.bulletPoint,
                {
                  fontFamily: "Times-Roman-Bold",
                  alignItems: "flex-start",
                  padding: 5,
                },
              ]}
            >
              <Text>NA</Text>
            </View>
          </View>
        </View>

        {/* Lab Investigation */}
        <Text style={[styles.sectionTitle, { borderBottomWidth: 0 }]}>
          LAB INVESTIGATION
        </Text>
        <View style={styles.tableContainer}>
          <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
            <View
              style={[
                styles.cell,
                styles.cellBold,
                { width: "50%", alignItems: "flex-start" },
              ]}
            >
              <Text style={{ fontFamily: "Times-Roman-Bold" }}>BLOOD</Text>
            </View>
            <View
              style={[
                styles.cellLast,
                { width: "50%", alignItems: "flex-start" },
              ]}
            >
              <Text style={{ fontFamily: "Times-Roman-Bold" }}>URINE /</Text>
            </View>
          </View>
          <View style={styles.tableRowLast}>
            <View
              style={[styles.cell, { width: "50%", alignItems: "flex-start" }]}
            >
              <Text>
                {data?.bloodTests ||
                  "HAEMATOLOGY, FBS, KIDNEY FUCNTION TEST, LIVER FUNCTION PROFILE"}
              </Text>
            </View>
            <View
              style={[
                styles.cellLast,
                { width: "50%", alignItems: "flex-start" },
              ]}
            >
              <Text>{data?.urineTests || "Urine Analysis /"}</Text>
            </View>
          </View>
        </View>

        {/* Impression */}
        <View style={[styles.impressionBox, { flexDirection: "row", gap: 10 }]}>
          <Text style={styles.impressionText}>
            Impression/ Fitness / Advice:
          </Text>
          <Text
            style={[
              styles.impressionText,
              { fontFamily: "Times-Roman-Normal" },
            ]}
          >
            {data?.impression || "FIT TO WORK"}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default BirlaOpusMerFormTemplate;
