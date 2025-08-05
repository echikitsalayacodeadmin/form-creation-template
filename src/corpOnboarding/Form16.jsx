// MusterRollPDF.js
import React, { Fragment } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  PDFViewer,
} from "@react-pdf/renderer";

// Register Times New Roman (replace with path to your local .ttf)
// Font.register({ family: 'TimesNewRoman', src: '/path/to/Times-New-Roman.ttf' });

// Fallback without register if needed
const FONT_FAMILY = "Times-Roman";

// Helper
const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

// Precise column widths in pt; A4 landscape is ~841.89 x 595.28pt
const widths = {
  sno: "2%",
  name: "10%",
  father: "10%",
  sex: "3%",
  day: "2%",
  work: "3%",
  total: "3%",
  remarks: "7%",
};

// Style for ALL grid borders
const BORDER = 0.7;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    fontFamily: FONT_FAMILY,
    fontSize: 8,
    padding: 8,
  },
  outerBorder: {
    border: `${BORDER} solid #000`,
    flexDirection: "column",
  },
  headerSection: {
    borderBottom: `${BORDER} solid #000`,
    paddingVertical: 2,
    alignItems: "center",
    textAlign: "center",
    lineHeight: 1.2,
  },
  headerTitle: { fontSize: 11, fontWeight: "bold", marginBottom: 1 },
  headerRule: { fontSize: 8 },
  infoRow: { flexDirection: "row", borderBottom: `${BORDER} solid #000` },
  infoCell1: { width: 125, borderRight: `${BORDER} solid #000`, padding: 2 },
  infoCell2: {
    width: 185,
    borderRight: `${BORDER} solid #000`,
    padding: 2,
    minHeight: 15,
  },
  infoCell3: { width: 170, borderRight: `${BORDER} solid #000`, padding: 2 },
  infoCell4: { flex: 1, padding: 2 },
  tableHead: {
    flexDirection: "row",
    borderBottom: `${BORDER} solid #000`,
    backgroundColor: "#f2f2f2",
  },
  tableRow: { flexDirection: "row", minHeight: 17 },
  cell: {
    borderRight: `${BORDER} solid #000`,
    borderBottom: `${BORDER} solid #000`,
    textAlign: "center",
    paddingVertical: 1,
    paddingHorizontal: 1,
    fontSize: 8,
    lineHeight: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  noRight: { borderRight: 0 },
  cellSno: { width: widths.sno },
  cellName: { width: widths.name },
  cellFather: { width: widths.father },
  cellSex: { width: widths.sex },
  cellDay: { width: widths.day },
  cellWork: { width: widths.work },
  cellTotal: { width: widths.total },
  cellRemarks: { width: widths.remarks },
  footerRow: {
    flexDirection: "row",

    borderBottom: `${BORDER} solid #000`,
  },
  footerText: { flex: 1, textAlign: "right", fontSize: 8, padding: 4 },
});

// Main component
const MusterRollPDF = ({
  contractorName = "",
  contractorAddress = "",
  establishmentName = "",
  locationOfWork = "",
  principalEmployer = "",
  month = "",
  rows = [],
}) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.outerBorder}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>MUSTER ROLL</Text>
          <Text style={styles.headerTitle}>FORM NO. XVI</Text>
          <Text style={styles.headerRule}>(See rule 78(1)(a)(ii))</Text>
        </View>
        {/* Footer */}

        {/* Info rows */}
        <View style={styles.infoRow}>
          <Text style={styles.infoCell1}>Name and address of contractor</Text>
          <Text style={styles.infoCell2}>
            {contractorName}
            {contractorAddress && `, ${contractorAddress}`}
          </Text>
          <Text style={styles.infoCell3}>
            Name and address of establishment/under which contract is carried
            on:
          </Text>
          <Text style={styles.infoCell4}>{establishmentName}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoCell1}>Nature and location of work</Text>
          <Text style={styles.infoCell2}>{locationOfWork}</Text>
          <Text style={styles.infoCell3}>
            Name and address of Principal Employer
          </Text>
          <Text style={styles.infoCell4}>{principalEmployer}</Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>For the month of {month}</Text>
        </View>
        {/* Table header */}
        <View style={styles.tableHead}>
          <Text style={[styles.cell, styles.cellSno]}>S. No</Text>
          <Text style={[styles.cell, styles.cellName]}>Name of Employee</Text>
          <Text style={[styles.cell, styles.cellFather]}>
            Father's/Husband's Name
          </Text>
          <Text style={[styles.cell, styles.cellSex]}>Sex</Text>
          {days.map((d, i) => (
            <Text key={d} style={[styles.cell, styles.cellDay]}>
              {d}
            </Text>
          ))}
          <Text style={[styles.cell, styles.cellWork]}>Work Days</Text>
          <Text style={[styles.cell, styles.cellTotal]}>Total Days</Text>
          <Text style={[styles.cell, styles.cellRemarks, styles.noRight]}>
            Remarks
          </Text>
        </View>

        {/* Table rows */}
        {rows.map((row, idx) => (
          <View key={idx} style={styles.tableRow}>
            <Text style={[styles.cell, styles.cellSno]}>{idx + 1}</Text>
            <Text style={[styles.cell, styles.cellName]}>{row.name}</Text>
            <Text style={[styles.cell, styles.cellFather]}>
              {row.fatherOrHusband}
            </Text>
            <Text style={[styles.cell, styles.cellSex]}>{row.sex}</Text>
            {days.map((d, i) => (
              <Text
                key={d}
                style={[
                  styles.cell,
                  styles.cellDay,
                  i === days.length - 1 ? undefined : undefined,
                ]}
              >
                {row.days?.[i] || ""}
              </Text>
            ))}
            <Text style={[styles.cell, styles.cellWork]}>{row.workDays}</Text>
            <Text style={[styles.cell, styles.cellTotal]}>{row.totalDays}</Text>
            <Text style={[styles.cell, styles.cellRemarks, styles.noRight]}>
              {row.remarks}
            </Text>
          </View>
        ))}
        {/* Empty rows to fill page visually */}
        {[...Array(9)].map((_, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={[styles.cell, styles.cellSno]} />
            <Text style={[styles.cell, styles.cellName]} />
            <Text style={[styles.cell, styles.cellFather]} />
            <Text style={[styles.cell, styles.cellSex]} />
            {days.map((d, j) => (
              <Text key={j} style={[styles.cell, styles.cellDay]} />
            ))}
            <Text style={[styles.cell, styles.cellWork]} />
            <Text style={[styles.cell, styles.cellTotal]} />
            <Text style={[styles.cell, styles.cellRemarks, styles.noRight]} />
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

const Form16 = () => {
  const dataRows = [
    {
      name: "John Doe",
      fatherOrHusband: "Richard Doe",
      sex: "M",
      days: Array(31).fill("P"),
      workDays: 28,
      totalDays: 30,
      remarks: "",
    },
    // ...more rows as needed
  ];
  return (
    <Fragment>
      <PDFViewer width="1000" height="700">
        <MusterRollPDF
          contractorName="Your Contractor"
          contractorAddress="123 Street, City"
          establishmentName="Your Establishment"
          locationOfWork="XYZ Location"
          principalEmployer="Employer Name"
          month="July 2025"
          rows={dataRows}
        />
      </PDFViewer>
    </Fragment>
  );
};

export default Form16;
