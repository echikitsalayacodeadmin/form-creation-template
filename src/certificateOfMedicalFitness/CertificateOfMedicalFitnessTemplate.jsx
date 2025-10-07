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
import Dr_Jaydip_Saxena from "../../src/assets/images/Dr_Jaydip_Saxena.png";

import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";
import dayjs from "dayjs";

Font.register({
  family: "Times-Roman",
  fonts: [
    { src: TimeRoman, fontWeight: "normal" },
    { src: TimeRomanBold, fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman",
    fontWeight: "normal",
    fontSize: 11,
    backgroundColor: "#ffffff",
    paddingHorizontal: 40,
    paddingVertical: 40,
    lineHeight: 1.6,
  },
  title: {
    fontFamily: "Times-Roman", // 👈 ADD THIS
    fontSize: 16,
    fontWeight: "bold", // ✅ now works
    textAlign: "center",
    marginBottom: 30,
    textDecoration: "underline",
    letterSpacing: 2,
  },
  paragraph: {
    fontFamily: "Times-Roman", // 👈 ADD THIS
    fontWeight: "normal",
    fontSize: 11,
    lineHeight: 1.8,
  },

  certificateText: {
    fontSize: 11,
  },
  signatureSection: {},
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 80,
  },
  signatureBox: {
    width: 250,
  },
  signatureLabel: {
    fontSize: 11,
    textAlign: "center",
    borderTop: "1px solid #000",
    paddingTop: 5,
  },
  signatureNote: {
    fontSize: 10,
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 10,
  },
  medicalOfficerSection: {
    marginBottom: 10,
  },
  officerRow: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  officerLabel: {
    fontSize: 11,
    minWidth: 150,
    marginRight: 10,
  },
  officerLine: {
    borderBottom: "1px dotted #000",
    flex: 1,
    minHeight: 15,
    paddingBottom: 2,
  },
  dateSection: {},
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateLabel: {
    fontSize: 11,
    marginRight: 10,
  },
  dateLine: {
    borderBottom: "1px solid #000",
    width: 120,
    minHeight: 15,
    paddingBottom: 2,
  },
  sealBox: {
    justifyContent: "center",
    flexDirection: "row",
  },
  sealText: {
    fontSize: 10,
    textAlign: "center",
    lineHeight: 1.2,
  },
  noteSection: {
    marginTop: 40,
    fontSize: 10,
    lineHeight: 1.5,
  },
  noteTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  underlineText: {
    textDecoration: "underline",
  },
  boldText: {
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});

const CertificateOfMedicalFitnessTemplate = ({ data, date }) => (
  <Document>
    {/* Page 1 */}
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>MEDICAL CERTIFICATE OF FITNESS</Text>

      <Text>
        have examined Shri / Kumari / Smt.:{" "}
        <Text style={styles.boldText}>{data?.name?.toLowerCase() || ""}</Text>,
        Son/Daughter of Shri: .................., Aged:{" "}
        <Text style={styles.boldText}>{data?.age || ""}</Text> Years, of
        Village:{" "}
        <Text style={styles.boldText}>
          {data?.department?.toLowerCase() || ""}
        </Text>
        , and certify that,{" "}
        {data?.gender?.toLowerCase() === "male"
          ? "He"
          : data?.gender?.toLowerCase() === "female"
          ? "She"
          : "He/She"}{" "}
        is free from deafness, defective vision (including colour vision) or any
        other infirmity, mental or physical, likely to interfere with the
        efficiency of his/her work and found him/her possessing good health.
      </Text>
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Text style={[styles.certificateText]}>
          This certificate is being given to{" "}
          {data?.gender?.toLowerCase() === "male"
            ? "him"
            : data?.gender?.toLowerCase() === "female"
            ? "she"
            : "him /her"}{" "}
          for the purpose of{" "}
        </Text>
        <View
          style={{
            borderBottom: "1px solid #000",
            paddingBottom: 1,
            width: 200,
          }}
        >
          <Text>{"Industrial Health Assessment"}</Text>
        </View>
      </View>

      <View style={styles.signatureSection}>
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <View style={{ minHeight: 60, marginBottom: 10 }}>
              <Text style={{ fontSize: 11 }}>
                {data?.candidateSignature || ""}
              </Text>
            </View>
            <Text style={styles.signatureLabel}>Signature of Candidate</Text>
            <Text style={styles.signatureNote}>
              (To be signed in presence of the Medical Officer)
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.medicalOfficerSection, { marginLeft: 150 }]}>
        <View style={styles.officerRow}>
          <Text style={styles.officerLabel}>Signature of Medical Officer:</Text>
          <View style={styles.officerLine}>
            <Text>{data?.medicalOfficerSignature || ""}</Text>
          </View>
        </View>

        <View style={styles.officerRow}>
          <Text style={styles.officerLabel}>Name of Medical Officer: Dr.</Text>
          <View style={styles.officerLine}>
            <Text>{data?.medicalOfficerName || "Jaydip Saxsena"}</Text>
          </View>
        </View>

        <View style={styles.officerRow}>
          <Text style={styles.officerLabel}>Registration No.</Text>
          <View style={styles.officerLine}>
            <Text>{data?.registrationNo || "61706"}</Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      ></View>
      <View style={styles.dateSection}>
        <View style={styles.dateRow}>
          <View style={{ height: 100 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.dateLabel}>Dated:</Text>
              <View style={styles.dateLine}>
                <Text>
                  {data?.dateOfJoining
                    ? dayjs(data?.dateOfJoining).format("DD MMM, YYYY")
                    : ""}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.sealBox}>
            <Text style={[styles.sealText]}>Seal</Text>
            <Image src={Dr_Jaydip_Saxena} style={{ height: 100, width: 100 }} />
          </View>
        </View>
      </View>

      <View style={styles.noteSection}>
        <Text style={styles.noteTitle}>Note:</Text>
        <Text>
          Medical certificate granted by a qualified medical practitioner
          holding at least M.B.B.S. Degree and
        </Text>
        <Text>
          registered with Medical Council of India, shall only be valid. The
          date of issue of the medical
        </Text>
        <Text>
          certificate should be within one year from the date of application.
        </Text>
      </View>
    </Page>
  </Document>
);

export default CertificateOfMedicalFitnessTemplate;
