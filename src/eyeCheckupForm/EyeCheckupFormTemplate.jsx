// import React from "react";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   Image,
//   Font,
// } from "@react-pdf/renderer";
// import dr_kunal_stamp_sign from "../../src/assets/images/dr_kunal_stamp_sign.png";
// import uncareheader from "../../src/assets/images/uncareheader.png";

// import TimeRoman from "../assets/fonts/Times-Roman.ttf";
// import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

// Font.register({
//   family: "Times-Roman-Normal",
//   src: TimeRoman,
// });

// Font.register({
//   family: "Times-Roman-Bold",
//   src: TimeRomanBold,
// });
// const styles = StyleSheet.create({
//   page: {
//     fontSize: 11,
//     fontFamily: "Times-Roman-Normal",
//     lineHeight: 1.4,
//   },
//   dottedLine: {
//     borderBottom: "1pt dotted #000",
//     minWidth: 80,
//     textAlign: "center",
//     paddingBottom: 2,
//   },
// });

// const DottedField = ({ value, width = 100 }) => (
//   <View style={[styles.dottedLine, { minWidth: width }]}>
//     <Text>{value || " "}</Text>
//   </View>
// );

// const EyeCheckupFormTemplate = ({ data }) => (
//   <Document>
//     <Page size="A4" style={styles.page} orientation="portrait"></Page>
//   </Document>
// );

// export default EyeCheckupFormTemplate;
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";
import macaleod from "../../src/assets/images/macaleod.png";
// Optional: top-right logo & doctor sign (if available)
// import companyLogo from "../assets/images/macleods_logo.png";
import dr_kunal_stamp_sign from "../../src/assets/images/dr_kunal_stamp_sign.png";
import dr_rohit_solanki_stamp_sign from "../../src/assets/images/dr_rohit_solanki_stamp_sign.png";
import rohitSign from "../../src/assets/images/rohitSign.png";
import rohitSeal from "../../src/assets/images/rohitSeal.png";
import dayjs from "dayjs";

Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    fontFamily: "Times-Roman-Normal",
    lineHeight: 1.4,
    padding: 0,
  },

  // Generic table primitives
  table: { border: "1pt solid #000", width: "100%" },
  row: { flexDirection: "row", borderBottom: "1pt solid #000" },
  col: {
    flex: 1,
    borderRight: "1pt solid #000",
    padding: 5,
    justifyContent: "center",
  },
  colNB: { flex: 1, padding: 5, justifyContent: "center" },

  // Page wrapper with outer border mimicking the scan
  frame: { margin: 10, flexGrow: 1 },

  // Typographic helpers
  bold: { fontFamily: "Times-Roman-Bold" },
  center: { textAlign: "center" },
  small: { fontSize: 10 },

  // Header styles
  headTitle: {
    fontFamily: "Times-Roman-Bold",
    fontSize: 13,
    textAlign: "center",
  },
  headSub: { fontSize: 10, textAlign: "center", marginTop: 2 },

  // Section headings inside tables
  sectionHead: { fontFamily: "Times-Roman-Bold" },

  // Dotted underline (only for DECLARATION area)
  dotted: {
    textDecoration: "underline",
    textDecorationStyle: "dotted",
    minWidth: 100,
    height: 12,
    marginLeft: 6,
  },

  // Spacers to match the scan’s heights
  tallBox: { minHeight: 72 }, // Treatment area box
  signBox: { minHeight: 88 }, // Signature area height
  sealLine: { minHeight: 28 }, // Seal line row

  // Footer notes under the big frame
  notesWrap: { marginLeft: 12, marginRight: 12, marginTop: 4 },
});

const DottedField = ({ width = 160, value }) => (
  <Text style={[styles.dotted, { minWidth: width, color: "#000000" }]}>
    {value || " "}
  </Text>
);

