// import React from "react";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   Font,
//   Image,
// } from "@react-pdf/renderer";

// import TimeRoman from "../assets/fonts/Times-Roman.ttf";
// import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";
// import dr_kunal_stamp_sign from "../../src/assets/images/dr_kunal_stamp_sign.png";
// import dr_rohit_solanki_stamp_sign from "../../src/assets/images/dr_rohit_solanki_stamp_sign.png";

// Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
// Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

// const styles = StyleSheet.create({
//   page: {
//     fontSize: 11,
//     fontFamily: "Times-Roman-Normal",
//     lineHeight: 1.4,
//     padding: 0,
//   },
// });

// const DottedField = ({ width = 160, value }) => (
//   <View style={[styles.dotted, { minWidth: width }]}>
//     <Text>{value || " "}</Text>
//   </View>
// );

// const VisionReportByOPTemplate = ({ data, fitStatus }) => (
//   <Document>
//     <Page size="A4" orientation="portrait" style={styles.page}></Page>
//   </Document>
// );

// export default VisionReportByOPTemplate;

import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

// Register fonts
Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    fontFamily: "Times-Roman-Normal",
    lineHeight: 1.5,
    padding: 40,
  },
  heading: {
    textAlign: "center",
    fontFamily: "Times-Roman-Bold",
    fontSize: 12,
    marginBottom: 10,
    textDecoration: "underline",
  },
  labelRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: 180,
  },
  dotted: {
    borderBottom: "1px dotted #000",
    flex: 1,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 6,
    fontFamily: "Times-Roman-Bold",
  },
  table: {
    display: "table",
    width: "100%",
    border: "1px solid #000",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
    padding: 4,
    flex: 1,
    textAlign: "center",
  },
  tableHeader: {
    fontFamily: "Times-Roman-Bold",
    backgroundColor: "#f5f5f5",
  },
  signature: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const DottedField = ({ width = 160, value }) => (
  <View style={[styles.dotted, { minWidth: width }]}>
    <Text>{value || " "}</Text>
  </View>
);

const VisionReportByOPTemplate = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Heading */}
      <Text style={styles.heading}>VISION REPORT</Text>

      {/* Basic Details */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>Name:</Text>
        <DottedField width={180} />
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Age:</Text>
        <DottedField width={180} />
        <Text style={{ marginLeft: 6 }}>yrs.</Text>
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Gender:</Text>
        <DottedField width={180} />
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Date of Examination:</Text>
        <DottedField width={180} />
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          Past Medical History related to Vision:
        </Text>
        <DottedField width={180} />
      </View>

      {/* Visual Acuity Table */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableCol, { flex: 2 }]}> </Text>
          <Text style={[styles.tableCol, { flex: 2 }]}>
            Unaided Vision {"\n"} (without Eyeglass)
          </Text>
          <Text style={[styles.tableCol, { flex: 2 }]}>
            Aided Vision {"\n"} (with Eyeglass)
          </Text>
          <Text style={styles.tableCol}>Colour Vision</Text>
          <Text style={[styles.tableCol, { flex: 2 }]}>
            Cataract/ Ptosis/ {"\n"} Squint/ Keratoconus/ {"\n"} Pterygium etc.
          </Text>
        </View>

        {/* Sub header row */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCol, { flex: 2 }]}></Text>
          <Text style={styles.tableCol}>Distance Vision</Text>
          <Text style={styles.tableCol}>Near Vision</Text>
          <Text style={styles.tableCol}>Distance Vision</Text>
          <Text style={styles.tableCol}>Near Vision</Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
        </View>

        {/* Right Eye */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCol, { flex: 2 }]}>Right Eye</Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
        </View>

        {/* Left Eye */}
        <View style={styles.tableRow}>
          <Text style={[styles.tableCol, { flex: 2 }]}>Left Eye</Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
        </View>
      </View>

      {/* Prescription Table */}
      <Text style={styles.sectionTitle}>
        PRESCRIPTION FOR EYEGLASS – ONLY IF GLASS PRESCRIBED
      </Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}>SPH</Text>
          <Text style={styles.tableCol}>CYL</Text>
          <Text style={styles.tableCol}>AXIS</Text>
          <Text style={styles.tableCol}>ADD</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>RIGHT EYE</Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>LEFT EYE</Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
        </View>
      </View>

      {/* Impression */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.sectionTitle}>Impression:</Text>
      </View>

      {/* Signature */}
      <View style={styles.signature}>
        <Text></Text>
        <Text>Signature with Seal of {"\n"}Optometrist</Text>
      </View>
    </Page>
  </Document>
);

export default VisionReportByOPTemplate;
