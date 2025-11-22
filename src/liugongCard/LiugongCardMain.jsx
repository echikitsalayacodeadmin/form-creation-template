import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import React from "react";
import { rawData } from "./rawData";
import { LiugongA4Sheet } from "./LiugongA4Sheet";

const LiugongCardMain = () => {
  return (
    <div>
      <PDFViewer style={{ width: "100%", height: "calc(100vh - 64px)" }}>
        <LiugongA4Sheet employees={rawData} />
      </PDFViewer>
    </div>
  );
};

export default LiugongCardMain;
