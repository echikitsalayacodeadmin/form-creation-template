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
import dr_kunal_stamp_sign from "../assets/images/dr_kunal_stamp_sign.png";
import daburLogo from "../assets/images/daburLogo.png";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

const styles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman-Normal",
    fontSize: 11,
    backgroundColor: "#ffffff",
    paddingHorizontal: 40,
    paddingVertical: 10,
    lineHeight: 1.4,
  },
  logo: {
    width: 80,
    height: 60,
    marginBottom: 20,
  },
  header: {
    textAlign: "center",
  },
  companyName: {
    fontSize: 14,
    fontFamily: "Times-Roman-Bold",
    textAlign: "center",
    marginBottom: 5,
  },
  unit: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
    width: 100,
  },
  title: {
    fontSize: 12,
    fontFamily: "Times-Roman-Bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 5,
  },
  regulation: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 30,
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 15,
    textAlign: "justify",
    lineHeight: 1.6,
  },
  underlineField: {
    borderBottom: "1px solid #000",
    minHeight: 15,
    paddingBottom: 0.5,
    display: "inline-block",
    minWidth: 200,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
  },
  signatureLabel: {
    fontSize: 11,
    marginBottom: 5,
  },
  signatureSpace: {
    minHeight: 60,
    marginBottom: 10,
  },
  enclosure: {
    fontSize: 11,
    marginBottom: 30,
  },
  examinationTitle: {
    fontSize: 11,
    fontFamily: "Times-Roman-Bold",
    textDecoration: "underline",
    marginBottom: 10,
  },
  examinationList: {
    fontSize: 11,
    marginLeft: 20,
  },
  listItem: {
    marginBottom: 5,
  },
  // Page 2 styles
  formTitle: {
    fontSize: 12,
    fontFamily: "Times-Roman-Bold",
    textAlign: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Times-Roman-Bold",
    marginBottom: 0,
    marginTop: 0,
  },
  table: {
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
    alignItems: "center",
  },
  tableCell: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRight: "1px solid #000",
    fontSize: 10,
  },
  tableCellLast: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 10,
  },
  tableCellHeader: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRight: "1px solid #000",
    fontSize: 10,
    fontFamily: "Times-Roman-Normal",
    backgroundColor: "#f0f0f0",
  },
  tableCellHeaderLast: {
    flex: 1,
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 10,
    fontFamily: "Times-Roman-Normal",
    backgroundColor: "#f0f0f0",
  },
  wideCell: {
    flex: 3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 10,
  },
  bottomSignature: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  bottomSignatureItem: {
    width: "30%",
  },
  bottomLabel: {
    fontSize: 11,
    marginBottom: 5,
  },
  bottomSpace: {
    minHeight: 20,
    borderBottom: "1px solid #000",
    marginBottom: 5,
  },
  sealSection: {
    textAlign: "center",
    marginTop: 20,
  },
  sealLabel: {
    fontSize: 11,
    marginBottom: 5,
  },
  sealSpace: {
    minHeight: 40,
    borderBottom: "1px solid #000",
    width: 200,
    alignSelf: "center",
  },

  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    display: "inline",
    paddingHorizontal: 2,
    marginHorizontal: 2,
    textDecoration: "underline",
  },
});

