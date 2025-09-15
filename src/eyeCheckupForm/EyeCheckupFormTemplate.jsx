// // import React from "react";
// // import {
// //   Page,
// //   Text,
// //   View,
// //   Document,
// //   StyleSheet,
// //   Image,
// //   Font,
// // } from "@react-pdf/renderer";
// // import dr_kunal_stamp_sign from "../../src/assets/images/dr_kunal_stamp_sign.png";
// // import uncareheader from "../../src/assets/images/uncareheader.png";

// // import TimeRoman from "../assets/fonts/Times-Roman.ttf";
// // import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

// // Font.register({
// //   family: "Times-Roman-Normal",
// //   src: TimeRoman,
// // });

// // Font.register({
// //   family: "Times-Roman-Bold",
// //   src: TimeRomanBold,
// // });
// // const styles = StyleSheet.create({
// //   page: {
// //     fontSize: 11,
// //     fontFamily: "Times-Roman-Normal",
// //     lineHeight: 1.4,
// //   },
// //   dottedLine: {
// //     borderBottom: "1pt dotted #000",
// //     minWidth: 80,
// //     textAlign: "center",
// //     paddingBottom: 2,
// //   },
// // });

// // const DottedField = ({ value, width = 100 }) => (
// //   <View style={[styles.dottedLine, { minWidth: width }]}>
// //     <Text>{value || " "}</Text>
// //   </View>
// // );

// // const EyeCheckupFormTemplate = ({ data }) => (
// //   <Document>
// //     <Page size="A4" style={styles.page} orientation="portrait"></Page>
// //   </Document>
// // );

// // export default EyeCheckupFormTemplate;
// import React from "react";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   Font,
//   Image,
// } from "@react-pdf/renderer";

// import TimeRoman from "../assets/fonts/Times-Roman.ttf";
// import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";
// import macaleod from "../../src/assets/images/macaleod.png";
// // Optional: top-right logo & doctor sign (if available)
// // import companyLogo from "../assets/images/macleods_logo.png";
// import dr_kunal_stamp_sign from "../../src/assets/images/dr_kunal_stamp_sign.png";
// import dr_rohit_solanki_stamp_sign from "../../src/assets/images/dr_rohit_solanki_stamp_sign.png";
// import rohitSign from "../../src/assets/images/rohitSign.png";
// import rohitSeal from "../../src/assets/images/rohitSeal.png";
// import dayjs from "dayjs";

// Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
// Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

// const styles = StyleSheet.create({
//   page: {
//     fontSize: 11,
//     fontFamily: "Times-Roman-Normal",
//     lineHeight: 1.4,
//     padding: 0,
//   },

//   // Generic table primitives
//   table: { border: "1pt solid #000", width: "100%" },
//   row: { flexDirection: "row", borderBottom: "1pt solid #000" },
//   col: {
//     flex: 1,
//     borderRight: "1pt solid #000",
//     padding: 5,
//     justifyContent: "center",
//   },
//   colNB: { flex: 1, padding: 5, justifyContent: "center" },

//   // Page wrapper with outer border mimicking the scan
//   frame: { margin: 10, flexGrow: 1 },

//   // Typographic helpers
//   bold: { fontFamily: "Times-Roman-Bold" },
//   center: { textAlign: "center" },
//   small: { fontSize: 10 },

//   // Header styles
//   headTitle: {
//     fontFamily: "Times-Roman-Bold",
//     fontSize: 13,
//     textAlign: "center",
//   },
//   headSub: { fontSize: 10, textAlign: "center", marginTop: 2 },

//   // Section headings inside tables
//   sectionHead: { fontFamily: "Times-Roman-Bold" },

//   // Dotted underline (only for DECLARATION area)
//   dotted: {
//     textDecoration: "underline",
//     textDecorationStyle: "dotted",
//     minWidth: 100,
//     height: 12,
//     marginLeft: 6,
//   },

//   // Spacers to match the scan’s heights
//   tallBox: { minHeight: 72 }, // Treatment area box
//   signBox: { minHeight: 88 }, // Signature area height
//   sealLine: { minHeight: 28 }, // Seal line row

//   // Footer notes under the big frame
//   notesWrap: { marginLeft: 12, marginRight: 12, marginTop: 4 },
// });

// const DottedField = ({ width = 160, value }) => (
//   <Text style={[styles.dotted, { minWidth: width, color: "#000000" }]}>
//     {value || " "}
//   </Text>
// );

