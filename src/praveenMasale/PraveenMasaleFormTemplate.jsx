import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import dayjs from "dayjs";
import prashantDeshmukh from "../assets/images/prashantDeshmukh.png";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Times-Roman-Normal",
    fontSize: 11,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 5,
    lineHeight: 1.4,
  },
  header: {
    textAlign: "right",
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    marginTop: 15,
    position: "absolute",
    left: "40%",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  dateSection: {
    textAlign: "right",
    fontSize: 11,
  },
  sectionNumber: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 0,
    marginBottom: 8,
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  fieldLabel: {
    fontSize: 11,
    marginRight: 10,
    minWidth: 100,
    paddingLeft: 10,
    marginBottom: 8,
  },
  fieldLine: {
    borderBottom: 1,
    borderBottomColor: "#000",
    flex: 1,
    minHeight: 15,
    marginRight: 20,
    marginTop: -5,
  },
  multiFieldRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  shortField: {
    borderBottom: 1,
    borderBottomColor: "#000",
    width: 80,
    minHeight: 15,
    marginRight: 20,
  },
  mediumField: {
    borderBottom: 1,
    borderBottomColor: "#000",
    width: 120,
    minHeight: 15,
    marginRight: 20,
  },
  longField: {
    borderBottom: 1,
    borderBottomColor: "#000",
    flex: 1,
    minHeight: 15,
    marginTop: 5,
  },
  subSection: {
    marginLeft: 40,
    marginBottom: 8,
  },
  subSectionIndent: {
    marginLeft: 60,
    marginBottom: 6,
  },
  cvsSection: {
    marginLeft: 20,
    marginBottom: 4,
  },
  cvsSubSection: {
    flexDirection: "row",
    marginLeft: 40,
    marginBottom: 0,
    alignItems: "center",
  },
  cvsLabel: {
    fontSize: 11,
    minWidth: 80,
    marginRight: 10,
  },
  longLine: {
    borderBottom: 1,
    borderBottomColor: "#000",
    minHeight: 15,
    marginBottom: 8,
  },
  certificateSection: {
    borderWidth: 1,
    padding: 15,
    borderColor: "#000",
  },
  certificateTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    textDecoration: "underline",
    marginBottom: 10,
  },
  certificateSubtitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  certificateNote: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 15,
  },
  certificateText: {
    fontSize: 11,
    lineHeight: 1.5,
  },
  signatureSection: {
    flexDirection: "row",
  },
  signatureLeft: {
    flex: 1,
    marginRight: 20,
  },
  signatureRight: {
    flex: 1,
  },
  signatureBox: {
    minHeight: 120,
    marginBottom: 10,
  },
  signatureLabel: {
    fontSize: 11,
    fontWeight: "bold",
  },
  qualificationFields: {
    marginTop: 10,
  },
  qualificationRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  qualificationLabel: {
    fontSize: 11,
    minWidth: 100,
    marginRight: 10,
  },
  underlineText: {
    textDecoration: "underline",
    fontWeight: "bold",
  },
});

