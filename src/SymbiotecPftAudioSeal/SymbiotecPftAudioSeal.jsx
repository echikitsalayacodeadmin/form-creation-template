import React, { useEffect, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { getData } from "../assets/services/GetApiCall";
import { sortDataByName } from "../assets/utils";
import Dr_Jaydip_Saxena from "../assets/images/Dr_Jaydip_Saxena.png";
import { useSnackbar } from "notistack";
import { uploadFile } from "../assets/services/PostApiCall";

/* =========================================================
   FILE CONFIG
========================================================= */

const FILE_CONFIG = {
  PFT: { urlKey: "pftUrl", fileType: "PFT" },
  AUDIOMETRY: { urlKey: "audiometryUrl", fileType: "AUDIOMETRY" },
};

/* =========================================================
   ADD DOCTOR SEAL TO PDF (BOTTOM-RIGHT SAFE POSITION)
========================================================= */

async function addDoctorSealToPdf({ pdfUrl, fileType }) {
  // Load PDF
  const pdfBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Always use last page
  const pages = pdfDoc.getPages();
  const page = pages[pages.length - 1];

  const { width, height } = page.getSize();

  // Load seal image (SAFE WAY)
  const sealBytes = await fetch(Dr_Jaydip_Saxena).then((r) => r.arrayBuffer());
  const sealImage = await pdfDoc.embedPng(sealBytes);

  // Seal size
  const sealWidth = 90;
  const sealHeight = 90;

  // Guaranteed visible position on RMS PDFs
  const x = width - sealWidth - 40;
  const y = fileType === "AUDIOMETRY" ? height * 0.1 : height * 0.15;

  page.drawImage(sealImage, {
    x,
    y,
    width: sealWidth,
    height: sealHeight,
  });

  return new Blob([await pdfDoc.save()], {
    type: "application/pdf",
  });
}

/* =========================================================
   PROCESS SINGLE EMPLOYEE
========================================================= */

async function processEmployee({
  employee,
  corpId,
  campCycleId,
  enqueueSnackbar,
}) {
  for (const key of Object.keys(FILE_CONFIG)) {
    const config = FILE_CONFIG[key];
    const fileType = config.fileType;
    const pdfUrl = employee?.[config.urlKey];
    if (!pdfUrl) continue;

    try {
      const modifiedBlob = await addDoctorSealToPdf({ pdfUrl, fileType });

      //   const previewUrl = URL.createObjectURL(modifiedBlob);
      //   window.open(previewUrl, "_blank");

      const formData = new FormData();
      formData.append("file", modifiedBlob, `${key}_${employee.empId}.pdf`);

      const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${employee.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;

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

const SymbiotecPftAudioSeal = ({
  corpId = "9a8c86a4-c879-465a-abbc-43864684092d",
  campCycleId = "354493",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [employees, setEmployees] = useState([]);
  const [processed, setProcessed] = useState(0);

  useEffect(() => {
    const fetchEmployees = async () => {
      const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
      const res = await getData(url);
      setEmployees(
        sortDataByName(
          res?.data?.filter((item) => item?.audiometryUrl || item?.pftUrl) || []
        )
      );
    };
    fetchEmployees();
  }, [corpId, campCycleId]);

  const handleStart = async () => {
    if (!employees.length) {
      enqueueSnackbar("No employees found", { variant: "warning" });
      return;
    }

    setProcessed(0);

    for (let i = 0; i < employees.length; i++) {
      await processEmployee({
        employee: employees[i],
        corpId,
        campCycleId,
        enqueueSnackbar,
      });

      setProcessed((prev) => prev + 1);
    }
  };

  return (
    <div>
      <button onClick={handleStart}>Stamp Doctor Seal & Preview PDF</button>

      <div>Total Employees: {employees.length}</div>
      <div>Processed: {processed}</div>

      {employees.map((e, i) => (
        <div key={i}>
          {i + 1}. {e.empId} - {e.name}
        </div>
      ))}
    </div>
  );
};

export default SymbiotecPftAudioSeal;
