import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getData } from "../assets/services/GetApiCall";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";
import { useSnackbar } from "notistack";

/* =========================================================
   FILE CONFIG
========================================================= */
const FILE_CONFIG = {
  BLOODTEST: {
    urlKey: "bloodTestUrl",
    fileType: "BLOODTEST",
  },
  PFT: {
    urlKey: "pftUrl",
    fileType: "PFT",
  },
  AUDIOMETRY: {
    urlKey: "audiometryUrl",
    fileType: "AUDIOMETRY",
  },
};

/* =========================================================
   DATE CONFIG (LABEL + OFFSETS)
========================================================= */
const DATE_CONFIG = {
  AUDIOMETRY: [{ label: "Registration Date", xOffset: 74, whiteWidth: 140 }],

  PFT: [{ label: "Date", xOffset: 45, whiteWidth: 140 }],

  BLOODTEST: [
    { label: "Registered On", xOffset: 115, whiteWidth: 59 },
    { label: "Sample Collected On", xOffset: 115, whiteWidth: 59 },
    { label: "Sample Reported On", xOffset: 115, whiteWidth: 57 },
  ],
};

const DRAW_CONFIG = {
  AUDIOMETRY: {
    yOffset: 0,
    whiteHeightExtra: 1,
    textYOffset: 0,
    textSize: 9,
  },

  PFT: {
    yOffset: -2, // 👈 PFT baseline fix
    whiteHeightExtra: 1, // 👈 covers full date + time
    textYOffset: 1, // 👈 aligns text perfectly
    textSize: 9,
  },

  BLOODTEST: {
    yOffset: -2,
    whiteHeightExtra: 1,
    textYOffset: 1,
    textSize: 9,
  },
};

/* =========================================================
   LOAD PDF.JS
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
   FIND LABEL POSITION
========================================================= */
async function findLabelPosition(pdfUrl, labelText) {
  const pdfjsLib = await loadPdfJs();
  const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
  const page = await pdf.getPage(1);
  const textContent = await page.getTextContent();

  for (const item of textContent.items) {
    const text = item.str?.trim();
    if (text && text.startsWith(labelText)) {
      const [x, y] = item.transform.slice(4, 6);
      await pdf.destroy();
      return { x, y, height: item.height || 10 };
    }
  }

  await pdf.destroy();
  return null;
}

/* =========================================================
   REPLACE DATE IN PDF
========================================================= */
async function replaceDateInPdf({ pdfUrl, fileType, customDate }) {
  const configs = DATE_CONFIG[fileType];
  if (!configs) return null;

  const pdfBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[0];
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const cfg of configs) {
    const labelPos = await findLabelPosition(pdfUrl, cfg.label);
    if (!labelPos) continue;

    const drawCfg = DRAW_CONFIG[fileType] || DRAW_CONFIG.BLOODTEST;

    const VALUE_X = labelPos.x + cfg.xOffset + 3;
    const VALUE_Y = labelPos.y + drawCfg.yOffset;

    // WHITE OUT OLD DATE (AND TIME)
    page.drawRectangle({
      x: VALUE_X,
      y: VALUE_Y,
      width: cfg.whiteWidth,
      height: labelPos.height + drawCfg.whiteHeightExtra,
      color: rgb(1, 1, 1),
    });

    // DRAW NEW DATE
    page.drawText(customDate, {
      x: VALUE_X + 3,
      y: VALUE_Y + drawCfg.textYOffset,
      size: drawCfg.textSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  return new Blob([await pdfDoc.save()], { type: "application/pdf" });
}

/* =========================================================
   PROCESS EMPLOYEE FILES
========================================================= */
async function processEmployee({
  employee,
  corpId,
  campCycleId,
  enqueueSnackbar,
  customDate,
}) {
  for (const key of Object.keys(FILE_CONFIG)) {
    const config = FILE_CONFIG[key];
    const pdfUrl = employee?.[config.urlKey];
    if (!pdfUrl) continue;

    try {
      const modifiedBlob = await replaceDateInPdf({
        pdfUrl,
        fileType: config.fileType,
        customDate,
      });

      if (!modifiedBlob) {
        enqueueSnackbar(`Date not found in ${key} (${employee.empId})`, {
          variant: "warning",
        });
        continue;
      }

      // const url2 = URL.createObjectURL(modifiedBlob);
      // window.open(url2, "_blank");

      const originalFileName =
        employee?.[config.urlKey]?.split("/")?.pop() ||
        `${key}_${employee.empId}.pdf`;

      const formData = new FormData();
      formData.append("file", modifiedBlob, originalFileName);

      const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${employee.empId}&fileType=${config.fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
      await uploadFile(uploadUrl, formData);
      enqueueSnackbar(`${key} uploaded for ${employee.empId}`, {
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      enqueueSnackbar(`${key} failed for ${employee.empId}`, {
        variant: "error",
      });
    }
  }
}

/* =========================================================
   MAIN COMPONENT
========================================================= */
const AartiCustomDateOnReport = ({
  corpId = "058c1ace-4ade-4dab-a13e-4f75c49339f2",
  campCycleId = "369186",
  CUSTOM_DATE = "29-Dec-2025",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [employees, setEmployees] = useState([]);
  const [processed, setProcessed] = useState(0);

  useEffect(() => {
    const fetchEmployees = async () => {
      const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
      const res = await getData(url);

      const filtered =
        res?.data?.filter(
          (item) =>  [
            "54201590",
            "54201380",
            "54201620",
            "54201276",
            "54201609",
            "54201578",
            "54201510",
            "54201505",
            "54201451",
            "54201367",
            "54201291",
            "54201350",
            "54201386",
            "542021128",
            "54207409",
            "54201384",
            "54101463",
            "54201548",
            "54201667",
            "54201692",
            "54201244",
            "54201366",
            "54201311",
            "54201283",
            "54201671",
            "54201597",
            "54201528",
            "PEM-800",
            "54201273"
          ].includes(item?.empId)
          
          // item?.bloodTestUrl || item?.pftUrl || item?.audiometryUrl
        ) || [];

      setEmployees(sortDataByName(filtered));
    };

    fetchEmployees();
  }, [corpId, campCycleId]);

  const handleStart = async () => {
    for (let i = 0; i < employees.length; i++) {
      await processEmployee({
        employee: employees[i],
        corpId,
        campCycleId,
        enqueueSnackbar,
        customDate: CUSTOM_DATE,
      });
      setProcessed((p) => p + 1);
    }
  };

  return (
    <div>
      <button onClick={handleStart}>
        Modify & Upload DATE (Blood + PFT + Audiometry)
      </button>

      <div>Total Employees: {employees.length}</div>
      <div>Processed: {processed}</div>

      {employees.map((e, i) => (
        <div key={i}>
          {i + 1}. {e.empId} - {e.name} isPFT:{e?.pftUrl ? "Yes" : "No"}{" "}
          isAudio:{e?.audiometryUrl ? "Yes" : "No"} isBlood:
          {e?.bloodTestUrl ? "Yes" : "No"} {e?.bloodTestUrl}
        </div>
      ))}
    </div>
  );
};

export default AartiCustomDateOnReport;
