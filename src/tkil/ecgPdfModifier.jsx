import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import normalEcg from "./normalEcg.png";
import { sortDataByName } from "../assets/utils";
import { getData } from "../assets/services/GetApiCall";

import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { useSnackbar } from "notistack";

// ✅ Load official PDF.js build + worker from CDN dynamically
async function loadPdfJs() {
  const pdfjsLib = await import(
    "https://mozilla.github.io/pdf.js/build/pdf.mjs"
  );
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
  return pdfjsLib;
}

async function findLinePosition(pdfUrl, searchText) {
  const pdfjsLib = await loadPdfJs();
  const loadingTask = pdfjsLib.getDocument(pdfUrl);
  const pdf = await loadingTask.promise;

  const numPages = pdf.numPages;
  const searchLower = searchText.toLowerCase();

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Group fragments by line (rounded Y)
    const lines = {};
    for (const item of textContent.items) {
      const [x, y] = item.transform.slice(4, 6);
      const roundedY = Math.round(y);
      if (!lines[roundedY]) lines[roundedY] = [];
      lines[roundedY].push({ x, y, text: item.str });
    }

    // Combine text fragments per line and search
    for (const [yKey, parts] of Object.entries(lines)) {
      parts.sort((a, b) => a.x - b.x);
      const lineText = parts.map((p) => p.text).join("");
      const lineLower = lineText.toLowerCase();

      if (lineLower.includes(searchLower)) {
        // ✅ Found the line with “Interpretations :”
        const matchIndex = lineLower.indexOf(searchLower);

        // Find which fragment contains the first letter “I”
        let runningLength = 0;
        let xOfI = parts[0].x;

        for (const p of parts) {
          const len = p.text.length;
          if (runningLength + len > matchIndex) {
            // The “I” is in this fragment
            xOfI = p.x;
            break;
          }
          runningLength += len;
        }

        const foundY = Number(yKey);
        await pdf.destroy();
        console.log(
          `Found "${searchText}" on page ${pageNum} — I at X=${xOfI.toFixed(
            2
          )}, baseline Y=${foundY}`
        );
        return { x: xOfI, y: foundY, pageNum };
      }
    }
  }

  await pdf.destroy();
  return null;
}

// ✅ Modify ECG PDF: draw 50px-high rectangle below "Interpretations :" line and write text "Normal ECG"
async function modifyEcgPdf(ecgUrl) {
  const found = await findLinePosition(ecgUrl, "Interpretations :");
  if (!found) {
    alert("Could not find 'Interpretations :' in the ECG PDF!");
    return null;
  }

  const { x: leftX, y: targetY, pageNum } = found;
  const pdfBytes = await fetch(ecgUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[pageNum - 1];

  const rectHeight = 65;
  const rectWidth = 260;
  const rectY = targetY - rectHeight - 5;
  const rectX = leftX - 2; // start slightly before "I"

  page.drawRectangle({
    x: rectX,
    y: rectY + 2,
    width: rectWidth,
    height: rectHeight,
    color: rgb(1, 1, 1),
  });

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const text = "Normal ECG";
  const textSize = 12;
  const textWidth = font.widthOfTextAtSize(text, textSize);

  page.drawText(text, {
    x: rectX + 10, // offset from left (center-ish)
    y: rectY + 45 + 15, // vertically centered
    size: 9.5,
    color: rgb(0, 0, 0), // black text
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
  });

  const modifiedPdfBytes = await pdfDoc.save();
  const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
  return blob;
}

// ✅ React Component
const EcgPdfModifier = ({
  corpId = "b1821b42-807b-419e-8969-3e500d636f4b",
  campCycleId = "345079",
  fileType = "ECG",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  // Fetch employee list
  const fetchListOfEmployees = async () => {
    const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);
    if (result && result.data) {
      const temp = result?.data?.filter((item) => item.ecgUrl);
      const sorted = sortDataByName(temp);
      setList(sorted);
      console.log("Total PFT employees:", sorted.length);
      setTotalEmployees(sorted.length);
    } else {
      enqueueSnackbar("Error fetching employee list", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
  }, [corpId, campCycleId]);

  const handleEcgModify = async (data) => {
    try {
      const ecgUrl = data?.ecgUrl;
      if (!ecgUrl) {
        enqueueSnackbar("Missing ECG URL!", { variant: "warning" });
        return;
      }

      // Step 1️⃣: Detect where “Interpretations :” appears
      const found = await findLinePosition(ecgUrl, "Interpretations :");
      if (!found) {
        alert("Could not find 'Interpretations :' in the ECG PDF!");
        return;
      }

      console.log("Detected line position:", found);

      // Step 2️⃣: Modify the ECG PDF (add rectangle + text)
      const modifiedBlob = await modifyEcgPdf(ecgUrl, found);

      // Step 3️⃣: Preview the modified PDF (optional)
      //   const previewUrl = URL.createObjectURL(modifiedBlob);
      //   window.open(previewUrl, "_blank");

      // Step 4️⃣: (Optional) Upload the modified PDF back to server

      const formData = new FormData();
      formData.append("file", modifiedBlob, `ECG_${data?.empId}.pdf`);

      const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;

      const result = await uploadFile(uploadUrl, formData);

      if (result && result.data) {
        enqueueSnackbar("Successfully Uploaded Modified ECG PDF!", {
          variant: "success",
        });
        setUploadedCount((prevCount) => prevCount + 1);
      } else {
        enqueueSnackbar("Upload failed!", { variant: "error" });
      }
    } catch (err) {
      console.error("Error modifying/uploading ECG PDF:", err);
      enqueueSnackbar("Error modifying/uploading ECG PDF!", {
        variant: "error",
      });
    }
  };

  const handleGeneratePDFs = async () => {
    for (let i = 0; i < list.length; i++) {
      await handleEcgModify(list[i], i);
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
      <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
      <button onClick={handleDeletePDF}>Delete Files</button>
      <div>Total Employees: {totalEmployees}</div> <br />
      <div>Uploaded Files: {uploadedCount}</div> <br />
      {list.map((item, index) => (
        <div key={index} style={{ display: "flex" }}>
          <div key={index}>{`${index}- ${item.empId} ${item.name}`}</div>
          <a href={item.ecgUrl}>
            <div key={index}>{item.ecgUrl}</div>
          </a>
          <br />
        </div>
      ))}
    </div>
  );
};

export default EcgPdfModifier;
