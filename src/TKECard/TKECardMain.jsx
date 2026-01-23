import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import tkeLogo from "../assets/images/tkeLogo.png";
import dayjs from "dayjs";
import { dataTKE } from "./rawDataTKE";

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );

const styles = StyleSheet.create({
  page: {
    width: "210mm",
    height: "297mm",
    padding: 16,
    fontSize: 5,
    fontFamily: "Helvetica",
  },

  card: {
    border: "0.3pt solid #000",
    width: "87mm",
    height: "57mm",
    padding: 10,
  },
  cardInner: {
    border: "0.5pt solid #000",
  },

  row: {
    flexDirection: "row",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottom: "0.5pt solid #000",
    height: "8mm",
  },

  logo: {
    width: 20,
    height: 8,
    marginRight: 4,
  },

  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 5,
    fontWeight: "bold",
  },

  sectionTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 5,
    borderTop: "0.5pt solid #000",
    borderBottom: "0.5pt solid #000",
    paddingVertical: 0.7,
  },

  footer: {
    textAlign: "center",
    fontSize: 4,
    paddingVertical: 0.7,
  },

  disclaimer: {
    textAlign: "center",
    fontSize: 4,
  },

  label: {
    fontWeight: "bold",
    fontSize: 4,
  },

  value: {
    fontSize: 4,
  },
  topBlock: {
    flexDirection: "row",
    borderBottom: "0.3pt solid #000",
  },

  leftCol: {
    flex: 4,
    borderRight: "0.3pt solid #000",
    paddingLeft: 3,
    justifyContent: "center",
  },

  rightStack: {
    flex: 4,
    flexDirection: "column",
  },

  rightRow: {
    flexDirection: "row",
    borderBottom: "0.3pt solid #000",
  },

  rightCell: {
    flex: 1,
    borderRight: "0.3pt solid #000",
    paddingLeft: 3,
    justifyContent: "center",
    paddingVertical: 0.7,
  },

  pathologyTitle: {
    textAlign: "center",
    fontWeight: "bold",
    borderBottom: "0.5pt solid #000",
    paddingVertical: 2,
    fontSize: 8,
  },

  pathologyRow: {
    flexDirection: "row",
    borderBottom: "0.3pt solid #000",
  },

  pathLabel: {
    flex: 2,
    borderRight: "0.3pt solid #000",
    paddingLeft: 3,
    paddingVertical: 1,
  },

  pathValue: {
    flex: 2,
    borderRight: "0.3pt solid #000",
    paddingLeft: 3,
  },

  noRightBorder: {
    borderRightWidth: 0,
  },

  adviceRow: {
    flexDirection: "row",
    borderBottom: "0.3pt solid #000",
  },

  adviceCell: {
    flex: 1,
    borderRight: "0.3pt solid #000",
    paddingLeft: 3,
    paddingVertical: 0.7,
  },

  footerFull: {
    textAlign: "center",
    fontWeight: "bold",
    paddingVertical: 2,
    fontSize: 5,
    borderBottom: "0.3pt solid #000",
  },

  footerNote: {
    textAlign: "center",
    fontSize: 3.4,
    paddingHorizontal: 1,
    paddingVertical: 1,
  },
});

