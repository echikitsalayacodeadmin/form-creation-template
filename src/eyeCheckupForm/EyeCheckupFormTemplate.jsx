import {
  Document,
  Font,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";
import macaleod from "../../src/assets/images/macaleod.png";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import rohitSign from "../../src/assets/images/rohitSign.png";
import rohitSeal from "../../src/assets/images/rohitSeal.png";
import dayjs from "dayjs";

Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman-Normal",
    fontSize: 11,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    borderWidth: 1,
    borderBottom: 0,
    borderBottomColor: "#000",
  },
  headerLeft: {
    flex: 3,
  },
  headerRight: {
    flex: 1,
    alignItems: "center",
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  addressInfo: {
    fontSize: 11,
    textAlign: "center",
    marginBottom: 3,
  },
  logo: {
    width: 80,
    height: 30,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    borderStyle: "solid",
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#000",
    padding: 5,
  },
  tableColHeader: {
    backgroundColor: "#FFFFFF",
    fontWeight: "bold",
  },
  tableCell: {
    fontSize: 11,
    textAlign: "left",
  },
  formSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 5,
    backgroundColor: "#f0f0f0",
    padding: 3,
    textAlign: "center",
  },
  inputField: {
    borderBottom: 1,
    borderBottomColor: "#000",
    marginBottom: 5,
    paddingBottom: 2,
    minHeight: 15,
  },
  signatureSection: {
    flexDirection: "row",
    marginTop: 20,
    borderTop: 1,
    borderTopColor: "#000",
    paddingTop: 10,
  },
  signatureBox: {
    flex: 1,
    textAlign: "center",
    padding: 10,
    marginHorizontal: 5,
    borderRight: 1,
    borderRightColor: "#000",
  },
  noteSection: {
    marginTop: 10,
    fontSize: 11,

    paddingTop: 5,
  },
});

