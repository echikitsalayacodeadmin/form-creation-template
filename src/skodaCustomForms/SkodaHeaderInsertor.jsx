import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import drRaviHeaderSkoda from "../assets/images/drRaviHeaderSkoda.png";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import { sortDataByName } from "../assets/utils";
import { getData } from "../assets/services/GetApiCall";
import { PDFDocument, rgb } from "pdf-lib";
import { uploadFile } from "../assets/services/PostApiCall";

async function removeAddressFromHeaderInReport(reportPdfBytes) {
  const reportPdf = await PDFDocument.load(reportPdfBytes);
  const mergedPdf = await PDFDocument.create();

  const [page] = await mergedPdf.copyPages(reportPdf, [0]);
  const { width, height } = page.getSize();

  // White-out from top of page till 90 height (full width)
  page.drawRectangle({
    x: 0,
    // Xray
    y: height - 105, // 90px down from top
    width: width, // full page width
    height: 105,

    // Form35
    // y: height - 75, // 90px down from top
    // width: width, // full page width
    // height: 75,

    color: rgb(1, 1, 1),
  });

  mergedPdf.addPage(page);
  return await mergedPdf.save();
}
async function mergeHeaderWithReport(reportPdfBytes) {
  const reportPdf = await PDFDocument.load(reportPdfBytes);
  const mergedPdf = await PDFDocument.create();

  // Import header image
  const headerImageBytes = await fetch(drRaviHeaderSkoda).then((res) =>
    res.arrayBuffer()
  );
  const headerImage = await mergedPdf.embedPng(headerImageBytes);

  const headerHeight = 90;

  // Get original page
  const [origPage] = await reportPdf.getPages();
  const { width, height } = origPage.getSize();

  // Embed original page as an embedded page
  const embeddedOrigPage = await mergedPdf.embedPage(origPage);

  // Create new single page output
  const newPage = mergedPdf.addPage([width, height]);

  // Draw header
  newPage.drawImage(headerImage, {
    x: 0,
    y: height - headerHeight,
    width,
    height: headerHeight,
  });

  // Draw the original content shifted down
  newPage.drawPage(embeddedOrigPage, {
    x: 0,
    y: 0,
    width,
    height: height - headerHeight,
  });

  return await mergedPdf.save();
}

