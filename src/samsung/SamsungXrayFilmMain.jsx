import React, { Fragment, useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { useSnackbar } from "notistack";
import { getData } from "../assets/services/GetApiCall";
import { updateData } from "../assets/services/PatchApi";
import { uploadFile } from "../assets/services/PostApiCall";
import { sortDataByName } from "../assets/utils";

const formatGender = (gender) => {
  const g = String(gender || "").toUpperCase();
  if (g === "MALE") return "Male";
  if (g === "FEMALE") return "Female";
  return gender || "N/A";
};

async function embedXrayImage(pdfDoc, imgBytes, url = "") {
  const lowerUrl = String(url).toLowerCase();

  if (lowerUrl.includes(".png")) {
    return pdfDoc.embedPng(imgBytes);
  }
  if (lowerUrl.includes(".jpg") || lowerUrl.includes(".jpeg")) {
    return pdfDoc.embedJpg(imgBytes);
  }

  try {
    return await pdfDoc.embedJpg(imgBytes);
  } catch {
    return pdfDoc.embedPng(imgBytes);
  }
}

export async function buildSamsungXrayFilmPdf(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const labelSize = 11;

  const infoTop = height - 50;
  const lineGap = 18;
  const left = 40;

  const name = data?.name || "N/A";
  const empId = data?.empId || "N/A";
  const age = data?.age != null && data?.age !== "" ? String(data.age) : "N/A";
  const gender = formatGender(data?.gender);

  page.drawText("X-RAY FILM REPORT", {
    x: left,
    y: infoTop,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });

  const rows = [
    ["Name", name],
    ["Employee ID", empId],
    ["Age", age],
    ["Gender", gender],
  ];

  rows.forEach(([label, value], index) => {
    const y = infoTop - 30 - index * lineGap;
    page.drawText(`${label}:`, {
      x: left,
      y,
      size: labelSize,
      font,
      color: rgb(0, 0, 0),
    });
    page.drawText(String(value), {
      x: left + 95,
      y,
      size: fontSize,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });
  });

  const infoBottom = infoTop - 30 - (rows.length - 1) * lineGap - 20;

  if (data?.xrayFilmUrl) {
    try {
      const xrayUrl = data.xrayFilmUrl;
      const imgBytes = await fetch(xrayUrl).then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch xray image (${res.status})`);
        return res.arrayBuffer();
      });

      const xrayImg = await embedXrayImage(pdfDoc, imgBytes, xrayUrl);

      const topMargin = infoBottom - 10;
      const bottomMargin = 40;
      const availableHeight = topMargin - bottomMargin;
      const sideMargin = 40;

      let imgWidth = width - sideMargin * 2;
      let imgHeight = (xrayImg.height / xrayImg.width) * imgWidth;

      if (imgHeight > availableHeight) {
        const scale = availableHeight / imgHeight;
        imgHeight *= scale;
        imgWidth *= scale;
      }

      const imgX = (width - imgWidth) / 2;
      const imgY = bottomMargin + (availableHeight - imgHeight) / 2;

      page.drawImage(xrayImg, {
        x: imgX,
        y: imgY,
        width: imgWidth,
        height: imgHeight,
      });
    } catch (err) {
      console.error("Error embedding X-ray:", err);
      page.drawText("Failed to load X-ray image", {
        x: left,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(1, 0, 0),
      });
    }
  } else {
    page.drawText("No X-ray image available", {
      x: left,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(1, 0, 0),
    });
  }

  return pdfDoc.save();
}

const SamsungXrayFilmMain = ({
  corpId = "33525031-d147-41e3-8dc6-c330be785f88",
  campCycleId = "428775",
  fileType = "XRAY_FILM",
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [errorEmpCount, setErrorEmpCount] = useState(0);
  const [errorEmpIDs, setErrorEmpIDs] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const generatePDF = async (data) => {
    try {
      if (!data?.xrayFilmUrl) {
        throw new Error("Missing xrayFilmUrl");
      }

      const pdfBytes = await buildSamsungXrayFilmPdf(data);
      const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

      // const previewUrl = URL.createObjectURL(pdfBlob);
      // window.open(previewUrl, "_blank");

      const formData = new FormData();
      formData.append("file", pdfBlob, `XrayFilm_${data?.empId}.pdf`);

      const url = `https://apitest.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await uploadFile(url, formData);

      if (result?.data) {
        enqueueSnackbar(`X-ray film PDF uploaded for ${data.empId}`, {
          variant: "success",
        });
        setUploadedCount((prev) => prev + 1);
      } else {
        enqueueSnackbar(`Upload failed for ${data.empId}`, { variant: "error" });
        setErrorEmpCount((prev) => prev + 1);
        setErrorEmpIDs((prev) => [...prev, data.empId]);
      }
    } catch (error) {
      console.error(`X-ray film PDF failed for ${data?.empId}:`, error);
      enqueueSnackbar(`Error for ${data?.empId}: ${error?.message || "failed"}`, {
        variant: "error",
      });
      setErrorEmpCount((prev) => prev + 1);
      setErrorEmpIDs((prev) => [...prev, data.empId]);
    }
  };

  const fetchListOfEmployees = async () => {
    if (!corpId || !campCycleId) {
      enqueueSnackbar("Set corpId and campCycleId props.", { variant: "warning" });
      setList([]);
      setTotalEmployees(0);
      return;
    }

    const url = `https://apitest.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
    const result = await getData(url);

    if (result?.data) {
      const temp = result.data.filter((item) => [18787977].map((item) => String(item).trim()).includes(item?.empId) && item?.xrayFilmUrl);
      const sorted = sortDataByName(temp);
      setList(sorted);
      setTotalEmployees(sorted.length);
      return;
    }

    enqueueSnackbar("Error fetching employee list", { variant: "error" });
    setList([]);
    setTotalEmployees(0);
  };

  useEffect(() => {
    fetchListOfEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corpId, campCycleId]);

  const handleGeneratePDFs = async () => {
    if (!list.length) {
      enqueueSnackbar("No X-ray film employees found.", { variant: "warning" });
      return;
    }

    setIsProcessing(true);
    setUploadedCount(0);
    setErrorEmpCount(0);
    setErrorEmpIDs([]);

    for (let i = 0; i < list.length; i += 1) {
      await generatePDF(list[i]);
    }

    setIsProcessing(false);
  };

  const deleteFiles = async (data) => {
    const url = `https://apitest.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${data.empId}`;
    const result = await updateData(url);

    if (result?.data) {
      enqueueSnackbar(`Deleted ${data.empId}`, { variant: "success" });
    } else {
      enqueueSnackbar(`Delete failed for ${data.empId}`, { variant: "error" });
    }
  };

  const handleDeletePDF = async () => {
    for (let i = 0; i < list.length; i += 1) {
      await deleteFiles(list[i]);
    }
  };

  return (
    <Fragment>
      <div>
        <h3>Samsung X-Ray Film Report</h3>
        <div>corpId: {corpId || "-"}</div>
        <div>campCycleId: {campCycleId || "-"}</div>
        <div>fileType: {fileType}</div>
        <br />
        <button onClick={handleGeneratePDFs} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Start Generating"}
        </button>{" "}
        <button onClick={handleDeletePDF} disabled={isProcessing}>
          Delete Files
        </button>
        <div>Total Employees: {totalEmployees}</div>
        <div>Uploaded Files: {uploadedCount}</div>
        <div>Error Files: {errorEmpCount}</div>
        <div>Error EmpIDs: {errorEmpIDs.join(", ")}</div>
        <br />
        {list.map((item, index) => (
          <div key={item.empId || index} style={{ display: "flex", gap: "8px" }}>
            <div>
              {index + 1}. {item.empId} - {item.name} (age: {item?.age ?? "-"},{" "}
              {formatGender(item?.gender)})
            </div>
            {item?.xrayFilmUrl ? (
              <a href={item.xrayFilmUrl} target="_blank" rel="noreferrer">
                {item.xrayFilmUrl}
              </a>
            ) : (
              <span>-</span>
            )}
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default SamsungXrayFilmMain;