const EyeCheckupFormTemplate = ({ data, unfit }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={[styles.header, { borderBottomWidth: 0 }]}>
        <View style={styles.headerLeft}>
          <Text
            style={[styles.companyName, { fontFamily: "Times-Roman-Bold" }]}
          >
            Macleods Pharmaceuticals Limited
          </Text>
          <Text
            style={[
              styles.addressInfo,
              {
                fontFamily: "Times-Roman-Bold",
                textAlign: "center",
                paddingHorizontal: 10,
                fontSize: 10,
              },
            ]}
          >
            Plot No. M-50 to M-54-A, Indore Special Economic Zone, Phase-II,
            District: Dhar, Pithampur, MP - 454774
          </Text>
        </View>
        <View style={[styles.headerRight, { borderLeftWidth: 1 }]}>
          <Image src={macaleod} style={{ width: 85, height: 28 }} />
        </View>
      </View>

      {/* Form Details Table */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View
            style={[styles.tableCol, { width: "25%" }, styles.tableColHeader]}
          >
            <Text
              style={[styles.tableCell, { fontFamily: "Times-Roman-Bold" }]}
            >
              Format Title:
            </Text>
          </View>
          <View
            style={[styles.tableCol, { width: "75%", borderRightWidth: 0 }]}
          >
            <Text style={[styles.tableCell]}>
              Eye testing (sight / vision testing) for optical / visual
              inspectors Format
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View
            style={[styles.tableCol, { width: "25%" }, styles.tableColHeader]}
          >
            <Text
              style={[styles.tableCell, { fontFamily: "Times-Roman-Bold" }]}
            >
              SOP No.:
            </Text>
          </View>
          <View style={[styles.tableCol, { width: "25%" }]}>
            <Text style={styles.tableCell}>SOP/PI/HRD/001</Text>
          </View>
          <View
            style={[styles.tableCol, { width: "25%" }, styles.tableColHeader]}
          >
            <Text
              style={[styles.tableCell, { fontFamily: "Times-Roman-Bold" }]}
            >
              Page No.
            </Text>
          </View>
          <View
            style={[styles.tableCol, { width: "25%", borderRightWidth: 0 }]}
          >
            <Text style={styles.tableCell}>1 of 1</Text>
          </View>
        </View>
        <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
          <View
            style={[
              styles.tableCol,
              { width: "25%", borderBottomWidth: 0 },
              styles.tableColHeader,
            ]}
          >
            <Text
              style={[styles.tableCell, { fontFamily: "Times-Roman-Bold" }]}
            >
              Format No.:
            </Text>
          </View>
          <View
            style={[
              styles.tableCol,
              { width: "75%", borderRightWidth: 0, borderBottomWidth: 0 },
            ]}
          >
            <Text style={styles.tableCell}>FRM/SOP/PI/HRD/001/03-002</Text>
          </View>
        </View>
      </View>

      {/* Employee Information Table */}
      <View style={[styles.table, { borderTopWidth: 0, marginTop: 20 }]}>
        <View style={[styles.tableRow]}>
          <View
            style={[
              styles.tableCol,
              { width: "25%", borderTopWidth: 1 },
              styles.tableColHeader,
            ]}
          >
            <Text
              style={[styles.tableCell, { fontFamily: "Times-Roman-Bold" }]}
            >
              Name :{" "}
            </Text>
          </View>
          <View style={[styles.tableCol, { width: "25%", borderTopWidth: 1 }]}>
            <Text style={styles.tableCell}>{data?.name || ""}</Text>
          </View>
          <View
            style={[
              styles.tableCol,
              { width: "25%", borderTopWidth: 1 },
              styles.tableColHeader,
            ]}
          >
            <Text
              style={[styles.tableCell, { fontFamily: "Times-Roman-Bold" }]}
            >
              Date :{" "}
            </Text>
          </View>
          <View
            style={[
              styles.tableCol,
              { width: "25%", borderTopWidth: 1, borderRightWidth: 0 },
            ]}
          >
            <Text style={styles.tableCell}>
              {data?.vitalsCreatedDate
                ? dayjs(data?.vitalsCreatedDate, "YYYY-MM-DD").format(
                    "DD/MM/YY"
                  )
                : ""}
            </Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View
            style={[styles.tableCol, { width: "25%" }, styles.tableColHeader]}
          >
            <Text
              style={[styles.tableCell, { fontFamily: "Times-Roman-Bold" }]}
            >
              Employee code :{" "}
            </Text>
          </View>
          <View style={[styles.tableCol, { width: "25%" }]}>
            <Text style={styles.tableCell}>{data?.empId || ""}</Text>
          </View>
          <View
            style={[styles.tableCol, { width: "25%" }, styles.tableColHeader]}
          >
            <Text
              style={[styles.tableCell, { fontFamily: "Times-Roman-Bold" }]}
            >
              Gender :
            </Text>
          </View>
          <View
            style={[styles.tableCol, { width: "25%", borderRightWidth: 0 }]}
          >
            <Text style={styles.tableCell}>{data?.gender || ""}</Text>
          </View>
        </View>
        <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
          <View
            style={[
              styles.tableCol,
              { width: "25%", borderBottomWidth: 0 },
              styles.tableColHeader,
            ]}
          >
            <Text
              style={[styles.tableCell, { fontFamily: "Times-Roman-Bold" }]}
            >
              Department :
            </Text>
          </View>
          <View
            style={[styles.tableCol, { width: "25%", borderBottomWidth: 0 }]}
          >
            <Text style={styles.tableCell}>
              {data?.department?.toLowerCase() === "qa"
                ? "QA"
                : "Production" || ""}
            </Text>
          </View>
          <View
            style={[
              styles.tableCol,
              { width: "25%", borderBottomWidth: 0 },
              styles.tableColHeader,
            ]}
          >
            <Text
              style={[styles.tableCell, { fontFamily: "Times-Roman-Bold" }]}
            >
              Section / Area :
            </Text>
          </View>
          <View
            style={[
              styles.tableCol,
              { width: "25%", borderRightWidth: 0, borderBottomWidth: 0 },
            ]}
          >
            <Text style={styles.tableCell}>
              {data?.designation?.toUpperCase() || ""}
            </Text>
          </View>
        </View>
      </View>

      {/* Eyes Vision Section */}
      <Text
        style={[
          styles.sectionTitle,
          {
            backgroundColor: "#ffffff",
            marginBottom: 0,
            borderLeft: 1,
            borderRight: 1,
            textAlign: "left",
            paddingHorizontal: 5,
            fontFamily: "Times-Roman-Bold",
            fontSize: 12,
          },
        ]}
      >
        EYES VISION : FAR / NEAR
      </Text>
      <View style={[styles.table, { borderBottomWidth: 0 }]}>
        <View style={styles.tableRow}>
          <View
            style={[styles.tableCol, { width: "25%" }, styles.tableColHeader]}
          >
            <Text style={[styles.tableCell, { fontSize: 11 }]}>
              Right Eye With Glasses:
            </Text>
          </View>
          <View style={[styles.tableCol, { width: "25%" }]}>
            <Text>Far (R): {data?.farRightEyeSightWithGlasses || ""}</Text>
            <Text>Near (R): {data?.nearRightEyeSightWithGlasses || ""}</Text>
          </View>
          <View
            style={[styles.tableCol, { width: "25%" }, styles.tableColHeader]}
          >
            <Text style={[styles.tableCell, { fontSize: 11 }]}>
              Right Eye Without Glasses:
            </Text>
          </View>
          <View
            style={[styles.tableCol, { width: "25%", borderRightWidth: 0 }]}
          >
            <Text>Far (R): {data?.farRightEyeSight || ""}</Text>
            <Text>Near (R): {data?.nearRightEyeSight || ""}</Text>
          </View>
        </View>
        <View style={[styles.tableRow, { borderBottomWidth: 0 }]}>
          <View
            style={[
              styles.tableCol,
              { width: "25%", borderBottomWidth: 0 },
              styles.tableColHeader,
            ]}
          >
            <Text style={[styles.tableCell, { fontSize: 11 }]}>
              Left Eye With Glasses:
            </Text>
          </View>
          <View
            style={[styles.tableCol, { width: "25%", borderBottomWidth: 0 }]}
          >
            <Text>Far (L): {data?.farLeftEyeSightWithGlasses || ""}</Text>
            <Text>Near (L): {data?.nearLeftEyeSightWithGlasses || ""}</Text>
          </View>
          <View
            style={[
              styles.tableCol,
              { width: "25%", borderBottomWidth: 0 },
              styles.tableColHeader,
            ]}
          >
            <Text style={[styles.tableCell, { fontSize: 11 }]}>
              Left Eye Without Glasses:
            </Text>
          </View>
          <View
            style={[
              styles.tableCol,
              { width: "25%", borderRightWidth: 0, borderBottomWidth: 0 },
            ]}
          >
            <Text>Far (L): {data?.farLeftEyeSight || ""}</Text>
            <Text>Near (L): {data?.nearLeftEyeSight || ""}</Text>
          </View>
        </View>
      </View>

      {/* Colour Vision Section */}
      <View style={[styles.table, { borderBottomWidth: 0 }]}>
        <View style={styles.tableRow}>
          <View
            style={[
              styles.tableCol,
              { width: "100%", borderRightWidth: 0, borderBottomWidth: 0 },
              styles.tableColHeader,
            ]}
          >
            <Text
              style={[styles.tableCell, { fontFamily: "Times-Roman-Bold" }]}
            >
              Colour Vision ( ISHIHARA'S CHART ) :
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.tableRow,
            { borderRightWidth: 0, borderBottomWidth: 0 },
          ]}
        >
          <View
            style={[
              styles.tableCol,
              {
                width: "100%",
                minHeight: 40,
                borderRightWidth: 0,
              },
            ]}
          >
            <Text style={styles.tableCell}>{data?.colourVision || "NAD"}</Text>
          </View>
        </View>
      </View>

      {/* Treatment Advised Section */}
      <View style={[styles.table, { borderBottomWidth: 0, marginTop: 20 }]}>
        <View style={styles.tableRow}>
          <View
            style={[
              styles.tableCol,
              { width: "35%", borderBottomWidth: 0, minHeight: 40 },
              styles.tableColHeader,
            ]}
          >
            <Text
              style={[styles.tableCell, { fontFamily: "Times-Roman-Bold" }]}
            >
              TREATMENT ADVICED :
            </Text>
          </View>
          <View
            style={[
              styles.tableCol,
              {
                width: "65%",
                borderRightWidth: 0,
                borderBottomWidth: 0,
                minHeight: 40,
              },
            ]}
          >
            <Text style={styles.tableCell}>{"No"}</Text>
          </View>
        </View>
      </View>

      {/* Declaration Section */}
      <View style={[styles.table, { borderBottomWidth: 0 }]}>
        <View style={styles.tableRow}>
          <View
            style={[
              styles.tableCol,
              { width: "35%", borderBottomWidth: 0 },
              styles.tableColHeader,
            ]}
          >
            <Text
              style={[styles.tableCell, { fontFamily: "Times-Roman-Bold" }]}
            >
              DECLARATION :
            </Text>
          </View>
          <View
            style={[
              styles.tableCol,
              {
                width: "65%",
                borderRightWidth: 0,
                borderBottomWidth: 0,
              },
            ]}
          >
            <Text
              style={[
                styles.tableCell,
                { flexDirection: "row", flexWrap: "wrap" },
              ]}
            >
              After examining Mr. / Mrs. / Ms{" "}
              <Text style={{ textDecoration: "underline" }}>
                {data?.name || ""}
              </Text>{" "}
              I hereby certify that he / she is fit / unfit for Job.
            </Text>
          </View>
        </View>
      </View>

      {/* Signature Section */}
      <View style={[styles.table, { borderBottomWidth: 0 }]}>
        <View style={styles.tableRow}>
          <View
            style={[
              styles.tableCol,
              { width: "50%", minHeight: 60, borderBottomWidth: 0 },
            ]}
          >
            <Image
              src={rohitSign}
              style={{
                width: 100,
                height: 50,
                alignSelf: "center",
                marginTop: 6,
              }}
            />
            <Text
              style={[
                styles.tableCell,
                {
                  textAlign: "center",
                  marginTop: 20,
                  fontFamily: "Times-Roman-Bold",
                },
              ]}
            >
              Certified By Doctor (Signature and Date)
            </Text>
          </View>
          <View
            style={[
              styles.tableCol,
              {
                width: "50%",
                minHeight: 60,
                borderRightWidth: 0,
                borderBottomWidth: 0,
              },
            ]}
          >
            {" "}
            <Text></Text>
            <Text
              style={[
                styles.tableCell,
                {
                  textAlign: "center",
                  marginTop: 75,
                  fontFamily: "Times-Roman-Bold",
                },
              ]}
            >
              Verified By Site HR (Signature and Date)
            </Text>
          </View>
        </View>
      </View>

      {/* Seal Section */}
      <View style={[styles.table, { borderBottomWidth: 0 }]}>
        <View style={styles.tableRow}>
          <View
            style={[
              styles.tableCol,
              { width: "100%", borderRightWidth: 0, borderBottomWidth: 0 },
              styles.tableColHeader,
            ]}
          >
            <Text
              style={[styles.tableCell, { fontFamily: "Times-Roman-Bold" }]}
            >
              Seal of certified doctor :
            </Text>
          </View>
        </View>
        <View style={[styles.tableRow, { borderTopWidth: 0 }]}>
          <View
            style={[
              styles.tableCol,
              {
                width: "100%",
                minHeight: 60,
                borderRightWidth: 0,
              },
            ]}
          >
            <Image
              src={rohitSeal}
              style={{
                width: 100,
                height: 50,
                alignSelf: "center",
                marginTop: 6,
              }}
            />
          </View>
        </View>
      </View>

      {/* Note Section */}
      <View style={styles.noteSection}>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "bold",
            fontFamily: "Times-Roman-Bold",
          }}
        >
          Note:
        </Text>
        <Text style={{ fontSize: 11, marginTop: 2 }}>
          * NAD denotes for : No Abnormality Detected.
        </Text>
        <Text style={{ fontSize: 11, marginTop: 2 }}>
          ** NA denotes for : Not Applicable.
        </Text>
      </View>
    </Page>
  </Document>
);

export default EyeCheckupFormTemplate;
