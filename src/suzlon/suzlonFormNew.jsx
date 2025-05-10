import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
  PDFViewer,
} from "@react-pdf/renderer";
import { getData } from "../assets/services/GetApiCall";
import { uploadFile } from "../assets/services/PostApiCall";
import { useSnackbar } from "notistack";
import { sortDataByName } from "../assets/utils";
import { updateData } from "../assets/services/PatchApi";

const bloodReportRemarks = [
  {
    empId: "3004",
    remarks: "Medical consultation advise\nConsult Physician",
    parameter: "BLOOD SUGAR RANDOM",
  },
  {
    empId: "2146",
    remarks: "medical consultation advise",
    parameter: "BLOOD SUGAR RANDOM",
  },
  {
    empId: "2297",
    remarks: "Medical consultation advise\n",
    parameter: "HB",
  },
  {
    empId: "1165",
    remarks:
      "Medical consultation advise\nPrescribe medicine name R/B Tone syrup",
    parameter: "HB",
  },
  {
    empId: "1157",
    remarks:
      "Medical consultation advise\nPrescribe medicine name R/B Tone syrup",
    parameter: "HB",
  },
  {
    empId: "1218",
    remarks:
      "Medical consultation advise\nPrescribe medicine name R/B Tone syrup",
    parameter: "HB",
  },
  {
    empId: "1219",
    remarks:
      "Medical consultation advise\nPrescribe medicine name R/B Tone syrup",
    parameter: "HB",
  },
  {
    empId: "1593",
    remarks:
      "Medical consultation advise\nPrescribe medicine name R/B Tone syrup",
    parameter: "HB",
  },
  {
    empId: "1088",
    remarks:
      "Medical consultation advise\nPrescribe medicine name R/B Tone syrup",
    parameter: "HB",
  },
  {
    empId: "1062",
    remarks: "Medical consultation advise\nPrescribe Medicine R/B tone syrup",
    parameter: "HB",
  },
  {
    empId: "3060",
    remarks:
      "Medical consultation advise\nPrescribe medicine name R/B Tone syrup",
    parameter: "HB",
  },
];

const audioRemarks = [
  {
    empId: "4005",
    remarks: "Medical consultation advise\n",
    parameter: "AirRightLow",
  },
  {
    empId: "4005",
    remarks: "Medical consultation advise\n",
    parameter: "AirRightMid",
  },
  {
    empId: "4005",
    remarks: "Medical consultation advise\n",
    parameter: "AirRightHigh",
  },
  {
    empId: "4005",
    remarks: "Medical consultation advise\n",
    parameter: "AirRightAverage",
  },
];

Font.register({
  family: "Roboto-Bold",
  src: "https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlfBBc9.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 10,
    backgroundColor: "white",
    fontFamily: "Times-Roman",
  },
  border: {
    border: 1,
    borderColor: "black",
    padding: 20,
    margin: 5,
    minHeight: "95%",
  },
  title: {
    fontSize: 12,
    fontFamily: "Times-Bold",
  },
  divider: {
    borderBottom: 2,
    borderBottomColor: "#8B4513",
    marginVertical: 5,
  },
  mainTitle: {
    fontSize: 14,
    color: "#007e7e",
    fontFamily: "Times-Bold",
    textAlign: "center",
    marginBottom: 30,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    width: "auto",
    marginRight: 5,
  },
  value: {
    flex: 1,
    borderBottom: 1,
    borderBottomColor: "black",
    marginRight: 10,
    height: 15,
  },
  valueWithoutBorderBottom: {
    flex: 1,
    marginRight: 10,
    height: 15,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Times-Bold",
    marginTop: 20,
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 11,
    marginBottom: 20,
    paddingLeft: 20,
  },
  physicalMeasurement: {
    marginTop: 20,
  },
  table: {
    width: "100%",
    // marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tableCell: {
    flex: 1,
    fontSize: 11,
  },
  horizontalLine: {
    borderBottom: 1,
    borderBottomColor: "black",
    marginVertical: 13,
  },
  annexureTitle: {
    fontSize: 14,
    fontFamily: "Times-Bold",
    marginBottom: 5,
  },
  decorativeLine: {
    borderBottom: 2,
    borderBottomColor: "#8B4513",
    marginVertical: 5,
  },
  mainTitle2: {
    fontSize: 14,
    color: "#2B7A78",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
    fontFamily: "Times-Bold",
  },
  subTitle: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "Times-Bold",
  },
  disclaimer: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Times-Bold",
  },
  formRow2: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "center",
  },
  numberLabel: {
    width: 20,
    fontSize: 11,
  },
  label2: {
    fontSize: 11,
    width: "auto",
    marginRight: 5,
  },
  colon: {
    fontSize: 11,
    marginRight: 5,
  },
  value2: {
    borderBottom: 1,
    borderBottomColor: "black",
    paddingBottom: 2,
    minWidth: 100, // <- ensure some visible width
    height: "auto", // <- or remove height entirely
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 15,
  },
  dateLabel: {
    fontSize: 11,
    marginRight: 5,
  },
  paragraph: {
    fontSize: 11,
    marginVertical: 10,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  orText: {
    fontSize: 11,
    textAlign: "center",
    marginVertical: 10,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
  },
  signatureBox: {
    width: "45%",
  },
  signatureText: {
    fontSize: 11,
    textAlign: "left",
  },
});

