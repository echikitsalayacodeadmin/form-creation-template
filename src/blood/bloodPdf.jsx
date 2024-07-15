// import React, { useState, useEffect } from "react";
// import { PDFDocument, rgb } from "pdf-lib";
// import { saveAs } from "file-saver";
// import { Document, Page } from "@react-pdf/renderer";
// import { pdfjs } from "react-pdf";
// import { sortDataByName } from "../assets/utils";
// import { uploadFile } from "../assets/services/PostApiCall";
// import { getData } from "../assets/services/GetApiCall";
// import { updateData } from "../assets/services/PatchApi";
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// const BloodPdf = ({
//   corpId = "8d7e2719-91c5-42ea-a34d-0d06b7f53e7f",
//   mainUrl = "https://storage-echikitsalaya.s3.ap-south-1.amazonaws.com/org/872cd841-9f7a-432d-b8e9-422b780bca10/138858/BLOODTEST/9205ccde-1d03-4305-8aa0-567ac259fb66/Mr_RAKESH_MANDLOI_68_28_05_2024_09_53_42_PM.pdf",
//   stoolContentPdf = "https://storage-echikitsalaya.s3.ap-south-1.amazonaws.com/org/872cd841-9f7a-432d-b8e9-422b780bca10/138858/BLOODTEST/77a1be28-8d9d-4369-81d0-71da156fe9a4/stoolcontent.pdf",
// }) => {
//   const addPageToPdf = async (employee) => {
//     // Load the main PDF and stool content PDF
//     const mainPdfBytes = await fetch(employee.bloodTestUrl).then((res) =>
//       res.arrayBuffer()
//     );
//     const stoolPdfBytes = await fetch(stoolContentPdf).then((res) =>
//       res.arrayBuffer()
//     );

//     const mainPdfDoc = await PDFDocument.load(mainPdfBytes);
//     const stoolPdfDoc = await PDFDocument.load(stoolPdfBytes);

//     const mainFirstPage = mainPdfDoc.getPage(0);
//     const { width, height } = mainFirstPage.getSize();

//     const [embeddedMainPage] = await mainPdfDoc.embedPages([mainFirstPage]);

//     const newPage = mainPdfDoc.addPage([width, height]);
//     newPage.drawPage(embeddedMainPage, {
//       x: 0,
//       y: 0,
//       width: width,
//       height: height,
//     });

//     newPage.drawRectangle({
//       x: 0,
//       y: -60,
//       width: width,
//       height: height - 130,
//       color: rgb(1, 1, 1),
//     });

//     const stoolFirstPage = stoolPdfDoc.getPage(0);

//     const cropY = 230; // Crop 250 points from the top
//     const stoolContentHeight = height - cropY; // Adjust the content height

//     // Set the MediaBox to crop the top of the stool page
//     stoolFirstPage.setMediaBox(0, cropY, width, stoolContentHeight);

//     // Embed the stool content page with cropping
//     const [embeddedStoolPage] = await mainPdfDoc.embedPages([stoolFirstPage]);

//     // Create a new page and draw the header from the main PDF

//     // Draw the stool content below the header
//     newPage.drawPage(embeddedStoolPage, {
//       x: -20,
//       y: 0, // Position below the header
//       width: width + 30,
//       height: stoolContentHeight,
//     });

//     const pdfBytes = await mainPdfDoc.save();
//     const blob = new Blob([pdfBytes], { type: "application/pdf" });
//     // const url = URL.createObjectURL(blob);

//     const formData = new FormData();
//     formData.append(
//       "file",
//       pdfBlob,
//       `${item?.cholestrolData?.["BLOOD_PATIENT_NAME_REPORT"]}.pdf`
//     );
//     const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=VACCINATION_CERTIFICATE&corpId=${corpId}&campCycleId=`;
//     const result = await uploadFile(url, formData);
//     if (result && result.data) {
//       enqueueSnackbar("Successfully Uploaded PDF!", {
//         variant: "success",
//       });
//       setUploadedCount((prevCount) => prevCount + 1);
//       // const url = URL.createObjectURL(pdfBlob);
//       // window.open(url, "_blank");
//     } else {
//       enqueueSnackbar("An error Occurred!", {
//         variant: "error",
//       });
//     }
//   };

