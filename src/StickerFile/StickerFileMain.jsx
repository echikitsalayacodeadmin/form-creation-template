import { PDFDownloadLink } from "@react-pdf/renderer";
import React from "react";
import StickerPDF from "./StickerPDF";

const StickerFileMain = () => {
  const sampleData = [
    {
      empId: "LW5000030814",
      name: "KISHAN KUMAR",
      folder: "NH-F12",
    },
    {
      empId: "10071511",
      name: "Lahu Bhagoji Anuse",
      folder: "NH-F34",
    },
    {
      empId: "LW5000028004",
      name: "LAXMAN RAMESH AWATADE",
      folder: "NH-F34",
    },
    {
      empId: "754332",
      name: "Lahu Dagadu Vishwasrao",
      folder: "NH-F34",
    },
  ];

  return (
    <div>
      <PDFDownloadLink
        document={<StickerPDF data={sampleData} />}
        fileName="stickers.pdf"
      >
        Download Stickers
      </PDFDownloadLink>
    </div>
  );
};

export default StickerFileMain;
