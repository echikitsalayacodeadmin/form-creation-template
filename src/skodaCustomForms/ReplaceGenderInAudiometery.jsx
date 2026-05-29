import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { sortDataByName } from "../assets/utils";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";

/* ===================== PDF.JS LOADER ===================== */
async function loadPdfJs() {
  const pdfjsLib = await import(
    "https://mozilla.github.io/pdf.js/build/pdf.mjs"
  );
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
  return pdfjsLib;
}

/* ===================== FIND GENDER POSITION ===================== */
// Find "Gender" label ("Gender :", "Gender:", "Gender") and value on PDF page 1
async function findGenderLabelAndValuePosition(pdfUrl) {
  const pdfjsLib = await loadPdfJs();
  const pdfBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer());
  const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
  const pdf = await loadingTask.promise;

  try {
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();

    let genderLabel = null;
    let genderValue = null;

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

        // CASE 1: Label and value in the same text item — e.g. "Gender : Male"
        if (text.includes(":")) {
          const parts = text.split(":");
          const afterColon = parts[1] || "";
          const valueToken = afterColon.trim().split(/\s+/)[0];

          if (valueToken) {
            const fullWidth = item.width || 40;
            const valueIndex = text.indexOf(valueToken);
            const ratio =
              valueIndex > 0 && text.length > 0
                ? valueIndex / text.length
                : 0.6;

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
              width:
                fullWidth * (valueToken.length / Math.max(text.length, 1)),
              height: item.height || 10,
              value: valueToken,
              label: text,
            };

            break;
          }
        }

        // CASE 2: Label and value are separate text items on the same line
        for (
          let j = i + 1;
          j < Math.min(i + 4, textContent.items.length);
          j++
        ) {
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

    if (genderLabel && genderValue) {
      console.log(
        "Gender label pos:",
        genderLabel,
        "Gender value pos:",
        genderValue
      );
      return { label: genderLabel, value: genderValue };
    }
    return null;
  } finally {
    loadingTask.destroy();
  }
}

/* ===================== MODIFY PDF ===================== */
async function replaceGenderField(audiometryUrl, newGender = "Female") {
  const found = await findGenderLabelAndValuePosition(audiometryUrl);
  if (!found) {
    alert("Gender label/value not found (text not searchable or layout changed).");
    return null;
  }

  const pdfBytes = await fetch(audiometryUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[0];

  const RECT_PAD = 4;
  page.drawRectangle({
    x: found.value.x - RECT_PAD,
    y: found.value.y,
    width: found.value.width + RECT_PAD * 2,
    height: found.value.height + 2,
    color: rgb(1, 1, 1),
  });

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

/* ===================== REACT COMPONENT ===================== */
const ReplaceGenderInAudiometery = ({
  corpId = "d84ed8d1-7d31-484d-82dd-59b79858a506",
  campCycleId = "415614",
  fileType = "AUDIOMETRY",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  const fetchListOfEmployees = async () => {
    const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);

    if (result && result.data) {
      const temp = result?.data?.filter(
        (item) =>
          item.audiometryUrl &&
          [
            "5485",
            "5523",
            "KH28",
            "5027",
            "5683",
            "5697",
            "5643",
            "5669",
            "5615",
            "5684",
            "5677",
            "5681",
            "5716",
            "5695",
            "5620",
            "5608",
            "5717",
            "5673",
            "5657",
            "5718",
            "5704",
            "5612",
            "5693",
            "5688",
            "5705",
            "5487",
            "5360",
            "5009",
            "5553",
            "5561",
            "5217",
            "5024",
            "5513",
            "5530",
            "5452",
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

      // Step 1: Detect gender label/value position
      const found = await findGenderLabelAndValuePosition(audiometryUrl);
      if (!found) {
        alert("Could not find Gender field in the Audio PDF!");
        return;
      }
      console.log("Detected gender position:", found);

      // Step 2: Modify the Audio PDF (white-out + new text)
      const modifiedBlob = await replaceGenderField(audiometryUrl, "Female");
      if (!modifiedBlob) return;

      // Step 3: Preview the modified PDF (optional)
      // const previewUrl = URL.createObjectURL(modifiedBlob);
      // window.open(previewUrl, "_blank");

      // Step 4: Upload the modified PDF
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
    } catch (err) {
      console.error("Error modifying/uploading Audio PDF:", err);
      enqueueSnackbar("Error modifying/uploading Audio PDF!", {
        variant: "error",
      });
    }
  };

  const handleGeneratePDFs = async () => {
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
