import React, { useState, useEffect, Fragment } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useSnackbar } from "notistack";
import { downloadCsv, sortDataByName } from "../assets/utils";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";

import { uploadFile } from "../assets/services/PostApiCall";

const ZestPharma = ({
  corpId = "fae5d4c3-7f90-4ee9-95c5-21bf2b1b6037",
  campCycleId = "246159",
  fileType = "PHYSICAL_FITNESS_FORM",
}) => {
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  //   Add a page to the PDF for a single employee
  const addPageToPdf = async (employee) => {
    if (!employee.physicalFitnessFormUrl) {
      console.error(`Missing blood test URL for employee ${employee.empId}`);
      return;
    }

    try {
      // Load the main PDF and stool content PDF
      const mainPdfBytes = await fetch(employee.physicalFitnessFormUrl).then(
        (res) => res.arrayBuffer()
      );

      const mainPdfDoc = await PDFDocument.load(mainPdfBytes);

      const mainFirstPage = mainPdfDoc.getPage(0);
      const { width, height } = mainFirstPage.getSize();

      const boldFont = await mainPdfDoc.embedFont(StandardFonts.HelveticaBold);

      mainFirstPage.drawRectangle({
        x: 174,
        y: height - 250,
        width: 50,
        height: 17,
        color: rgb(1, 1, 1),
      });

      mainFirstPage.drawText(`${employee?.height} cm`, {
        x: 175,
        y: height - 246,
        size: 9,
        color: rgb(0, 0, 0),
        // font: boldFont,
      });

      const pdfBytes = await mainPdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      const urlPDF = URL.createObjectURL(pdfBlob);

      //   window.open(urlPDF, "_blank");

      const formData = new FormData();
      formData.append(
        "file",
        pdfBlob,
        `${
          employee?.physicalFitnessFormUrl?.split("/").pop() ||
          employee?.empId + "_ZestPharma"
        }.pdf`
      );
      const url = `https://apibackend.uno.care/api/org/upload?empId=${employee.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
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
      const result = await getData(url);
      if (result && result.data) {
        const empIds = [
          10130, 10174, 10294, 10173, 10178, 10331, 10136, 10334, 10257, 10215,
          10259, 10335, 10180, 10262, 10107, 10106, 10109, 10108, 10143, 10186,
          10101, 10144, 10301, 10224, 10103, 10146, 10223, 10149, 10226, 10148,
          10196, 10151, 10118, 10119, 10110, 10231, 10153, 10112, 10114, 10157,
          10113, 10115, 10163, 10284, 10283, 10128, 10328, 10165, 10241, 10243,
          10323, 10168, 10127, 10247,
        ].map((item) => item.toString());
        const temp = result?.data.filter((item) => empIds.includes(item.empId));
        console.log({ em: temp.length });
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
    <Fragment>
      <div>
        <button onClick={processNextEmployee}>Process Employees</button>
        <button onClick={handleDeletePDF}>Delete files</button>
        <div>Total Employees: {totalEmployees}</div> <br />
        <div>Uploaded Files: {uploadedCount}</div> <br />
        {list.map((item, index) => (
          <div key={index} style={{ display: "flex" }}>
            <div>
              {item.empId} <br /> {item.name} <br />
            </div>
            <a href={item.physicalFitnessFormUrl}>
              <div>{item.physicalFitnessFormUrl || "No Blood Report File"}</div>
            </a>
            <br />
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default ZestPharma;
