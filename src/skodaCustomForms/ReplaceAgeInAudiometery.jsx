import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import React, { useEffect, useState } from "react";
import { getData } from "../assets/services/GetApiCall";
import { sortDataByName } from "../assets/utils";
import { useSnackbar } from "notistack";
import { updateData } from "../assets/services/PatchApi";

async function loadPdfJs() {
  const pdfjsLib = await import(
    "https://mozilla.github.io/pdf.js/build/pdf.mjs"
  );
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
  return pdfjsLib;
}

async function findAgeLabelPosition(pdfUrl) {
  const pdfjsLib = await loadPdfJs();
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();

  for (const item of textContent.items) {
    const text = item.str?.trim();

    // ✅ THIS is the fix
    if (text && text.startsWith("Age")) {
      const [x, y] = item.transform.slice(4, 6);

      await pdf.destroy();
      console.log({ x, y, height: item.height || 10, text });
      return {
        x,
        y,
        height: item.height || 10,
        text, // helpful for debugging
      };
    }
  }

  await pdf.destroy();
  return null;
}

async function replaceAgeUsingOffset(audiometryUrl, newAge = "50") {
  const ageLabel = await findAgeLabelPosition(audiometryUrl);
  if (!ageLabel) {
    alert("Age label not found (text not searchable)");
    return null;
  }

  const pdfBytes = await fetch(audiometryUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[0];

  const VALUE_X = ageLabel.x + 20; // ✅ exactly what you wanted
  const VALUE_Y = ageLabel.y;

  // white out existing value
  page.drawRectangle({
    x: VALUE_X,
    y: VALUE_Y,
    width: 30,
    height: ageLabel.height + 4,
    color: rgb(1, 1, 1),
  });

  // draw new age
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.drawText(newAge, {
    x: VALUE_X + 3,
    y: VALUE_Y,
    size: 9,
    font,
    color: rgb(0, 0, 0),
  });

  return new Blob([await pdfDoc.save()], { type: "application/pdf" });
}

// ✅ React Component
const ReplaceAgeInAudiometery = ({
  corpId = "35693879-486b-44b6-8a6a-15d57f111a08",
  campCycleId = "355289",
  fileType = "AUDIOMETRY",
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
      const temp = result?.data?.filter((item) => item.audiometryUrl);
      const sorted = sortDataByName(temp);
      setList(sorted);
      console.log("Total Audio employees:", sorted.length);
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
      const audiometryUrl = data?.audiometryUrl;
      if (!audiometryUrl) {
        enqueueSnackbar("Missing Audio URL!", { variant: "warning" });
        return;
      }

      // Step 1️⃣: Detect where “Interpretations :” appears
      const found = await findAgeLabelPosition(audiometryUrl);
      if (!found) {
        alert("Could not find 'Age :' in the Audio PDF!");
        return;
      }

      console.log("Detected line position:", found);

      // Step 2️⃣: Modify the ECG PDF (add rectangle + text)
      const modifiedBlob = await replaceAgeUsingOffset(
        data.audiometryUrl,
        "50"
      );

      // Step 3️⃣: Preview the modified PDF (optional)
      const previewUrl = URL.createObjectURL(modifiedBlob);
      window.open(previewUrl, "_blank");

      // Step 4️⃣: (Optional) Upload the modified PDF back to server

      //   const formData = new FormData();
      //   formData.append("file", modifiedBlob, `ECG_${data?.empId}.pdf`);

      //   const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;

      //   const result = await uploadFile(uploadUrl, formData);

      //   if (result && result.data) {
      //     enqueueSnackbar("Successfully Uploaded Modified ECG PDF!", {
      //       variant: "success",
      //     });
      setUploadedCount((prevCount) => prevCount + 1);
      //   } else {
      //     enqueueSnackbar("Upload failed!", { variant: "error" });
      //   }
    } catch (err) {
      console.error("Error modifying/uploading ECG PDF:", err);
      enqueueSnackbar("Error modifying/uploading ECG PDF!", {
        variant: "error",
      });
    }
  };

  const handleGeneratePDFs = async () => {
    for (let i = 0; i < 10; i++) {
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
          <a href={item.audiometryUrl}>
            <div key={index}>{item.audiometryUrl}</div>
          </a>
          <br />
        </div>
      ))}
    </div>
  );
};

export default ReplaceAgeInAudiometery;
