import React, { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useSnackbar } from "notistack";
import { downloadCsv, sortDataByName } from "../assets/utils";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";

const ShrijiPolymerBlood = ({
  corpId = "fff042b1-8fd3-48aa-aa8a-e7c97949a9d5",
  campCycleId = "246259",
  fileType = "BLOODTEST",
  bloodGroupFile = "https://storage-echikitsalaya.s3.ap-south-1.amazonaws.com/corpAllReports/fff042b1-8fd3-48aa-aa8a-e7c97949a9d5/BLOODTEST/20241220092404/Ms_SHAYRI_DAWAR_SP71_19_12_2024_04_25_56_PM.pdf",
}) => {
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  //   Add a page to the PDF for a single employee
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
      const bloodGroupPdfBytes = await fetch(bloodGroupFile).then((res) =>
        res.arrayBuffer()
      );

      const mainPdfDoc = await PDFDocument.load(mainPdfBytes);
      const bloodGroupPdfDoc = await PDFDocument.load(bloodGroupPdfBytes);

      // // Remove the last page
      // const pageCount = mainPdfDoc.getPageCount();
      // if (pageCount > 1) {
      //   mainPdfDoc.removePage(pageCount - 1); // Remove the last page
      // }

      const mainFirstPage = mainPdfDoc.getPage(0);
      const { width, height } = mainFirstPage.getSize();

      const [embeddedMainPage] = await mainPdfDoc.embedPages([mainFirstPage]);
      const boldFont = await mainPdfDoc.embedFont(StandardFonts.HelveticaBold);
      const newPage = mainPdfDoc.addPage([width, height]);
      newPage.drawPage(embeddedMainPage, {
        x: 0,
        y: 0,
        width: width,
        height: height,
      });

      // Shivani Report

      newPage.drawRectangle({
        x: 0,
        y: 150,
        width: width,
        height: height - 220 - 150,
        color: rgb(1, 1, 1),
      });

      const bloodLastPage = bloodGroupPdfDoc.getPage(1);

      const cropY = 190; // Crop 230 points from the top
      const bloodFileHeight = height - cropY; // Adjust the content height

      bloodLastPage.setMediaBox(0, cropY, width, bloodFileHeight);

      const [embeddedBloodPage] = await mainPdfDoc.embedPages([bloodLastPage]);

      newPage.drawPage(embeddedBloodPage, {
        x: 0,
        y: 0, // Position below the header
        width: width,
        height: bloodFileHeight,
      });

      newPage.drawRectangle({
        x: 240,
        y: height - 242,
        width: width - 515,
        height: height - 822,
        color: rgb(1, 1, 1),
      });

      newPage.drawText(`${employee.HBSAG || `"O" Rh Positive`}`, {
        x: 250, // Adjust x to your desired position
        y: height - 232, // Adjust y to position the text over the rectangle (you can fine-tune this)
        size: 9, // Font size
        color: rgb(0, 0, 0), // Text color (black)
        font: boldFont,
      });

      newPage.drawRectangle({
        x: 279,
        y: height - 812,
        width: width - 590,
        height: height - 822,
        color: rgb(1, 1, 1),
      });

      newPage.drawText(`${2}`, {
        x: 279,
        y: height - 803.3,
        size: 9,
        color: rgb(0, 0, 0),
        // font: boldFont,
      });

      const pdfBytes = await mainPdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      const urlPDF = URL.createObjectURL(pdfBlob);

      window.open(urlPDF, "_blank");

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
      setUploadedCount((prevCount) => prevCount + 1);
    }
  };

  // Fetch the list of employees
  const fetchListOfEmployees = async () => {
    try {
      const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await getData(url);
      if (result && result.data) {
        const temp = result.data;
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

  const handleDeletePDF = async () => {
    for (let i = 0; i < list.length; i++) {
      await deleteFiles(list[i]);
    }
  };

  const deleteFiles = async (data) => {
    const url = `https://apibackend.uno.care/api/org/employee/delete/file?empId=${data?.empId}&toDeletefiletype=${fileType}&corpId=${corpId}`;
    const result = await updateData(url);
    if (result && result.data) {
      enqueueSnackbar("Successfully Deleted PDF!", {
        variant: "success",
      });
      setUploadedCount((prevCount) => prevCount + 1);
    } else {
      enqueueSnackbar("An error Occurred!", {
        variant: "error",
      });
    }
  };
  return (
    <div>
      <button onClick={processNextEmployee}>Process Employees</button>
      <button onClick={handleDeletePDF}>Delete files</button>
      <div>Total Employees: {totalEmployees}</div> <br />
      <div>Uploaded Files: {uploadedCount}</div> <br />
      {list.map((item, index) => (
        <div key={index} style={{ display: "flex" }}>
          <div>
            {item.empId} <br /> {item.name} <br />
            {`HBsAg": ${item?.HBSAG}`}
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

export default ShrijiPolymerBlood;