const EyeCheckupFormTemplate = ({ data, fitStatus = "fit" }) => (
  <Document>
    <Page size="A4" orientation="portrait" style={styles.page}>
      <View style={styles.frame}>
        {/* ===== TOP HEADER ===== */}
        <View style={styles.table}>
          {/* First header row: Company & optional logo box on right */}
          <View style={styles.row}>
            <View
              style={{ flex: 3, borderRight: "1pt solid #000", padding: 6 }}
            >
              <Text style={styles.headTitle}>
                Macleods Pharmaceuticals Limited
              </Text>
              <Text
                style={[styles.headSub, { fontFamily: "Times-Roman-Bold" }]}
              >
                Plot No. M-50 to M-54-A, Indore Special Economic Zone, Phase -
                II, District: Dhar, Pithampur, MP - 454774
              </Text>
            </View>
            <View style={[styles.colNB, { flex: 1, alignItems: "center" }]}>
              <Image src={macaleod} style={{ width: 85, height: 28 }} />
            </View>
          </View>

          {/* Format Title */}
          <View className="format" style={styles.row}>
            <View style={[styles.col, { flexBasis: 180, flexGrow: 0 }]}>
              <Text style={styles.bold}>Format Title:</Text>
            </View>
            <View style={styles.colNB}>
              <Text>
                Eye testing (sight / vision testing) for optical / visual
                inspectors Format
              </Text>
            </View>
          </View>

          {/* SOP / Format No. / Page No. */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text>
                <Text style={styles.bold}>SOP No.:</Text> SOP/PI/HRD/001
              </Text>
            </View>
            <View style={styles.col}>
              <Text>
                <Text style={styles.bold}>Format No.:</Text>{" "}
                FRM/SOP/PI/HRD/001/03-002
              </Text>
            </View>
            <View style={styles.col}>
              <Text style={styles.bold}>Page No.</Text>
            </View>
            <View style={styles.colNB}>
              <Text>1 of 1</Text>
            </View>
          </View>
        </View>

        {/* ===== EMPLOYEE INFO TABLE ===== */}
        <View style={[styles.table]}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text>Name :</Text>
            </View>
            <View style={styles.col}>
              <Text>{data?.name || ""}</Text>
            </View>
            <View style={styles.col}>
              <Text>Date :</Text>
            </View>
            <View style={styles.colNB}>
              <Text>
                {dayjs(data?.vitalsCreatedDate).format("DD/MM/YYYY") || ""}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text>Employee code :</Text>
            </View>
            <View style={styles.col}>
              <Text>{data?.empId || ""}</Text>
            </View>
            <View style={styles.col}>
              <Text>Gender :</Text>
            </View>
            <View style={[styles.colNB, { textTransform: "capitalize" }]}>
              <Text>{data?.gender?.toLowerCase() || ""}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text>Department :</Text>
            </View>
            <View style={[styles.col, { textTransform: "capitalize" }]}>
              <Text>{data?.department?.toLowerCase() || ""}</Text>
            </View>
            <View style={styles.col}>
              <Text>Section / Area :</Text>
            </View>
            <View style={[styles.colNB, { textTransform: "capitalize" }]}>
              <Text>{data?.designation?.toLowerCase() || ""}</Text>
            </View>
          </View>

          {/* Eyes Vision heading row */}
          <View style={styles.row}>
            <View style={styles.colNB}>
              <Text style={styles.sectionHead}>EYES VISION : FAR / NEAR</Text>
            </View>
          </View>

          {/* Vision results rows */}
          <View style={styles.row}>
            <View style={styles.col}>
              <Text>Right Eye With Glasses :</Text>
            </View>
            <View style={styles.col}>
              <Text>Far (R): {data?.farRightEyeSightWithGlasses || ""}</Text>
              <Text>Near (R): {data?.nearRightEyeSightWithGlasses || ""}</Text>
            </View>
            <View style={styles.col}>
              <Text>Right Eye Without Glasses :</Text>
            </View>
            <View style={styles.colNB}>
              <Text>Far (R): {data?.farRightEyeSight || ""}</Text>
              <Text>Near (R): {data?.nearRightEyeSight || ""}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <Text>Left Eye With Glasses :</Text>
            </View>
            <View style={styles.col}>
              <Text>Far (L): {data?.farLeftEyeSightWithGlasses || ""}</Text>
              <Text>Near (L): {data?.nearLeftEyeSightWithGlasses || ""}</Text>
            </View>
            <View style={styles.col}>
              <Text>Left Eye Without Glasses :</Text>
            </View>
            <View style={styles.colNB}>
              <Text>Far (L): {data?.farLeftEyeSight || ""}</Text>
              <Text>Near (L): {data?.nearLeftEyeSight || ""}</Text>
            </View>
          </View>

          <View style={[styles.row, { height: 72 }]}>
            <View style={styles.colNB}>
              <Text>
                Colour Vision ( ISHIHARA’S CHART ) :{" "}
                {data?.colourVision || "NAD"}
              </Text>
            </View>
          </View>
        </View>

        {/* ===== TREATMENT ADVISED ===== */}
        <View style={[styles.table, { marginTop: 6 }]}>
          <View style={styles.row}>
            <View style={styles.colNB}>
              <Text style={styles.sectionHead}>TREATMENT ADVICED :</Text>
            </View>
          </View>
          <View style={[styles.row, styles.tallBox]}>
            <View style={styles.colNB} />
          </View>
        </View>

        {/* ===== DECLARATION ===== */}
        <View style={[styles.table, { marginTop: 6 }]}>
          <View style={styles.row}>
            <View style={[styles.col, { flexBasis: 160, flexGrow: 0 }]}>
              <Text style={styles.sectionHead}>DECLARATION :</Text>
            </View>
            <View style={styles.colNB}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <Text>
                  After examining{" "}
                  {data?.gender?.toLowerCase() === "male"
                    ? "Mr."
                    : data?.gender?.toLowerCase() === "female"
                    ? "Ms."
                    : "Mr./Ms"}{" "}
                  <Text
                    style={[styles.dotted, { minWidth: 130, color: "#000000" }]}
                  >
                    {data?.name || ""}{" "}
                  </Text>
                  <Text style={{ marginLeft: 6 }}>
                    I hereby certify that{" "}
                    {data?.gender?.toLowerCase() === "male"
                      ? "he"
                      : data?.gender?.toLowerCase() === "female"
                      ? "she"
                      : "he/she"}{" "}
                    is{" "}
                    <Text
                      style={[
                        styles.dotted,
                        { minWidth: 130, color: "#000000" },
                      ]}
                    >
                      {fitStatus || "fit"}{" "}
                    </Text>
                  </Text>
                  <Text>for Job.</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Signature boxes */}
          <View style={[styles.row, { height: 72 }]}>
            <View style={styles.col}>
              <Image
                src={rohitSign}
                style={{
                  width: 90,
                  height: 46,
                  alignSelf: "center",
                  marginTop: 6,
                }}
              />
              <Text style={[styles.center, styles.bold]}>
                Certified By Doctor{"\n"}
                <Text style={styles.small}>(Signature and Date)</Text>
              </Text>
            </View>
            <View style={styles.colNB}>
              <View style={{ height: 46 }} />
              <Text style={[styles.center, styles.bold]}>
                Verified By Site HR{"\n"}
                <Text style={styles.small}>(Signature and Date)</Text>
              </Text>
            </View>
          </View>

          {/* Seal of certified doctor */}
          <View style={[styles.row, styles.sealLine]}>
            <View style={styles.colNB}>
              <Text>Seal of certified doctor :</Text>
              <Image
                src={rohitSeal}
                style={{
                  width: 90,
                  height: 56,
                  alignSelf: "center",
                  marginTop: 6,
                }}
              />
            </View>
          </View>
        </View>
      </View>

      {/* ===== FOOTER NOTES (outside the big frame, bottom) ===== */}
      <View style={styles.notesWrap}>
        <Text style={styles.bold}>Note:</Text>
        <Text className="note-line">
          * NAD denotes for : No Abnormality Detected.
        </Text>
        <Text className="note-line">** NA denotes for : Not Applicable.</Text>
      </View>
    </Page>
  </Document>
);

export default EyeCheckupFormTemplate;
