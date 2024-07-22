// // import React, { useState, useEffect } from "react";
// // import { PDFDocument, rgb } from "pdf-lib";
// // import { saveAs } from "file-saver";
// // import { Document, Page } from "@react-pdf/renderer";
// // import { pdfjs } from "react-pdf";
// // import { sortDataByName } from "../assets/utils";
// // import { uploadFile } from "../assets/services/PostApiCall";
// // import { getData } from "../assets/services/GetApiCall";
// // import { updateData } from "../assets/services/PatchApi";
// // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// // const BloodPdf = ({
// //   corpId = "8d7e2719-91c5-42ea-a34d-0d06b7f53e7f",
// //   mainUrl = "https://storage-echikitsalaya.s3.ap-south-1.amazonaws.com/org/872cd841-9f7a-432d-b8e9-422b780bca10/138858/BLOODTEST/9205ccde-1d03-4305-8aa0-567ac259fb66/Mr_RAKESH_MANDLOI_68_28_05_2024_09_53_42_PM.pdf",
// //   stoolContentPdf = "https://storage-echikitsalaya.s3.ap-south-1.amazonaws.com/org/872cd841-9f7a-432d-b8e9-422b780bca10/138858/BLOODTEST/77a1be28-8d9d-4369-81d0-71da156fe9a4/stoolcontent.pdf",
// // }) => {
// //   const addPageToPdf = async (employee) => {
// //     // Load the main PDF and stool content PDF
// //     const mainPdfBytes = await fetch(employee.bloodTestUrl).then((res) =>
// //       res.arrayBuffer()
// //     );
// //     const stoolPdfBytes = await fetch(stoolContentPdf).then((res) =>
// //       res.arrayBuffer()
// //     );

// //     const mainPdfDoc = await PDFDocument.load(mainPdfBytes);
// //     const stoolPdfDoc = await PDFDocument.load(stoolPdfBytes);

// //     const mainFirstPage = mainPdfDoc.getPage(0);
// //     const { width, height } = mainFirstPage.getSize();

// //     const [embeddedMainPage] = await mainPdfDoc.embedPages([mainFirstPage]);

// //     const newPage = mainPdfDoc.addPage([width, height]);
// //     newPage.drawPage(embeddedMainPage, {
// //       x: 0,
// //       y: 0,
// //       width: width,
// //       height: height,
// //     });

// //     newPage.drawRectangle({
// //       x: 0,
// //       y: -60,
// //       width: width,
// //       height: height - 130,
// //       color: rgb(1, 1, 1),
// //     });

// //     const stoolFirstPage = stoolPdfDoc.getPage(0);

// //     const cropY = 230; // Crop 250 points from the top
// //     const stoolContentHeight = height - cropY; // Adjust the content height

// //     // Set the MediaBox to crop the top of the stool page
// //     stoolFirstPage.setMediaBox(0, cropY, width, stoolContentHeight);

// //     // Embed the stool content page with cropping
// //     const [embeddedStoolPage] = await mainPdfDoc.embedPages([stoolFirstPage]);

// //     // Create a new page and draw the header from the main PDF

// //     // Draw the stool content below the header
// //     newPage.drawPage(embeddedStoolPage, {
// //       x: -20,
// //       y: 0, // Position below the header
// //       width: width + 30,
// //       height: stoolContentHeight,
// //     });

// //     const pdfBytes = await mainPdfDoc.save();
// //     const blob = new Blob([pdfBytes], { type: "application/pdf" });
// //     // const url = URL.createObjectURL(blob);

// //     const formData = new FormData();
// //     formData.append(
// //       "file",
// //       pdfBlob,
// //       `${item?.cholestrolData?.["BLOOD_PATIENT_NAME_REPORT"]}.pdf`
// //     );
// //     const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=VACCINATION_CERTIFICATE&corpId=${corpId}&campCycleId=`;
// //     const result = await uploadFile(url, formData);
// //     if (result && result.data) {
// //       enqueueSnackbar("Successfully Uploaded PDF!", {
// //         variant: "success",
// //       });
// //       setUploadedCount((prevCount) => prevCount + 1);
// //       // const url = URL.createObjectURL(pdfBlob);
// //       // window.open(url, "_blank");
// //     } else {
// //       enqueueSnackbar("An error Occurred!", {
// //         variant: "error",
// //       });
// //     }
// //   };

// //   const fetchListOfEmployees = async () => {
// //     const url = `https://apibackend.uno.care/api/org/detailed/all?corpId=${corpId}&campCycleId=`;
// //     const result = await getData(url);
// //     if (result && result.data) {
// //       console.log("Fetched Data successfully");
// //       const temp = result.data.filter((item) => item.blooTestUrl);
// //       setList(sortDataByName(temp));
// //       setTotalEmployees(temp.length);
// //     } else {
// //       console.log("An error Occurred");
// //     }
// //   };

