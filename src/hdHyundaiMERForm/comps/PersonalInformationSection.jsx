import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({

  sectionContainer: {
    marginBottom: 12
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 6,
    textDecoration: "underline",
  },

  row: {
    flexDirection: "row",
    marginBottom: 6,
  },

  column: {
    flex: 1,
    flexDirection: "row",
  },

  label: {
    fontWeight: "bold",
    width: 90,
    fontSize: 8
  },

  value: {
    flex: 1,
    fontSize: 8,

  },

});

const PersonalInformationSection = ({ data }) => {
  return (
    <View style={styles.sectionContainer}>

      {/* SECTION TITLE */}
      <Text style={styles.sectionTitle}>
        PERSONAL INFORMATION
      </Text>

      {/* ROW 1 */}
      <View style={styles.row}>

        <View style={{
          flex: 2,
          flexDirection: "row",
        }}>
          <Text style={styles.label}>NAME:</Text>
          <Text style={styles.value}>{data?.name}</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>AGE/SEX:</Text>
          <Text style={styles.value}>{data?.ageSex}</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>CONTACT:</Text>
          <Text style={styles.value}>{data?.contact}</Text>
        </View>

      </View>

      {/* ROW 2 */}
      <View style={styles.row}>

        <View style={{
          flex: 2,
          flexDirection: "row",
        }}>
          <Text style={styles.label}>NAME of EMPLOYER:</Text>
          <Text style={styles.value}>{data?.companyName}</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>DESIGNATION/POST:</Text>
          <Text style={styles.value}>{data?.designation}</Text>
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>EMPLOYEE ID:</Text>
          <Text style={styles.value}>{data?.employeeId}</Text>
        </View>

      </View>

    </View>
  );
};

export default PersonalInformationSection;