const HealthCheckupPDF = ({ data = {} }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.border}>
        <Text style={styles.title}>Annexure IV</Text>

        <View
          style={{
            border: "1px solid brown",
            width: "100%",
            marginVertical: 10,
          }}
        />

        <Text style={styles.mainTitle}>
          Pre-Employment /Periodic Health Check-up Card
        </Text>

        <View style={styles.formRow}>
          <View style={{ flex: 3, flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.label}>Name:</Text>
            <View style={{ ...styles.value, justifyContent: "center" }}>
              <Text style={{ fontSize: 11 }}>{data?.name || ""}</Text>
            </View>
          </View>

          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.label}>Date:</Text>
            <View style={{ ...styles.value, justifyContent: "center" }}>
              <Text style={{ fontSize: 11 }}>
                {data?.vitalsCreatedDate ||
                  "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Age:</Text>
          <View style={{ ...styles.value, justifyContent: "center" }}>
            <Text style={{ fontSize: 11 }}>
              {data?.age || "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
            </Text>
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={{ flex: 3, flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.label}>Address:</Text>
            <View style={{ ...styles.value, justifyContent: "center" }}>
              <Text style={{ fontSize: 8 }}>
                {"Survey No. 291/296/297, Village - Borali,Tehsil - Badnawar, District - Dhar - 454 660, MP, India" ||
                  "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.label}>Sex:</Text>
            <View style={{ ...styles.value, justifyContent: "center" }}>
              <Text style={{ fontSize: 11 }}>
                {data?.gender || "Male / Female"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.formRow}>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.label}>Employee Code No:</Text>
            <View style={{ ...styles.value, justifyContent: "center" }}>
              <Text style={{ fontSize: 11 }}>
                {data?.empId || "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.label}>Location:</Text>
            <View style={{ ...styles.value, justifyContent: "center" }}>
              <Text style={{ fontSize: 11 }}>Badnawar</Text>
            </View>
          </View>
        </View>

        <Text style={{ ...styles.sectionTitle, fontFamily: "Roboto-Bold" }}>
          Nature of Job:-
        </Text>
        <Text style={styles.sectionContent}>{data.NATURE_OF_JOB || ""}</Text>

        <Text style={{ ...styles.sectionTitle, fontFamily: "Roboto-Bold" }}>
          Present Complaints:
        </Text>
        <Text style={styles.sectionContent}>
          {data.PRESENT_COMPLAINTS || ""}
        </Text>

        <Text style={{ ...styles.sectionTitle, fontFamily: "Roboto-Bold" }}>
          Physical Activity:
        </Text>
        <Text style={styles.sectionContent}>
          None * Less than 10-30 mins / 1-2 times /wk More than 30 mins more
          thantwice/wk
        </Text>

        <Text style={{ ...styles.sectionTitle, fontFamily: "Roboto-Bold" }}>
          Personal History:
        </Text>
        <Text style={styles.sectionContent}>
          Hypertension, Diabetes, Asthma, TB, Accident, Operation, epilepsy,
          Jaundice, Any Rx,
        </Text>

        <Text style={{ ...styles.sectionTitle, fontFamily: "Roboto-Bold" }}>
          Family History:
        </Text>
        <Text style={styles.sectionContent}>{data.familyHistory || ""}</Text>

        <Text style={{ ...styles.sectionTitle, fontFamily: "Roboto-Bold" }}>
          Personal History:
        </Text>
        <Text style={styles.sectionContent}>
          Appetite, Bowel Habit, Menstruation, Sleep
        </Text>

        <Text style={{ ...styles.sectionTitle, fontFamily: "Roboto-Bold" }}>
          Habit:
        </Text>
        <Text style={styles.sectionContent}>
          Alcohol - {data?.healthHistoryFormData?.alcoholHabit}, Tobacco -{" "}
          {data?.healthHistoryFormData?.smokingHabit}, Smoking -{" "}
          {data?.healthHistoryFormData?.tobaccoHabit}
        </Text>
      </View>
    </Page>

    <Page size="A4" style={styles.page}>
      <View style={styles.border}>
        <Text
          style={{
            fontSize: 11,
            fontFamily: "Roboto-Bold",
            marginBottom: 5,
          }}
        >
          Physical Measurement
        </Text>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Height: {data.height || ""} Cms</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Chest on Expiration: {data.chestExpiration || ""}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Weight: {data.weight || ""} Kgs</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Chest on Inspiration: {data.chestInspiration || ""}</Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>Abdominal Girth: {data.abdominalGirth || ""} Cms</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Hips: {data.hipGirth || ""} Cms</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>BMI: {data.bmi || ""}</Text>
            </View>
          </View>
        </View>

        <View style={styles.horizontalLine} />

        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Roboto-Bold",
              width: 100,
            }}
          >
            Eye:
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>Vision</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Right</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Left</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Colour Vision: {data?.colourVision}</Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>Near</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>
                  {data?.nearRightEyeSight ||
                    data?.nearRightEyeSightWithGlasses}
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text>
                  {data?.nearLeftEyeSight || data?.nearLeftEyeSightWithGlasses}
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text>
                  {data?.nearRightEyeSightWithGlasses ||
                  data?.nearLeftEyeSightWithGlasses
                    ? "With Glasses"
                    : "Without Glasses"}
                </Text>
              </View>
            </View>

            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>Far</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>
                  {data?.farRightEyeSight || data?.farRightEyeSightWithGlasses}
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text>
                  {data?.farLeftEyeSight || data?.farLeftEyeSightWithGlasses}
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text>
                  {data?.farRightEyeSightWithGlasses ||
                  data?.farLeftEyeSightWithGlasses
                    ? "With Glasses"
                    : "Without Glasses"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.horizontalLine} />

        <View style={{ flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Roboto-Bold",
              width: 100,
            }}
          >
            ENT:
          </Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>Ears: {data.ears || ""}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Nose: {data.nose || ""}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Throat: {data.throat || ""}</Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>Tonsils: {data.tonsils || ""}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>Teeth: {data.teeth || ""}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.horizontalLine} />

        <View>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Roboto-Bold",
              marginBottom: 5,
            }}
          >
            Systemic Examination
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              alignItems: "center",
            }}
          >
            <Text style={styles.label}>Respiratory System:</Text>
            <View style={styles.valueWithoutBorderBottom} />
            <Text style={styles.label}>Rate: </Text>
            <View
              style={{
                ...styles.valueWithoutBorderBottom,
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 11 }}> {data?.respRate || ""}</Text>
            </View>
            <View style={styles.valueWithoutBorderBottom}></View>
            <Text style={styles.label}>Auscultation:</Text>
            <View style={styles.valueWithoutBorderBottom} />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>X-Ray Chest: NAD</Text>
            <View style={styles.valueWithoutBorderBottom} />
          </View>
        </View>

        <View style={styles.horizontalLine} />

        <View>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Roboto-Bold",
              marginBottom: 5,
            }}
          >
            Cardio Vascular System:
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              alignItems: "center",
            }}
          >
            <Text style={styles.label}>Pulse:</Text>
            <View
              style={{
                ...styles.valueWithoutBorderBottom,
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 11 }}> {data?.pulseRate}</Text>
            </View>
            <Text style={styles.label}>per min</Text>
            <Text style={styles.label}>B.P.</Text>
            <View
              style={{
                ...styles.valueWithoutBorderBottom,
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 11 }}> {data?.bp}</Text>
            </View>

            <Text style={styles.label}>mm of hg</Text>
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>Heart Sounds:</Text>
            <View style={styles.valueWithoutBorderBottom} />
          </View>
        </View>

        <View style={styles.horizontalLine} />

        <View>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              alignItems: "center",
            }}
          >
            <Text style={{ ...styles.label, fontFamily: "Roboto-Bold" }}>
              Per Abdomen:
            </Text>
            <View style={styles.valueWithoutBorderBottom} />
            <Text style={styles.label}>Liver:</Text>
            <View style={styles.valueWithoutBorderBottom} />
            <Text style={styles.label}>Spleen:</Text>
            <View style={styles.valueWithoutBorderBottom} />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>Kidney:</Text>
            <View style={styles.valueWithoutBorderBottom} />
          </View>
        </View>

        <View style={styles.horizontalLine} />

        <View>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Roboto-Bold",
              marginBottom: 5,
            }}
          >
            Central Nervous System:
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              alignItems: "center",
            }}
          >
            <Text style={styles.label}>Reflex:</Text>
            <View style={styles.valueWithoutBorderBottom} />
            <Text style={styles.label}>Sensation:</Text>
            <View style={styles.valueWithoutBorderBottom} />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>Physiological make up:</Text>
            <View style={styles.valueWithoutBorderBottom} />
          </View>
        </View>

        <View style={styles.horizontalLine} />

        <View>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Roboto-Bold",
              marginBottom: 5,
            }}
          >
            Genito Urinary System:
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              alignItems: "center",
            }}
          >
            <Text style={styles.label}>Hyrocoele:</Text>
            <View style={styles.valueWithoutBorderBottom} />
            <Text style={styles.label}>Hernia:</Text>
            <View style={styles.valueWithoutBorderBottom} />
          </View>
        </View>

        <View style={styles.horizontalLine} />

        <View>
          <Text
            style={{
              fontSize: 11,
              fontFamily: "Roboto-Bold",
              marginBottom: 5,
            }}
          >
            Musculo Skeletal System:
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginBottom: 5,
              alignItems: "center",
            }}
          >
            <Text style={styles.label}>Spine:</Text>
            <View style={styles.valueWithoutBorderBottom} />
            <Text style={styles.label}>Joints:</Text>
            <View style={styles.valueWithoutBorderBottom} />
          </View>
          <View style={styles.formRow}>
            <Text style={styles.label}>Muscle Tone:</Text>
            <View style={styles.valueWithoutBorderBottom} />
          </View>
        </View>
      </View>
    </Page>

    <Page size="A4" style={styles.page}>
      <View style={styles.border}>
        <Text style={{ ...styles.sectionTitle, fontFamily: "Roboto-Bold" }}>
          Other Findings:
        </Text>
        <Text style={styles.sectionContent}>{data.otherFindings || ""}</Text>

        <Text style={{ ...styles.sectionTitle, fontFamily: "Roboto-Bold" }}>
          Remarks & Advice
        </Text>
        <View
          style={{
            borderBottom: 1,
            borderBottomColor: "black",
            marginBottom: 100,
          }}
        />
        <View
          style={{
            borderBottom: 1,
            borderBottomColor: "black",
            marginVertical: 20,
          }}
        />

        <Text style={{ ...styles.sectionTitle, fontFamily: "Roboto-Bold" }}>
          Reports:
        </Text>
        <Text
          style={{
            fontSize: 11,
            marginVertical: 20,
            paddingLeft: 20,
            fontFamily: "Roboto-Bold",
          }}
        >
          PFT
        </Text>
        <Text
          style={{
            fontSize: 11,
            marginTop: 20,
            paddingLeft: 20,
            marginBottom: 5,
            fontFamily: "Roboto-Bold",
          }}
        >
          Blood :
        </Text>
        <Text
          style={{
            fontSize: 11,
            marginBottom: 20,
            paddingLeft: 20,
          }}
        >
          {bloodReportRemarks.filter((item) => item.empId === data?.empId)
            .length > 0
            ? bloodReportRemarks
                .filter((item) => item.empId === data?.empId)
                .map((item) => `${item.parameter}: ${item.remarks}`)
                .join("\n")
            : "NAD"}
        </Text>
        <Text
          style={{
            fontSize: 11,
            marginVertical: 20,
            paddingLeft: 20,
            fontFamily: "Roboto-Bold",
          }}
        >
          ECG
        </Text>
        <Text
          style={{
            fontSize: 11,
            marginTop: 20,
            paddingLeft: 20,
            marginBottom: 5,
            fontFamily: "Roboto-Bold",
          }}
        >
          Audiometry:
        </Text>
        <Text
          style={{
            fontSize: 11,
            marginBottom: 20,
            paddingLeft: 20,
          }}
        >
          {audioRemarks
            .filter((item) => item.empId === data?.empId)
            .map((item) => `${item.parameter}: ${item.remarks}`).length > 0
            ? audioRemarks
                .filter((item) => item.empId === data?.empId)
                .map((item) => `${item.parameter}: ${item.remarks}`)
                .join("\n")
            : "NAD"}
        </Text>
      </View>
    </Page>

    {/* <Page size="A4" style={styles.page}>
      <View style={styles.border}>
        <Text style={styles.annexureTitle}>Annexure V</Text>
        <View style={styles.decorativeLine} />

        <Text style={styles.mainTitle2}>
          Medical Fitness Certificate In case of Pre -employment
        </Text>
        <Text style={styles.subTitle}>MEDICAL FITNESS CERTIFICATE</Text>
        <Text style={styles.disclaimer}>
          (TO BE ISSUED BY REGISTER MEDICAL PRATICTIONER ONLY )
        </Text>

        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Date: -</Text>
          <View style={{ ...styles.value, justifyContent: "center" }}>
            <Text style={{ fontSize: 11 }}>
              {data?.vitalsCreatedDate || ""}
            </Text>
          </View>
        </View>

        <View style={styles.formRow2}>
          <Text style={styles.numberLabel}>1.</Text>
          <Text style={styles.label2}>Name of the person examined</Text>
          <Text style={styles.colon}>:</Text>
          <View style={{ ...styles.value, justifyContent: "center" }}>
            <Text style={{ fontSize: 11 }}>{data?.name || ""}</Text>
          </View>
        </View>

        <View style={styles.formRow2}>
          <Text style={styles.numberLabel}>2.</Text>
          <Text style={styles.label2}>Father's Name</Text>
          <Text style={styles.colon}>:</Text>
          <View style={{ ...styles.value, justifyContent: "center" }}>
            <Text style={{ fontSize: 11 }}>{data?.fathersName || ""}</Text>
          </View>
        </View>

        <View style={styles.formRow2}>
          <Text style={styles.numberLabel}>3.</Text>
          <Text style={styles.label2}>Sex</Text>
          <Text style={styles.colon}>:</Text>
          <View style={{ ...styles.value, justifyContent: "center" }}>
            <Text style={{ fontSize: 11 }}>{data?.gender || ""}</Text>
          </View>
        </View>

        <View style={styles.formRow2}>
          <Text style={styles.numberLabel}>4.</Text>
          <Text style={styles.label2}>Residence</Text>
          <Text style={styles.colon}>:</Text>
          <View style={{ ...styles.value, justifyContent: "center" }}>
            <Text style={{ fontSize: 11 }}>{data?.address || ""}</Text>
          </View>
        </View>

        <View style={styles.formRow2}>
          <Text style={styles.numberLabel}>5.</Text>
          <Text style={styles.label2}>Date of Birth (if available)</Text>
          <Text style={styles.colon}>:</Text>
          <View style={{ ...styles.value, justifyContent: "center" }}>
            <Text style={{ fontSize: 11 }}>{data?.dateOfBirth || ""}</Text>
          </View>
        </View>

        <View style={styles.formRow2}>
          <Text style={styles.numberLabel}>6.</Text>
          <Text style={styles.label2}>Name & address of the factory</Text>
          <Text style={styles.colon}>:</Text>
          <View style={{ ...styles.value, justifyContent: "center" }}>
            <Text style={{ fontSize: 11 }}></Text>
          </View>
        </View>

        <View style={styles.formRow2}>
          <Text style={styles.numberLabel}>7.</Text>
          <Text style={styles.label2}>The candidate is proposed for</Text>
          <Text style={styles.colon}>:</Text>
          <View style={{ ...styles.value, justifyContent: "center" }}>
            <Text style={{ fontSize: 11 }}></Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          I certify that I have personally examined the above named person whose
          identificationmarks are _______________________________
        </Text>

        <Text style={styles.paragraph}>
          And who is desirous of being employed in above mentioned
          process/operation and that his /her age, as nearly as can be
          ascertained from my examination is _____ years. In my opinion he /she
          is fit for employment in the said process/ operation.
        </Text>

        <Text style={styles.paragraph}>
          In my opinion he/she is unfit for employment in the said process /
          operation for the reason _________________________________.
        </Text>

        <Text style={styles.orText}>Or</Text>

        <Text style={styles.paragraph}>
          He/She is referred for further expertopinion.
        </Text>

        <Text style={styles.paragraph}>
          Also his / her{" "}
          <Text style={{ fontFamily: "Roboto-Bold" }}>
            Vertigo screening test
          </Text>{" "}
          as per Annexure VI and Annexure VII is Negative / Positive / Not
          Applicable and can be employed in tower climbing operations (Only for
          applicable Roles)
        </Text>

        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>
              Signature or left hand thumb impression
            </Text>
            <Text style={styles.signatureText}>person examined/Name</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureText}>Signature and Sealof the</Text>
            <Text style={styles.signatureText}>Medical Practitioner</Text>
          </View>
        </View>
      </View>
    </Page> */}
  </Document>
);

