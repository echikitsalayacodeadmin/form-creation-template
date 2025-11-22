import React, { useEffect, useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
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

export async function modifyBloodPdfDynamic(bloodUrl) {
  // Load pdf-lib + fonts
  const pdfBytes = await fetch(bloodUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const searchText = "ANNUAL HEALTH CHECK UP- BASIC ONSITE CAMP";
  const replaceText = "Bi-Annual Medical Check-Up – October 2025";

  // --- Load pdf.js ---
  const pdfjsLib = await import(
    "https://mozilla.github.io/pdf.js/build/pdf.mjs"
  );
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";

  const loadingTask = pdfjsLib.getDocument({ url: bloodUrl });
  const pdf = await loadingTask.promise;

  // --- PAGE 1: Add header text near top (200pt gap) ---
  const firstPage = pdfDoc.getPages()[0];
  const { height } = firstPage.getSize();
  const fontSize = 9;
  const x = 40;
  const y = height - 195;

  // Draw the text
  firstPage.drawText(replaceText, {
    x,
    y,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0),
  });

  // Measure text width for underline
  const textWidth = helveticaFont.widthOfTextAtSize(replaceText, fontSize);

  // Draw underline below text
  firstPage.drawLine({
    start: { x, y: y - 1.5 }, // slightly below baseline
    end: { x: x + textWidth, y: y - 1.5 },
    thickness: 0.5,
    color: rgb(0, 0, 0),
  });

  // --- ALSO ADD SAME TEXT TO PAGE 6 AND 7 ---
  const totalPages = pdfDoc.getPageCount();
  [6, 7].forEach((pageNum) => {
    if (pageNum <= totalPages) {
      const page = pdfDoc.getPages()[pageNum - 1]; // zero-based index
      const { height: pageHeight } = page.getSize();

      page.drawText(replaceText, {
        x,
        y: pageHeight - 195,
        size: fontSize,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });

      const underlineWidth = helveticaFont.widthOfTextAtSize(
        replaceText,
        fontSize
      );
      page.drawLine({
        start: { x, y: pageHeight - 196.5 },
        end: { x: x + underlineWidth, y: pageHeight - 196.5 },
        thickness: 0.5,
        color: rgb(0, 0, 0),
      });

      console.log(`✅ Added header text with underline on page ${pageNum}`);
    }
  });

  // --- Pages 2–5: find and replace dynamically ---
  for (let pageNum = 2; pageNum <= 5 && pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    const normalize = (s) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const normalizedSearch = normalize(searchText);

    // Combine all text items for approximate match
    const combinedText = normalize(
      textContent.items.map((t) => t.str).join(" ")
    );

    // Check if searchText exists approximately anywhere
    if (combinedText.includes(normalizedSearch)) {
      console.log(`✅ Found match on page ${pageNum}`);

      // Find the first text item roughly containing any keyword
      const keyPart = searchText.split(" ")[0].toLowerCase(); // "annual"
      let found = null;
      for (const item of textContent.items) {
        if (item.str.toLowerCase().includes(keyPart)) {
          const [x, y] = item.transform.slice(4, 6);
          found = { x, y };
          break;
        }
      }

      if (found) {
        const pageLib = pdfDoc.getPages()[pageNum - 1];
        const { x, y } = found;

        const scale = 1.33;
        const adjX = x;
        const adjY = y;

        pageLib.drawRectangle({
          x: adjX - 2,
          y: adjY - 5,
          width: 450,
          height: 11,
          color: rgb(1, 1, 1),
        });

        const fontSize = 9;
        pageLib.drawText(replaceText, {
          x: adjX,
          y: adjY - 2,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
        });

        // Measure text width to know how long the underline should be
        const textWidth = helveticaFont.widthOfTextAtSize(
          replaceText,
          fontSize
        );

        // Draw underline (a thin black line under text)
        pageLib.drawLine({
          start: { x: adjX, y: adjY - 3 }, // just below text baseline
          end: { x: adjX + textWidth, y: adjY - 3 },
          thickness: 0.5,
          color: rgb(0, 0, 0),
        });

        console.log(`✅ Replaced at approx (${adjX}, ${adjY})`);
      }
    } else {
      console.log(`❌ Not found on page ${pageNum}`);
    }
  }

  await pdf.destroy();

  // Save modified file
  const modifiedBytes = await pdfDoc.save();
  return new Blob([modifiedBytes], { type: "application/pdf" });
}

// ✅ React Component
const StridesBlood = ({
  corpId = "f62fa674-0710-47c9-9a5e-b76b731a22e3",
  campCycleId = "347754",
  fileType = "BLOODTEST",
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
      const temp = result?.data?.filter(
        (item) => ["SH179"].includes(item?.empId) && item.bloodTestUrl
      );
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

  const handleBloodModify = async (data) => {
    try {
      const bloodTestUrl = data?.bloodTestUrl;
      if (!bloodTestUrl) {
        enqueueSnackbar("Missing Blood Test URL!", { variant: "warning" });
        return;
      }

      const modifiedBlob = await modifyBloodPdfDynamic(bloodTestUrl);
      //   Step 3️⃣: Preview the modified PDF (optional)
      // const previewUrl = URL.createObjectURL(modifiedBlob);
      // window.open(previewUrl, "_blank");

      const formData = new FormData();
      formData.append("file", modifiedBlob, `BLOOD_${data?.empId}.pdf`);

      const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;
      const result = await uploadFile(uploadUrl, formData);

      if (result?.data) {
        enqueueSnackbar("Successfully Uploaded Modified Blood PDF!", {
          variant: "success",
        });
        setUploadedCount((prev) => prev + 1);
      } else {
        enqueueSnackbar("Upload failed!", { variant: "error" });
      }
    } catch (err) {
      console.error("Error modifying/uploading Blood PDF:", err);
      enqueueSnackbar("Error modifying Blood PDF!", { variant: "error" });
    }
  };

  const handleGeneratePDFs = async () => {
    for (let i = 0; i < list.length; i++) {
      await handleBloodModify(list[i], i);
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
          <a href={item.bloodTestUrl}>
            <div key={index}>{item.bloodTestUrl}</div>
          </a>
          <br />
        </div>
      ))}
    </div>
  );
};

export default StridesBlood;