const TKECardTemplate = ({ employees }) => {
  const pages = chunk(employees, 8);
  return (
    <Document>
      {pages.map((pageGroup, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          style={{
            width: "210mm",
            height: "297mm",
            paddingTop: 5,
            paddingLeft: "18mm",
            flexDirection: "column",
            backgroundColor: "#fff",
            fontFamily: "Times-Roman-Normal",
          }}
        >
          {chunk(pageGroup, 2).map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={{ flexDirection: "row", marginBottom: 6 }}
            >
              {row.map((emp, i) => (
                <View key={i} style={{ marginRight: i === 0 ? 6 : 0 }}>
                  <Card data={emp} />
                </View>
              ))}
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

const Card = ({ data }) => (
  <View style={styles.card}>
    <View style={styles.cardInner}>
      {/* Header */}
      <View
        style={[styles.row, { borderBottom: "0.5pt solid #000", padding: 2 }]}
      >
        {data?.["Employment Type"] === "ONROLL" && (
          <Image source={tkeLogo} style={{ width: 22, height: 8 }} />
        )}
        <Text
          style={{
            flex: 1,
            textAlign:
              data?.["Employment Type"] === "ONROLL" ? "right" : "center",
            fontSize: 7,
            fontWeight: "bold",
          }}
        >
          EMPLOYEE HEALTH CARD
        </Text>
      </View>

      {/* Top Grid */}
      <View style={styles.topBlock}>
        {/* Left spanning cell */}
        <View style={styles.leftCol}>
          <Text style={{ fontSize: 5 }}>Name : {data?.["NAME"] || ""}</Text>
          <Text style={{ fontSize: 5 }}>Age : {data?.["AGE"] || ""}</Text>
          <Text style={{ fontSize: 5 }}>
            Department : {data?.["Depatment"] || ""}
          </Text>
        </View>

        {/* Right side */}
        <View style={styles.rightStack}>
          {/* Row 1 */}
          <View style={styles.rightRow}>
            <View style={styles.rightCell}>
              <Text style={{ fontSize: 5 }}>Card No.</Text>
            </View>
            <View style={styles.rightCell}>
              <Text style={{ fontSize: 5 }}>{data?.["ID"] || ""}</Text>
            </View>
            <View style={styles.rightCell}>
              <Text style={{ fontSize: 5 }}>Check-up Date</Text>
            </View>
            <View style={[styles.rightCell, styles.noRightBorder]}>
              <Text style={{ fontSize: 5 }}>
                {data?.["Check-up Date"]
                  ? dayjs(data?.["Check-up Date"]).format("DD/MM/YY")
                  : ""}
              </Text>
            </View>
          </View>

          {/* Row 2 */}
          <View style={[styles.rightRow, { borderBottomWidth: 0 }]}>
            <View style={styles.rightCell}>
              <Text style={{ fontSize: 5 }}>Emp. No.</Text>
            </View>
            <View style={styles.rightCell}>
              <Text style={{ fontSize: 5 }}>{data?.["EMP CODE"] || ""}</Text>
            </View>
            <View style={styles.rightCell}>
              <Text style={{ fontSize: 5 }}>Blood Group</Text>
            </View>
            <View style={[styles.rightCell, styles.noRightBorder]}>
              <Text style={{ fontSize: 5 }}>{data?.["BLOOD GROUP"] || ""}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Vitals row */}
      <View style={styles.topBlock}>
        <View style={styles.leftCol}>
          <Text style={{ fontSize: 5 }}>BMI : {data?.["BMI"] || ""}</Text>
          <Text style={{ fontSize: 5 }}>BP : {data?.["BP"] || ""}</Text>
        </View>

        <View style={styles.rightStack}>
          <View style={[styles.rightRow, { borderBottom: 0 }]}>
            <View style={[styles.rightCell, { paddingBottom: 0, flex: 2 }]}>
              <Text style={{ fontSize: 5 }}>
                Weight : {data?.["WEIGHT"] ? `${data?.["WEIGHT"]}` : ""}
              </Text>
            </View>
            <View style={[styles.rightCell, { borderRight: 0, flex: 2 }]}>
              <Text style={{ fontSize: 5 }}>
                Vision : {data?.["VISION REMARK"] || ""}
              </Text>
            </View>
          </View>

          <View style={[styles.rightRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.rightCell, { borderRight: 0 }]}>
              <Text style={{ fontSize: 5 }}>
                Height : {data?.["HEIGHT"] ? data?.["HEIGHT"] : ""}
              </Text>
            </View>
            <View style={[styles.rightCell]}>
              <Text style={{ fontSize: 5 }}></Text>
            </View>
            <View style={[styles.rightCell, { borderRight: 0 }]}></View>
            <View style={[styles.rightCell, styles.noRightBorder]}></View>
          </View>
        </View>
      </View>

      {/* PATHOLOGY */}
      {/* PATHOLOGY title */}
      <Text style={styles.pathologyTitle}>PATHOLOGY</Text>

      {[
        [
          "HB",
          data?.["HEMOGLOBIN"] ? `${data?.["HEMOGLOBIN"]} mg/dl` : "",
          "Total Bilirubin",
          data?.["TOTAL BILIRUBIN"] ? `${data?.["TOTAL BILIRUBIN"]} mg/dL` : "",
        ],
        [
          "Total Chol.",
          data?.["CHOLESTROL"] ? `${data?.["CHOLESTROL"]} mg/dL` : "",
          "ALT (SGPT)",
          data?.["SGPT"] ? `${data?.["SGPT"]} mg/dL` : "",
        ],
        [
          "Triglyceride",
          data?.["TRIGLYCERIDE"] ? `${data?.["TRIGLYCERIDE"]} mg/dL` : "",
          "AST (SGOT)",
          data?.["SGOT"] ? `${data?.["SGOT"]} mg/dL` : "",
        ],
        [
          "HBA1C",
          data?.["HBA1C"] ? data?.["HBA1C"] : "",
          "RBC Count",
          data?.["RBC"] ? `${data?.["RBC"]} μL` : "",
        ],
        [
          "WBC Count",
          data?.["TOTAL WBC COUNT"] ? `${data?.["TOTAL WBC COUNT"]} μL` : "",
          "Platelets Count",
          data?.["PLATELET COUNT"] ? `${data?.["PLATELET COUNT"]} μL` : "",
        ],
        [
          "Creatinine",
          data?.["SCREATININE"] ? `${data?.["SCREATININE"]} mg/dL` : "",
          "Blood Urea Level",
          data?.["BLOOD UREA"] ? `${data?.["BLOOD UREA"]} mg/dL` : "",
        ],
      ].map((row, i) => (
        <View key={i} style={styles.pathologyRow}>
          <View style={styles.pathLabel}>
            <Text style={{ fontSize: 5 }}>{row[0]}</Text>
          </View>
          <View style={styles.pathValue}>
            <Text style={{ fontSize: 5 }}>{row[1]}</Text>
          </View>
          <View style={styles.pathLabel}>
            <Text style={{ fontSize: 5 }}>{row[2]}</Text>
          </View>
          <View style={[styles.pathValue, styles.noRightBorder]}>
            <Text style={{ fontSize: 5 }}>{row[3]}</Text>
          </View>
        </View>
      ))}

      {/* Advice */}
      <View style={styles.adviceRow}>
        <View style={styles.adviceCell}>
          <Text style={{ fontSize: 5 }}>
            PFT Advise : {data?.["PFT"] || ""}
          </Text>
        </View>
        <View style={[styles.adviceCell, styles.noRightBorder]}>
          <Text style={{ fontSize: 5 }}>
            ECG Advise : {data?.["ECG"] || ""}
          </Text>
        </View>
      </View>

      <View style={styles.adviceRow}>
        <View style={styles.adviceCell}>
          <Text style={{ fontSize: 5 }}>
            Audiometry Advise : {data?.["AUDIOMETRIC"] || ""}
          </Text>
        </View>
        <View style={[styles.adviceCell, styles.noRightBorder]}>
          <Text style={{ fontSize: 5 }}>
            Colour Blind :{" "}
            {data?.["COLOUR BLINDNESS"] === "NAD"
              ? "Normal"
              : data?.["COLOUR BLINDNESS"]}
          </Text>
        </View>
      </View>

      {/* Recommendations */}
      <Text style={styles.footerFull}>
        RECOMMENDATIONS: EAT HEALTHY FOOD AND REGULAR EXERCISE
      </Text>

      <Text style={styles.footerNote}>
        All recommendation are based only on the health check-up reports. Please
        discuss with your physician to correlate clinically.
      </Text>
    </View>
  </View>
);

const TKECardMain = () => {
  return (
    <div>
      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <TKECardTemplate employees={dataTKE} />
      </PDFViewer>
    </div>
  );
};

export default TKECardMain;
