import React from "react";
import {
  Document,
  Image,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import uncareheader from "../assets/images/uncareheader.png";
import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

// Register fonts
Font.register({
  family: "Times-Roman-Normal",
  src: TimeRoman,
});

Font.register({
  family: "Times-Roman-Bold",
  src: TimeRomanBold,
});

// Example component
const StridesHeader2026Template = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerRow}>
          <Image style={styles.logo} src={uncareheader} />
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Annual Medical Check-up – February 2026
        </Text>
      </Page>
    </Document>
  );
};

export default StridesHeader2026Template;

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
    textDecoration: "underline",
    fontFamily: "Times-Roman-Bold",
  },
  imageContainer: {
    padding: 20,
  },
  xrayImage: {
    width: "100%",
    height: "auto",
  },
});
