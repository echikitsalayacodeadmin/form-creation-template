import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  PDFViewer,
  Font,
  Image,
} from "@react-pdf/renderer";
import Dr_Jaydip_Saxena from "../assets/images/Dr_Jaydip_Saxena.png";
import dr_kunal_stamp_sign from "../assets/images/dr_kunal_stamp_sign.png";

// Register Times fonts for classic look
Font.register({
  family: "Times-Roman",
  src: "https://fonts.gstatic.com/s/timesnewroman/v11/pxiDyp8kv8JHgFVrJJLucXtAKPY.woff2",
});
Font.register({
  family: "Times-Bold",
  src: "https://fonts.gstatic.com/s/timesnewroman/v11/pxiAyp8kv8JHgFVrJJLucXtAKPY.woff2",
  fontWeight: "bold",
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 20,
    fontFamily: "Times-Roman",
    fontSize: 11,
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    display: "flex",
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Times-Bold",
    marginBottom: 20,
  },
  form7: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Times-Bold",
    marginBottom: 2,
  },
  rule: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 14,
  },
  heathRegister: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "bold",
    fontFamily: "Times-Bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 10,
  },
  surgeonSection: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 10,
  },
  surgeonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
  },
  surgeonLabel: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    width: 38,
    marginRight: 0,
  },
  surgeonLine: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    flexGrow: 1,
    borderBottomWidth: 0,
    marginLeft: 0,
    marginRight: 0,
  },
  surgeonDots: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    letterSpacing: 2,
  },
  surgeonFromToRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 38,
  },
  surgeonFromToText: {
    fontSize: 11,
    fontFamily: "Times-Roman",
    marginLeft: 2,
    marginRight: 2,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  row: { flexDirection: "row" },
  cellId: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,

    width: 60,
    fontFamily: "Times-Roman",
  },

  cellLabel: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,

    width: "60%",
    fontFamily: "Times-Roman",
  },

  cellValue: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,

    width: "40%",
    fontFamily: "Times-Roman",
  },
  bottomSection: {
    marginTop: 10,
  },
  hr: {
    borderBottomWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  noteBold: {
    fontWeight: "bold",
    fontFamily: "Times-Bold",
    marginRight: 10,
  },
  noteText: {
    fontFamily: "Times-Roman",
  },
  noteIndented: {
    fontFamily: "Times-Roman",
    marginLeft: 20,
  },
});

const Dots = ({ count }) => (
  <Text style={styles.surgeonDots}>{".".repeat(count)}</Text>
);