// const EyeCheckupFormTemplate = ({ data, fitStatus = "fit" }) => (
//   <Document>
//     <Page size="A4" orientation="portrait" style={styles.page}>
//       <View style={styles.frame}>
//         {/* ===== TOP HEADER ===== */}
//         <View style={styles.table}>
//           {/* First header row: Company & optional logo box on right */}
//           <View style={styles.row}>
//             <View
//               style={{ flex: 3, borderRight: "1pt solid #000", padding: 6 }}
//             >
//               <Text style={styles.headTitle}>
//                 Macleods Pharmaceuticals Limited
//               </Text>
//               <Text
//                 style={[styles.headSub, { fontFamily: "Times-Roman-Bold" }]}
//               >
//                 Plot No. M-50 to M-54-A, Indore Special Economic Zone, Phase -
//                 II, District: Dhar, Pithampur, MP - 454774
//               </Text>
//             </View>
//             <View style={[styles.colNB, { flex: 1, alignItems: "center" }]}>
//               <Image src={macaleod} style={{ width: 85, height: 28 }} />
//             </View>
//           </View>

//           {/* Format Title */}
//           <View className="format" style={styles.row}>
//             <View style={[styles.col, { flexBasis: 180, flexGrow: 0 }]}>
//               <Text style={styles.bold}>Format Title:</Text>
//             </View>
//             <View style={styles.colNB}>
//               <Text>
//                 Eye testing (sight / vision testing) for optical / visual
//                 inspectors Format
//               </Text>
//             </View>
//           </View>

//           {/* SOP / Format No. / Page No. */}
//           <View style={styles.row}>
//             <View style={styles.col}>
//               <Text>
//                 <Text style={styles.bold}>SOP No.:</Text> SOP/PI/HRD/001
//               </Text>
//             </View>
//             <View style={styles.col}>
//               <Text>
//                 <Text style={styles.bold}>Format No.:</Text>{" "}
//                 FRM/SOP/PI/HRD/001/03-002
//               </Text>
//             </View>
//             <View style={styles.col}>
//               <Text style={styles.bold}>Page No.</Text>
//             </View>
//             <View style={styles.colNB}>
//               <Text>1 of 1</Text>
//             </View>
//           </View>
//         </View>

//         {/* ===== EMPLOYEE INFO TABLE ===== */}
//         <View style={[styles.table]}>
//           <View style={styles.row}>
//             <View style={styles.col}>
//               <Text>Name :</Text>
//             </View>
//             <View style={styles.col}>
//               <Text>{data?.name || ""}</Text>
//             </View>
//             <View style={styles.col}>
//               <Text>Date :</Text>
//             </View>
//             <View style={styles.colNB}>
//               <Text>
//                 {dayjs(data?.vitalsCreatedDate).format("DD/MM/YYYY") || ""}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.row}>
//             <View style={styles.col}>
//               <Text>Employee code :</Text>
//             </View>
//             <View style={styles.col}>
//               <Text>{data?.empId || ""}</Text>
//             </View>
//             <View style={styles.col}>
//               <Text>Gender :</Text>
//             </View>
//             <View style={[styles.colNB, { textTransform: "capitalize" }]}>
//               <Text>{data?.gender?.toLowerCase() || ""}</Text>
//             </View>
//           </View>
//           <View style={styles.row}>
//             <View style={styles.col}>
//               <Text>Department :</Text>
//             </View>
//             <View style={[styles.col]}>
//               <Text>{data?.department?.toUpperCase() || ""}</Text>
//             </View>
//             <View style={styles.col}>
//               <Text>Section / Area :</Text>
//             </View>
//             <View style={[styles.colNB]}>
//               <Text>{data?.designation?.toUpperCase() || ""}</Text>
//             </View>
//           </View>

//           {/* Eyes Vision heading row */}
//           <View style={styles.row}>
//             <View style={styles.colNB}>
//               <Text style={styles.sectionHead}>EYES VISION : FAR / NEAR</Text>
//             </View>
//           </View>

//           {/* Vision results rows */}
//           <View style={styles.row}>
//             <View style={styles.col}>
//               <Text>Right Eye With Glasses :</Text>
//             </View>
//             <View style={styles.col}>
// <Text>Far (R): {data?.farRightEyeSightWithGlasses || ""}</Text>
// <Text>Near (R): {data?.nearRightEyeSightWithGlasses || ""}</Text>
//             </View>
//             <View style={styles.col}>
//               <Text>Right Eye Without Glasses :</Text>
//             </View>
//             <View style={styles.colNB}>
// <Text>Far (R): {data?.farRightEyeSight || ""}</Text>
// <Text>Near (R): {data?.nearRightEyeSight || ""}</Text>
//             </View>
//           </View>