//   const fetchListOfEmployees = async () => {
//     const url = `https://apibackend.uno.care/api/org/detailed/all?corpId=${corpId}&campCycleId=`;
//     const result = await getData(url);
//     if (result && result.data) {
//       console.log("Fetched Data successfully");
//       const temp = result.data.filter((item) => item.blooTestUrl);
//       setList(sortDataByName(temp));
//       setTotalEmployees(temp.length);
//     } else {
//       console.log("An error Occurred");
//     }
//   };

//   useEffect(() => {
//     fetchListOfEmployees();
//   }, []);

//   const deleteFiles = async (data) => {
//     // Fetch employees from the API starting from the currentIndex
//     const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=VACCINATION_CERTIFICATE&empId=${data.empId}`;
//     const result = await updateData(url);
//     if (result && result.data) {
//       enqueueSnackbar("Successfully Uploaded PDF!", {
//         variant: "success",
//       });
//       setUploadedCount((prevCount) => prevCount + 1);
//     } else {
//       enqueueSnackbar("An error Occurred!", {
//         variant: "error",
//       });
//     }
//   };

//   return (
//     <div>
//       <button onClick={addPageToPdf}>Add Page to PDF</button>
//       <button onClick={handleDeletePDF}>Delete Files</button>
//       <div>Total Employees: {totalEmployees}</div> <br />
//       <div>Uploaded Files: {uploadedCount}</div> <br />
//       {list.map((item, index) => (
//         <div key={index} style={{ display: "flex" }}>
//           <div key={index}>
//             {item.empId} {item.name}
//           </div>
//           <a href={item.bloodTestUrl}>
//             <div key={index}>{item.bloodTestUrl}</div>
//           </a>
//           <br />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default BloodPdf;

import React, { useState, useEffect } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { useSnackbar } from "notistack";
import { sortDataByName } from "../assets/utils";
import { uploadFile } from "../assets/services/PostApiCall";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";

const BloodPdf = ({
  corpId = "8047e6d8-e51b-4d6d-b3e2-bc0ccd13be25",
  fileType = "BLOODTEST",
  stoolContentPdf = "https://storage-echikitsalaya.s3.ap-south-1.amazonaws.com/org/872cd841-9f7a-432d-b8e9-422b780bca10/138858/BLOODTEST/77a1be28-8d9d-4369-81d0-71da156fe9a4/stoolcontent.pdf",
}) => {
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
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
        y: -60,
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
        x: -20,
        y: 0, // Position below the header
        width: width + 30,
        height: stoolContentHeight,
      });

      const pdfBytes = await mainPdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      const formData = new FormData();
      formData.append(
        "file",
        pdfBlob,
        `${
          employee?.cholestrolData?.["BLOOD_PATIENT_NAME_REPORT"] || "Report"
        }.pdf`
      );
      const url = `https://apibackend.uno.care/api/org/upload?empId=${employee.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=`;
      const result = await uploadFile(url, formData);
      if (result && result.data) {
        enqueueSnackbar("Successfully Uploaded PDF!", { variant: "success" });
        setUploadedCount((prevCount) => prevCount + 1);
      } else {
        enqueueSnackbar("An error occurred while uploading PDF!", {
          variant: "error",
        });
      }
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
        const temp = result.data.filter((item) => item.bloodTestUrl);
        // setList(sortDataByName(temp));
        // setTotalEmployees(temp.length);
        for (let i = 0; i < temp.length; i++) {
          window.open(temp?.[i].bloodTestUrl, "_blank");
        }
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

  // Process all employees
  const processEmployees = async () => {
    for (let i = 0; i < list.length; i++) {
      await addPageToPdf(list[i]);
    }
  };

  return (
    <div>
      <button onClick={processEmployees}>Process Employees</button>
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
