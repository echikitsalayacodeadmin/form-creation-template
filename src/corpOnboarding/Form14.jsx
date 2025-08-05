import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  centerText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold",
  },
  section: {
    marginTop: 10,
    marginBottom: 6,
  },
  table: {
    border: "1px solid black",
    display: "table",
    width: "auto",
    borderCollapse: "collapse",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    border: "1px solid black",
    padding: 4,
    flexGrow: 1,
  },
  cellNumber: {
    width: "5%",
    border: "1px solid black",
    padding: 4,
    textAlign: "center",
  },
  cellLabel: {
    width: "95%",
    border: "1px solid black",
    padding: 4,
  },
  signatureBox: {
    marginTop: 30,
    fontWeight: "bold",
  },
});

// Component
const Form14 = () => (
  <PDFDownloadLink
    document={
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.centerText}>FORM XIV</Text>
          <Text style={[styles.centerText, { marginBottom: 2 }]}>
            (See Rule 76)
          </Text>
          <Text style={[styles.centerText, { marginBottom: 6 }]}>
            Employment Card
          </Text>

          <View style={styles.section}>
            <Text>Name and address of Contractor:-</Text>
            <Text>Nature of work and Location of work:-</Text>
          </View>

          <View style={styles.table}>
            {[
              "Name of Workmen",
              "S.No in the register of workmen employed",
              "Nature of employment/Designation",
              "Wage rate (with particulars of unit in case of piece work)",
              "Wage period",
              "Tenure of employment",
              "Remarks",
            ].map((label, index) => (
              <View style={styles.row} key={index}>
                <View style={styles.cellNumber}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={styles.cellLabel}>
                  <Text>{label}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.signatureBox}>
            <Text>Initials of the contractor or his representative</Text>
          </View>
        </Page>
      </Document>
    }
  >
    {({ loading }) => (loading ? "Loading PDF..." : "Download Form XIV PDF")}
  </PDFDownloadLink>
);

export default Form14;
