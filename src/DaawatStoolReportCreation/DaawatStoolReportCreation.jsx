

import React, { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { useSnackbar } from "notistack";
import { sortDataByName } from "../assets/utils";
import { uploadFile } from "../assets/services/PostApiCall";
import { getData } from "../assets/services/GetApiCall";
import stoolContentImage from "./effotelStoolImage.png"

const downloadPdf = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};


const HEADER_HEIGHT = 190;   // keep header
const FOOTER_HEIGHT = 110;   // leave bottom space
const PAGE_PADDING = 0;




const DaawatStoolReportCreation = ({

  corpId = "15f6b1de-093f-4490-9e11-8d06904404f8",
  fileType = "BLOODTEST",
  campCycleId = "420644",


}) => {
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  // Add a page to the PDF for a single employee
  const addPageToPdf = async (employee) => {
    try {
      if (!employee.bloodTestUrl) return;

      /* ---------- Load blood PDF (SOURCE) ---------- */
      const bloodPdfBytes = await fetch(employee.bloodTestUrl).then(res =>
        res.arrayBuffer()
      );

      const bloodDoc = await PDFDocument.load(bloodPdfBytes);
      const bloodPage = bloodDoc.getPage(0);
      const { width, height } = bloodPage.getSize();

      /* ---------- Create NEW PDF ---------- */
      const newPdfDoc = await PDFDocument.create();

      /* ---------- Embed FULL page 0 ---------- */
      const [embeddedPage] = await newPdfDoc.embedPages([bloodPage]);

      const page = newPdfDoc.addPage([width, height]);

      // 1️⃣ Draw full blood page as background
      page.drawPage(embeddedPage, {
        x: 0,
        y: 0,
        width,
        height,
      });

      /* ---------- White-out blood table area ---------- */
      page.drawRectangle({
        x: 0,
        y: FOOTER_HEIGHT,
        width: width,
        height: height - HEADER_HEIGHT - FOOTER_HEIGHT,
        color: rgb(1, 1, 1),
      });

      /* ---------- Load stool image ---------- */
      const stoolImageBytes = await fetch(stoolContentImage).then(res =>
        res.arrayBuffer()
      );
      const stoolImage = await newPdfDoc.embedPng(stoolImageBytes);

      const scale = width / stoolImage.width;
      const stoolHeight = stoolImage.height * scale;

      /* ---------- Calculate stool Y ---------- */
      let stoolY = height - HEADER_HEIGHT - stoolHeight - PAGE_PADDING;
      if (stoolY < FOOTER_HEIGHT) stoolY = FOOTER_HEIGHT;

      /* ---------- Draw stool content ---------- */
      page.drawImage(stoolImage, {
        x: 0,
        y: stoolY,
        width,
        height: stoolHeight,
      });

      /* ---------- Optional: hide small footer element ---------- */
      page.drawRectangle({
        x: 285,
        y: 30,
        width: 50,
        height: 20,
        color: rgb(1, 1, 1),
      });

      /* ---------- Save & download ---------- */
      const pdfBytes = await newPdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });




      // const previewUrl = URL.createObjectURL(modifiedBlob);
      // window.open(previewUrl, "_blank");

      const formData = new FormData();
      formData.append("file", pdfBlob, `Stool_Report_${employee?.empId}.pdf`);

      const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${employee?.empId}&fileType=${"TMT"}&corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await uploadFile(uploadUrl, formData);

      if (result && result.data) {
        enqueueSnackbar("Successfully uploaded modified Audiometry PDF!", {
          variant: "success",
        });
        setUploadedCount((prev) => prev + 1);
      } else {
        enqueueSnackbar("Upload failed!", { variant: "error" });
      }


    } catch (error) {
      console.error(error);
      enqueueSnackbar(`Failed for ${employee.empId}`, { variant: "error" });
    }
  };





  // Fetch the list of employees
  const fetchListOfEmployees = async () => {
    try {
      const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await getData(url);
      if (result && result.data) {
        const temp = result.data.filter(
          (item) =>
            [
              "S016533",
              "S012831",
              "S016336",
              "S011263",
              "S019753",
              "S018408",
              "S018709",
              "S012904",
              "S013660",
              "S014801",
              "S013299",
              "S016176",
              "S016141",
              "S019782",
              "S015311",
              "S03613",
              "S018526",
              "S019877",
              "S06800",
              "S015812",
              "S018122",
              "S016590",
              "S017389",
              "S00362",
              "S012389",
              "S014502",
              "S011264",
              "S015082",
              "S016327",
              "S013212",
              "S019654",
              "S014837",
              "S017364",
              "S020050",
              "S014293",
              "S012433",
              "S013114",
              "S020027"
            ]
              .includes(item.empId) && item.bloodTestUrl
        );
        setList(sortDataByName(temp));
        setTotalEmployees(temp.length);
      } else {
        console.log("An error occurred while fetching data");
      }
    } catch (error) {
      console.error("Error fetching employee list:", error);
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
  }, []);

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const processAllEmployees = async () => {
    for (let i = 0; i < list.length; i++) {
      await addPageToPdf(list[i]);
      await sleep(1500); // REQUIRED
    }
    enqueueSnackbar("All employees processed!", { variant: "success" });
  };


  return (
    <div>
      <button onClick={processAllEmployees}>Process Employees</button>
      <div>Total Employees: {totalEmployees}</div> <br />
      <div>Uploaded Files: {uploadedCount}</div> <br />
      {list.map((item, index) => (
        <div key={index} style={{ display: "flex" }}>
          <div>
            {item.empId} {item.name}
          </div>
          <a href={item.bloodTestUrl}>
            <div>{item.bloodTestUrl}</div>
          </a>
          <br />
        </div>
      ))}
    </div>
  );
};

export default DaawatStoolReportCreation;