// //   useEffect(() => {
// //     fetchListOfEmployees();
// //   }, []);

// //   const deleteFiles = async (data) => {
// //     // Fetch employees from the API starting from the currentIndex
// //     const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=VACCINATION_CERTIFICATE&empId=${data.empId}`;
// //     const result = await updateData(url);
// //     if (result && result.data) {
// //       enqueueSnackbar("Successfully Uploaded PDF!", {
// //         variant: "success",
// //       });
// //       setUploadedCount((prevCount) => prevCount + 1);
// //     } else {
// //       enqueueSnackbar("An error Occurred!", {
// //         variant: "error",
// //       });
// //     }
// //   };

// //   return (
// //     <div>
// //       <button onClick={addPageToPdf}>Add Page to PDF</button>
// //       <button onClick={handleDeletePDF}>Delete Files</button>
// //       <div>Total Employees: {totalEmployees}</div> <br />
// //       <div>Uploaded Files: {uploadedCount}</div> <br />
// //       {list.map((item, index) => (
// //         <div key={index} style={{ display: "flex" }}>
// //           <div key={index}>
// //             {item.empId} {item.name}
// //           </div>
// //           <a href={item.bloodTestUrl}>
// //             <div key={index}>{item.bloodTestUrl}</div>
// //           </a>
// //           <br />
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default BloodPdf;

