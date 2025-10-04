import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import Dr_Jaydip_Saxena from "../../src/assets/images/Dr_Jaydip_Saxena.png";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    lineHeight: 1.5,
    fontFamily: "Times-Roman",
  },
  title: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 10,
    marginBottom: 8,
  },
  section: {
    marginBottom: 6,
  },
  textJustify: {
    textAlign: "justify",
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  multiLine: {
    marginTop: 20,
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 26,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    fontSize: 9,
    textAlign: "center",
  },
  dottedLine: {
    borderBottom: "1pt dotted #000",
    minWidth: 80,
    textAlign: "center",
    paddingBottom: 0.5,
  },
  // Dotted field styles
  dottedFieldContainer: {
    position: "relative",
    height: 14,
    justifyContent: "center",
  },
  fieldText: {
    fontSize: 11,
    textAlign: "center",
  },
});

const DottedField = ({ value = "", width = 100 }) => {
  const underscoreCount = Math.floor(width / 6); // adjust divisor for spacing
  if (!value) {
    return <Text style={styles.fieldText}>{"_".repeat(underscoreCount)}</Text>;
  }
  return (
    <Text
      style={[
        styles.fieldText,
        {
          textDecoration: "underline",
          textDecorationStyle: "solid",
        },
      ]}
    >
      {value}
    </Text>
  );
};

const CertificateOfFitnessTemplate = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>FORM NO. 17</Text>
        <Text style={styles.subtitle}>(See Rule 102)</Text>
        <Text style={{ ...styles.title, marginBottom: 20 }}>
          CERTIFICATE OF FITNESS
        </Text>

        <View style={[styles.section]}>
          <View style={{ flexDirection: "row", alignItems: "center", mb: 1 }}>
            <Text>Serial No. </Text>
            <DottedField value={data?.empId || ""} width={100} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", mb: 1 }}>
            <Text>Date </Text>
            <DottedField value={data?.vitalsCreatedDate || ""} width={100} />
          </View>
        </View>

        <View style={[styles.section, { marginTop: 30 }]}>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <Text>
              I hereby certify that I have personally examined{" "}
              <Text
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "solid",
                }}
              >
                {data?.name || "_____________"}
              </Text>{" "}
              son of{" "}
              <Text
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "solid",
                }}
              >
                {data?.fathersName || "_____________"}
              </Text>{" "}
              residing at{" "}
              <Text
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "solid",
                }}
              >
                {"Rohtak"}
              </Text>{" "}
              who is desirous of being employed as{" "}
              <Text
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "solid",
                }}
              >
                {data?.designation || "_____________"}
              </Text>{" "}
              in the{" "}
              <Text
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "solid",
                }}
              >
                {"Uno care"}
              </Text>{" "}
              and that his age, nearly as can be ascertained from my examination
              is{" "}
              <Text
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "solid",
                }}
              >
                {data?.age || "____"}
              </Text>{" "}
              years and that he is, in my opinion, fit for employment in{" "}
              <Text
                style={{
                  textDecoration: "underline",
                  textDecorationStyle: "solid",
                }}
              >
                Asian Paints Ltd
              </Text>
            </Text>
          </View>
          <Text>His descriptive marks are:</Text>
        </View>

        <View style={styles.multiLine}>
          <DottedField value={[data?.mark1]} width={500} />
          <DottedField value={data?.mark2} width={500} />
        </View>
        <View style={styles.multiLine}>
          <DottedField value={[data?.mark1]} width={500} />
          <DottedField value={data?.mark2} width={500} />
        </View>

        <View style={[styles.signatureRow, { marginBottom: 10 }]}>
          <View style={{ width: "45%" }}>
            <Image
              src={Dr_Jaydip_Saxena}
              style={{
                height: 60,
                width: 80,
              }}
            />
          </View>
          <View style={{ width: "45%" }}>
            <Text></Text>
          </View>
        </View>

        <View style={styles.signatureRow}>
          <View style={{ width: "45%" }}>
            <Text>Signature of certifying Surgeon</Text>
          </View>
          <View style={{ width: "45%" }}>
            <Text>
              Signature or left-hand thumb-impression of person employed
            </Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}>
              <Text>
                I certify that I examined the person mentioned above on{" "}
                {data?.vitalsCreatedDate || ""}
              </Text>
            </View>
            <View style={styles.tableCell}>
              <Text>
                I extend this certificate until {data?.extendUntil || " "}
              </Text>{" "}
            </View>
            <View style={styles.tableCell}>
              <Image
                src={Dr_Jaydip_Saxena}
                style={{
                  height: 60,
                  width: 80,
                }}
              />
              <Text>Signature of Certifying Surgeon</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Note of symptom {data?.symptom || " "}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CertificateOfFitnessTemplate;