const DaburMedicalTemplate = ({ data }) => (
  <Document>
    {/* Page 1 - Certificate */}
    <Page size="A4" style={styles.page}>
      <Image src={daburLogo} style={{ height: 50, width: 50 }} />
      <View style={styles.header}>
        <Text style={styles.companyName}>Dabur India Limited</Text>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={styles.unit}>
            <Text style={[styles.underline]}>Tezpur</Text> Unit
          </Text>
        </View>
      </View>

      <Text style={styles.title}>
        PERFORMA FOR MEDICAL FITNESS CERTIFICATE FOR FOOD HANDLERS
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={[styles.subtitle, { fontFamily: "Times-Roman-Bold" }]}>
            (FOR THE YEAR <Text style={[styles.underline]}>2025</Text>)
          </Text>
        </View>
      </View>

      <Text style={styles.regulation}>
        (See Para No. 10.1.2, Part-II, Schedule – 4 of FSS Regulation, 2011)
      </Text>

      <Text style={styles.paragraph}>
        It is certified that Shri/Smt./Miss{" "}
        <Text style={[styles.underline]}>
          {data?.employeeName ||
            "                                                                                                                                 "}
        </Text>{" "}
        S/o, D/o, W/o{" "}
        <Text style={[styles.underline]}>
          {data?.fatherName ||
            "                                                     "}
        </Text>{" "}
        employed with M/s Dabur India Limited,{" "}
        <Text style={[styles.underline]}>
          {data?.unit ||
            "                                                               "}
        </Text>{" "}
        Unit, coming in direct contact with food items has been carefully
        examined* by me on date{" "}
        <Text style={[styles.underline]}>{data?.examinationDate || ""}</Text>.
      </Text>

      <Text style={styles.paragraph}>
        Based on the medical examination conducted, he/she is found free from
        any infectious or communicable diseases and the person is fit to work in
        the above mentioned food establishment.
      </Text>

      <Text style={styles.paragraph}>
        His/Her medical checkup and inoculation sheet is attached.
      </Text>

      <View style={styles.signatureSection}>
        <View style={[styles.signatureBox, { marginTop: 80 }]}>
          <Text style={[styles.signatureLabel]}>
            Date: <Text style={styles.underline}></Text>
          </Text>

          <Text style={styles.signatureLabel}>
            Place: <Text style={styles.underline}>{data?.place || ""}</Text>
          </Text>
        </View>

        <View style={styles.signatureBox}>
          <Image src={dr_kunal_stamp_sign} style={{ height: 80, width: 120 }} />
          <Text style={styles.signatureLabel}>
            Name and Signature with Seal of Registered Medical Practitioner /
            Civil Surgeon
          </Text>
        </View>
      </View>

      <View style={{ width: "100%" }}>
        <Text style={styles.enclosure}>Encl: as above</Text>
      </View>

      <Text style={styles.examinationTitle}>
        * Medical Examination to be conducted:
      </Text>
      <View style={styles.examinationList}>
        <Text style={styles.listItem}>1. Physical Examination</Text>
        <Text style={styles.listItem}>2. Eye Test</Text>
        <Text style={styles.listItem}>3. Skin Examination</Text>
        <Text style={styles.listItem}>
          4. Compliance with schedule of Vaccine to be inoculated against
          enteric group of diseases
        </Text>
        <Text style={styles.listItem}>
          5. Any test required to confirm any communicable or infectious disease
          which the person suspected to be suffering from on clinical
          examination.
        </Text>
      </View>
    </Page>

    {/* Page 2 - Medical Checkup Form */}
    <Page size="A4" style={styles.page}>
      <Image src={daburLogo} style={{ height: 50, width: 50 }} />
      <View style={styles.header}>
        <Text style={[styles.companyName, { marginBottom: 0 }]}>
          Dabur India Limited
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
          <Text style={[styles.unit, { marginBottom: 0 }]}>
            <Text style={[styles.underline]}>Tezpur</Text> Unit
          </Text>
        </View>
        <Text style={styles.title}>Medical Checkup & Inoculation Sheet</Text>
      </View>

      <Text style={styles.sectionTitle}>Personal Details:-</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, { borderTop: "1px solid #000" }]}>
          <Text style={styles.tableCellHeader}>Name</Text>
          <Text style={styles.tableCellLast}>{data?.employeeName || ""}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Father's Name</Text>
          <Text style={styles.tableCellLast}>{data?.fatherName || ""}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Physical Examination:-</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, { borderTop: "1px solid #000" }]}>
          <Text style={styles.tableCellHeader}>Height</Text>
          <Text style={styles.tableCellLast}>{data?.height || ""}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Weight</Text>
          <Text style={styles.tableCellLast}>{data?.weight || ""}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Chest (unexpanded)</Text>
          <Text style={styles.tableCellLast}>
            {data?.chestUnexpanded || ""}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Chest (expanded)</Text>
          <Text style={styles.tableCellLast}>{data?.chestExpanded || ""}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Abdomen</Text>
          <Text style={styles.tableCellLast}>{data?.abdomen || ""}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>General Physique</Text>
          <Text style={styles.tableCellLast}>
            {data?.generalPhysique || ""}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Blood Pressure</Text>
          <Text style={styles.tableCellLast}>{data?.bloodPressure || ""}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Heart Rate</Text>
          <Text style={styles.tableCellLast}>{data?.heartRate || ""}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Lungs</Text>
          <Text style={styles.tableCellLast}>{data?.lungs || ""}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Physical Fitness</Text>
          <Text style={styles.tableCellLast}>
            {data?.physicalFitness || ""}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>
            Any visible physical abnormality or disability
          </Text>
          <Text style={styles.tableCellLast}>
            {data?.physicalAbnormality || ""}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Eye Test:-</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, { borderTop: "1px solid #000" }]}>
          <Text style={styles.tableCellHeader}>Eyesight</Text>
          <Text style={styles.tableCellLast}>{data?.eyesight || ""}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Color Blindness</Text>
          <Text style={styles.tableCellLast}>{data?.colorBlindness || ""}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Skin Examination:-</Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, { borderTop: "1px solid #000" }]}>
          <Text style={styles.tableCellHeader}>
            Any signs of infectious or communicable disease
          </Text>
          <Text style={styles.tableCellLast}>
            {data?.infectiousDisease || ""}
          </Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>
            Any test required to confirm in case a person is suspected to be
            suffering from the above disease on clinical examination.
          </Text>
          <Text style={styles.tableCellLast}>{data?.testRequired || ""}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Schedule of Vaccine to be inoculated against enteric group of diseases:-
      </Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, { borderTop: "1px solid #000" }]}>
          <Text style={styles.tableCellHeader}>Typhoid</Text>
          <Text style={styles.tableCellLast}>{data?.typhoid || ""}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Hepatitis A</Text>
          <Text style={styles.tableCellLast}>{data?.hepatitisA || ""}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Hepatitis B</Text>
          <Text style={styles.tableCellLast}>{data?.hepatitisB || ""}</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>
            Any other location-specific vaccine as prescribed by the Doctor
          </Text>
          <Text style={styles.tableCellLast}>{data?.otherVaccine || ""}</Text>
        </View>
      </View>

      <View style={styles.bottomSignature}>
        <View style={styles.bottomSignatureItem}>
          <Text style={styles.bottomLabel}>Place:</Text>
          <View style={styles.bottomSpace}>
            <Text>{data?.place || ""}</Text>
          </View>
        </View>
        <View style={styles.bottomSignatureItem}>
          <Text style={styles.bottomLabel}>Name:</Text>
          <View style={styles.bottomSpace}>
            <Text>{data?.doctorName || ""}</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSignature}>
        <View style={styles.bottomSignatureItem}>
          <Text style={styles.bottomLabel}>Date:</Text>
          <View style={styles.bottomSpace}>
            <Text>{data?.examinationDate || ""}</Text>
          </View>
        </View>
        <View style={styles.bottomSignatureItem}>
          <Text style={styles.bottomLabel}>Signature:</Text>
          <View style={styles.bottomSpace}>
            <Text>{data?.doctorSignature || ""}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sealSection}>
        <Text style={styles.sealLabel}>Seal with Registration No.:</Text>
        <View style={styles.sealSpace}>
          <Text>{data?.registrationNo || ""}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default DaburMedicalTemplate;
