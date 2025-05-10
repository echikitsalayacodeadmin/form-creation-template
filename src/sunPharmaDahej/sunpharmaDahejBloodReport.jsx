import { useSnackbar } from "notistack";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import { uploadFile } from "../assets/services/PostApiCall";

const SunpharmaDahejBloodReport = ({
  corpId = "4102a5bd-77d8-42f3-b2cd-a4101cde2366",
  //   corpId = "872cd841-9f7a-432d-b8e9-422b780bca10",
  campCycleId = "289149",
  fileType = "BLOODTEST",
  bloodGroupFile = "https://storage-echikitsalaya.s3.ap-south-1.amazonaws.com/org/872cd841-9f7a-432d-b8e9-422b780bca10/252188/BLOODTEST/61ea621e-8586-467f-8018-b676d2b69123/redCliff.pdf",
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

      newPage.drawRectangle({
        x: 0,
        y: 0,
        width: width,
        height: height - 180,
        color: rgb(1, 1, 1),
      });

      const bloodLastPage = bloodGroupPdfDoc.getPage(0);

      const cropY = 180; // Crop 230 points from the top
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
        x: 370,
        y: height - 121,
        width: width - 535,
        height: height - 822,
        color: rgb(1, 1, 1),
      });

      newPage.drawText(
        `${employee.formattedBloodGroup || `${employee?.glucoseRandom || ""}`}`,
        {
          x: 285, // Adjust x to your desired position
          y: height - 235, // Adjust y to position the text over the rectangle (you can fine-tune this)
          size: 9, // Font size
          color: rgb(0, 0, 0), // Text color (black)
          // font: boldFont,
        }
      );

      const pdfBytes = await mainPdfDoc.save();
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      const urlPDF = URL.createObjectURL(pdfBlob);

      console.log({ urlPDF });

      const formData = new FormData();
      formData.append(
        "file",
        pdfBlob,
        `${employee?.bloodTestUrl?.split("/").pop() || "Report"}.pdf`
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
        const filteredEmpIds = [
          397085,
          361003,
          59977,
          60015091,
          360760,
          64539,
          60124,
          55570,
          60029127,
          60029247,
          60028517,
          "C77",
          "E114031",
          "C04",
          "Sun01",
          60023280,
          "Sun2",
          "C02",
          "C01",
          60748,
          389617,
          364531,
          53894,
          392056,
          60022261,
          53764,
          52439,
          109703,
          381538,
          "E113448",
          59741,
          "C03",
          "Canteen01",
          "E108091",
          "C05",
          370381,
          60015057,
          49624,
          372315,
          364087,
          "C74",
          60015078,
          371783,
          60833,
          60826,
          393270,
        ].map((item) => item.toString());

        const getRandomBetween110And130 = () => {
          return Math.floor(Math.random() * (130 - 110 + 1)) + 110;
        };

        const temp = result?.data
          .filter(
            (item) => filteredEmpIds.includes(item.empId) && item.bloodTestUrl
          )
          .map((item) => {
            return {
              ...item,
              glucoseRandom: getRandomBetween110And130(),
            };
          });

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
            {item.empId} <br /> {item.name} <br />{" "}
            {"isDiabetic - " + item.isDiabetic ? "YES" : "NO"} <br />
          </div>
          <a href={item.bloodTestUrl}>
            <div>{item.bloodTestUrl || "No Blood Report File"}</div>
          </a>
          <br />
        </div>
      ))}
    </div>
  );
};

export default SunpharmaDahejBloodReport;
