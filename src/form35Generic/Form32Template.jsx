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
import uncareheader from "../assets/images/uncareheader.png";
import Dr_Jaydip_Saxena from "../assets/images/Dr_Jaydip_Saxena.png";
import dr_kunal_stamp_sign from "../assets/images/dr_kunal_stamp_sign.png";
import { KUNALSIGNBASE64 } from "../assets/images/base64Images";

// Register fonts
Font.register({
  family: "Times-Roman-Normal",
  src: TimeRoman,
});

Font.register({
  family: "Times-Roman-Bold",
  src: TimeRomanBold,
});

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 24,
    fontSize: 11,
    fontFamily: "Times-Roman",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logo: {
    width: "100%",
    height: 70,
    marginRight: 12,
  },
  unoCareText: {
    fontSize: 10,
    color: "#2e4fa2",
    fontWeight: "bold",
    marginBottom: 2,
  },
  regOffice: {
    fontSize: 8,
    marginBottom: 2,
    maxWidth: 130,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  table: {
    display: "table",
    width: "100%",
    border: "1px solid #000",
    margin: "0 auto",
    marginTop: 20,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: "row",
  },
  cell: {
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
    padding: 4,
    fontSize: 11,
    minHeight: 18,
    justifyContent: "center",
    flexGrow: 1,
  },
  cellNoRight: {
    borderRight: "none",
  },
  cellNoBottom: {
    borderBottom: "none",
  },
  cellHeader: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
    paddingVertical: 2,
  },
  cellSection: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 11,
    paddingVertical: 2,
  },
  cellLabel: {
    fontWeight: "bold",
  },
  cellCenter: {
    textAlign: "center",
  },
  cellRight: {
    textAlign: "right",
  },
  cellLeft: {
    textAlign: "left",
  },
  fitnessCert: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 11,
    padding: 4,
    borderBottom: "1px solid #000",
  },
  fitnessText: {
    textAlign: "center",
    padding: 4,
    fontSize: 11,
  },
  signatureBlock: {
    marginTop: 40,
    alignItems: "flex-end",
  },
  signatureText: {
    fontSize: 14,
    marginBottom: 2,
  },
  signDetails: {
    fontSize: 10,
    textAlign: "right",
    lineHeight: 1.2,
  },
  unoCareSign: {
    color: "#2e4fa2",
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "right",
  },
});

