import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import dr_kunal_stamp_sign from "../../src/assets/images/dr_kunal_stamp_sign.png";
import uncareheader from "../../src/assets/images/uncareheader.png";

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

// Common Styles
const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    fontFamily: "Times-Roman-Normal",
    lineHeight: 1.4,
  },
  section: {
    marginBottom: 10,
    marginHorizontal: 20,
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
    <Page size="A4" style={styles.page} orientation="portrait">
      <Image
        src={uncareheader}
        style={{
          width: "100%",
          height: 70,
          marginBottom: 5,
        }}
      />
      <Text
        style={[
          styles.label,
          {
            marginBottom: 0,
            marginHorizontal: 20,
            textAlign: "center",
            fontFamily: "Times-Roman-Bold",
          },
        ]}
      >
        Medical Examination Fitness Certificate
      </Text>
      <View
        style={{
          borderBottom: "1pt solid #000",
          marginTop: 10,
          marginBottom: 5,
        }}
      />
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
        <Text style={{ marginTop: 10 }}>
          Name of the Company: Global Calcium Pvt. Ltd., Hosur
        </Text>
      </View>

      <View
        style={{
          borderBottom: "1pt solid #000",
          marginTop: 0,
          marginBottom: 10,
        }}
      />

      <Text
        style={[
          styles.label,
          {
            marginBottom: 10,
            marginHorizontal: 20,
            textDecoration: "underline",
            fontFamily: "Times-Roman-Bold",
          },
        ]}
      >
        Present Health Complaints if any:
      </Text>

      {/* Present Health Complaints */}
      {[
        { label: "Diabetes", property: "medHistDiabetes" },
        { label: "Hypertension", property: "medHistHypertension" },
        { label: "Asthma/COPD", property: "medHistAsthmaCopd" },
        { label: "Tuberculosis", property: "medHistTuberculosis" },
        { label: "Heart Disease", property: "medHistHeartDisease" },
      ].map((condition, i) => (
        <View key={i} style={[styles.row, { marginHorizontal: 20 }]}>
          <Text style={styles.label}>{condition.label}:</Text>
          <DottedField
            value={data?.doctorConsultationFormData?.[condition.property]}
            width={100}
          />
          <Text style={styles.label}>If Yes Duration:</Text>
          <DottedField
            value={
              data?.doctorConsultationFormData?.[`${condition.property}`] || ""
            }
            width={100}
          />
        </View>
      ))}

      <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />

      {/* Medications */}
      <View style={styles.section}>
        <Text
          style={[
            styles.bold,
            { textDecoration: "underline", fontFamily: "Times-Roman-Bold" },
          ]}
        >
          Current Medications (If any):
        </Text>
        <View
          style={{
            padding: 8,
          }}
        >
          <Text>
            {data?.doctorConsultationFormData?.["medHistCurrentMedications"] ||
              " "}
          </Text>
        </View>
      </View>

      <View
        style={{
          borderBottom: "1pt solid #000",
          marginBottom: 10,
          marginTop: 0,
        }}
      />

      {/* Personal Habits */}
      <View style={styles.section}>
        <Text
          style={[
            styles.bold,
            { textDecoration: "underline", fontFamily: "Times-Roman-Bold" },
          ]}
        >
          Personal Habit:{" "}
        </Text>
        <View style={styles.row}>
          <Text style={styles.label}>Food Habit:</Text>
          <DottedField
            value={
              data?.doctorConsultationFormData?.habitFoodNonVegYesNo === "Yes"
                ? "Non Veg"
                : "No"
                ? "Veg"
                : ""
            }
            width={80}
          />
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

      <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />

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
      <View style={[{ marginTop: 30, marginHorizontal: 20 }]}>
        <View
          style={{
            borderWidth: 0.5,
            borderColor: "#000000",
            marginBottom: 10,
          }}
        />
        <Text style={styles.label}>
          Disclaimer: The findings are based on the medical tests and
          examinations conducted on the date specified and are subject to
          clinical correlation. This report is intended for occupational health
          monitoring purposes only and should not be disclosed to unauthorized
          persons.
        </Text>
      </View>
    </Page>
    {/* Second Page: General Examination, Systemic Examination, Final Impression */}
    <Page size="A4" style={styles.page}>
      {/* General Examination */}
      <Image
        src={uncareheader}
        style={{
          width: "100%",
          height: 70,
          marginBottom: 10,
        }}
      />
      <Text
        style={[
          styles.label,
          {
            marginBottom: 0,
            marginHorizontal: 20,
            textAlign: "center",
            fontFamily: "Times-Roman-Bold",
          },
        ]}
      >
        Medical Examination Fitness Certificate
      </Text>
      <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />
      <View style={[styles.section]}>
        <Text
          style={[
            styles.bold,
            {
              textAlign: "left",
              textDecoration: "underline",
              marginBottom: 6,
              fontFamily: "Times-Roman-Bold",
            },
          ]}
        >
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
          <DottedField width={60} value={data?.pulseRate || ""} />
          <Text style={{ marginLeft: 2 }}>bpm</Text>
          <Text style={[styles.label, { marginLeft: 16 }]}>SpO2:</Text>
          <DottedField width={60} value={data?.spO2Percent || ""} />
          <Text style={{ marginLeft: 2 }}>%</Text>
        </View>
      </View>
      <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />
      {/* Inspection */}
      <View style={[styles.section]}>
        <Text
          style={[
            styles.bold,
            {
              textDecoration: "underline",
              marginBottom: 4,
              fontFamily: "Times-Roman-Bold",
            },
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
      <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />
      {/* Systemic Examination */}
      <View style={[styles.section]}>
        <Text
          style={[
            styles.bold,
            {
              textAlign: "left",
              textDecoration: "underline",
              marginBottom: 6,
              fontFamily: "Times-Roman-Bold",
            },
          ]}
        >
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
      <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />
      {/* Provisional Diagnosis & Advice */}
      <View style={[styles.section]}>
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
      <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />
      {/* Final Impression */}
      <View style={[styles.section]}>
        <Text
          style={[
            styles.bold,
            {
              textDecoration: "underline",
              marginBottom: 4,
              fontFamily: "Times-Roman-Bold",
            },
          ]}
        >
          Final Impression:
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 4,
            marginBottom: 20,
          }}
        >
          <Text>I do hereby certify that</Text>
          <DottedField width={180} value={data?.name} />
          <Text>Employee with</Text>
          <Text style={styles.bold}>GLOBAL CALCIUM PVT LTD ,</Text>
          <Text>has been carefully examined by me on</Text>
          <DottedField width={120} value={data?.vitalsCreatedDate} />
          <Text>, based on Medical Report & Physical examination </Text>
          <Text>
            conducted,{" "}
            {data?.gender === "MALE"
              ? "He"
              : data?.gender === "FEMALE"
              ? "She"
              : "He/she"}{" "}
            is found free from any
          </Text>
          <Text>
            diseases and{" "}
            {data?.gender === "MALE"
              ? "he"
              : data?.gender === "FEMALE"
              ? "she"
              : "he/she"}{" "}
            is
          </Text>
          <Text style={styles.bold}>Medically Fit</Text>
          <Text>to work in the above mentioned establishment.</Text>
        </View>
        <View style={[styles.row, { marginTop: 20 }]}>
          <Text style={styles.label}>Place: Hosur</Text>
        </View>
        <View style={[styles.row]}>
          <Text style={styles.label}>Date:</Text>
          <DottedField width={100} value={data?.vitalsCreatedDate} />
          <Text style={{ flex: 1 }}></Text>
          <Text style={[styles.bold, { textAlign: "right", flex: 1 }]}>
            Signature of Medical Officer with Seal
          </Text>
          <Image
            src={dr_kunal_stamp_sign}
            style={{
              height: 60,
              width: 80,
              position: "absolute",
              bottom: 10,
              right: 100,
            }}
          />
        </View>{" "}
        <View style={[{ marginTop: 30 }]}>
          <View
            style={{
              borderWidth: 0.5,
              borderColor: "#000000",
              marginBottom: 10,
            }}
          />
          <Text style={styles.label}>
            Disclaimer: The findings are based on the medical tests and
            examinations conducted on the date specified and are subject to
            clinical correlation. This report is intended for occupational
            health monitoring purposes only and should not be disclosed to
            unauthorized persons.
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default GlobalCalciumDoctorConsultationFormTemplate;

// 16th July
// import React from "react";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   Image,
// } from "@react-pdf/renderer";
// import dr_kunal_stamp_sign from "../../src/assets/images/dr_kunal_stamp_sign.png";

// // Common Styles
// const styles = StyleSheet.create({
//   page: {
//     fontSize: 11,
//     fontFamily: "Times-Roman",
//     lineHeight: 1.4,
//     marginTop: 30,
//   },
//   section: {
//     marginBottom: 10,
//     marginHorizontal: 20,
//   },
//   bold: {
//     fontWeight: "bold",
//   },
//   row: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginBottom: 4,
//     gap: 4,
//   },
//   dottedLine: {
//     borderBottom: "1pt dotted #000",
//     minWidth: 80,
//     textAlign: "center",
//     paddingBottom: 2,
//   },
//   label: {
//     marginRight: 4,
//   },
//   table: {
//     border: "1pt solid black",
//     marginTop: 8,
//   },
//   tableRow: {
//     flexDirection: "row",
//   },
//   tableHeader: {
//     backgroundColor: "#f0f0f0",
//     fontWeight: "bold",
//   },
//   tableCell: {
//     flex: 1,
//     borderRight: "1pt solid black",
//     borderBottom: "1pt solid black",
//     padding: 4,
//     fontSize: 10,
//     minHeight: 20,
//   },
//   tableFirstCol: {
//     flex: 2,
//   },
// });

// // Reusable Field with Dotted Line
// const DottedField = ({ value, width = 100 }) => (
//   <View style={[styles.dottedLine, { minWidth: width }]}>
//     <Text>{value || ""}</Text>
//   </View>
// );

// const GlobalCalciumDoctorConsultationFormTemplate = ({ data }) => (
//   <Document>
//     <Page size="A4" style={styles.page} orientation="portrait">
//       <Text
//         style={[
//           styles.label,
//           { marginBottom: 30, marginHorizontal: 20, textAlign: "center" },
//         ]}
//       >
//         Medical Examination Fitness Certificate
//       </Text>

//       <View style={styles.section}>
//         <View style={styles.row}>
//           <Text style={styles.label}>Name of the Employee:</Text>
//           <DottedField value={data?.name} width={150} />
//           <Text style={styles.label}>Age:</Text>
//           <DottedField value={data?.age} width={40} />
//           <Text style={styles.label}>Gender:</Text>
//           <DottedField value={data?.gender} width={60} />
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Employee ID:</Text>
//           <DottedField value={data?.empId} width={80} />
//           <Text style={styles.label}>Department:</Text>
//           <DottedField value={data?.department} width={150} />
//         </View>
//         <Text style={{ marginTop: 10 }}>
//           Name of the Company: Global Calcium Pvt. Ltd., Hosur
//         </Text>
//       </View>

//       <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />

//       <Text style={[styles.label, { marginBottom: 30, marginHorizontal: 20 }]}>
//         Present Health Complaints if any:
//       </Text>

//       {/* Present Health Complaints */}
//       {[
//         {
//           label: "Diabetes",
//           property: "medicalCondition",
//           keywords: ["diabet"],
//         },
//         {
//           label: "Hypertension",
//           property: "medicalCondition",
//           keywords: ["hyperten"],
//         },
//         {
//           label: "Asthma/COPD",
//           property: "medicalCondition",
//           keywords: ["asthma", "copd"],
//         },
//         {
//           label: "Tuberculosis",
//           property: "medicalCondition",
//           keywords: ["tuberculosis", "tb"],
//         },
//         {
//           label: "Heart Disease",
//           property: "medicalCondition",
//           keywords: ["heart"],
//         },
//       ].map((condition, i) => {
//         const rawValue =
//           data?.healthHistoryFormData?.[condition.property]?.toLowerCase?.() ||
//           "";
//         const hasCondition = condition.keywords.some((keyword) =>
//           rawValue.includes(keyword)
//         );
//         return (
//           <View key={i} style={[styles.row, { marginHorizontal: 20 }]}>
//             <Text style={styles.label}>{condition.label}:</Text>
//             <DottedField value={hasCondition ? "Yes" : "NAD"} width={100} />
//             <Text style={styles.label}>If Yes Duration:</Text>
//             <DottedField value={""} width={100} />
//           </View>
//         );
//       })}

//       <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />

//       {/* Medications */}
//       <View style={styles.section}>
//         <Text style={styles.bold}>Current Medications (If any):</Text>
//         <View
//           style={{
//             padding: 8,
//             minHeight: 30,
//             marginTop: 4,
//           }}
//         >
//           <Text>
//             {data?.doctorConsultationFormData?.["medHistCurrentMedications"] ||
//               "NAD"}
//           </Text>
//         </View>
//       </View>

//       <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />

//       {/* Personal Habits */}
//       <View style={styles.section}>
//         <Text style={styles.bold}>Personal Habit: </Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Food Habit:</Text>
//           <DottedField value={data?.habitFoodNonVegYesNo} width={80} />
//         </View>

//         {/* Habit Table */}
//         <View style={styles.table}>
//           <View style={[styles.tableRow, styles.tableHeader]}>
//             <Text style={[styles.tableCell, styles.tableFirstCol]}></Text>
//             <Text style={styles.tableCell}>Yes/No</Text>
//             <Text style={styles.tableCell}>Duration</Text>
//             <Text style={styles.tableCell}>Type</Text>
//             <Text style={styles.tableCell}>Frequency</Text>
//             <Text style={styles.tableCell}>Quantity</Text>
//           </View>

//           {[
//             {
//               label: "Alcohol",
//               property: "alcoholHabit",
//               duration: "habitAlcoholDuration",
//               type: "habitAlcoholType",
//               frequency: "habitAlcoholFrequency",
//               quantity: "habitAlcoholQuantity",
//             },
//             {
//               label: "Smoking",
//               property: "smokingHabit",
//               duration: "habitSmokingDuration",
//               type: "habitSmokingType",
//               frequency: "habitSmokingFrequency",
//               quantity: "habitSmokingQuantity",
//             },
//             {
//               label: "Tobacco",
//               property: "tobaccoHabit",
//               duration: "habitTobaccoDuration",
//               type: "habitTobaccoType",
//               frequency: "habitTobaccoFrequency",
//               quantity: "habitTobaccoQuantity",
//             },
//           ].map((key, i) => (
//             <View key={i} style={styles.tableRow}>
//               <Text style={[styles.tableCell, styles.tableFirstCol]}>
//                 {key?.label === "Alcohol"
//                   ? "Alcohol consumption"
//                   : key?.label === "Tobacco"
//                   ? "Tobacco Chewing"
//                   : "Smoking"}
//               </Text>
//               <Text style={styles.tableCell}>
//                 {data?.healthHistoryFormData?.[`${key?.property}`] || ""}
//               </Text>
//               <Text style={styles.tableCell}>
//                 {data?.doctorConsultationFormData?.[`${key.duration}`] || ""}
//               </Text>
//               <Text style={styles.tableCell}>
//                 {data?.doctorConsultationFormData?.[`${key.type}`] || ""}
//               </Text>
//               <Text style={styles.tableCell}>
//                 {data?.doctorConsultationFormData?.[`${key.frequency}`] || ""}
//               </Text>
//               <Text style={styles.tableCell}>
//                 {data?.doctorConsultationFormData?.[`${key.quantity}`] || ""}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </View>

//       <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />

//       {/* History Sections */}
//       <View style={styles.section}>
//         <Text>Significant Past Medical History:</Text>
//         <View style={{ borderBottom: "1pt dotted black", minHeight: 20 }}>
//           <Text>
//             {data?.doctorConsultationFormData?.["medHistPastSignificant"] ||
//               "NAD"}
//           </Text>
//         </View>
//       </View>
//       <View style={styles.section}>
//         <Text>Significant Family History:</Text>
//         <View style={{ borderBottom: "1pt dotted black", minHeight: 20 }}>
//           <Text>{data?.healthHistoryFormData?.familyHistory || "NAD"}</Text>
//         </View>
//       </View>
//       <View style={styles.section}>
//         <Text>Menstrual History (only for Females):</Text>
//         <View style={{ borderBottom: "1pt dotted black", minHeight: 20 }}>
//           <Text>
//             {data?.doctorConsultationFormData?.["medHistMenstrualFemale"] ||
//               "NAD"}
//           </Text>
//         </View>
//       </View>
//     </Page>
//     {/* Second Page: General Examination, Systemic Examination, Final Impression */}
//     <Page size="A4" style={styles.page}>
//       {/* General Examination */}
//       <View style={[styles.section]}>
//         <Text style={[styles.bold, { textAlign: "center", marginBottom: 6 }]}>
//           General Examination
//         </Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Height:</Text>
//           <DottedField width={60} value={data?.height} />
//           <Text style={{ marginLeft: 2 }}>cm</Text>
//           <Text style={[styles.label, { marginLeft: 16 }]}>Weight:</Text>
//           <DottedField width={60} value={data?.weight} />
//           <Text style={{ marginLeft: 2 }}>Kg</Text>
//           <Text style={[styles.label, { marginLeft: 16 }]}>BMI:</Text>
//           <DottedField width={60} value={data?.bmi} />
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>BP:</Text>
//           <DottedField width={60} value={data?.cholestrolData?.["highBp"]} />
//           <Text style={{ marginLeft: 2 }}>/</Text>
//           <DottedField width={60} value={data?.cholestrolData?.["lowBp"]} />
//           <Text style={{ marginLeft: 2 }}>mmHg</Text>
//           <Text style={[styles.label, { marginLeft: 16 }]}>Pulse:</Text>
//           <DottedField width={60} value={data?.pulseRate || ""} />
//           <Text style={{ marginLeft: 2 }}>bpm</Text>
//           <Text style={[styles.label, { marginLeft: 16 }]}>SpO2:</Text>
//           <DottedField width={60} value={data?.spO2Percent || ""} />
//           <Text style={{ marginLeft: 2 }}>%</Text>
//         </View>
//       </View>
//       <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />
//       {/* Inspection */}
//       <View style={[styles.section]}>
//         <Text
//           style={[
//             styles.bold,
//             { textDecoration: "underline", marginBottom: 4 },
//           ]}
//         >
//           Inspection:
//         </Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Pallor:</Text>
//           <DottedField
//             width={80}
//             value={data?.doctorConsultationFormData?.examSignPallor || "NAD"}
//           />
//           <Text style={[styles.label, { marginLeft: 8 }]}>Icterus:</Text>
//           <DottedField
//             width={80}
//             value={data?.doctorConsultationFormData?.examSignIcterus || "NAD"}
//           />
//           <Text style={[styles.label, { marginLeft: 8 }]}>Cyanosis:</Text>
//           <DottedField
//             width={80}
//             value={data?.doctorConsultationFormData?.examSignCyanosis || "NAD"}
//           />
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Clubbing:</Text>
//           <DottedField
//             width={80}
//             value={data?.doctorConsultationFormData?.examSignClubbing}
//           />
//           <Text style={[styles.label, { marginLeft: 8 }]}>Pedal Edema:</Text>
//           <DottedField
//             width={80}
//             value={
//               data?.doctorConsultationFormData?.examSignPedalEdema || "NAD"
//             }
//           />
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Skin Examination:</Text>
//           <DottedField
//             width={300}
//             value={data?.doctorConsultationFormData?.examSkin || "NAD"}
//           />
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Oral Hygiene:</Text>
//           <DottedField
//             width={120}
//             value={data?.doctorConsultationFormData?.examOralHygiene || "NAD"}
//           />
//           <Text style={[styles.label, { marginLeft: 16 }]}>Deformities:</Text>
//           <DottedField
//             width={120}
//             value={data?.doctorConsultationFormData?.examDeformities || "NAD"}
//           />
//         </View>
//       </View>
//       <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />
//       {/* Systemic Examination */}
//       <View style={[styles.section]}>
//         <Text style={[styles.bold, { textAlign: "center", marginBottom: 6 }]}>
//           Systemic Examination
//         </Text>
//         <View style={styles.row}>
//           <Text style={styles.label}>Cardio-Vascular System:</Text>
//           <DottedField
//             width={120}
//             value={data?.doctorConsultationFormData?.examCvs || "NAD"}
//           />
//           <Text style={[styles.label, { marginLeft: 16 }]}>
//             Respiratory System:
//           </Text>
//           <DottedField
//             width={120}
//             value={data?.doctorConsultationFormData?.examRespiratory || "NAD"}
//           />
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Gastro-Intestinal System:</Text>
//           <DottedField
//             width={120}
//             value={
//               data?.doctorConsultationFormData?.examGastrointestinal || "NAD"
//             }
//           />
//           <Text style={[styles.label, { marginLeft: 16 }]}>
//             Central Nervous System:
//           </Text>
//           <DottedField
//             width={120}
//             value={data?.doctorConsultationFormData?.examCns || "NAD"}
//           />
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Vision Examination Final Impression:</Text>
//           <DottedField
//             width={220}
//             value={
//               data?.doctorConsultationFormData?.visionFinalImpression || "NAD"
//             }
//           />
//         </View>
//       </View>
//       <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />
//       {/* Provisional Diagnosis & Advice */}
//       <View style={[styles.section]}>
//         <View style={styles.row}>
//           <Text style={styles.label}>Provisional Diagnosis:</Text>
//           <DottedField
//             width={350}
//             value={
//               data?.doctorConsultationFormData?.diagnosisProvisional || "NAD"
//             }
//           />
//         </View>
//         <View style={styles.row}>
//           <Text style={styles.label}>Advice:</Text>
//           <DottedField
//             width={400}
//             value={data?.doctorConsultationFormData?.diagnosisAdvice || "NAD"}
//           />
//         </View>
//       </View>
//       <View style={{ borderBottom: "1pt solid #000", marginVertical: 10 }} />
//       {/* Final Impression */}
//       <View style={[styles.section]}>
//         <Text
//           style={[
//             styles.bold,
//             { textDecoration: "underline", marginBottom: 4 },
//           ]}
//         >
//           Final Impression:
//         </Text>

//         <View
//           style={{
//             flexDirection: "row",
//             flexWrap: "wrap",
//             gap: 4,
//             marginBottom: 20,
//           }}
//         >
//           <Text>I do hereby certify that</Text>
//           <DottedField width={180} value={data?.name} />
//           <Text>Employee with</Text>
//           <Text style={styles.bold}>GLOBAL CALCIUM PVT LTD ,</Text>
//           <Text>has been carefully examined by me on</Text>
//           <DottedField width={120} value={data?.vitalsCreatedDate} />
//           <Text>, based on Medical Report & Physical</Text>
//           <Text>examination conducted,</Text>
//           <Text>He is found free from any</Text>
//           <Text>diseases and He is to work in the above-mentioned</Text>
//           <Text style={styles.bold}>Medically Fit</Text>
//           <Text>establishment.</Text>
//         </View>

//         <View style={styles.row}>
//           <Text style={styles.label}>Place: Hosur</Text>
//         </View>
//         <View style={[styles.row]}>
//           <Text style={styles.label}>Date:</Text>
//           <DottedField width={100} value={data?.vitalsCreatedDate} />
//           <Text style={{ flex: 1 }}></Text>
//           <Text style={[styles.bold, { textAlign: "right", flex: 1 }]}>
//             Signature of Medical Officer with Seal
//           </Text>
//           <Image
//             src={dr_kunal_stamp_sign}
//             style={{
//               height: 60,
//               width: 80,
//               position: "absolute",
//               bottom: 10,
//               right: 100,
//             }}
//           />
//         </View>
//       </View>
//     </Page>
//   </Document>
// );

// export default GlobalCalciumDoctorConsultationFormTemplate;
