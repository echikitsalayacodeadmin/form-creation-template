






import React, { Fragment } from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import uncareheader from "../assets/images/uncareheader.png";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

Font.registerHyphenationCallback(word => [word]);

Font.register({
  family: "Times-Roman-Normal",
  src: TimeRoman,
});

Font.register({
  family: "Times-Roman-Bold",
  src: TimeRomanBold,
});

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "Times-Roman",
    lineHeight: 1.4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 8,
    marginBottom: 12,
  },
  logo: {
    width: '100%',
    height: 70,
  },
  headerText: {
    marginLeft: 12,
  },
  title: {
    fontSize: 14,
    fontFamily: "Times-Roman-Bold",
  },
  subtitle: {
    fontSize: 9,
    marginTop: 2,
  },

  /* ---------- SECTION ---------- */
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Times-Roman-Bold",
    textDecoration: "underline",
    marginBottom: 6,
  },

  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: {
    width: "35%",
    fontFamily: "Times-Roman-Bold",
  },
  value: {
    width: "65%",
  },

  twoColRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    width: "48%",
  },

  footerNote: {
    marginTop: 8,
    fontSize: 9,
  },

  sectionBox: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },

  sectionHeader: {
    backgroundColor: "#f2f2f2",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingVertical: 4,
    paddingHorizontal: 6,
  },

  sectionHeaderText: {
    fontSize: 11,
    fontFamily: "Times-Roman-Bold",
    textTransform: "uppercase",
  },

  sectionContent: {
    padding: 8,
  },

});

const InfoRow = ({ label, value }) => (
  <View style={[styles.row,]}>
    <Text style={styles.label}>{label}</Text>
    <View style={{ flexDirection: 'row', }}>
      <Text>: </Text>
      <Text style={styles.value}>{value || "—"}</Text>
    </View>

  </View>
);


const CeatTyreCustomFormTemplate = ({ data }) => {
  return (

    <Document>
      <Page size="A4" style={styles.page}>

        {/* ================= HEADER ================= */}
        <View style={styles.header}>
          <Image style={styles.logo} src={uncareheader} />

        </View>


        {/* ================= EMPLOYEE DETAILS ================= */}
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>
              EMPLOYEE DETAILS
            </Text>
          </View>

          <View style={styles.sectionContent}>
            <View style={styles.twoColRow}>
              <View style={styles.col}>
                <InfoRow label="Name" value={data?.name} />
                <InfoRow label="Employee ID" value={data?.empId} />
                <InfoRow label="Age / Gender" value={`${data?.age} / ${data?.gender}`} />
              </View>

              <View style={styles.col}>
                <InfoRow label="Height (cm)" value={data?.height} />
                <InfoRow label="Weight (kg)" value={data?.weight} />
                <InfoRow label="BMI" value={data?.bmi} />
              </View>
            </View>
          </View>
        </View>


        {/* ================= LAB INVESTIGATIONS ================= */}

        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>GENERAL EXAMINATION</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.twoColRow}>
              <View style={styles.col}>
                <InfoRow label="B.P" value={data?.bp} />
                <InfoRow label="Skin" value={data?.skin} />
                <InfoRow label="Vision" value={data?.vision} />
              </View>

              <View style={styles.col}>
                <InfoRow label="Pulse/min" value={data?.pulseRate} />
                <InfoRow label="Color Vision" value={data?.colorVision} />

              </View>
            </View>
          </View>
        </View>
        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>LABORATORY INVESTIGATIONS</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.twoColRow}>
              <View style={styles.col}>
                <InfoRow label="Haemoglobin" value={data?.hb} />
                <InfoRow label="WBC Count" value={data?.wbc} />
                <InfoRow label="RBC Count" value={data?.rbc} />
              </View>

              <View style={styles.col}>
                <InfoRow label="Platelet Count" value={data?.platelet} />
                <InfoRow label="Random Glucose" value={data?.glucose} />
                <InfoRow label="Creatinine" value={data?.creatinine} />
              </View>
            </View>
          </View>
        </View>

        {/* ================= MEDICAL HISTORY ================= */}

        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>MEDICAL HISTORY</Text>
          </View>
          <View style={styles.sectionContent}>
            <InfoRow label="Personal History" value={data?.personalHistory} />
            <InfoRow label="Family History" value={data?.familyHistory} />
            <InfoRow label="Present Complaints" value={data?.presentComplaints} />
          </View>
        </View>

        {/* ================= SYSTEMIC EXAMINATION ================= */}


        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>SYSTEMIC EXAMINATION</Text>
          </View>
          <View style={styles.sectionContent}>
            <View style={styles.twoColRow}>
              <View style={styles.col}>
                <InfoRow label="Cardiovascular System" value={data?.cvs} />
                <InfoRow label="Respiratory System" value={data?.rs} />
              </View>

              <View style={styles.col}>
                <InfoRow label="Abdomen" value={data?.abdomen} />
                <InfoRow label="Central Nervous System" value={data?.cns} />
              </View>
            </View>
          </View>
        </View>

        {/* ================= MISCELLANEOUS ================= */}


        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>MISCELLANEOUS</Text>
          </View>
          <View style={styles.sectionContent}>

            <View style={styles.twoColRow}>
              <View style={styles.col}>
                <InfoRow label="ECG" value={data?.ecg} />
                <InfoRow label="PFT" value={data?.pft} />
              </View>

              <View style={styles.col}>
                <InfoRow label="X-Ray" value={data?.xray} />
                <InfoRow label="Audiometry" value={data?.audiometry} />
              </View>
            </View>
          </View>
        </View>

        {/* ================= BMI ADVICE ================= */}

        <View style={styles.sectionBox}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>BMI ADVISE</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text>
              {data?.bmiAdvice ||
                "BMI indicates borderline overweight. Lifestyle modification and diet control is advised."}
            </Text>
          </View>
        </View>

      </Page>
    </Document>

  )
}

export default CeatTyreCustomFormTemplate
