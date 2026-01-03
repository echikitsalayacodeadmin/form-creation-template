import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import { useSnackbar } from "notistack";
import dayjs from "dayjs";

/* =========================================================
   FILE CONFIG (Offsets differ per report)
========================================================= */
const FILE_CONFIG = {
  ECG: {
    urlKey: "ecgUrl",
    fileType: "ECG",
    xOffset: 40,
    whiteWidth: 15,
  },
  PFT: {
    urlKey: "pftUrl",
    fileType: "PFT",
    xOffset: 47,
    whiteWidth: 20,
  },
  AUDIOMETRY: {
    urlKey: "audiometryUrl",
    fileType: "AUDIOMETRY",
    xOffset: 20,
    whiteWidth: 30,
  },
};

/* =========================================================
   PDF.JS LOADER
========================================================= */
async function loadPdfJs() {
  const pdfjsLib = await import(
    "https://mozilla.github.io/pdf.js/build/pdf.mjs"
  );
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
  return pdfjsLib;
}

/* =========================================================
   FIND AGE LABEL POSITION
========================================================= */
async function findAgeLabelPosition(pdfUrl) {
  const pdfjsLib = await loadPdfJs();
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();

  for (const item of textContent.items) {
    const text = item.str?.trim();
    if (text && text.startsWith("Age")) {
      const [x, y] = item.transform.slice(4, 6);
      await pdf.destroy();
      return { x, y, height: item.height || 10 };
    }
  }

  await pdf.destroy();
  return null;
}

/* =========================================================
   REPLACE AGE IN PDF
========================================================= */
async function replaceAgeInPdf({
  pdfUrl,
  newAge,
  xOffset,
  whiteWidth,
  fileType,
}) {
  const ageLabel = await findAgeLabelPosition(pdfUrl);
  if (!ageLabel) return null;

  const pdfBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[0];

  const VALUE_X = ageLabel.x + xOffset;
  const VALUE_Y = ageLabel.y;

  page.drawRectangle({
    x: VALUE_X,
    y: VALUE_Y,
    width: whiteWidth,
    height: ageLabel.height + 3,
    color: rgb(1, 1, 1),
  });

  const textX = fileType === "PFT" ? VALUE_X + 3 + 5 : VALUE_X + 3;

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  page.drawText(newAge, {
    x: textX,
    y: VALUE_Y,
    size: 9,
    font,
    color: rgb(0, 0, 0),
  });

  return new Blob([await pdfDoc.save()], { type: "application/pdf" });
}

/* =========================================================
   PROCESS ALL FILES FOR ONE EMPLOYEE
========================================================= */
async function processEmployee({
  employee,
  corpId,
  campCycleId,
  enqueueSnackbar,
  age,
}) {
  for (const key of Object.keys(FILE_CONFIG)) {
    const config = FILE_CONFIG[key];
    const pdfUrl = employee?.[config.urlKey];
    if (!pdfUrl) continue;

    try {
      const modifiedBlob = await replaceAgeInPdf({
        pdfUrl,
        newAge: age,
        xOffset: config.xOffset,
        whiteWidth: config.whiteWidth,
        fileType: config.fileType,
      });

      if (!modifiedBlob) {
        enqueueSnackbar(`Age not found in ${key} for ${employee.empId}`, {
          variant: "warning",
        });
        continue;
      }

      const formData = new FormData();
      formData.append("file", modifiedBlob, `${key}_${employee.empId}.pdf`);

      // const previewUrl = URL.createObjectURL(modifiedBlob);
      // window.open(previewUrl, "_blank");

      const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${employee.empId}&fileType=${config.fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;

      await uploadFile(uploadUrl, formData);

      enqueueSnackbar(`${key} uploaded for ${employee.empId}`, {
        variant: "success",
      });
    } catch (err) {
      console.error(`${key} failed`, err);
      enqueueSnackbar(`${key} failed for ${employee.empId}`, {
        variant: "error",
      });
    }
  }
}

/* =========================================================
   MAIN COMPONENT
========================================================= */
const ReplaceAgeAllReports = ({
  corpId = "35693879-486b-44b6-8a6a-15d57f111a08",
  campCycleId = "355289",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [employees, setEmployees] = useState([]);
  const [processed, setProcessed] = useState(0);

  useEffect(() => {
    const fetchEmployees = async () => {
      const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
      const res = await getData(url);

      // const excludedDates = ["2025-11-19", "2025-11-18", "2025-11-17"];
      // const includedDates = ["2025-12-01", "2025-12-02"];

      // const filteredData =
      //   res?.data?.filter(
      //     (item) =>
      //       // ["40030981", "40032255", "611024"].includes(item?.empId) &&
      //       includedDates.includes(item?.vitalsCreatedDate) &&
      //       item?.bloodTestUrl
      //   ) || [];

      const filteredData =
        res?.data?.filter(
          (item) =>
            item?.bloodTestUrl &&
            dayjs(item.vitalsCreatedDate).isAfter("2025-11-30")
        ) || [];

      setEmployees(sortDataByName(filteredData));
    };
    fetchEmployees();
  }, [corpId, campCycleId]);

  const handleStart = async () => {
    for (let i = 0; i < employees?.length; i++) {
      await processEmployee({
        employee: employees[i],
        corpId,
        campCycleId,
        enqueueSnackbar,
        age: employees[i]?.cholestrolData?.["AGE"] || employees[i]?.age,
      });
      setProcessed((p) => p + 1);
    }
  };

  return (
    <div>
      <button onClick={handleStart}>
        Modify & Upload ECG + PFT + AUDIOMETRY
      </button>

      <div>Total Employees: {employees.length}</div>
      <div>Processed: {processed}</div>

      {employees.map((e, i) => (
        <div key={i}>
          {i + 1}. {e.empId} - {e.name}{" "}
          {employees[i]?.cholestrolData?.["AGE"] || "_"}
        </div>
      ))}
    </div>
  );
};

export default ReplaceAgeAllReports;
