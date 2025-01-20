import React, { useState, useEffect } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useSnackbar } from "notistack";
import { downloadCsv, sortDataByName } from "../assets/utils";
import { uploadFile } from "../assets/services/PostApiCall";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { daawatOldCamp } from "./bloodOldCamp";

const DaawatBlood = ({
  //   corpId = "872cd841-9f7a-432d-b8e9-422b780bca10",
  // campCycleId = "252188",
  corpId = "8047e6d8-e51b-4d6d-b3e2-bc0ccd13be25",
  campCycleId = "237640",
  fileType = "BLOODTEST",
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

      const mainPdfDoc = await PDFDocument.load(mainPdfBytes);

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

      newPage.drawText("hBsAg", {
        x: 40, // Adjust x to your desired position
        y: height - 230, // Adjust y to position the text over the rectangle (you can fine-tune this)
        size: 9, // Font size
        color: rgb(0, 0, 0), // Text color (black)
        // font: boldFont,
      });
      newPage.drawText(`${employee.HBSAG || "Non-Reactive"}`, {
        x: 250, // Adjust x to your desired position
        y: height - 230, // Adjust y to position the text over the rectangle (you can fine-tune this)
        size: 9, // Font size
        color: rgb(0, 0, 0), // Text color (black)
      });

      console.log({ height: "842", width });

      newPage.drawRectangle({
        x: 250,
        y: 30,
        width: width - 535,
        height: height - 802,
        color: rgb(1, 1, 1),
      });

      //Sage Report
      // newPage.drawRectangle({
      //   x: 20,
      //   y: 200,
      //   // y: -90,
      //   width: width - 40,
      //   height: height - 180 - 90 - 200,
      //   color: rgb(1, 1, 1),
      // });

      // newPage.drawText("hBsAg", {
      //   x: 40, // Adjust x to your desired position
      //   y: height - 265, // Adjust y to position the text over the rectangle (you can fine-tune this)
      //   size: 9, // Font size
      //   color: rgb(0, 0, 0), // Text color (black)
      //   font: boldFont,
      // });
      // newPage.drawText("Non Reactive", {
      //   x: 230, // Adjust x to your desired position
      //   y: height - 265, // Adjust y to position the text over the rectangle (you can fine-tune this)
      //   size: 9, // Font size
      //   color: rgb(0, 0, 0), // Text color (black)
      // });

      // console.log({ height: "842" });

      // newPage.drawRectangle({
      //   x: 0,
      //   y: 0,
      //   // y: -90,
      //   width: width,
      //   height: height - 832,
      //   color: rgb(1, 1, 1),
      // });

      //   // Add text to the Last page
      //   newPage.drawText("hBsAg", {
      //     x: 50, // Adjust x and y as needed to align with "Test Name" column
      //     y: -80, // Adjust based on where the "Test Name" starts
      //     size: 10,
      //     color: rgb(0, 0, 0),
      //   });

      //   newPage.drawText("Non Reactive", {
      //     x: 200, // Adjust x to align with the "Observed Values" column
      //     y: -80, // Match the y position of the "Test Name"
      //     size: 10,
      //     color: rgb(0, 0, 0),
      //   });

      const pdfBytes = await mainPdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      const urlPDF = URL.createObjectURL(pdfBlob);

      // window.open(urlPDF, "_blank");

      const formData = new FormData();
      formData.append(
        "file",
        pdfBlob,
        `${employee?.bloodTestUrl?.split("/").pop() || "Report"}.pdf`
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
      setUploadedCount((prevCount) => prevCount + 1);
    }
  };

  // Fetch the list of employees
  const fetchListOfEmployees = async () => {
    try {
      const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
      // const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=8047e6d8-e51b-4d6d-b3e2-bc0ccd13be25&campCycleId=237640`;
      const result = await getData(url);
      if (result && result.data) {
        const temp = result.data.map((item) => ({
          empId: item.empId,
          name: item.name,
          "S.CREATININE": item?.cholestrolData?.["S.CREATININE"],
          GFR: item?.cholestrolData?.GFR,
          age: item.age,
          gender: item.gender,
        }));

        downloadCsv(temp);
        // .filter(
        //   (item) => item.vitalsCreatedDate === "2025-01-03" && item.bloodTestUrl
        // );

        // .filter(
        //   (item) =>
        //     [
        //       // "711206",
        //       // "711230",
        //       // "1210862",
        //       // "1210161",
        //       // "CS0800",
        //       // "CS10784",
        //       // "Dk19",
        //       // "711225",
        //       // "Dmahi02",
        //       // "CS007",
        //       // "CS10662",
        //       // "Br68",
        //       // "KC0004",
        //       // "KC0008",
        //       // "7111216",
        //       // "Br39",
        //       // "23043",
        //       // "Kc00010",
        //       // "AQ001",
        //       // "AQ5343",
        //       // "711031",
        //       // "CS10663",
        //       // "1211052",
        //       // "DR93",
        //       // "Dr83",
        //       // "685990",
        //       // "711033",
        //       // "711272",
        //       // "1210180",
        //       // "896132",
        //       // "1211003",
        //       // "1210401",
        //       // "1210717",
        //       // "711133",
        //       // "1210996",
        //       // "1210161",
        //       "976909",
        //     ].includes(item.empId) && item.bloodTestUrl
        // )
        // .map((item) => ({
        //   ...item,
        //   HBSAG: daawatOldCamp.find((oldCamp) => oldCamp.empId === item.empId)
        //     ?.cholestrolData?.["HBsAg"],
        // }));
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

export default DaawatBlood;
