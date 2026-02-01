

import React, { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { useSnackbar } from "notistack";
import { sortDataByName } from "../assets/utils";
import { uploadFile } from "../assets/services/PostApiCall";
import { getData } from "../assets/services/GetApiCall";
import stoolContentImage from "./stoolContentImage.png"

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
  
  corpId = "8047e6d8-e51b-4d6d-b3e2-bc0ccd13be25",
  fileType = "BLOODTEST",
  campCycleId = "364062",

 
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
  
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${employee.empId}_STOOL_REPORT.pdf`;
      a.click();
      URL.revokeObjectURL(url);
  
      enqueueSnackbar("Stool report downloaded!", { variant: "success" });
    
  
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
                "1211091","KC0023","1210863","1211086","1210639","1210675","1210970","1210876","1210872","1211079",
                "BP151","ME045","PP036","1211029","1210514","1210901","1211032","1210765","1210085","AP0021",
                "1211136","PEM009","1210967","SS0064","1210590","711387","1210878","AP0023","1211059","1210360",
                "711115","1211005","1210320","BP150","1210396","SS0023","AQ5568","1211088","AQ4454","1210740",
                "1210955","1210941","1210362","1210545","1210989","23409","1210567","KC0021","BP12","1211024",
                "1211054","1210575","1210757","1210898","SS0044","AQ6783","DR46","1211025","1210522","1210739",
                "1210273","1210416","1211001","711381","SS0036","1210494","1210644","1210102","1210382","1210418",
                "1210068","1210096","1210873","1210991","1210117","1210848","1211072","1210213","LK017","1210040",
                "1210311","SS0006","KC0001","1210317","1210840","1211129","711370","Dk19","1210454","KC0015",
                "1210569","1210865","23040","1210379","KC0018","1210741","1210455","KC0017","1210892","KC0020",
                "KC00020","1210187","KC00021","1210944","1210520","1210057","1210280","SS0063","1210880","1210155",
                "711097","1211037","1210755","1211046","1210062","1210463","1210930","1210056","1210656","1210963",
                "PP039","M1210963","711093","1210660","KC0004","AP0002","1210261","23017","711092","1210210",
                "Br48","1210092","1211093","1210097","1210714","1210331","1210899","1210059","PP032","711374",
                "1210736","1211095","PP08","1211044","1211094","711247","1210526","PP019","AQ6183","1210734",
                "1210070","711285","23413","C0002","1210815","1210643","1210518","1210220","1210812","1210072",
                "BP144","KC0022","KC0013","BP149","1210870","1210304","1210079","1210124","1210959","1210472",
                "1211004","AQ6583","1210473","1210709","23044","1210345","1210421","1210049","1210601","1210478",
                "1210858","1210368","SS0004","1210240","711219","1211100","1210568","1210119","SS0065","1211047",
                "1210595","711177","1210902","1210446","PEM-695","1211038","1210238","1210179","1210214","1210990",
                "1210414","1210984","711397","AP0007","1210603","DR23","AQ6181","1210371","1210105","1210856",
                "1210566","1210905","1210798","1210367","1210912","AQ6444","1210661","1211141","AQ4461","1210324",
                "1210971","23082","1211061","1210318","SS0018","1211030","1210996","1210818","1211022","1210415",
                "711133","1210394","1211041","1210395","1211109","AP0009","1210647","1211087","1210877","AQ6182",
                "1210366","1210846","1210977","1211111","1210756","23317"
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

