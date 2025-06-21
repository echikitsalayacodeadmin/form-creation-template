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

// Register a font for bold headings
Font.register({
  family: "Times-Bold",
  src: "https://fonts.gstatic.com/s/timesnewroman/v11/9oRPNYsQpS4zJU2Qp8hYkA.ttf",
  fontWeight: "bold",
});

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 11,
    fontFamily: "Times-Roman",
  },
  header: {
    textAlign: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 6,
  },
  bold: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #000",
  },
  table: {
    display: "table",
    width: "auto",
    border: "1px solid #000",
    marginBottom: 16,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColNum: {
    width: "7%",
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
    padding: 4,
    textAlign: "center",
  },
  tableColLabel: {
    width: "38%",
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
    padding: 4,
  },
  tableColValue: {
    width: "55%",
    borderBottom: "1px solid #000",
    padding: 4,
  },
  lastRow: {
    borderBottom: "none",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  signatureBlock: {
    marginTop: 40,
    alignItems: "flex-end",
  },
  signatureText: {
    fontFamily: "Times-Bold",
    fontSize: 14,
    marginBottom: 2,
  },
  signDetails: {
    fontSize: 10,
    textAlign: "right",
    lineHeight: 1.2,
  },
  unoCare: {
    color: "#2e4fa2",
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "right",
  },
});

const Form35Template = ({ data = {} }) => {
  // Default data for preview/demo
  const {
    serialNo = "221166",
    date = "12th June 2025",
    factoryName = "BRIDGESTONE INDIA PRIVATE LIMITED",
    department = "hr",
    workerName = "Abhishek Bhati",
    sex = "MALE",
    age = "34",
    employmentDate = "",
    natureOfWork = "",
    vision = "Vision Readings: NEAR (R-N/6  L-N/6) FAR (R-6/6  L-6/6)\nColour Blindness: NAD",
    remarks = "NAD",
    signature = "Rohit",
    signDetails = "Rohit Solanki\nSr Optometrist\nReg. No. : 0056800",
    unoCare = "Uno.care",
  } = data;

  const tableRows = [
    ["1", "Name of the Factory", factoryName],
    ["2", "Department/works where the worker is employed", department],
    ["3", "Name of workers", workerName],
    ["4", "Sex", sex],
    ["5", "Age", age],
    ["6", "Date of Employment", employmentDate],
    ["7", "Nature of work", natureOfWork],
    ["8", "Result of examination of eye sight", vision],
    ["9", "Remarks", remarks],
    ["10", "Signature of Ophthalmologist", ""],
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.metaRow}>
          <Text>Serial No : {serialNo}</Text>
          <Text>Date: {date}</Text>
        </View>
        <View style={styles.header}>
          <Text style={styles.title}>FORM 35</Text>
          <Text style={styles.subtitle}>
            [Prescribed under sub-rule (4) of Rule 66-A]
          </Text>
          <Text style={[styles.bold, { fontSize: 13, marginTop: 4 }]}>
            Record of eye-examination
          </Text>
        </View>
        <View style={styles.table}>
          {tableRows.map((row, idx) => (
            <View
              key={row[0]}
              style={[
                styles.tableRow,
                idx === tableRows.length - 1 ? styles.lastRow : {},
              ]}
            >
              <Text style={styles.tableColNum}>{row[0]}</Text>
              <Text style={styles.tableColLabel}>{row[1]}</Text>
              <Text style={styles.tableColValue}>{row[2]}</Text>
            </View>
          ))}
        </View>
        <View style={styles.signatureBlock}>
          <Text style={styles.signatureText}>{signature}</Text>
          <Text style={styles.signDetails}>{signDetails}</Text>
          <Text style={styles.unoCare}>{unoCare}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default Form35Template;
