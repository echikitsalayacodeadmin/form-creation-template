import React, { Fragment } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 8,
    fontFamily: "Helvetica",
  },
  centerHeader: {
    textAlign: "center",
    marginBottom: 4,
    fontSize: 10,
    fontWeight: "bold",
  },
  subHeader: {
    textAlign: "center",
    marginBottom: 8,
    fontSize: 9,
  },
  dualRow: {
    flexDirection: "row",
    border: 1,
    borderBottom: 0,
  },
  dualCell: {
    borderRight: 1,
    padding: 4,
    width: "50%",
    minHeight: 30,
  },
  tableHeader: {
    flexDirection: "row",
    border: 1,
    borderBottom: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderLeft: 1,
    borderRight: 1,
  },
  cellHeader: {
    borderRight: 1,
    borderBottom: 1,
    padding: 4,
    fontWeight: "bold",
    textAlign: "center",
  },
  cell: {
    borderRight: 1,
    borderBottom: 1,
    padding: 4,
    minHeight: 24,
  },
});

// Column width styles — adjusted visually to match your layout
const colStyles = [
  { width: "4%" }, // Sl.No.
  { width: "12%" }, // Name
  { width: "6%" }, // Age & Sex
  { width: "10%" }, // Father's/Husband's Name
  { width: "10%" }, // Nature of Employment
  { width: "12%" }, // Permanent Address
  { width: "10%" }, // Local Address
  { width: "9%" }, // Date of commencement
  { width: "9%" }, // Signature/thumb
  { width: "8%" }, // Date of termination
  { width: "5%" }, // Reasons for termination
  { width: "5%" }, // Remarks
];

const headers = [
  "Sl.No.",
  "Name and surname of Workman",
  "Age and Sex",
  "Father's/Husband's Name",
  "Nature of Employment/Designation",
  "Permanent Home address of workman",
  "Local Address",
  "Date of commencement of employment",
  "Signature or thumb impression of workman",
  "Date of termination of employment",
  "Reasons for termination",
  "Remarks",
];

const Form13 = () => {
  return (
    <Fragment>
      <PDFDownloadLink
        fileName="FormXIII_WorkmanRegister.pdf"
        document={
          <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
              <Text style={styles.centerHeader}>Form XIII</Text>
              <Text style={styles.centerHeader}>
                REGISTER OF WORKMAN EMPLOYED BY CONTRACTOR
              </Text>
              <Text style={styles.subHeader}>(SEE RULE 75)</Text>

              {/* Top info section */}
              <View style={styles.dualRow}>
                <Text style={styles.dualCell}>Name of the Contractor</Text>
                <Text style={styles.dualCell}>
                  Name and address of the establishment/under which contract is
                  carried on
                </Text>
              </View>
              <View style={[styles.dualRow, { borderBottom: 1 }]}>
                <Text style={styles.dualCell}>Nature and Location of Work</Text>
                <Text style={styles.dualCell}>
                  Name and Address of Principal Employer
                </Text>
              </View>

              {/* Table Header */}
              <View style={styles.tableHeader}>
                {headers.map((h, i) => (
                  <Text key={i} style={[styles.cellHeader, colStyles[i]]}>
                    {h}
                  </Text>
                ))}
              </View>

              {/* 8 empty rows */}
              {[...Array(8)].map((_, rowIdx) => (
                <View style={styles.tableRow} key={rowIdx}>
                  {headers.map((_, colIdx) => (
                    <Text key={colIdx} style={[styles.cell, colStyles[colIdx]]}>
                      {/* leave empty */}
                    </Text>
                  ))}
                </View>
              ))}
            </Page>
          </Document>
        }
      >
        {({ loading }) =>
          loading ? "Generating PDF..." : "Download Form XIII PDF"
        }
      </PDFDownloadLink>
    </Fragment>
  );
};

export default Form13;
