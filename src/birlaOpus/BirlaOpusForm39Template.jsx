import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import dr_rohit_solanki_stamp_sign from "../assets/images/dr_rohit_solanki_stamp_sign.png";

// Sizes are tuned to visually match the provided image as closely as possible
// A4 landscape for a wide register-style table
const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingLeft: 28,
    paddingRight: 28,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  titleSmall: {
    fontSize: 10,
  },
  titleMain: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 6,
  },
  titleBold: {
    fontSize: 12,
    fontWeight: 700,
  },
  table: {
    borderWidth: 1,
    borderColor: "#000",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    borderRightWidth: 1,
    borderColor: "#000",
    paddingVertical: 6,
    paddingHorizontal: 4,
    justifyContent: "center",
  },
  cellLast: {
    borderRightWidth: 0,
  },
  textCenter: {
    fontSize: 9,
    textAlign: "center",
  },
  textSmall: {
    fontSize: 8,
    textAlign: "center",
  },
  thickBottom: {
    borderBottomWidth: 1,
    borderColor: "#000",
  },
});

// Column widths in percentage to mimic the sample image
// Total columns: 11
const columnPercents = [
  5, // Sl. No
  11, // Department/Works
  13, // Name of Worker
  6, // Sex
  8, // Age
  13, // Occupation Nature
  9, // Occupation Date of Employment
  8, // Examination Date
  8, // Examination Result
  10, // Signature of the Ophthalmologist
  9, // Remarks
];

const HeaderRowTop = () => (
  <View style={[styles.row]}>
    <View style={[styles.cell, { width: `${columnPercents[0]}%` }]}>
      <Text style={styles.textCenter}>Sl.{"\n"}No</Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[1]}%` }]}>
      <Text style={styles.textCenter}>Department{"\n"}/Works</Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[2]}%` }]}>
      <Text style={styles.textCenter}>Name of{"\n"}Worker</Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[3]}%` }]}>
      <Text style={styles.textCenter}>Sex</Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[4]}%` }]}>
      <Text style={styles.textCenter}>Age (on last{"\n"}birth day)</Text>
    </View>
    <View
      style={[
        styles.cell,
        { width: `${columnPercents[5] + columnPercents[6]}%` },
      ]}
    >
      <Text style={styles.textCenter}>Occupation</Text>
    </View>
    <View
      style={[
        styles.cell,
        { width: `${columnPercents[7] + columnPercents[8]}%` },
      ]}
    >
      <Text style={styles.textCenter}>Examination of eye sight</Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[9]}%` }]}>
      <Text style={styles.textCenter}>
        Signature of the{"\n"}Ophthalmologist
      </Text>
    </View>
    <View
      style={[
        styles.cell,
        styles.cellLast,
        { width: `${columnPercents[10]}%` },
      ]}
    >
      <Text style={styles.textCenter}>Remarks</Text>
    </View>
  </View>
);

const HeaderRowSub = () => (
  <View style={[styles.row, styles.thickBottom]}>
    <View style={[styles.cell, { width: `${columnPercents[0]}%` }]}>
      <Text style={styles.textCenter}> </Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[1]}%` }]}>
      <Text style={styles.textCenter}> </Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[2]}%` }]}>
      <Text style={styles.textCenter}> </Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[3]}%` }]}>
      <Text style={styles.textCenter}> </Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[4]}%` }]}>
      <Text style={styles.textCenter}> </Text>
    </View>
    <View
      style={[
        styles.cell,
        {
          width: `${columnPercents[5]}%`,
          borderTopWidth: 1,
          borderColor: "#000",
        },
      ]}
    >
      <Text style={styles.textSmall}>Nature</Text>
    </View>
    <View
      style={[
        styles.cell,
        {
          width: `${columnPercents[6]}%`,
          borderTopWidth: 1,
          borderColor: "#000",
        },
      ]}
    >
      <Text style={styles.textSmall}>Date of{"\n"}Employment</Text>
    </View>
    <View
      style={[
        styles.cell,
        {
          width: `${columnPercents[7]}%`,
          borderTopWidth: 1,
          borderColor: "#000",
        },
      ]}
    >
      <Text style={styles.textSmall}>Date</Text>
    </View>
    <View
      style={[
        styles.cell,
        {
          width: `${columnPercents[8]}%`,
          borderTopWidth: 1,
          borderColor: "#000",
        },
      ]}
    >
      <Text style={styles.textSmall}>Result</Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[9]}%` }]}>
      <Text style={styles.textCenter}> </Text>
    </View>
    <View
      style={[
        styles.cell,
        styles.cellLast,
        { width: `${columnPercents[10]}%` },
      ]}
    >
      <Text style={styles.textCenter}> </Text>
    </View>
  </View>
);

