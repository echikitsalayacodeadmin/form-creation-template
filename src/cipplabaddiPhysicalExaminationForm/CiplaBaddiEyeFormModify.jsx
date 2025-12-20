import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
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

/* ===================== FIND TEXT POSITION ===================== */
async function findExactTextEnd(pdfUrl, searchText) {
  const pdfjsLib = await loadPdfJs();
  const pdfBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer());

  const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
  const searchLower = searchText.toLowerCase();

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    let buffer = "";
    let startX = null;
    let y = null;
    let lastX = null;

    for (const item of textContent.items) {
      const text = item.str;
      const [x, yPos] = item.transform.slice(4, 6);

      if (!buffer) {
        buffer = text;
        startX = x;
        y = yPos;
        lastX = x;
      } else {
        buffer += text;
        lastX = x;
      }

      if (buffer.toLowerCase().includes(searchLower)) {
        await pdf.destroy();

        return {
          pageNum,
          xEnd: lastX + text.length * 5.2, // accurate enough
          y,
        };
      }

      // reset buffer if line changes
      if (Math.abs(yPos - y) > 2) {
        buffer = "";
        startX = null;
        y = null;
      }
    }
  }

  await pdf.destroy();
  return null;
}

/* ===================== MODIFY PDF ===================== */
async function addWithGlassesText(pdfUrl) {
  const LABEL = "Eye checkup (Vision color & refraction)";

  const found = await findExactTextEnd(pdfUrl, LABEL);
  if (!found) {
    console.warn("Label not found:", LABEL);
    return null;
  }

  const { xEnd, y, pageNum } = found;

  const pdfBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[pageNum - 1];

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawText("  With Glasses", {
    x: xEnd + 4, // right after label
    y: y - 0,
    size: 10,
    font: boldFont, // ✅ BOLD FONT
    color: rgb(0, 0, 0),
  });
  return new Blob([await pdfDoc.save()], {
    type: "application/pdf",
  });
}

/* ===================== REACT COMPONENT ===================== */
const CiplaBaddiEyeFormModify = ({
  corpId = "dd16b55c-2de0-4d1e-b6da-d2cbd98f7473",
  campCycleId = "350262",
  fileType = "EYE_TEST",
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [list, setList] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [uploadedCount, setUploadedCount] = useState(0);

  /* ===================== FETCH EMPLOYEES ===================== */
  const fetchListOfEmployees = async () => {
    try {
      const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await getData(url);

      if (result?.data) {
        const ids = [
          "A122486140",
          "168409",
          "41155",
          "15771",
          "165910",
          "47019",
          "15321",
          "159047",
          "47167",
          "81000602",
          "93669",
          "58087",
          "43858",
          "35374",
          "81001051",
          "23535",
          "15368",
          "136612",
          "128365",
          "81000059",
          "164921",
          "24693",
          "27229",
          "15382",
          "1332167",
          "81000859",
          "24226",
          "84033",
          "130181",
          "15629",
          "150244",
          "165913",
          "111999",
          "169760",
          "128082",
          "145282",
          "135943",
          "15281",
          "157588",
          "33803",
          "162760",
          "81000118",
          "18172",
          "15667",
          "105466",
          "31223",
          "47579",
          "15470",
          "81000134",
          "169394",
          "15741",
          "15853",
          "15585",
          "43973",
          "24866",
          "121014",
          "15794",
          "37311",
          "43095",
          "15041",
          "58373",
          "139309",
          "A06254621",
          "42673",
          "49173",
          "166196",
          "187",
          "40229",
          "81000219",
          "171130",
          "15433",
          "15406",
          "15588",
          "D-2",
          "15468",
          "15331",
          "114925",
          "81000693",
          "164081",
          "144034",
          "47503",
          "26984",
          "15442",
          "102249",
          "81000506",
          "81001212",
          "15649",
          "167790",
          "150245",
          "159009",
          "15704",
          "15734",
          "163079",
          "35213",
          "81001110",
          "15712",
          "122671",
          "81001135",
          "15809",
          "166180",
          "15380",
          "157831",
          "32046",
          "28913",
          "81000364",
          "81000589",
          "144164",
          "81001204",
          "169519",
          "166035",
          "15476",
          "46196",
          "24779",
          "15773",
          "131576",
          "15624",
          "15404",
          "CF-1222",
        ];

        const filtered = result.data.filter(
          (item) => item.eyeTestUrl && ids.includes(item?.empId)
        );
        const sorted = sortDataByName(filtered);

        setList(sorted);
        setTotalEmployees(sorted.length);
      }
    } catch (err) {
      enqueueSnackbar("Error fetching employee list", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchListOfEmployees();
  }, [corpId, campCycleId]);

  /* ===================== MODIFY SINGLE PDF ===================== */
  const handleEyeReportModify = async (data) => {
    try {
      const eyeUrl = data?.eyeTestUrl;
      if (!eyeUrl) {
        enqueueSnackbar("Missing Eye PDF URL", { variant: "warning" });
        return;
      }

      const modifiedBlob = await addWithGlassesText(eyeUrl);

      if (!modifiedBlob) {
        enqueueSnackbar("Text not found in PDF", { variant: "warning" });
        return;
      }

      const previewUrl = URL.createObjectURL(modifiedBlob);
      window.open(previewUrl, "_blank");

      const formData = new FormData();
      formData.append(
        "file",
        modifiedBlob,
        `${data?.eyeTestUrl?.split("/").pop()}`
      );

      const url = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await uploadFile(url, formData);

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
    } catch (err) {
      console.error(err);
      enqueueSnackbar("PDF modification failed", { variant: "error" });
    }
  };

  /* ===================== GENERATE ===================== */
  const handleGeneratePDFs = async () => {
    for (let i = 0; i < list.length; i++) {
      await handleEyeReportModify(list[i], i);
    }
  };
  /* ===================== DELETE ===================== */
  const handleDeletePDF = async () => {
    for (let item of list) {
      const url = `https://apibackend.uno.care/api/org/employee/delete/file?corpId=${corpId}&toDeletefiletype=${fileType}&empId=${item.empId}`;
      await updateData(url);
      setUploadedCount((c) => c + 1);
    }
  };

  /* ===================== UI ===================== */
  return (
    <div>
      <button onClick={handleGeneratePDFs}>Start Generating</button>
      <br />
      <button onClick={handleDeletePDF}>Delete Files</button>

      <div>Total Employees: {totalEmployees}</div>
      <div>Processed: {uploadedCount}</div>

      {list.map((item, index) => (
        <div key={index} style={{ display: "flex" }}>
          <div key={index}>{`${index}- ${item.empId} ${item.name}`}</div>

          <a href={item.eyeTestUrl} target="_blank">
            <div key={index}>{item.eyeTestUrl}</div>
          </a>

          <br />
        </div>
      ))}
    </div>
  );
};

export default CiplaBaddiEyeFormModify;
