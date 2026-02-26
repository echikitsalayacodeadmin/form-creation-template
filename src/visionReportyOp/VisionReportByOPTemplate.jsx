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
import dr_rohit_solanki_stamp_sign from "../../src/assets/images/dr_rohit_solanki_stamp_sign.png";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

// Register fonts
Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

const styles = StyleSheet.create({
  page: {
    fontSize: 11,
    fontFamily: "Times-Roman-Normal",
    lineHeight: 1.5,
    padding: 40,
  },
  heading: {
    textAlign: "center",
    fontFamily: "Times-Roman-Bold",
    fontSize: 12,
    marginBottom: 10,
    textDecoration: "underline",
  },
  labelRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: 180,
  },
  dotted: {
    borderBottom: "1px dotted #000",
    flex: 1,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 6,
    fontFamily: "Times-Roman-Bold",
  },
  table: {
    display: "table",
    width: "100%",
    border: "1px solid #000",
    marginTop: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    borderRight: "1px solid #000",
    borderBottom: "1px solid #000",
    padding: 4,
    flex: 1,
    textAlign: "center",
  },
  tableHeader: {
    fontFamily: "Times-Roman-Bold",
    backgroundColor: "#f5f5f5",
  },
  signature: {
    marginTop: 60,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const DottedField = ({ width = 160, value }) => (
  <View style={[styles.dotted, { minWidth: width }]}>
    <Text>{value || " "}</Text>
  </View>
);

const VisionReportByOPTemplate = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Heading */}
      <Text style={styles.heading}>VISION REPORT</Text>

      {/* Basic Details */}
      <View style={styles.labelRow}>
        <Text style={styles.label}>Employee ID:</Text>
        <DottedField width={180} value={data?.empId} />
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Name:</Text>
        <DottedField width={180} value={data?.name} />
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Age:</Text>
        <DottedField width={180} value={data?.age} />
        <Text style={{ marginLeft: 6 }}>yrs.</Text>
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Gender:</Text>
        <DottedField width={180} value={data?.gender} />
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Date of Examination:</Text>
        <DottedField width={180} value={data?.vitalsCreatedDate} />
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          Past Medical History related to Vision:
        </Text>
        <DottedField width={180} value={"Nil"} />
      </View>

      {/* Visual Acuity Table */}
      {/* Visual Acuity Table */}
      {/* Visual Acuity Table */}
      <View style={styles.table}>
        {/* Row 1: Main Title across all columns */}
        <View style={styles.tableRow}>
          <Text
            style={[
              styles.tableCol,
              {
                flex: 9,
                textAlign: "center",
                fontFamily: "Times-Roman-Bold",
                borderRight: 0,
              },
            ]}
          >
            VISUAL ACUITY
          </Text>
        </View>

        {/* Row 2 + Row 3 merged with nested layout */}
        <View style={styles.tableRow}>
          {/* First empty column (spans 2 rows) */}
          <Text
            style={[
              styles.tableCol,
              { flex: 2, textAlign: "center", justifyContent: "center" },
            ]}
          ></Text>

          {/* Unaided Vision (with subheaders) */}
          <View
            style={[
              styles.tableCol,
              { flex: 2, flexDirection: "column", padding: 0 },
            ]}
          >
            <Text
              style={{
                borderBottom: "1px solid #000",
                padding: 4,
                textAlign: "center",
              }}
            >
              Unaided Vision{"\n"}(without Eyeglass)
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.tableCol, { flex: 1, borderBottom: 0 }]}>
                Distance{"\n"}Vision
              </Text>
              <Text
                style={[
                  styles.tableCol,
                  { flex: 1, borderBottom: 0, borderRight: 0 },
                ]}
              >
                Near{"\n"}Vision
              </Text>
            </View>
          </View>

          {/* Aided Vision (with subheaders) */}
          <View
            style={[
              styles.tableCol,
              { flex: 2, flexDirection: "column", padding: 0 },
            ]}
          >
            <Text
              style={{
                borderBottom: "1px solid #000",
                padding: 4,
                textAlign: "center",
              }}
            >
              Aided Vision{"\n"}(with Eyeglass)
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.tableCol, { flex: 1, borderBottom: 0 }]}>
                Distance{"\n"}Vision
              </Text>
              <Text
                style={[
                  styles.tableCol,
                  { flex: 1, borderBottom: 0, borderRight: 0 },
                ]}
              >
                Near{"\n"}Vision
              </Text>
            </View>
          </View>

          {/* Colour Vision (spans 2 rows) */}
          <Text
            style={[
              styles.tableCol,
              {
                flex: 3,
                textAlign: "center",
                justifyContent: "center",
                borderRight: 0,
              },
            ]}
          >
            Colour Vision
          </Text>

          {/* Other conditions (spans 2 rows) */}
        </View>

        {/* Right Eye */}
        <View style={styles.tableRow}>
          {/* First column */}
          <Text style={[styles.tableCol, { flex: 2 }]}>Right Eye</Text>

          {/* Unaided Vision (2 sub-cells) */}
          <View style={{ flex: 2, flexDirection: "row" }}>
            <Text style={[styles.tableCol, { flex: 1 }]}>
              {data?.farRightEyeSight || "-"}
            </Text>
            <Text style={[styles.tableCol, { flex: 1 }]}>
              {data?.nearRightEyeSight || "-"}
            </Text>
          </View>

          {/* Aided Vision (2 sub-cells) */}
          <View style={{ flex: 2, flexDirection: "row" }}>
            <Text style={[styles.tableCol, { flex: 1 }]}>
              {data?.farRightEyeSightWithGlasses || "-"}
            </Text>
            <Text style={[styles.tableCol, { flex: 1 }]}>
              {data?.nearRightEyeSightWithGlasses || "-"}
            </Text>
          </View>

          {/* Colour Vision */}
          <Text style={[styles.tableCol, { flex: 3, borderRight: 0 }]}>
            {data?.colourVision?.toLowerCase() === "nad" ? "Normal" : data?.colourVision?.toLowerCase()?.includes("r") ||
              data?.colourVision?.toLowerCase()?.includes("right") ||
              data?.colourVision?.toLowerCase()?.includes("both") ? "Abnormal" : "-"}
          </Text>
        </View>

        {/* Left Eye */}
        <View style={styles.tableRow}>
          {/* First column */}
          <Text style={[styles.tableCol, { flex: 2, borderBottom: 0 }]}>
            Left Eye
          </Text>

          {/* Unaided Vision (2 sub-cells) */}
          <View style={{ flex: 2, flexDirection: "row" }}>
            <Text style={[styles.tableCol, { flex: 1, borderBottom: 0 }]}>
              {data?.farLeftEyeSight || "-"}
            </Text>
            <Text style={[styles.tableCol, { flex: 1, borderBottom: 0 }]}>
              {data?.nearLeftEyeSight || "-"}
            </Text>
          </View>

          {/* Aided Vision (2 sub-cells) */}
          <View style={{ flex: 2, flexDirection: "row" }}>
            <Text style={[styles.tableCol, { flex: 1, borderBottom: 0 }]}>
              {data?.farLeftEyeSightWithGlasses || "-"}
            </Text>
            <Text style={[styles.tableCol, { flex: 1, borderBottom: 0 }]}>
              {data?.nearLeftEyeSightWithGlasses || "-"}
            </Text>
          </View>

          {/* Colour Vision */}
          <Text
            style={[
              styles.tableCol,
              { flex: 3, borderBottom: 0, borderRight: 0 },
            ]}
          >
            {/* {data?.colourVision?.toLowerCase() === "nad"
              ? "Abnormal"
              : data?.colourVision?.toLowerCase()?.includes("l") ||
                data?.colourVision?.toLowerCase()?.includes("left") ||
                data?.colourVision?.toLowerCase()?.includes("both")
              ? "Normal"
              : "-"} */}

            {data?.colourVision?.toLowerCase() === "nad" ? "Normal" : data?.colourVision?.toLowerCase()?.includes("l") ||
              data?.colourVision?.toLowerCase()?.includes("left") ||
              data?.colourVision?.toLowerCase()?.includes("both") ? "Abnormal" : "-"}
          </Text>
        </View>
      </View>

      {/* Prescription Table */}
      {/* <Text style={styles.sectionTitle}>
        PRESCRIPTION FOR EYEGLASS – ONLY IF GLASS PRESCRIBED
      </Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}>SPH</Text>
          <Text style={styles.tableCol}>CYL</Text>
          <Text style={styles.tableCol}>AXIS</Text>
          <Text style={[styles.tableCol, { borderRight: 0 }]}>ADD</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>RIGHT EYE</Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={styles.tableCol}></Text>
          <Text style={[styles.tableCol, { borderRight: 0 }]}></Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={[styles.tableCol, { borderBottom: 0 }]}>LEFT EYE</Text>
          <Text style={[styles.tableCol, { borderBottom: 0 }]}></Text>
          <Text style={[styles.tableCol, { borderBottom: 0 }]}></Text>
          <Text style={[styles.tableCol, { borderBottom: 0 }]}></Text>
          <Text
            style={[styles.tableCol, { borderBottom: 0, borderRight: 0 }]}
          ></Text>
        </View>
      </View> */}

      {/* Impression */}
      <View style={{ marginTop: 20, flexDirection: "row", gap: 10 }}>
        <Text style={styles.sectionTitle}>Impression: </Text>
        <Text style={[{ marginTop: 12, marginBottom: 6 }]}>
          Fit for employment
        </Text>
      </View>

      {/* Signature */}
      <View style={styles.signature}>
        <Text></Text>
        <View>
          <Text>Signature with Seal of {"\n"}Optometrist</Text>
          <Image
            src={dr_rohit_solanki_stamp_sign}
            style={{
              width: 90,
              height: 56,
              alignSelf: "center",
              marginTop: 6,
            }}
          />
        </View>
      </View>
    </Page>
  </Document>
);

export default VisionReportByOPTemplate;