const Form32Template = ({
  data,
  company = "BRIDGESTONE INDIA PRIVATE LIMITED",
  date = "12th June 2025",
  fitText,
  signature = "dr_kunal_stamp_sign.png", // default signature
}) => {
  // Function to get the correct signature image
  const getSignatureImage = () => {
    switch (signature) {
      case "Dr_Jaydip_Saxena.png":
        return Dr_Jaydip_Saxena;
      case "KUNALSIGNBASE64":
        return KUNALSIGNBASE64;
      case "dr_kunal_stamp_sign.png":
      default:
        return dr_kunal_stamp_sign;
    }
  };

  // Default data for preview/demo

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with logo and address */}
        <View style={styles.headerRow}>
          <Image style={styles.logo} src={uncareheader} />
        </View>
        <Text style={styles.regOffice}>
          Regd. Office: 253, Shri Krishna Avenue, Phase-1, Limbodi Khandwa Road,
          Indore-452001
        </Text>
        <View style={styles.dateRow}>
          <Text>Date: {data?.vitalsCreatedDate || ""}</Text>
        </View>
        {/* Main Table */}
        <View style={styles.table}>
          {/* Health Check-UP PROGRAMME */}
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.cell,
                styles.cellHeader,
                {
                  width: "100%",
                  borderRight: 0,
                  fontFamily: "Times-Roman-Bold",
                },
              ]}
            >
              Health Check-UP PROGRAMME
            </Text>
            <Text
              style={[styles.cell, styles.cellNoRight, { width: 0 }]}
            ></Text>
            <Text
              style={[styles.cell, styles.cellNoRight, { width: 0 }]}
            ></Text>
            <Text
              style={[styles.cell, styles.cellNoRight, { width: 0 }]}
            ></Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.cell,
                styles.cellHeader,
                {
                  width: "100%",
                  borderRight: 0,
                  fontFamily: "Times-Roman-Bold",
                },
              ]}
            >
              PHYSICAL FITNESS CERTIFICATE
            </Text>
            <Text
              style={[styles.cell, styles.cellNoRight, { width: 0 }]}
            ></Text>
            <Text
              style={[styles.cell, styles.cellNoRight, { width: 0 }]}
            ></Text>
            <Text
              style={[styles.cell, styles.cellNoRight, { width: 0 }]}
            ></Text>
          </View>
          {/* Employee Details */}
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.cell,
                styles.cellLabel,
                { width: "25%", fontFamily: "Times-Roman-Bold" },
              ]}
            >
              Name:
            </Text>
            <Text style={[styles.cell, { width: "25%" }]}>
              {data?.name || ""}
            </Text>
            <Text
              style={[
                styles.cell,
                styles.cellLabel,
                { width: "25%", fontFamily: "Times-Roman-Bold" },
              ]}
            >
              Employee ID:
            </Text>
            <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>
              {data?.empId || ""}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.cell,
                styles.cellLabel,
                { width: "25%", fontFamily: "Times-Roman-Bold" },
              ]}
            >
              Age:
            </Text>
            <Text style={[styles.cell, { width: "25%" }]}>
              {data?.age || ""}
            </Text>
            <Text
              style={[
                styles.cell,
                styles.cellLabel,
                { width: "25%", fontFamily: "Times-Roman-Bold" },
              ]}
            >
              Gender:
            </Text>
            <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>
              {data?.gender || ""}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.cell,
                styles.cellLabel,
                { width: "25%", fontFamily: "Times-Roman-Bold" },
              ]}
            >
              Department:
            </Text>
            <Text style={[styles.cell, { width: "25%" }]}>
              {data?.department || ""}
            </Text>
            <Text
              style={[
                styles.cell,
                styles.cellLabel,
                { width: "25%", fontFamily: "Times-Roman-Bold" },
              ]}
            >
              Designation:
            </Text>
            <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>
              {data?.designation || ""}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.cell,
                { width: "100%" },
                styles.cellNoRight,
                styles.cellCenter,
              ]}
            >
              .
            </Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
          </View>
          {/* General medical Examination */}
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.cell,
                styles.cellSection,
                {
                  width: "100%",
                  borderRight: 0,
                  fontFamily: "Times-Roman-Bold",
                },
              ]}
            >
              General medical Examination
            </Text>
            <Text
              style={[styles.cell, styles.cellNoRight, { width: 0 }]}
            ></Text>
            <Text
              style={[styles.cell, styles.cellNoRight, { width: 0 }]}
            ></Text>
            <Text
              style={[styles.cell, styles.cellNoRight, { width: 0 }]}
            ></Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.cell,
                styles.cellLabel,
                { width: "25%", fontFamily: "Times-Roman-Bold" },
              ]}
            >
              ENT:
            </Text>
            <Text style={[styles.cell, { width: "25%" }]}>None</Text>
            <Text
              style={[
                styles.cell,
                styles.cellLabel,
                { width: "25%", fontFamily: "Times-Roman-Bold" },
              ]}
            >
              Digestive System:
            </Text>
            <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>
              None
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.cell,
                styles.cellLabel,
                { width: "25%", fontFamily: "Times-Roman-Bold" },
              ]}
            >
              Skin Condition :
            </Text>
            <Text style={[styles.cell, { width: "25%" }]}>None</Text>
            <Text
              style={[
                styles.cell,
                styles.cellLabel,
                { width: "25%", fontFamily: "Times-Roman-Bold" },
              ]}
            >
              Oral Cavity
            </Text>
            <Text style={[styles.cell, { width: "25%" }, styles.cellNoRight]}>
              None
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.cell,
                { width: "100%" },
                styles.cellNoRight,
                styles.cellCenter,
              ]}
            >
              .
            </Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
          </View>
          {/* Recommendation */}
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.cell,
                styles.cellLabel,
                { width: "35%", fontFamily: "Times-Roman-Bold" },
              ]}
            >
              Recommendation (If Any) :
            </Text>
            <Text
              style={[
                styles.cell,
                { width: "65%", textAlign: "center" },
                styles.cellNoRight,
              ]}
            >
              No Abnormality Detected
            </Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.cell,
                { width: "100%" },
                styles.cellNoRight,
                styles.cellCenter,
              ]}
            >
              .
            </Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
          </View>
          {/* Fitness Certificate */}
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.cell,
                styles.fitnessCert,
                { width: "100%", fontFamily: "Times-Roman-Bold" },
                styles.cellNoRight,
              ]}
            >
              Fitness
            </Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
          </View>
          <View style={styles.tableRow}>
            <Text
              style={[
                styles.cell,
                styles.fitnessText,
                { width: "100%" },
                styles.cellNoRight,
              ]}
            >
              {fitText}
            </Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
            <Text
              style={[styles.cell, { width: 0 }, styles.cellNoRight]}
            ></Text>
          </View>
        </View>
        {/* Signature */}
        <View style={styles.signatureBlock}>
          <Image
            style={{ height: 100, width: 160 }}
            src={getSignatureImage()}
          />
        </View>
      </Page>
    </Document>
  );
};

export default Form32Template;
