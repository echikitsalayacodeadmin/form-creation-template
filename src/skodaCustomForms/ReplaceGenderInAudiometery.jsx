import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { sortDataByName } from "../assets/utils";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";

// Utility to dynamically load pdf.js for text search
async function loadPdfJs() {
  const pdfjsLib = await import(
    "https://mozilla.github.io/pdf.js/build/pdf.mjs"
  );
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
  return pdfjsLib;
}

// Find "Gender" label ("Gender :", "Gender:", "Gender") and value position on PDF Page 1
async function findGenderLabelAndValuePosition(pdfUrl) {
  const pdfjsLib = await loadPdfJs();
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();

  let genderLabel = null;
  let genderValue = null;

  // Scan for "Gender"
  for (let i = 0; i < textContent.items.length; i++) {
    const item = textContent.items[i];
    const text = (item.str || "").trim();

    if (
      text === "Gender" ||
      text.startsWith("Gender:") ||
      text.startsWith("Gender :") ||
      text.includes("Gender")
    ) {
      const [labelX, labelY] = item.transform.slice(4, 6);

      // CASE 1: Label and value are in the SAME text item
      // e.g. "Gender : Male" (as in 79 (3).pdf)
      if (text.includes(":")) {
        const parts = text.split(":");
        const afterColon = parts[1] || "";
        const valueToken = afterColon.trim().split(/\s+/)[0]; // "Male", "Female", "M", "F", etc.

        if (valueToken) {
          const fullWidth = item.width || 40;
          const valueIndex = text.indexOf(valueToken);
          const ratio =
            valueIndex > 0 && text.length > 0
              ? valueIndex / text.length
              : 0.6; // fallback rough ratio

          const approxValueX = labelX + fullWidth * ratio;

          genderLabel = {
            x: labelX,
            y: labelY,
            width: item.width,
            height: item.height || 10,
            label: text,
          };

          genderValue = {
            x: approxValueX,
            y: labelY,
            width: fullWidth * (valueToken.length / Math.max(text.length, 1)),
            height: item.height || 10,
            value: valueToken,
            label: text,
          };

          break;
        }
      }

      // CASE 2: Label and value are separate text items
      // Check if value is immediately after on same line (based on transform matrix)
      for (let j = i + 1; j < Math.min(i + 4, textContent.items.length); j++) {
        const next = textContent.items[j];
        const nextText = (next.str || "").trim();
        const [nextX, nextY] = next.transform.slice(4, 6);

        if (
          nextText.length &&
          Math.abs(nextY - labelY) < 2 &&
          nextX > labelX
        ) {
          genderValue = {
            x: nextX,
            y: nextY,
            width: next.width,
            height: next.height || 10,
            value: nextText,
            label: text,
          };
          genderLabel = {
            x: labelX,
            y: labelY,
            width: item.width,
            height: item.height || 10,
            label: text,
          };
          break;
        }
      }

      if (genderValue) break;
    }
  }

  await pdf.destroy();

  if (genderLabel && genderValue) {
    // For debugging
    console.log("Gender label pos:", genderLabel, "Gender value pos:", genderValue);
    return { label: genderLabel, value: genderValue };
  }
  return null;
}

// Replace the gender value in the PDF by drawing a white rectangle and new value at detected position
async function replaceGenderField(audiometryUrl, newGender = "Female") {
  const found = await findGenderLabelAndValuePosition(audiometryUrl);

  if (!found) {
    // Overriding with the custom alert as per context and user's prompt
    alert("Gender label/value not found in 79 (3).pdf (PDF may not be searchable or has changed layout).");
    return null;
  }

  const pdfBytes = await fetch(audiometryUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[0];

  // Whiten out the actual gender value (be broad, for 'M', 'F', 'Male', 'Female', etc.)
  // Add a few px padding left/right
  const RECT_PAD = 4;
  page.drawRectangle({
    x: found.value.x - RECT_PAD,
    y: found.value.y,
    width: found.value.width + RECT_PAD * 2,
    height: found.value.height + 2,
    color: rgb(1, 1, 1),
  });

  // Write the new gender value, aligned with previous value
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.drawText(newGender, {
    x: found.value.x - 1,
    y: found.value.y,
    size: 9,
    font,
    color: rgb(0, 0, 0),
  });

  return new Blob([await pdfDoc.save()], { type: "application/pdf" });
}

// React component
const ReplaceGenderInAudiometery = ({
  corpId = "74b2de3a-07ae-46d1-8dec-0bee1523657a",
  campCycleId = "375501",
  fileType = "AUDIOMETRY",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  // Fetch employee data from API
  const fetchListOfEmployees = async () => {
    const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);

    if (result && result.data) {
      // Keep only those with an audiometry PDF and matching empId
      const temp = result?.data?.filter(
        (item) =>
          item.audiometryUrl &&
          [
            "3098", "2032", "2030", "2063", "2089", "91538", "91577", "91650",
            "3317", "03373", "2043", "2049", "3280", "2034", "2076", "2039",
            "3499", "2024", "2044", "2040", "2046", "3456",
          ].includes(item?.empId)
      );
      const sorted = sortDataByName(temp);
      setList(sorted);
      setTotalEmployees(sorted.length);
      console.log("Total Audio employees:", sorted.length);
    } else {
      enqueueSnackbar("Error fetching employee list", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
  }, [corpId, campCycleId]);

  const handleModifyPdf = async (data) => {
    try {
      const audiometryUrl = data?.audiometryUrl;
      if (!audiometryUrl) {
        enqueueSnackbar("Missing Audio URL!", { variant: "warning" });
        return;
      }
      // Try to rewrite gender field in their PDF – detects true gender value position
      const modifiedBlob = await replaceGenderField(audiometryUrl, "Female");

      if (!modifiedBlob) return;

      // Optional: show preview of result PDF
      // const previewUrl = URL.createObjectURL(modifiedBlob);
      // window.open(previewUrl, "_blank");

      // TODO: Uncomment to implement server upload if needed
      
      const formData = new FormData();
      formData.append("file", modifiedBlob, `AUDIOMETRY_${data?.empId}.pdf`);
      const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await uploadFile(uploadUrl, formData);
      if (result && result.data) {
        enqueueSnackbar("Successfully Uploaded Modified Audio PDF!", {
          variant: "success",
        });
        setUploadedCount((prevCount) => prevCount + 1);
      } else {
        enqueueSnackbar("Upload failed!", { variant: "error" });
      }
      
      setUploadedCount((prevCount) => prevCount + 1);
    } catch (err) {
      console.error("Error modifying/uploading Audio PDF:", err);
      enqueueSnackbar("Error modifying/uploading Audio PDF!", {
        variant: "error",
      });
    }
  };

  const handleGeneratePDFs = async () => {
    // For debugging/preview, only process the first employee
    for (let i = 0; i < list.length; i++) {
      await handleModifyPdf(list[i]);
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
      <button onClick={handleGeneratePDFs}>Start Generating</button> <br />
      <button onClick={handleDeletePDF}>Delete Files</button>
      <div>Total Employees: {totalEmployees}</div> <br />
      <div>Uploaded Files: {uploadedCount}</div> <br />
      {list.map((item, index) => (
        <div key={index} style={{ display: "flex" }}>
          <div>{`${index}- ${item.empId} ${item.name}`}</div>
          <a href={item.audiometryUrl}>
            <div>{item.audiometryUrl}</div>
          </a>
          <br />
        </div>
      ))}
    </div>
  );
};

export default ReplaceGenderInAudiometery;
