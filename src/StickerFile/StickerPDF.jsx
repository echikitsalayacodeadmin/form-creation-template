import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

import TimeRoman from "../assets/fonts/Times-Roman.ttf";
import TimeRomanBold from "../assets/fonts/Times-Bold.ttf";

Font.register({ family: "Times-Roman-Normal", src: TimeRoman });
Font.register({ family: "Times-Roman-Bold", src: TimeRomanBold });

// 1 inch = 72pt → 2.5in = 180pt
const stickerWidth = 180;
const stickerHeight = 72;

const styles = StyleSheet.create({
  page: {
    padding: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    fontFamily: "Times-Roman-Normal",
  },
  sticker: {
    width: stickerWidth,
    height: stickerHeight,
    border: "1px solid #000",
    padding: 6,
    margin: 4,
    justifyContent: "space-between",
    borderRadius: 10,
  },
  empId: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Times-Roman-Bold",
  },
  name: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: "bold",
    fontFamily: "Times-Roman-Bold",
  },
  folder: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: "bold",
    fontFamily: "Times-Roman-Bold",
  },
  date: {
    fontSize: 9,
    marginTop: 2,
    fontWeight: "bold",
    fontFamily: "Times-Roman-Bold",
  },
});

const chunkData = (array, chunkSize = 30) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const StickerPDF = ({ data }) => {
  const pages = chunkData(data, 30); // 30 stickers per A4 page

  return (
    <Document>
      {pages.map((pageItems, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {pageItems.map((item, i) => (
            <View key={i} style={styles.sticker}>
              <Text style={styles.empId}>{item.empId}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.folder}>{item.folder}</Text>
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

export default StickerPDF;
