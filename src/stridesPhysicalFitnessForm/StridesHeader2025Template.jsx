import React from "react";
import {
  Document,
  Image,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import uncareheader from "../assets/images/uncareheader.png";

// Example component
const StridesHeader2025Template = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerRow}>
          <Image style={styles.logo} src={uncareheader} />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Bi-Annual Medical Check-up – October 2025
        </Text>
      </Page>
    </Document>
  );
};

export default StridesHeader2025Template;

// ----------------------
// Styles
// ----------------------
const styles = StyleSheet.create({
  page: {
    padding: 0,
    backgroundColor: "#fff",
  },
  headerRow: {
    width: "100%",
    textAlign: "center",
    marginBottom: 10,
    padding: 10,
  },
  logo: {
    width: "100%",
    height: 70,
  },
  title: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
  },
  imageContainer: {
    padding: 20,
  },
  xrayImage: {
    width: "100%",
    height: "auto",
  },
});
