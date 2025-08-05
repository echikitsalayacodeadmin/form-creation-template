import React, { Fragment } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 7,
    fontFamily: "Helvetica",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 4,
  },
  title: {
    textAlign: "center",
    fontWeight: "bold",
  },
  rightAlignedBox: {
    width: "100%",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    width: "100%",
  },
  infoCell: {
    borderWidth: 0.5,
    borderColor: "#00000",
    padding: 2,
    fontWeight: "bold",
    minHeight: 18,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 0.5,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: "row",
  },
  headerCell: {
    fontWeight: "bold",
    textAlign: "center",
    padding: 2,
    borderStyle: "solid",
    borderWidth: 0.5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  cell: {
    padding: 2,
    borderStyle: "solid",
    borderWidth: 0.5,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    minHeight: 18,
  },
  col1: { width: "4%" },
  col2: { width: "12%" },
  col3: { width: "6.5%" },
  col4: { width: "9%" },
  col5: { width: "9.5%" },
  col6: { width: "9%" },
  col7: { width: "11%" },
  col8: { width: "8.5%" },
  col9: { width: "9%" },
  col10: { width: "8.5%" },
  col11: { width: "6.5%" },
  col12: { width: "6.5%" },
});

const Form13 = () => {
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

  const columnStyles = [
    styles.col1,
    styles.col2,
    styles.col3,
    styles.col4,
    styles.col5,
    styles.col6,
    styles.col7,
    styles.col8,
    styles.col9,
    styles.col10,
    styles.col11,
    styles.col12,
  ];

  return (
    <Fragment>
      <PDFDownloadLink
        document={
          <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
              {/* Right-aligned Title */}
              <View style={styles.titleRow}>
                <View style={styles.rightAlignedBox}>
                  <Text style={styles.title}>Form XIII</Text>
                  <Text style={styles.title}>
                    REGISTER OF WORKMAN EMPLOYED BY CONTRACTOR
                  </Text>
                  <Text style={styles.title}>(SEE RULE 75)</Text>
                </View>
              </View>

              {/* Contractor Info Rows */}
              <View style={[styles.infoRow]}>
                <Text
                  style={[
                    styles.infoCell,
                    { width: "31.9%", borderRight: "0" },
                  ]}
                >
                  Name of the Contractor
                </Text>
                <Text
                  style={[
                    styles.infoCell,
                    { width: "68.1%", borderRight: "0" },
                  ]}
                ></Text>
                <Text
                  style={[
                    styles.infoCell,
                    { width: "31.9%", borderRight: "0" },
                  ]}
                >
                  Name and address of the establishment/under which contract is
                  carried on
                </Text>
                <Text
                  style={[
                    styles.infoCell,
                    { width: "68.1%", borderRight: "0" },
                  ]}
                ></Text>
              </View>

              <View style={[styles.infoRow]}>
                <Text
                  style={[
                    styles.infoCell,
                    { width: "31.9%", borderRight: "0" },
                  ]}
                >
                  Nature and Location of Work
                </Text>
                <Text
                  style={[
                    styles.infoCell,
                    { width: "68.1%", borderRight: "0" },
                  ]}
                ></Text>
                <Text
                  style={[
                    styles.infoCell,
                    { width: "31.9%", borderRight: "0" },
                  ]}
                >
                  Name and Address of Principal Employer
                </Text>
                <Text style={[styles.infoCell, { width: "68.1%" }]}></Text>
              </View>

              {/* Table Header */}
              <View style={[styles.table, styles.row]}>
                {headers.map((header, index) => (
                  <Text
                    key={index}
                    style={[styles.headerCell, columnStyles[index]]}
                  >
                    {header}
                  </Text>
                ))}
              </View>

              {/* Table Rows */}
              {[...Array(7)].map((_, rowIndex) => (
                <View style={[styles.table, styles.row]} key={rowIndex}>
                  {headers.map((_, colIndex) => (
                    <Text
                      key={colIndex}
                      style={[styles.cell, columnStyles[colIndex]]}
                    ></Text>
                  ))}
                </View>
              ))}
            </Page>
          </Document>
        }
        fileName="FormXIII_WorkmanRegister.pdf"
      >
        {({ loading }) =>
          loading ? "Loading PDF..." : "Download Form XIII PDF"
        }
      </PDFDownloadLink>
    </Fragment>
  );
};

export default Form13;