//           <View style={styles.row}>
//             <View style={styles.col}>
//               <Text>Left Eye With Glasses :</Text>
//             </View>
//             <View style={styles.col}>
// <Text>Far (L): {data?.farLeftEyeSightWithGlasses || ""}</Text>
// <Text>Near (L): {data?.nearLeftEyeSightWithGlasses || ""}</Text>
//             </View>
//             <View style={styles.col}>
//               <Text>Left Eye Without Glasses :</Text>
//             </View>
//             <View style={styles.colNB}>
// <Text>Far (L): {data?.farLeftEyeSight || ""}</Text>
// <Text>Near (L): {data?.nearLeftEyeSight || ""}</Text>
//             </View>
//           </View>

//           <View style={[styles.row, { height: 72 }]}>
//             <View style={styles.colNB}>
//               <Text>
//                 Colour Vision ( ISHIHARA’S CHART ) :{" "}
//                 {data?.colourVision || "NAD"}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* ===== TREATMENT ADVISED ===== */}
//         <View style={[styles.table, { marginTop: 6 }]}>
//           <View style={styles.row}>
//             <View style={styles.colNB}>
//               <Text style={styles.sectionHead}>TREATMENT ADVICED :</Text>
//             </View>
//           </View>
//           <View style={[styles.row, styles.tallBox]}>
//             <View style={styles.colNB} />
//           </View>
//         </View>

//         {/* ===== DECLARATION ===== */}
//         <View style={[styles.table, { marginTop: 6 }]}>
//           <View style={styles.row}>
//             <View style={[styles.col, { flexBasis: 160, flexGrow: 0 }]}>
//               <Text style={styles.sectionHead}>DECLARATION :</Text>
//             </View>
//             <View style={styles.colNB}>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   marginBottom: 6,
//                 }}
//               >
//                 <Text>
//                   After examining{" "}
//                   {data?.gender?.toLowerCase() === "male"
//                     ? "Mr."
//                     : data?.gender?.toLowerCase() === "female"
//                     ? "Ms."
//                     : "Mr./Ms"}{" "}
//                   <Text
//                     style={[styles.dotted, { minWidth: 130, color: "#000000" }]}
//                   >
//                     {data?.name || ""}{" "}
//                   </Text>
//                   <Text style={{ marginLeft: 6 }}>
//                     I hereby certify that{" "}
//                     {data?.gender?.toLowerCase() === "male"
//                       ? "he"
//                       : data?.gender?.toLowerCase() === "female"
//                       ? "she"
//                       : "he/she"}{" "}
//                     is{" "}
//                     <Text
//                       style={[
//                         styles.dotted,
//                         { minWidth: 130, color: "#000000" },
//                       ]}
//                     >
//                       {fitStatus || "fit"}{" "}
//                     </Text>
//                   </Text>
//                   <Text>for Job.</Text>
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* Signature boxes */}
//           <View style={[styles.row, { height: 72 }]}>
//             <View style={styles.col}>
{
  /* <Image
  src={rohitSign}
  style={{
    width: 90,
    height: 46,
    alignSelf: "center",
    marginTop: 6,
  }}
/> */
}
//               <Text style={[styles.center, styles.bold]}>
//                 Certified By Doctor{"\n"}
//                 <Text style={styles.small}>(Signature and Date)</Text>
//               </Text>
//             </View>
//             <View style={styles.colNB}>
//               <View style={{ height: 46 }} />
//               <Text style={[styles.center, styles.bold]}>
//                 Verified By Site HR{"\n"}
//                 <Text style={styles.small}>(Signature and Date)</Text>
//               </Text>
//             </View>
//           </View>

//           {/* Seal of certified doctor */}
//           <View style={[styles.row, styles.sealLine]}>
//             <View style={styles.colNB}>
//               <Text>Seal of certified doctor :</Text>
// <Image
//   src={rohitSeal}
//   style={{
//     width: 90,
//     height: 56,
//     alignSelf: "center",
//     marginTop: 6,
//   }}
// />
//             </View>
//           </View>
//         </View>
//       </View>

//       {/* ===== FOOTER NOTES (outside the big frame, bottom) ===== */}
//       <View style={styles.notesWrap}>
//         <Text style={styles.bold}>Note:</Text>
//         <Text className="note-line">
//           * NAD denotes for : No Abnormality Detected.
//         </Text>
//         <Text className="note-line">** NA denotes for : Not Applicable.</Text>
//       </View>
//     </Page>
//   </Document>
// );