import React, { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { useSnackbar } from "notistack";
import { sortDataByName } from "../assets/utils";
import { uploadFile } from "../assets/services/PostApiCall";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";

const ids = [
  "1210001",
  "1210040",
  "1210049",
  "1210052",
  "1210057",
  "1210059",
  "1210060",
  "1210062",
  "1210068",
  "1210070",
  "1210072",
  "1210079",
  "1210085",
  "1210092",
  "1210096",
  "1210097",
  "1210102",
  "1210105",
  "1210114",
  "1210117",
  "1210119",
  "1210124",
  "1210155",
  "1210161",
  "1210165",
  "1210179",
  "1210210",
  "1210213",
  "1210214",
  "1210220",
  "1210238",
  "1210240",
  "1210261",
  "1210269",
  "1210273",
  "1210280",
  "1210283",
  "1210304",
  "1210311",
  "1210312",
  "1210317",
  "1210318",
  "1210320",
  "1210331",
  "1210356",
  "1210360",
  "1210362",
  "1210367",
  "1210368",
  "1210370",
  "1210371",
  "1210379",
  "1210382",
  "1210383",
  "1210394",
  "1210395",
  "1210396",
  "1210414",
  "1210416",
  "1210425",
  "1210446",
  "1210454",
  "1210455",
  "1210463",
  "1210472",
  "1210473",
  "1210478",
  "1210494",
  "1210514",
  "1210518",
  "1210520",
  "1210521",
  "1210522",
  "1210526",
  "1210545",
  "1210566",
  "1210567",
  "1210568",
  "1210569",
  "1210572",
  "1210575",
  "1210586",
  "1210588",
  "1210590",
  "1210595",
  "1210601",
  "1210603",
  "1210639",
  "1210643",
  "1210644",
  "1210646",
  "1210647",
  "1210656",
  "1210661",
  "1210675",
  "1210709",
  "1210714",
  "1210727",
  "1210734",
  "1210739",
  "1210740",
  "1210741",
  "1210743",
  "1210745",
  "1210748",
  "1210755",
  "1210756",
  "1210765",
  "1210792",
  "1210798",
  "1210811",
  "1210812",
  "1210813",
  "1210815",
  "1210818",
  "1210820",
  "1210827",
  "1210829",
  "1210830",
  "1210832",
  "1210841",
  "1210848",
  "1210856",
  "1210858",
  "1210859",
  "1210860",
  "1210865",
  "1210870",
  "1210871",
  "1210872",
  "1210873",
  "1210876",
  "1210877",
  "1210878",
  "1210880",
  "1210881",
  "1210892",
  "1210895",
  "1210898",
  "1210899",
  "1210901",
  "1210902",
  "1210905",
  "1210906",
  "1210912",
  "1210935",
  "1210955",
  "1210959",
  "1210961",
  "1210963",
  "1210967",
  "1210970",
  "1210971",
  "1210977",
  "1210980",
  "1210981",
  "1210983",
  "1210984",
  "1210985",
  "1210989",
  "1210990",
  "1210991",
  "1210996",
  "1211001",
  "1211002",
  "1211003",
  "1211004",
  "1211005",
  "1211011",
  "1211012",
  "1211013",
  "1211014",
  "1211015",
  "1211017",
  "1211018",
  "1211019",
  "1211020",
  "1211022",
  "1211021",
  "1211023",
  "1211024",
  "1211025",
  "1211026",
  "1211007",
  "1211027",
  "1211028",
  "1211029",
  "1211030",
  "1211032",
  "1211037",
  "1211038",
  "1211040",
  "1211041",
  "1211044",
  "1211046",
  "1211047",
  "1211048",
];

const bioLine = [
  "1211032",
  "1211012",
  "1210991",
  "1210743",
  "1210727",
  "1210572",
  "1210526",
  "1210382",
  "1210331",
  "1210312",
];

const nelayHospital = ["1211040", "1211046", "1211044", "1211047"];

const sageLabs = ["1211020", "1210643", "1211019", "1210238", "1210830"];

const BloodPdf = ({
  corpId = "8047e6d8-e51b-4d6d-b3e2-bc0ccd13be25",
  // corpId = "872cd841-9f7a-432d-b8e9-422b780bca10",
  fileType = "BLOODTEST",
  stoolContentPdf = "https://storage-echikitsalaya.s3.ap-south-1.amazonaws.com/org/872cd841-9f7a-432d-b8e9-422b780bca10/138858/BLOODTEST/77a1be28-8d9d-4369-81d0-71da156fe9a4/stoolContentNelayHospital.pdf",
  // stoolContentPdf = "https://storage-echikitsalaya.s3.ap-south-1.amazonaws.com/org/872cd841-9f7a-432d-b8e9-422b780bca10/138858/BLOODTEST/77a1be28-8d9d-4369-81d0-71da156fe9a4/stoolcontent.pdf",
}) => {
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  // Add a page to the PDF for a single employee
  const addPageToPdf = async (employee) => {
    if (!employee.bloodTestUrl) {
      console.error(`Missing blood test URL for employee ${employee.empId}`);
      return;
    }

    try {
      // Load the main PDF and stool content PDF
      const mainPdfBytes = await fetch(employee.bloodTestUrl).then((res) =>
        res.arrayBuffer()
      );
      const stoolPdfBytes = await fetch(stoolContentPdf).then((res) =>
        res.arrayBuffer()
      );

      const mainPdfDoc = await PDFDocument.load(mainPdfBytes);
      const stoolPdfDoc = await PDFDocument.load(stoolPdfBytes);

      const mainFirstPage = mainPdfDoc.getPage(0);
      const { width, height } = mainFirstPage.getSize();

      const [embeddedMainPage] = await mainPdfDoc.embedPages([mainFirstPage]);

      const newPage = mainPdfDoc.addPage([width, height]);
      newPage.drawPage(embeddedMainPage, {
        x: 0,
        y: 0,
        width: width,
        height: height,
      });

      newPage.drawRectangle({
        x: 0,
        y: -80,
        width: width,
        height: height - 130,
        color: rgb(1, 1, 1),
      });

      const stoolFirstPage = stoolPdfDoc.getPage(0);

      const cropY = 230; // Crop 230 points from the top
      const stoolContentHeight = height - cropY; // Adjust the content height

      stoolFirstPage.setMediaBox(0, cropY, width, stoolContentHeight);

      const [embeddedStoolPage] = await mainPdfDoc.embedPages([stoolFirstPage]);

      newPage.drawPage(embeddedStoolPage, {
        x: 0,
        y: 0, // Position below the header
        width: width,
        height: stoolContentHeight,
      });

      const pdfBytes = await mainPdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      // const url = URL.createObjectURL(pdfBlob);

      // window.open(url, "_blank");

      // const formData = new FormData();
      // formData.append(
      //   "file",
      //   pdfBlob,
      //   `${employee?.bloodTestUrl?.split("/").pop() || "Report"}.pdf`
      // );
      // const url = `https://apibackend.uno.care/api/org/upload?empId=${employee.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=`;
      // const result = await uploadFile(url, formData);
      // if (result && result.data) {
      //   enqueueSnackbar("Successfully Uploaded PDF!", { variant: "success" });
      //   setUploadedCount((prevCount) => prevCount + 1);
      // } else {
      //   enqueueSnackbar("An error occurred while uploading PDF!", {
      //     variant: "error",
      //   });
      // }
    } catch (error) {
      console.error(`Error processing employee ${employee.empId}:`, error);
      enqueueSnackbar(`An error occurred while processing ${employee.empId}`, {
        variant: "error",
      });
    }
  };

  // Fetch the list of employees
  const fetchListOfEmployees = async () => {
    try {
      const url = `https://apibackend.uno.care/api/org/detailed/all?corpId=${corpId}&campCycleId=`;
      const result = await getData(url);
      if (result && result.data) {
        const temp = result.data.filter(
          (item) => ids?.includes(item.empId) && item.bloodTestUrl === null
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

  const processNextEmployee = async () => {
    if (currentIndex < list.length) {
      await addPageToPdf(list[currentIndex]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      enqueueSnackbar("All employees processed!", { variant: "success" });
    }
  };

  return (
    <div>
      <button onClick={processNextEmployee}>Process Employees</button>
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

export default BloodPdf;