const NumberRow = () => (
  <View style={[styles.row, styles.thickBottom]}>
    {" "}
    {
      // Number labels 1..11 under headers
    }
    {columnPercents.map((widthPercent, index) => (
      <View
        key={`num-${index}`}
        style={[
          styles.cell,
          index === columnPercents.length - 1 && styles.cellLast,
          { width: `${widthPercent}%` },
        ]}
      >
        <Text style={styles.textCenter}>{index + 1}</Text>
      </View>
    ))}
  </View>
);

const EmptyContentRow = () => (
  <View style={[styles.row, { minHeight: 260 }]}>
    {" "}
    {
      // Large empty body area to allow handwriting/data fill, bordered cells
    }
    {columnPercents.map((widthPercent, index) => (
      <View
        key={`empty-${index}`}
        style={[
          styles.cell,
          index === columnPercents.length - 1 && styles.cellLast,
          { width: `${widthPercent}%` },
        ]}
      >
        <Text style={styles.textSmall}> </Text>
      </View>
    ))}
  </View>
);

const DataRow = ({ item, index }) => (
  <View style={styles.row}>
    <View style={[styles.cell, { width: `${columnPercents[0]}%` }]}>
      <Text style={styles.textCenter}>{index + 1}</Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[1]}%` }]}>
      <Text style={styles.textSmall}>{item.department || ""}</Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[2]}%` }]}>
      <Text style={styles.textSmall}>{item.name || ""}</Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[3]}%` }]}>
      <Text style={styles.textSmall}>{item.gender || ""}</Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[4]}%` }]}>
      <Text style={styles.textSmall}>{item.age || ""}</Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[5]}%` }]}>
      <Text style={styles.textSmall}>{item.designation || ""}</Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[6]}%` }]}>
      <Text style={styles.textSmall}>{item.dateOfJoining || ""}</Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[7]}%` }]}>
      <Text style={styles.textSmall}>{item.vitalsCreatedDate || ""}</Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[8]}%` }]}>
      <Text style={styles.textSmall}>
        {item.colourVision?.toLowerCase() === "nad" ||
        item.colourVision?.toLowerCase() === "" ||
        item.colourVision?.toLowerCase() === null
          ? "NAD"
          : item.colourVision}
      </Text>
    </View>
    <View style={[styles.cell, { width: `${columnPercents[9]}%` }]}>
      {/* <Image
        src={dr_rohit_solanki_stamp_sign}
        style={{ height: 60, width: 80 }}
      /> */}
    </View>
    <View
      style={[
        styles.cell,
        styles.cellLast,
        { width: `${columnPercents[10]}%` },
      ]}
    >
      <Text style={styles.textSmall}>{item.remarks || ""}</Text>
    </View>
  </View>
);

const BirlaOpusForm39Template = ({ data }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.header}>
        <Text style={[styles.titleSmall, { fontSize: 14, marginBottom: 15 }]}>
          1[FORM No. 39]
        </Text>
        <Text style={[styles.titleSmall, { fontSize: 14, marginBottom: 15 }]}>
          ( See sub-rule (4) of Rule 65B)
        </Text>
        <Text style={[styles.titleBold, { fontSize: 14, marginBottom: 15 }]}>
          RECORD OF EYE EXAMINATION
        </Text>
      </View>

      <View style={styles.table}>
        <HeaderRowTop />
        <HeaderRowSub />
        <NumberRow />
        {data ? <DataRow item={data} index={0} /> : <EmptyContentRow />}
      </View>
    </Page>
  </Document>
);

export default BirlaOpusForm39Template;
