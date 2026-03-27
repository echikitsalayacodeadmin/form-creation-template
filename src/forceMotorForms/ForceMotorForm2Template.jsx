import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

import uncareheader from "../assets/images/uncareheader.png";
import prashantDeshmukh from "../assets/images/prashantDeshmukh.png";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

// ✅ Font Registration
Font.register({
  family: "Times",
  fonts: [
    { src: TimeRoman },
    { src: TimeRomanBold, fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
    fontFamily: "Times",
    lineHeight: 1.4,
  },

  bold: {
    fontWeight: "bold",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  centerBlock: {
    textAlign: "center",
    marginTop: 10,
    lineHeight: 1.4,
  },

  section: {
    marginTop: 12,
  },

  paragraphRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    lineHeight: 1.5,
    textAlign: "justify",
  },

  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },

  thumb: {
    width: 80,
    height: 40,
    marginTop: 5,
  },

  table: {
    border: "1px solid #000",
    marginTop: 20,
  },

  tableRow: {
    flexDirection: "row",
  },

  tableCell: {
    flex: 1,
    borderRight: "1px solid #000",
    borderTop: "1px solid #000",
    padding: 4,
    fontSize: 9,
  },

  tableHeader: {
    fontSize: 8,
    fontWeight: "bold",
  },

  center: {
    textAlign: "center",
  },
});

const Txt = ({ children, bold }) => (
  <Text style={bold ? styles.bold : {}}>
    {children}
    {" "}
  </Text>
);

const ForceMotorForm2Template = ({ data }) => {
  const genderPronoun =
    data?.gender === "MALE"
      ? "HIS"
      : data?.gender === "FEMALE"
        ? "HER"
        : "HIS/HER";

  const subjectPronoun =
    data?.gender === "MALE"
      ? "HE"
      : data?.gender === "FEMALE"
        ? "SHE"
        : "HE/SHE";

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* HEADER */}
        <Image src={uncareheader} />

        {/* DATE */}
        <View style={styles.rowBetween}>
          <Text />
          <Text>
            DATE : <Text style={styles.bold}>{data?.vitalsCreadtedDate || ""}</Text>
          </Text>
        </View>

        {/* CENTER */}
        <View style={{ marginVertical: 20 }}>
          <View style={styles.centerBlock}>
            <Text style={styles.bold}>FROM 23</Text>
            <Text style={styles.bold}>PRESCRIBED UNDER RULE</Text>
            <Text style={styles.bold}>21(5)</Text>
            <Text style={{ marginTop: 4 }}>CERTIFICATE OF FITNESS</Text>
          </View>

          <View style={styles.section}>
            <Text>
              SERIAL NUMBER :{" "}
              <Text style={styles.bold}>SAI/CERTI/FIT-1</Text>
            </Text>
          </View>
        </View>

        {/* PARAGRAPH */}
        <View style={{ marginVertical: 20 }}>
          <View style={styles.section}>

            {/* ✅ CLEAN INLINE PARAGRAPH */}
            <View style={styles.paragraphRow}>
              <Txt>1. I CERTIFY THAT I HAVE PERSONALLY EXAMINED</Txt>

              <Txt bold>{data?.name}</Txt><Txt>WHO IS DESIROUS</Txt>

              <Txt> OF BEING EMPLOYED AS IN</Txt>

              <Txt bold>FORCE MOTORS LTD</Txt><Txt> AND THAT {genderPronoun} AGE, AS NEARLY AS CAN BE ASCERTAINED</Txt>

              <Txt>FROM MY EXAMINATION IS
              </Txt>

              <Txt bold>{data?.age}</Txt><Txt>YEAR AND THAT {subjectPronoun} IS, IN MY OPINION, FIT FOR EMPLOYMENT IN THE ABOVE </Txt>
              <Txt>MENTIONED FACTORY AS MENTIONED ABOVE.</Txt>
            </View>

            {/* POINT 2 */}
            <View style={[styles.paragraphRow, { marginTop: 6 }]}>
              <Text>
                2. HE MAY BE PRODUCED FOR FURTHER EXAMINATION AFTER A PERIOD OF{" "}
              </Text>

              <Text style={styles.bold}>
                {data?.period || "31-01-2025 to 30-01-2026"}
              </Text>
            </View>

            {/* POINT 3 */}
            <Text style={{ marginTop: 6 }}>
              3. THE SERIAL NUMBER OF THE PREVIOUS CERTIFICATE IS.....
            </Text>
          </View>
        </View>

        {/* SIGNATURE */}
        <View style={{ marginTop: 50 }}>
          <View style={styles.signatureRow}>
            <View>
              <Text style={styles.bold}>SIGN OR LEFT HAND THUMB</Text>
              <Text style={styles.bold}>THUMB IMPRESSION OF PERSON</Text>
              <Text style={styles.bold}>EXAMINED</Text>

              {data?.thumb && (
                <Image src={data.thumb} style={styles.thumb} />
              )}
            </View>

            <View style={{ textAlign: "center" }}>
              <Text style={styles.bold}>SIGN OF</Text>
              <Text style={styles.bold}>CERTIFYING SURGEON</Text>

              <Image
                src={prashantDeshmukh}
                style={{ height: 100, width: 130, marginTop: 10 }}
              />
            </View>
          </View>
        </View>

        {/* TABLE */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader]}>
              I CERTIFY THAT I EXAMINED THE PERSON MENTIONED ABOVE ON
            </Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>
              EXTEND THIS CERTIFICATE UNTIL (IF CERTIFICATE IS NOT EXTENDED, THE PERIOD FOR WHICH THE WORKER IS CONSIDERED UNFIT FOR WORK IS TO MENTIONED)
            </Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>
              SIGNS AND SYMPTOMS OBSERVED DURING EXAMINATION
            </Text>
            <Text style={[styles.tableCell, styles.tableHeader]}>
              SIGNATURE OF THE CERTIFYING SURGEON
            </Text>
          </View>

          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.center]}>
              <Text style={styles.bold}>
                {data?.vitalsCreadtedDate || ""}
              </Text>
            </Text>
            <Text style={[styles.tableCell, styles.center]}>
              <Text style={styles.bold}>
                {data?.validTillDate || ""}
              </Text>
            </Text>
            <Text style={[styles.tableCell, styles.center]}>
              <Text style={styles.bold}>
                NA
              </Text>
            </Text>
            <Text style={styles.tableCell}></Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ForceMotorForm2Template;