const PraveenMasaleFormTemplate = ({
  data,
  companyName = "Pravin Masalewale",
}) => (
  <Document>
    {/* Page 1 */}
    <Page size="A4" style={styles.page}>
      <View
        style={{
          border: "1px solid #000000",
          paddingHorizontal: 20,
          paddingTop: 15,
          paddingBottom: 0,
        }}
      >
        <Text style={[styles.header, { fontFamily: "Times-Roman-Bold" }]}>
          FM/HRD/01/11B
        </Text>

        <Text style={styles.title}>PRAVIN MASALEWALE</Text>
        <Text style={[styles.subtitle, { fontFamily: "Times-Roman-Bold" }]}>
          MEDICAL EXAMINER'S CONFIDENTIAL REPORT
        </Text>

        <View
          style={[
            styles.dateSection,
            { flexDirection: "row", gap: 5, justifyContent: "flex-end" },
          ]}
        >
          <Text style={{ fontFamily: "Times-Roman-Bold" }}> Date:-</Text>
          <Text style={{ textDecoration: "underline" }}>
            {dayjs(data?.vitalsCreatedDate).format("DD/MM/YYYY") || ""}
          </Text>
        </View>

        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel, { fontFamily: "Times-Roman-Bold" }]}>
            1. Full name of the Life to be Examined:
          </Text>
          <View style={styles.fieldLine}>
            <Text>{data?.name || ""}</Text>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Text style={[styles.fieldLabel]}>Address:</Text>
          <View style={styles.fieldLine}>
            <Text>
              {data?.address ||
                "Plot No 44, One Suhana, Hadapsar, Pune - 411013, Maharashtra, India"}
            </Text>
          </View>
        </View>

        <View style={styles.multiFieldRow}>
          <Text style={styles.fieldLabel}>Age:</Text>
          <View style={styles.shortField}>
            <Text>{data?.age || ""}</Text>
          </View>
          <Text style={styles.fieldLabel}>DOB:</Text>
          <View style={styles.mediumField}>
            <Text>{data?.dateOfBirth || ""}</Text>
          </View>
          <Text style={styles.fieldLabel}>Blood Group:</Text>
          <View style={styles.shortField}>
            <Text>{data?.bloodGroup || ""}</Text>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Identification Mark if any:</Text>
          <View style={styles.fieldLine}>
            <Text>{data?.identification || "No"}</Text>
          </View>
        </View>

        <Text
          style={[styles.sectionNumber, { fontFamily: "Times-Roman-Bold" }]}
        >
          2. Measurement & Weight:
        </Text>

        <View style={styles.multiFieldRow}>
          <Text style={styles.fieldLabel}>Height (cm):</Text>
          <View style={styles.shortField}>
            <Text>{data?.height || ""}</Text>
          </View>
          <Text style={styles.fieldLabel}>Weight (kgs):</Text>
          <View style={styles.shortField}>
            <Text>{data?.weight || ""}</Text>
          </View>
          <Text style={styles.fieldLabel}>BMI</Text>
          <View style={styles.shortField}>
            <Text>{data?.bmi || ""}</Text>
          </View>
        </View>

        <Text
          style={[
            styles.sectionNumber,
            { marginBottom: 2 },
            { fontFamily: "Times-Roman-Bold" },
          ]}
        >
          3. CVS:
        </Text>

        <View style={styles.cvsSection}>
          <Text style={{ fontFamily: "Times-Roman-Bold" }}>{"A)"}</Text>
          <View style={styles.cvsSubSection}>
            <Text style={styles.cvsLabel}>Pulse</Text>
            <View style={styles.longField}>
              <Text>{data?.pulseRate || ""}</Text>
            </View>
          </View>
          <View style={styles.cvsSubSection}>
            <Text style={styles.cvsLabel}>B.P. (mm of Hg.)</Text>
            <View style={styles.longField}>
              <Text>{data?.bp || ""}</Text>
            </View>
          </View>
          <View style={styles.cvsSubSection}>
            <Text style={styles.cvsLabel}>Heart Sounds</Text>
            <View style={styles.longField}>
              <Text>NAD</Text>
            </View>
          </View>
          <View style={styles.cvsSubSection}>
            <Text style={styles.cvsLabel}>Murmur</Text>
            <View style={styles.longField}>
              <Text>NAD</Text>
            </View>
          </View>

          <Text style={{ marginTop: 5, fontFamily: "Times-Roman-Bold" }}>
            {"B)"}
          </Text>
          <View style={styles.cvsSubSection}>
            <Text style={styles.cvsLabel}>RS</Text>
            <View style={styles.longField}>
              <Text>NAD</Text>
            </View>
          </View>
        </View>

        <Text
          style={[
            styles.sectionNumber,
            { marginBottom: 4, fontFamily: "Times-Roman-Bold" },
          ]}
        >
          4. Skin:
        </Text>
        <View style={styles.cvsSubSection}>
          <Text style={styles.cvsLabel}>Skin / Hair</Text>
          <View style={styles.longField}>
            <Text>NAD</Text>
          </View>
        </View>
        <View style={styles.cvsSubSection}>
          <Text style={styles.cvsLabel}>Nail</Text>
          <View style={styles.longField}>
            <Text>NAD</Text>
          </View>
        </View>
        <View style={styles.cvsSubSection}>
          <Text style={styles.cvsLabel}>Hernial Sites</Text>
          <View style={styles.longField}>
            <Text>NAD</Text>
          </View>
        </View>
        <View style={styles.cvsSubSection}>
          <Text style={styles.cvsLabel}>Lymph Nodes</Text>
          <View style={styles.longField}>
            <Text>NAD</Text>
          </View>
        </View>

        <Text
          style={[
            styles.sectionNumber,
            { marginBottom: 0 },
            { fontFamily: "Times-Roman-Bold" },
          ]}
        >
          5. P/A:
        </Text>
        <View style={styles.cvsSubSection}>
          <Text style={styles.cvsLabel}>Liver</Text>
          <View style={styles.longField}>
            <Text>NAD</Text>
          </View>
        </View>
        <View style={styles.cvsSubSection}>
          <Text style={styles.cvsLabel}>Spleen</Text>
          <View style={styles.longField}>
            <Text>NAD</Text>
          </View>
        </View>
        <View style={styles.cvsSubSection}>
          <Text style={styles.cvsLabel}>Mass</Text>
          <View style={styles.longField}>
            <Text>NAD</Text>
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Text
            style={[
              styles.sectionNumber,
              { marginTop: 8, marginBottom: 0, fontFamily: "Times-Roman-Bold" },
            ]}
          >
            6. CNS: Stroke / Paralysis / Weakness:
          </Text>
          <View style={styles.longField}>
            <Text>NAD</Text>
          </View>
        </View>

        <View style={[styles.fieldRow, { marginBottom: 0 }]}>
          <Text
            style={[styles.sectionNumber, { fontFamily: "Times-Roman-Bold" }]}
          >
            7. Ear-Nose-Thorat (ENT):
          </Text>
          <View style={[styles.longField, { marginTop: -5 }]}>
            <Text>NAD</Text>
          </View>
        </View>

        <View style={[styles.fieldRow, { marginBottom: 0 }]}>
          <Text
            style={[styles.sectionNumber, { fontFamily: "Times-Roman-Bold" }]}
          >
            8. Teeth & Tongue & Gum's:
          </Text>
          <View style={[styles.longField, { marginTop: -5 }]}>
            <Text>NAD</Text>
          </View>
        </View>

        <View style={[styles.fieldRow, { marginBottom: 0 }]}>
          <Text
            style={[styles.sectionNumber, { fontFamily: "Times-Roman-Bold" }]}
          >
            9. Eyes & Vison -Near – Distant – Colour – Squint:
          </Text>
          <View style={[styles.longField, { marginTop: -5 }]}>
            <Text>{data?.visionRemark || ""}</Text>
          </View>
        </View>

        <View style={[styles.fieldRow, { marginBottom: 0 }]}>
          <Text
            style={[styles.sectionNumber, { fontFamily: "Times-Roman-Bold" }]}
          >
            10. Deformity & Disability:
          </Text>
          <View style={[styles.longField, { marginTop: -5 }]}>
            <Text>NO</Text>
          </View>
        </View>

        <View style={[styles.fieldRow, { marginBottom: 0 }]}>
          <Text
            style={[styles.sectionNumber, { fontFamily: "Times-Roman-Bold" }]}
          >
            11. Habits:
          </Text>
          <View style={[styles.longField, { marginTop: -5 }]}></View>
        </View>

        <View style={[styles.fieldRow, { marginBottom: 0 }]}>
          <Text
            style={[styles.sectionNumber, { fontFamily: "Times-Roman-Bold" }]}
          >
            12. Any other Positive Findings:
          </Text>
          <View style={[styles.longField, { marginTop: -5 }]}>
            <Text>NO</Text>
          </View>
        </View>

        <View style={styles.multiFieldRow}>
          <Text
            style={[styles.sectionNumber, { fontFamily: "Times-Roman-Bold" }]}
          >
            13. Vaccine
          </Text>
          <Text style={[styles.fieldLabel, { fontFamily: "Times-Roman-Bold" }]}>
            1) T.T injection
          </Text>
          <View style={styles.mediumField}>
            <Text style={{ fontSize: 10 }}>Batch No: KN24048</Text>
            <Text style={{ fontSize: 10 }}>MFG Date: 08/2024</Text>
            <Text style={{ fontSize: 10 }}>EXP Date: 07/2027</Text>
          </View>
          <Text style={[styles.fieldLabel, { fontFamily: "Times-Roman-Bold" }]}>
            2)Typhoid Vaccine
          </Text>
          <View style={styles.mediumField}>
            <Text style={{ fontSize: 10 }}>Batch No: 05KS12B</Text>
            <Text style={{ fontSize: 10 }}>MFG Date: 03/2025</Text>
            <Text style={{ fontSize: 10 }}>EXP Date: 02/2028</Text>
          </View>
        </View>
      </View>
    </Page>

    {/* Page 2 */}
    <Page size="A4" style={styles.page}>
      <View
        style={{
          border: "1px solid #000000",
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}
      >
        <Text style={[styles.header, { fontFamily: "Times-Roman-Bold" }]}>
          FM/HRD/01/11B
        </Text>

        <Text
          style={[styles.sectionNumber, { fontFamily: "Times-Roman-Bold" }]}
        >
          14. Operation and Other Details:
        </Text>

        <View style={styles.subSection}>
          <Text style={{ marginBottom: 8 }}>
            a) Is there any evidence of any operation, accident or injury? Give
            details
          </Text>
          <View style={styles.longLine}>
            <Text>NO</Text>
          </View>
          <View style={styles.longLine}></View>
        </View>

        <View style={styles.subSection}>
          <Text style={{ marginBottom: 8 }}>
            b) Is there personal history of :
          </Text>

          <View style={styles.subSectionIndent}>
            <View style={styles.fieldRow}>
              <Text>Asthma, bronchitis, tuberclosis or any other </Text>
              <Text
                style={[
                  styles.underlineText,
                  { fontFamily: "Times-Roman-Bold" },
                ]}
              >
                Lunge Disease
              </Text>
            </View>

            <View style={styles.fieldRow}>
              <Text>High blood pressure, chest pain or any </Text>
              <Text
                style={[
                  styles.underlineText,
                  { fontFamily: "Times-Roman-Bold" },
                ]}
              >
                Heart Disease
              </Text>
            </View>

            <View style={styles.fieldRow}>
              <Text>Diabetes, Cancer, Tumor, Any type of </Text>
              <Text
                style={[
                  styles.underlineText,
                  { fontFamily: "Times-Roman-Bold" },
                ]}
              >
                Kidney Disease
              </Text>
            </View>
          </View>
        </View>

        <Text
          style={[styles.sectionNumber, { fontFamily: "Times-Roman-Bold" }]}
        >
          15. Do you have any adverse effect of any medicine? If yes please
          specify
        </Text>
        <View style={styles.longLine}>
          <Text>NO</Text>
        </View>
        <View style={styles.longLine}></View>
      </View>

      <View style={styles.certificateSection}>
        <Text
          style={[styles.certificateTitle, { fontFamily: "Times-Roman-Bold" }]}
        >
          Certificate
        </Text>

        <Text style={styles.certificateSubtitle}>
          PERFORMA FOR MEDICAL FITNESS CERTIFICATE FOR FOOD HANDLERS
        </Text>
        <Text style={styles.certificateNote}>(FOR THE YEAR 2025.)</Text>
        <Text style={styles.certificateNote}>
          (See Para no. 10.1.2,Part-II, schedule-4 of FSS Regulation , 2011)
        </Text>

        <Text style={styles.certificateText}>
          I hereby certify that Mr./ Ms./ Mrs.{" "}
          <Text style={{ textDecoration: "underline" }}>
            {data?.name || ""}
          </Text>{" "}
          employed with M/s{" "}
          <Text style={{ textDecoration: "underline" }}>{companyName}</Text>{" "}
          ,coming in direct contact with food items has been carefully examined
          by me on date{" "}
          <Text style={{ textDecoration: "underline" }}>
            {dayjs(data?.vitalsCreatedDate).format("DD/MM/YYYY")}
          </Text>{" "}
          Based on the medical examination conducted, he/she is found free from
          any infectious ,contagious or communicable diseases and the person is
          Fit to work in the above mentioned food establishment.
        </Text>

        <View style={styles.signatureSection}>
          <View style={styles.signatureLeft}>
            <View style={styles.signatureBox}></View>
            <Text
              style={[
                styles.signatureLabel,
                { fontFamily: "Times-Roman-Bold" },
              ]}
            >
              Signature/Thumb imp.of employee
            </Text>
          </View>

          <View style={styles.signatureRight}>
            <View style={styles.signatureBox}>
              <Image
                src={prashantDeshmukh}
                style={{ height: 120, width: 120 }}
              />
            </View>
            <Text
              style={[
                styles.signatureLabel,
                { fontFamily: "Times-Roman-Bold" },
              ]}
            >
              Name and Signature with Seal
            </Text>
            <Text style={styles.signatureLabel}>
              of Registered Medical Practitioner/Civil Surgeon)
            </Text>

            <View style={styles.qualificationFields}>
              <View style={styles.qualificationRow}>
                <Text style={styles.qualificationLabel}>Qualification</Text>
                <View style={styles.longField}></View>
              </View>

              <View style={styles.qualificationRow}>
                <Text style={styles.qualificationLabel}>Code no</Text>
                <View style={styles.longField}></View>
              </View>

              <View style={styles.qualificationRow}>
                <Text style={styles.qualificationLabel}>Name & Address</Text>
                <View style={styles.longField}></View>
              </View>

              <View style={styles.longLine}></View>
            </View>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default PraveenMasaleFormTemplate;