// export default EyeCheckupFormTemplate;

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

Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman-Normal",
    fontSize: 12,
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
    fontSize: 12,
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
    fontSize: 12,
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
    fontSize: 12,

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
            style={[styles.addressInfo, { fontFamily: "Times-Roman-Bold" }]}
          >
            Plot No. M-50 to M-60 to Industrial Estate Special Economic Zone,
            Phase - II,
          </Text>
          <Text
            style={[styles.addressInfo, { fontFamily: "Times-Roman-Bold" }]}
          >
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
          <View style={[styles.tableCol, { width: "50%" }]}>
            <Text style={styles.tableCell}>
              Eye testing (sight / vision testing) for optical / visual
              inspectors Format
            </Text>
          </View>
          <View
            style={[styles.tableCol, { width: "25%", borderRightWidth: 0 }]}
          >
            <Text style={styles.tableCell}></Text>
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
              {data?.vitalsCreatedDate || ""}
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
            <Text style={styles.tableCell}>Right Eye With Glasses :</Text>
          </View>
          <View style={[styles.tableCol, { width: "25%" }]}>
            <Text>Far (R): {data?.farRightEyeSightWithGlasses || "No"}</Text>
            <Text>Near (R): {data?.nearRightEyeSightWithGlasses || "No"}</Text>
          </View>
          <View
            style={[styles.tableCol, { width: "25%" }, styles.tableColHeader]}
          >
            <Text style={styles.tableCell}>Right Eye Without Glasses :</Text>
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
            <Text style={styles.tableCell}>Left Eye With Glasses :</Text>
          </View>
          <View
            style={[styles.tableCol, { width: "25%", borderBottomWidth: 0 }]}
          >
            <Text>Far (L): {data?.farLeftEyeSightWithGlasses || "No"}</Text>
            <Text>Near (L): {data?.nearLeftEyeSightWithGlasses || "No"}</Text>
          </View>
          <View
            style={[
              styles.tableCol,
              { width: "25%", borderBottomWidth: 0 },
              styles.tableColHeader,
            ]}
          >
            <Text style={styles.tableCell}>Left Eye Without Glasses :</Text>
          </View>
          <View
            style={[
              styles.tableCol,
              { width: "25%", borderRightWidth: 0, borderBottomWidth: 0 },
            ]}
          >
            <Text>Far (L): {data?.farLeftEyeSight || "No"}</Text>
            <Text>Near (L): {data?.nearLeftEyeSight || "No"}</Text>
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
              { width: "65%", borderRightWidth: 0, borderBottomWidth: 0 },
            ]}
          >
            {/* Name line */}
            <Text style={styles.tableCell}>
              After examining Mr. / Mrs. / Ms{" "}
              <Text
                style={[styles.dotted, { minWidth: 130, color: "#000000" }]}
              >
                {data?.name || ""}
              </Text>
            </Text>

            {/* Fit/Unfit line */}
            <Text style={[styles.tableCell, { marginTop: 10 }]}>
              I hereby certify that he / she is{" "}
              <Text
                style={[
                  styles.dotted,
                  {
                    color: "#000000",
                    textDecoration: unfit ? "line-through" : "none",
                  },
                ]}
              >
                fit
              </Text>{" "}
              /{" "}
              <Text
                style={[
                  styles.dotted,
                  {
                    color: "#000000",
                    textDecoration: !unfit ? "line-through" : "none",
                  },
                ]}
              >
                unfit
              </Text>{" "}
              for
            </Text>

            {/* Job line */}
            <Text style={[styles.tableCell, { marginTop: 10 }]}>Job.</Text>
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
              Verified By Site HR
            </Text>
            <Text
              style={[
                styles.tableCell,
                {
                  textAlign: "center",
                  marginTop: 5,
                  fontFamily: "Times-Roman-Bold",
                },
              ]}
            >
              (Signature and Date)
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
            fontSize: 12,
            fontWeight: "bold",
            fontFamily: "Times-Roman-Bold",
          }}
        >
          Note:
        </Text>
        <Text style={{ fontSize: 12, marginTop: 2 }}>
          * NAD denotes for : No Abnormality Detected.
        </Text>
        <Text style={{ fontSize: 12, marginTop: 2 }}>
          ** NA denotes for : Not Applicable.
        </Text>
      </View>
    </Page>
  </Document>
);

export default EyeCheckupFormTemplate;
