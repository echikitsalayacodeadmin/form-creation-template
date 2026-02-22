import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({

  container: {
    border: "1 solid black",

  },

  row: {
    flexDirection: "row",
  },

  label: {
    width: "15%",
    borderRight: "1 solid black",
    borderBottom: "1 solid black",
    padding: 4,
    fontWeight: "bold",
    fontSize: 8
  },

  value: {
    width: "85%",
    borderBottom: "1 solid black",
    padding: 4,
    fontSize: 8
  },

  lastLabel: {
    width: "15%",
    borderRight: "1 solid black",
    padding: 4,
    fontWeight: "bold",
    fontSize: 8
  },

  lastValue: {
    width: "85%",
    padding: 4,
    fontSize: 8
  },

});

const AdviceRemarksSection = ({ data }) => {

  return (

    <View style={styles.container}>

      {/* ADVICE */}
      <View style={styles.row}>

        <Text style={styles.label}>
          ADVICE :
        </Text>

        <Text style={styles.value}>
          {data.advice}
        </Text>

      </View>

      {/* REMARKS */}
      <View style={styles.row}>

        <Text style={styles.lastLabel}>
          REMARKS :
        </Text>

        <Text style={styles.lastValue}>
          {data.remarks}
        </Text>

      </View>

    </View>

  );
};

export default AdviceRemarksSection;