const MaharashtraFactRule = ({
  certifyingSurgeonName = "Dr Jaydip Saxsena",
  data = {},
  fitStatus = "",
  vitalsCreatedDate = "",
  signature = "dr_kunal_stamp_sign.png",
}) => {
  // Function to get the correct signature image
  const getSignatureImage = () => {
    switch (signature) {
      case "Dr_Jaydip_Saxena.png":
        return Dr_Jaydip_Saxena;
      case "dr_kunal_stamp_sign.png":
      default:
        return dr_kunal_stamp_sign;
    }
  };
  const tableHeaders = [
    { id: 1, label: "Serial No.", value: "" },
    { id: 2, label: "Works No.", value: data?.empId || "" },
    { id: 3, label: "Name of worker", value: data?.name || "" },
    { id: 4, label: "Sex", value: data?.gender || "" },
    { id: 5, label: "Age (last birthday)", value: data?.age || "" },
    { id: 6, label: "Date of employment of present work", value: "NA" },
    { id: 7, label: "Date of leaving or transfer to other work", value: "NA" },
    { id: 8, label: "Reason for leaving Transfer or discharge", value: "NA" },
    {
      id: 9,
      label: "Nature of job or occupation",
      value: data?.department || "",
    },
    { id: 10, label: "Raw material or bye-product handled", value: "NA" },
    {
      id: 11,
      label: "Date of medical Examination by Certifying Surgeon",
      value: data?.vitalsCreatedDate || vitalsCreatedDate || "",
    },
    {
      id: 12,
      label: "Results of Medical Examination",
      value: fitStatus === "Fit" ? "Fit" : "Medical Consultation Advised",
    },
    {
      id: 13,
      label:
        "If suspended from work, state period of suspension with detailed reasons",
      value: "NA",
    },
    {
      id: 14,
      label:
        "Certified fit to resume duty on with signature of Certifying Surgeon",
      value: "NA",
    },
    {
      id: 15,
      label: "If certificate of unfitness of suspension issued to worker",
      value: "NA",
    },
    {
      id: 16,
      label: "Signature with date of Certifying Surgeon",
      value: <Image src={Dr_Jaydip_Saxena} style={{ height: 60, width: 80 }} />,
    },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header at the top */}

        <Text style={styles.title}>The Maharashtra Factories Rules</Text>
        <Text style={styles.form7}>FORM 7</Text>
        <Text style={styles.rule}>
          (See rule 18(7) and Schedules II, III, IV, VI, VIII, X, XI, XIII, XIV,
          XV, XVII, XVIII and XX to Rule 114)
        </Text>
        <Text style={styles.heathRegister}>Heath Register</Text>
        <Text style={styles.subtitle}>
          (In respect of persons employed in occupations declared to be
          dangerous operations under)
        </Text>
        <Text style={styles.surgeonSection}>
          Sec. 87, Name of Certifying surgeon :
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <View>
            <View style={styles.surgeonRow}>
              <Text style={styles.surgeonLabel}>(a) Mr.</Text>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 120,
                }}
              >
                <Text style={{ fontSize: 10 }}>
                  {certifyingSurgeonName || " "}
                </Text>
                <Dots count={70} />
              </View>
            </View>
            <View style={styles.surgeonFromToRow}>
              <Text style={styles.surgeonFromToText}>From</Text>
              <Dots count={28} />
              <Text style={styles.surgeonFromToText}>To</Text>
              <Dots count={22} />
            </View>
            {/* Surgeon (b) */}
            <View style={styles.surgeonRow}>
              <Text style={styles.surgeonLabel}>(b) Mr.</Text>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 120,
                }}
              >
                <Text style={{ fontSize: 10 }}> </Text>
                <Dots count={70} />
              </View>
            </View>
            <View style={styles.surgeonFromToRow}>
              <Text style={styles.surgeonFromToText}>From</Text>
              <Dots count={28} />
              <Text style={styles.surgeonFromToText}>To</Text>
              <Dots count={22} />
            </View>
            {/* Surgeon (c) */}
            <View style={styles.surgeonRow}>
              <Text style={styles.surgeonLabel}>(c) Mr.</Text>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 120,
                }}
              >
                <Text style={{ fontSize: 10 }}> </Text>
                <Dots count={70} />
              </View>
            </View>
            <View style={styles.surgeonFromToRow}>
              <Text style={styles.surgeonFromToText}>From</Text>
              <Dots count={28} />
              <Text style={styles.surgeonFromToText}>To</Text>
              <Dots count={22} />
            </View>
          </View>
        </View>

        {/* Table centered vertically */}
        <View style={styles.contentContainer}>
          <View style={styles.table}>
            {tableHeaders.map((row, index) => (
              <View style={styles.row} key={index}>
                <Text style={styles.cellId}>{row.id || ""}</Text>
                <Text style={styles.cellLabel}>{row.label || ""}</Text>
                {row.id === 16 ? (
                  <View
                    style={[
                      styles.cellValue,
                      {
                        justifyContent: "center",
                        alignItems: "center",
                        height: 60,
                      },
                    ]}
                  >
                    <Image
                      src={Dr_Jaydip_Saxena}
                      style={{ height: 50, width: 80 }}
                    />
                  </View>
                ) : typeof row.value === "object" && row.value !== null ? (
                  row.value
                ) : (
                  <Text style={styles.cellValue}>{row?.value || ""}</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Footer at the bottom */}
        <View style={styles.bottomSection} fixed>
          <View style={styles.hr} />
          <View style={styles.noteRow}>
            <Text style={styles.noteBold}>Note :</Text>
            <Text style={styles.noteText}>
              (i) Col. 8 - Detailed summery of reason for transfer or discharge
              should be stated.
            </Text>
          </View>
          <Text style={styles.noteIndented}>
            (ii) Col. 11 - Should be expressed as fir / unit / suspended.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default MaharashtraFactRule;
