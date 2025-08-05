import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

const columnWidths = [
  "4%",
  "6%",
  "15%",
  "4%",
  "6%",
  "10%",
  "10%",
  "10%",
  "10%",
  "10%",
  "10%",
  "10%",
  "10%",
  "10%",
  "10%",
];

const styles = StyleSheet.create({
  page: { padding: 15, fontSize: 6 },
  title: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtitle: { textAlign: "center", fontSize: 8, marginBottom: 3 },
  label: { fontSize: 6, marginBottom: 2 },
  officerRow: { fontSize: 6, marginVertical: 1 },

  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderStyle: "solid",
  },
  cell: {
    borderRightWidth: 1,
    borderStyle: "solid",
    padding: 2,
    textAlign: "center",
  },
  headerCell: {
    fontWeight: "bold",
    backgroundColor: "#e6e6e6",
  },
  footer: { marginTop: 10, fontSize: 6 },
});

const headers = [
  "Sr.",
  "Works\nNo",
  "Name of Building\nworker",
  "Sex",
  "Age\n(Last birthday)",
  "Date of employment\non present work",
  "Date of leaving or\ntransfer to other work",
  "Reason for leaving\ntransfer or discharge",
  "Nature of job\nor occupation",
  "Raw material\nor by product\nhandled",
  "Date of medical\nexamination by CMO",
  "Results of medical\nexamination",
  "Suspension\nperiod + reason",
  "Fit to resume\n(CMO sign)",
  "Unfitness/\nSuspension\nCertificate",
];

const dummyRows = Array.from({ length: 10 }).map((_, i) =>
  Array(15)
    .fill("")
    .map((_, j) => (j === 0 ? `${i + 1}` : ""))
);

const FormXExactPDF = () => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <Text style={styles.title}>FORM X</Text>
      <Text style={styles.subtitle}>(See rule 193 (d))</Text>
      <Text style={styles.subtitle}>HEALTH REGISTER</Text>
      <Text style={styles.subtitle}>
        (In respect of workers employed in Building and other construction work
        involving hazardous processes)
      </Text>

      <Text style={[styles.label, { textAlign: "center" }]}>
        Name of the Construction Medical Officer/Medical Inspector
      </Text>
      <Text style={[styles.officerRow, { textAlign: "center" }]}>
        (A) Mr. ______________________ From ____________ To ____________
      </Text>
      <Text style={[styles.officerRow, { textAlign: "center" }]}>
        (B) Mr. ______________________ From ____________ To ____________
      </Text>
      <Text style={[styles.officerRow, { textAlign: "center" }]}>
        (C) Mr. ______________________ From ____________ To ____________
      </Text>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.row}>
          {headers.map((header, i) => (
            <Text
              key={i}
              style={[
                styles.cell,
                styles.headerCell,
                { width: columnWidths[i] },
              ]}
            >
              {header}
            </Text>
          ))}
        </View>

        {dummyRows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <Text
                key={colIndex}
                style={[styles.cell, { width: columnWidths[colIndex] }]}
              >
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItem: "center",
          marginVertical: 5,
        }}
      >
        <Text style={styles.footer}>Date: ____________________</Text>
        <Text style={styles.footer}>
          Signature with date of Medical Inspector/CMO
        </Text>
      </View>
      <Text style={styles.footer}>
        Note: (i) Column (8) - Detailed summary of reason for transfer or
        discharge should be stated
        {"\n"}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (ii) Column (12)
        should be expressed as fit/unfit/suspended.
      </Text>
    </Page>
  </Document>
);

export default function HealthFormX() {
  return (
    <PDFDownloadLink
      document={<FormXExactPDF />}
      fileName="form-x-health-register.pdf"
    >
      {({ loading }) =>
        loading ? "Generating PDF..." : "Download Form X (Exact)"
      }
    </PDFDownloadLink>
  );
}
