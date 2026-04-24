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
// Update these paths to match your project structure
import RocaFssaiHeader from "../../src/assets/images/RocaFssaiHeader.png";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 45,
    fontSize: 10,
    fontFamily: "Times-Roman-Normal",
    lineHeight: 1.6,
  },
  headerBorder: {
    border: "1.5pt solid #000",
    padding: 8,
    marginBottom: 18,
  },
  headerImage: {
    width: "100%",
  },
  title: {
    textAlign: "center",
    fontSize: 11,
    fontFamily: "Times-Roman-Bold",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  subTitle: {
    textAlign: "center",
    fontSize: 10,
    fontFamily: "Times-Roman-Normal",
    marginBottom: 6,
  },
  refText: {
    textAlign: "center",
    fontSize: 9.5,
    fontFamily: "Times-Roman-Normal",
    marginBottom: 22,
  },
  paragraph: {
    textAlign: "justify",
    marginBottom: 30,
    fontFamily: "Times-Roman-Normal",
    fontSize: 10,
    lineHeight: 1.8,
  },
  paragraphIndent: {
    textIndent: 30,
  },
  normal: {
    fontFamily: "Times-Roman-Normal",
  },
  bold: {
    fontFamily: "Times-Roman-Bold",
  },
  injected: {
    fontFamily: "Times-Roman-Bold",
    textDecoration: "underline",
  },
  signatureBox: {
    marginTop: 10,
    marginBottom: 40,
    alignItems: "flex-end",
  },
  signatureBold: {
    fontFamily: "Times-Roman-Bold",
    fontSize: 10,
  },
  signatureNormal: {
    fontFamily: "Times-Roman-Normal",
    fontSize: 10,
  },
  listSection: {
    marginTop: 10,
  },
  listHeading: {
    textDecoration: "underline",
    fontFamily: "Times-Roman-Bold",
    fontSize: 10,
    marginBottom: 10,
  },
  listItem: {
    marginLeft: 15,
    marginBottom: 5,
    fontFamily: "Times-Roman-Normal",
    fontSize: 10,
    lineHeight: 1.6,
  },
  listItemWrap: {
    flexDirection: "row",
    marginLeft: 15,
    marginBottom: 5,
  },
  listNum: {
    fontFamily: "Times-Roman-Normal",
    fontSize: 10,
    width: 18,
  },
  listText: {
    fontFamily: "Times-Roman-Normal",
    fontSize: 10,
    flex: 1,
    lineHeight: 1.6,
  },
});

const DOTS_NAME = "..................................................................";
const DOTS_COMPANY = "................................................................";
const DOTS_DATE = ".....................";
const DOTS_YEAR = ".....................";



const RocaFassaiCertificateTemplate = ({ data = {} }) => {
  const {
    name,
    companyName,
    examDate,
    year,
    doctorName,
  } = data;

  const hasName = name && name.trim() !== "";
  const hasCompany = companyName && companyName.trim() !== "";
  const hasDate = examDate && examDate.trim() !== "";
  const hasYear = year && year.trim() !== "";
  const hasDoctor = doctorName && doctorName.trim() !== "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerBorder}>
          <Image src={RocaFssaiHeader} style={styles.headerImage} />
        </View>

        {/* TITLE */}
        <Text style={styles.title}>
          MEDICAL FITNESS CERTIFICATE FOR FOOD HANDLERS
        </Text>

        {/* YEAR LINE */}
        <Text style={styles.subTitle}>
          {"(FOR THE YEAR "}
          {hasYear ? (
            <Text style={styles.injected}>{year}</Text>
          ) : (
            <Text style={styles.normal}>{DOTS_YEAR}</Text>
          )}
          {")"}
        </Text>

        {/* REFERENCE */}
        <Text style={styles.refText}>
          (See Para No. 10.1.2, Part- II, Schedule - 4 of FSS Regulation, 2011)
        </Text>

        {/* PARAGRAPH */}
        <Text style={styles.paragraph}>
          {"        It is certified that "}
          <Text style={styles.bold}>Shri/Smt./Miss</Text>
          {hasName ? (
            <Text style={styles.injected}>{name}</Text>
          ) : (
            <Text style={styles.normal}>{DOTS_NAME}</Text>
          )}
          {"\n"}
          {"employed with M/s."}
          {hasCompany ? (
            <Text style={styles.injected}>{companyName}</Text>
          ) : (
            <Text style={styles.normal}>{DOTS_COMPANY}</Text>
          )}
          {", coming in direct\ncontact with food items has been carefully examined* by me on date "}
          {hasDate ? (
            <Text style={styles.injected}>{examDate}</Text>
          ) : (
            <Text style={styles.normal}>{DOTS_DATE}</Text>
          )}
          {". Based on the medical\nexamination conducted, he/she is found free from any infectious or\ncommunicable diseases and the person is fit to work in the above\nmentioned food establishment."}
        </Text>

        {/* SIGNATURE */}
        <View style={styles.signatureBox}>
          <Text style={styles.signatureBold}>Name and Signature with Seal</Text>
          <Text style={styles.signatureNormal}>
            of Registered Medical Practitioner /
          </Text>
          <Text style={styles.signatureNormal}>Civil Surgeon</Text>
          {hasDoctor && (
            <Text style={[styles.signatureBold, { marginTop: 8 }]}>
              {doctorName}
            </Text>
          )}
        </View>

        {/* MEDICAL TEST SECTION */}
        <View style={styles.listSection}>
          <Text style={styles.listHeading}>
            *Medical Examination to be conducted:
          </Text>

          <View style={styles.listItemWrap}>
            <Text style={styles.listNum}>1.</Text>
            <Text style={styles.listText}>Physical Examination</Text>
          </View>

          <View style={styles.listItemWrap}>
            <Text style={styles.listNum}>2.</Text>
            <Text style={styles.listText}>Eye Test</Text>
          </View>

          <View style={styles.listItemWrap}>
            <Text style={styles.listNum}>3.</Text>
            <Text style={styles.listText}>Skin Examination</Text>
          </View>

          <View style={styles.listItemWrap}>
            <Text style={styles.listNum}>4.</Text>
            <Text style={styles.listText}>
              Compliance with schedule of Vaccine to be inoculated against
              enteric group of diseases
            </Text>
          </View>

          <View style={styles.listItemWrap}>
            <Text style={styles.listNum}>5.</Text>
            <Text style={styles.listText}>
              Any test required to confirm any communicable or infectious disease
              which the person suspected to be suffering from on clinical
              examination.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default RocaFassaiCertificateTemplate;