const SkodaHeaderInsertor = ({
  corpId = "35693879-486b-44b6-8a6a-15d57f111a08",
  campCycleId = "355289",
  // fileType = "FORM_35",
  // urlType = "form35Url",
  fileType = "XRAY",
  urlType = "xrayUrl",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const batchSize = 50;
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [processType, setProcessType] = useState("add");

  const generatePDF = async (data, index) => {
    try {
      const pdfUrl = data?.[urlType];
      if (!pdfUrl) {
        console.warn("No PDF found for:", data.empId);
        return;
      }
      const res = await fetch(pdfUrl);
      if (!res.ok) throw new Error("Failed fetching PDF");

      const reportBuffer = await res.arrayBuffer();
      let finalBytes;

      if (processType === "add") {
        console.log("Adding Header...");
        finalBytes = await mergeHeaderWithReport(reportBuffer);
      } else if (processType === "remove") {
        console.log("Removing Address from Header...");
        finalBytes = await removeAddressFromHeaderInReport(reportBuffer);
      }

      const mergedBlob = new Blob([finalBytes], { type: "application/pdf" });

      //   STEP 4 — Upload the merged file
      const formData = new FormData();
      formData.append(
        "file",
        mergedBlob,
        `${data?.[urlType]?.split("/").pop() || "Report"}`
      );

      //   const url2 = URL.createObjectURL(mergedBlob);
      //   window.open(url2, "_blank");

      const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await uploadFile(url, formData);

      if (result && result.data) {
        enqueueSnackbar("Successfully Uploaded Merged PDF!", {
          variant: "success",
        });
        setUploadedCount((prevCount) => prevCount + 1);
      } else {
        enqueueSnackbar("An error Occurred!", { variant: "error" });
      }
    } catch (error) {
      console.error("Error generating/uploading merged PDF:", error);
      enqueueSnackbar("Error generating/uploading merged PDF", {
        variant: "error",
      });
    }
  };
  const fetchListOfEmployees = async () => {
    // const url = `https://apibackend.uno.care/api/org/detailed/all?corpId=${corpId}&campCycleId=${campCycleId}`;
    const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);
    if (result && result.data) {
      console.log("Fetched Data successfully");
      // "710069",
      // const codes = [
      //   // "610931",
      //   // "40030309",
      //   // "40035005",
      //   // "40030020",
      //   // "40030981",
      //   // "40030960",
      //   // "40031130",
      //   // "40036934",
      //   // "40035572",
      //   // "40035425",
      //   // "40032018",
      //   // "40035298",
      //   // "40030310",
      //   // "40036016",
      //   // "40035718",
      //   // "40030518",
      //   // "40035337",
      //   // "40036397",
      //   // "40031666",
      //   // "40036191",
      //   // "40030280",
      //   // "40030250",
      //   // "40035094",
      //   // "40035965",
      //   // "40036205",
      //   // "40000599",
      //   // "40035163",
      //   // "40036471",
      //   // "40037488",
      //   // "40035948",
      //   // "40035524",
      //   // "40035024",
      //   // "40035167",
      //   // "40035188",
      //   // "40050711",
      //   // "40037950",
      //   // "40051110",
      //   // "40036592",
      //   // "40036396",
      //   // "40031166",
      //   // "40035199",
      //   // "40031589",
      //   // ;;;
      //   // "40031130",
      //   // "40036934",
      //   // "40035572",
      //   // "40035425",
      //   // "40035188",
      //   // "40031589",
      // ];

      //   const temp = result?.data.filter((item) => codes.includes(item.empId));

      const codes = [
        "40035733",
        "40035431",
        "40036332",
        "40036568",
        "40035744",
        "40035135",
        "40035517",
        "40035702",
        "40035946",
      ];
      // const codes2 = ["40036236", "40035085", "40036292", "40035514"];

      const temp = result?.data.filter(
        (item) => item?.vitalsCreatedDate === "2025-11-20" && item?.[urlType]
        // !codes.includes(item?.empId)
        // codes2?.includes(item?.empId)
      );

      console.log({ list: temp.map((item) => item.empId).join(",") });
      const length = temp.length;
      console.log({ length });
      setList(sortDataByName(temp));
      setTotalEmployees(temp.length);
      console.log({ empLisy: sortDataByName(temp) });
    } else {
      console.log("An error Occurred");
    }
  };
  useEffect(() => {
    fetchListOfEmployees();
  }, []);

  const handleGeneratePDFs = async () => {
    for (let i = 0; i < list.length; i++) {
      await generatePDF(list[i], i);
    }
  };
  const handleDeletePDF = async () => {
    for (let i = 0; i < list.length; i++) {
      await deleteFiles(list[i]);
    }
  };

  const deleteFiles = async (data) => {
    const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;
    const result = await updateData(url);
    if (result && result.data) {
      enqueueSnackbar("Successfully Uploaded PDF!", {
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
      <div>
        <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
        <button onClick={handleDeletePDF}>Delete Files</button>
        <div>
          <label style={{ fontWeight: "bold" }}>Select Processing Type: </label>

          <select
            value={processType}
            onChange={(e) => setProcessType(e.target.value)}
            style={{ marginBottom: "10px" }}
          >
            <option value="add">Add Header</option>
            <option value="remove">Remove Address</option>
          </select>
        </div>
        <div>Total Employees: {totalEmployees}</div> <br />
        <div>Uploaded Files: {uploadedCount}</div> <br />
        {list.map((item, index) => (
          <div key={index} style={{ display: "flex" }}>
            <div key={index}>{`${index}- ${item.empId} ${item.name}`}</div>

            <a href={item?.[urlType]}>
              <div key={index}>{item?.[urlType]}</div>
            </a>

            <br />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkodaHeaderInsertor;