const SuzlonFormNew = ({
  corpId = "5cc0376c-1038-4260-9fc3-ee553bfc33b1",
  campCycleId = "285781",
  fileType = "CONSOLIDATED_REPORT",
  // fileType = "ANNEXURE",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const generateAndUploadPDF = async (data) => {
    try {
      const blob = await pdf(<HealthCheckupPDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      const formData = new FormData();
      formData.append("file", blob, `${data.empId}_consolidatedReport.pdf`);

      // const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
      // const result = await uploadFile(url, formData);

      // if (result && result.data) {
      //   enqueueSnackbar(`Uploaded PDF for ${data?.name}`, {
      //     variant: "success",
      //   });
      //   setUploadedCount((prevCount) => prevCount + 1);
      // } else {
      //   enqueueSnackbar(`Upload failed for ${data?.name}`, {
      //     variant: "error",
      //   });
      // }
    } catch (err) {
      enqueueSnackbar(`Error uploading for ${data?.name}`, {
        variant: "error",
      });
    }
  };

  const deleteFiles = async (data) => {
    try {
      const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;
      const result = await updateData(url, "");

      if (result && result.data) {
        enqueueSnackbar(`Deleted PDF for ${data.name}`, {
          variant: "success",
        });
      } else {
        enqueueSnackbar(`Delete failed for ${data.name}`, {
          variant: "error",
        });
      }
    } catch (err) {
      enqueueSnackbar(`Error deleting for ${data.name}`, {
        variant: "error",
      });
    }
  };

  const fetchListOfEmployees = async () => {
    const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);
    if (result && result.data) {
      console.log("Fetched Data successfully");
      const temp = result.data.filter((item) => item.empId === "4005");
      setList(sortDataByName(temp));
      setTotalEmployees(temp.length);
    } else {
      console.log("An error occurred");
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
  }, []);

  const handleBatchUpload = async () => {
    setIsUploading(true);
    for (let i = 0; i < 1; i++) {
      await generateAndUploadPDF(list[i]);
    }
    setIsUploading(false);
    enqueueSnackbar("All PDFs processed", { variant: "success" });
  };

  const handleDeletePDF = async () => {
    setIsUploading(true);
    for (let i = 0; i < 1; i++) {
      await deleteFiles(list[i]);
    }
    setIsUploading(false);
    enqueueSnackbar("All PDFs deleted", { variant: "info" });
  };

  return (
    <div>
      <h2>Total Employees: {totalEmployees}</h2>
      <h3>Uploaded: {uploadedCount}</h3>
      <button onClick={handleBatchUpload} disabled={isUploading}>
        {isUploading ? "Processing..." : "Generate & Upload PDFs"}
      </button>
      <button
        onClick={handleDeletePDF}
        disabled={isUploading}
        style={{ marginLeft: "10px" }}
      >
        {isUploading ? "Processing..." : "Delete Uploaded PDFs"}
      </button>
      {list.map((item, index) => (
        <div key={index}>
          <span>{item.empId}</span> <span>{item.name}</span>{" "}
          {/* <a href={item.annexureUrl}>
            <div>{item.annexureUrl}</div>
          </a> */}
          <a href={item.consolidatedRUrl}>
            <div>{item.consolidatedRUrl}</div>
          </a>
        </div>
      ))}
    </div>
    // <div className="min-h-screen bg-gray-100">
    //   <PDFViewer style={{ width: "100%", height: "100vh" }}>
    //     <HealthCheckupPDF data={sampleData} />
    //   </PDFViewer>
    // </div>
  );
};

export default SuzlonFormNew;
