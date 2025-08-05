import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

// Common Styles
const styles = StyleSheet.create({
  page: {
    margin: 10,
    border: "1pt solid #000",
    padding: 20,
    fontSize: 11,
    fontFamily: "Times-Roman",
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 4,
    gap: 4,
  },
  dottedLine: {
    borderBottom: "1pt dotted #000",
    minWidth: 80,
    textAlign: "center",
    paddingBottom: 2,
  },
  label: {
    marginRight: 4,
  },
  table: {
    border: "1pt solid black",
    marginTop: 8,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  tableCell: {
    flex: 1,
    borderRight: "1pt solid black",
    borderBottom: "1pt solid black",
    padding: 4,
    fontSize: 10,
    minHeight: 20,
  },
  tableFirstCol: {
    flex: 2,
  },
});

// Reusable Field with Dotted Line
const DottedField = ({ value, width = 100 }) => (
  <View style={[styles.dottedLine, { minWidth: width }]}>
    <Text>{value || " "}</Text>
  </View>
);

const GlobalCalciumDoctorConsultationFormTemplate = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header Section */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Name of the Employee:</Text>
          <DottedField value={data?.name} width={150} />
          <Text style={styles.label}>Age:</Text>
          <DottedField value={data?.age} width={40} />
          <Text style={styles.label}>Gender:</Text>
          <DottedField value={data?.gender} width={60} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Employee ID:</Text>
          <DottedField value={data?.empId} width={80} />
          <Text style={styles.label}>Department:</Text>
          <DottedField value={data?.department} width={150} />
        </View>
        <Text>Name of the Company: Global Calcium Pvt. Ltd., Hosur</Text>
      </View>

      {/* Present Health Complaints */}
      {[
        { label: "Diabetes", property: "medHistDiabetes" },
        { label: "Hypertension", property: "medHistHypertension" },
        { label: "Asthma/COPD", property: "medHistAsthmaCopd" },
        { label: "Tuberculosis", property: "medHistTuberculosis" },
        { label: "Heart Disease", property: "medHistHeartDisease" },
      ].map((condition, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.label}>{condition.label}:</Text>
          <DottedField
            value={data?.doctorConsultationFormData?.[condition.property]}
            width={100}
          />
          <Text style={styles.label}>If Yes Duration:</Text>
          <DottedField
            value={
              data?.doctorConsultationFormData?.[
                `${condition.property}Duration`
              ] || ""
            }
            width={100}
          />
        </View>
      ))}

      {/* Medications */}
      <View style={styles.section}>
        <Text style={styles.bold}>Current Medications (If any):</Text>
        <View
          style={{
            border: "1pt solid black",
            padding: 8,
            minHeight: 30,
            marginTop: 4,
          }}
        >
          <Text>
            {data?.doctorConsultationFormData?.["medHistCurrentMedications"] ||
              " "}
          </Text>
        </View>
      </View>

      {/* Personal Habits */}
      <View style={styles.section}>
        <Text style={styles.bold}>Personal Habit: </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Food Habit:</Text>
          <DottedField value={data?.habitFoodNonVegYesNo} width={80} />
        </View>

        {/* Habit Table */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, styles.tableFirstCol]}></Text>
            <Text style={styles.tableCell}>Yes/No</Text>
            <Text style={styles.tableCell}>Duration</Text>
            <Text style={styles.tableCell}>Type</Text>
            <Text style={styles.tableCell}>Frequency</Text>
            <Text style={styles.tableCell}>Quantity</Text>
          </View>

          {[
            {
              label: "Alcohol",
              property: "habitAlcoholYesNo",
              duration: "habitAlcoholDuration",
              type: "habitAlcoholType",
              frequency: "habitAlcoholFrequency",
              quantity: "habitAlcoholQuantity",
            },
            {
              label: "Smoking",
              property: "habitSmokingYesNo",
              duration: "habitSmokingDuration",
              type: "habitSmokingType",
              frequency: "habitSmokingFrequency",
              quantity: "habitSmokingQuantity",
            },
            {
              label: "Tobacco",
              property: "habitTobaccoYesNo",
              duration: "habitTobaccoDuration",
              type: "habitTobaccoType",
              frequency: "habitTobaccoFrequency",
              quantity: "habitTobaccoQuantity",
            },
          ].map((key, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableFirstCol]}>
                {key?.label === "Alcohol"
                  ? "Alcohol consumption"
                  : key?.label === "Tobacco"
                  ? "Tobacco Chewing"
                  : "Smoking"}
              </Text>
              <Text style={styles.tableCell}>
                {data?.doctorConsultationFormData?.[`${key?.property}`] || ""}
              </Text>
              <Text style={styles.tableCell}>
                {data?.doctorConsultationFormData?.[`${key.duration}`] || ""}
              </Text>
              <Text style={styles.tableCell}>
                {data?.doctorConsultationFormData?.[`${key.type}`] || ""}
              </Text>
              <Text style={styles.tableCell}>
                {data?.doctorConsultationFormData?.[`${key.frequency}`] || ""}
              </Text>
              <Text style={styles.tableCell}>
                {data?.doctorConsultationFormData?.[`${key.quantity}`] || ""}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* History Sections */}
      <View style={styles.section}>
        <Text>Significant Past Medical History:</Text>
        <View style={{ borderBottom: "1pt dotted black", minHeight: 20 }}>
          <Text>
            {data?.doctorConsultationFormData?.["medHistPastSignificant"] ||
              " "}
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text>Significant Family History:</Text>
        <View style={{ borderBottom: "1pt dotted black", minHeight: 20 }}>
          <Text>
            {data?.doctorConsultationFormData?.["medHistFamilySignificant"] ||
              " "}
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text>Menstrual History (only for Females):</Text>
        <View style={{ borderBottom: "1pt dotted black", minHeight: 20 }}>
          <Text>
            {data?.doctorConsultationFormData?.["medHistMenstrualFemale"] ||
              " "}
          </Text>
        </View>
      </View>
    </Page>
    {/* Second Page: General Examination, Systemic Examination, Final Impression */}
    <Page size="A4" style={styles.page}>
      {/* General Examination */}
      <View
        style={[
          styles.section,
          { border: "1pt solid #000", padding: 8, marginBottom: 0 },
        ]}
      >
        <Text style={[styles.bold, { textAlign: "center", marginBottom: 6 }]}>
          General Examination
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Height:</Text>
          <DottedField width={60} value={data?.height} />
          <Text style={{ marginLeft: 2 }}>cm</Text>
          <Text style={[styles.label, { marginLeft: 16 }]}>Weight:</Text>
          <DottedField width={60} value={data?.weight} />
          <Text style={{ marginLeft: 2 }}>Kg</Text>
          <Text style={[styles.label, { marginLeft: 16 }]}>BMI:</Text>
          <DottedField width={60} value={data?.bmi} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>BP:</Text>
          <DottedField width={60} value={data?.cholestrolData?.["highBp"]} />
          <Text style={{ marginLeft: 2 }}>/</Text>
          <DottedField width={60} value={data?.cholestrolData?.["lowBp"]} />
          <Text style={{ marginLeft: 2 }}>mmHg</Text>
          <Text style={[styles.label, { marginLeft: 16 }]}>Pulse:</Text>
          <DottedField width={60} value={data?.pulseRate} />
          <Text style={{ marginLeft: 2 }}>bpm</Text>
          <Text style={[styles.label, { marginLeft: 16 }]}>SpO2:</Text>
          <DottedField width={60} value={data?.spo2Percent} />
          <Text style={{ marginLeft: 2 }}>%</Text>
        </View>
      </View>

      {/* Inspection */}
      <View
        style={[
          styles.section,
          {
            border: "1pt solid #000",
            borderTopWidth: 0,
            padding: 8,
            marginBottom: 0,
          },
        ]}
      >
        <Text
          style={[
            styles.bold,
            { textDecoration: "underline", marginBottom: 4 },
          ]}
        >
          Inspection:
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Pallor:</Text>
          <DottedField
            width={80}
            value={data?.doctorConsultationFormData?.examSignPallor}
          />
          <Text style={[styles.label, { marginLeft: 8 }]}>Icterus:</Text>
          <DottedField
            width={80}
            value={data?.doctorConsultationFormData?.examSignIcterus}
          />
          <Text style={[styles.label, { marginLeft: 8 }]}>Cyanosis:</Text>
          <DottedField
            width={80}
            value={data?.doctorConsultationFormData?.examSignCyanosis}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Clubbing:</Text>
          <DottedField
            width={80}
            value={data?.doctorConsultationFormData?.examSignClubbing}
          />
          <Text style={[styles.label, { marginLeft: 8 }]}>Pedal Edema:</Text>
          <DottedField
            width={80}
            value={data?.doctorConsultationFormData?.examSignPedalEdema}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Skin Examination:</Text>
          <DottedField
            width={300}
            value={data?.doctorConsultationFormData?.examSkin || ""}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Oral Hygiene:</Text>
          <DottedField
            width={120}
            value={data?.doctorConsultationFormData?.examOralHygiene || ""}
          />
          <Text style={[styles.label, { marginLeft: 16 }]}>Deformities:</Text>
          <DottedField
            width={120}
            value={data?.doctorConsultationFormData?.examDeformities || ""}
          />
        </View>
      </View>

      {/* Systemic Examination */}
      <View
        style={[
          styles.section,
          {
            border: "1pt solid #000",
            borderTopWidth: 0,
            padding: 8,
            marginBottom: 0,
          },
        ]}
      >
        <Text style={[styles.bold, { textAlign: "center", marginBottom: 6 }]}>
          Systemic Examination
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Cardio-Vascular System:</Text>
          <DottedField
            width={120}
            value={data?.doctorConsultationFormData?.examCvs || ""}
          />
          <Text style={[styles.label, { marginLeft: 16 }]}>
            Respiratory System:
          </Text>
          <DottedField
            width={120}
            value={data?.doctorConsultationFormData?.examRespiratory || ""}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gastro-Intestinal System:</Text>
          <DottedField
            width={120}
            value={data?.doctorConsultationFormData?.examGastrointestinal || ""}
          />
          <Text style={[styles.label, { marginLeft: 16 }]}>
            Central Nervous System:
          </Text>
          <DottedField
            width={120}
            value={data?.doctorConsultationFormData?.examCns || ""}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Vision Examination Final Impression:</Text>
          <DottedField
            width={220}
            value={
              data?.doctorConsultationFormData?.visionFinalImpression || ""
            }
          />
        </View>
      </View>

      {/* Provisional Diagnosis & Advice */}
      <View
        style={[
          styles.section,
          {
            border: "1pt solid #000",
            borderTopWidth: 0,
            padding: 8,
            marginBottom: 0,
          },
        ]}
      >
        <View style={styles.row}>
          <Text style={styles.label}>Provisional Diagnosis:</Text>
          <DottedField
            width={350}
            value={data?.doctorConsultationFormData?.diagnosisProvisional || ""}
          />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Advice:</Text>
          <DottedField
            width={400}
            value={data?.doctorConsultationFormData?.diagnosisAdvice || ""}
          />
        </View>
      </View>

      {/* Final Impression */}
      <View
        style={[
          styles.section,
          {
            border: "1pt solid #000",
            borderTopWidth: 0,
            padding: 8,
            minHeight: 120,
          },
        ]}
      >
        <Text
          style={[
            styles.bold,
            { textDecoration: "underline", marginBottom: 4 },
          ]}
        >
          Final Impression:
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
          <Text>I do hereby certify that</Text>
          <DottedField width={180} value={data?.name} />
          <Text>Employee with</Text>
          <Text style={styles.bold}>GLOBAL CALCIUM PVT LTD</Text>
          <Text>, has been carefully examined by me on</Text>
          <DottedField width={120} value={data?.vitalsCreatedDate} />
          <Text>, based on Medical Report & Physical</Text>
          <Text>examination conducted,</Text>
          <Text>He is found free from any</Text>
          <Text>diseases and He is to work in the above-mentioned</Text>
          <Text style={styles.bold}>Medically Fit</Text>
          <Text>establishment.</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Place: Hosur</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date:</Text>
          <DottedField
            width={100}
            value={data?.reportGeneratedDate || data?.vitalsCreatedDate}
          />
          <Text style={{ flex: 1 }}></Text>
          <Text style={[styles.bold, { textAlign: "right", flex: 1 }]}>
            Signature of Medical Officer with Seal
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default GlobalCalciumDoctorConsultationFormTemplate;
