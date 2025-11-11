// import React, { useEffect, useState } from "react";
// import { PDFDocument, rgb } from "pdf-lib";
// import normalImage from "./normalImage.png";
// import { getData } from "../assets/services/GetApiCall";
// import { sortDataByName } from "../assets/utils";
// import { uploadFile } from "../assets/services/PostApiCall";
// import { enqueueSnackbar } from "notistack";

// // ✅ Helper to fetch the PDF as ArrayBuffer
// async function fetchPdfBuffer(url) {
//   const response = await fetch(url);
//   const arrayBuffer = await response.arrayBuffer();
//   return arrayBuffer;
// }

// // ✅ Function to modify PDF (white-out + image overlay)
// export async function modifyPftPdf(pftUrl, imageUrl) {
//   // 1. Load existing PDF
//   const existingPdfBytes = await fetchPdfBuffer(pftUrl);
//   const pdfDoc = await PDFDocument.load(existingPdfBytes);

//   // 2. Load image (PNG or JPG)
//   const imageResponse = await fetch(imageUrl);
//   const imageArrayBuffer = await imageResponse.arrayBuffer();

//   let embeddedImage;
//   if (imageUrl.endsWith(".png")) {
//     embeddedImage = await pdfDoc.embedPng(imageArrayBuffer);
//   } else {
//     embeddedImage = await pdfDoc.embedJpg(imageArrayBuffer);
//   }

//   // 3. Modify each page
//   const pages = pdfDoc.getPages();

//   for (const page of pages) {
//     const { width } = page.getSize();

//     // Estimate Y position of "Pre Medication Report Indicates"
//     const targetY = 22; // adjust manually for your PDF

//     // ✅ White out everything below the line
//     page.drawRectangle({
//       x: 20, // 20px left padding
//       y: 98, // start from y = 98
//       width: width - 40, // trim 20px from both sides
//       height: targetY, // area height
//       color: rgb(1, 1, 1), // white
//     });

//     // ✅ Draw the new image over the cleared section
//     const aspect = embeddedImage.height / embeddedImage.width;
//     const imageHeight = (width - 40) * aspect;

//     page.drawImage(embeddedImage, {
//       x: 20,
//       y: 98,
//       width: width - 40,
//       height: imageHeight,
//     });
//   }

//   // 4. Save modified PDF and return Blob
//   const modifiedPdfBytes = await pdfDoc.save();
//   const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
//   return blob;
// }

// // ✅ React Component
// const PftPdfModifier = ({
//   corpId = "b1821b42-807b-419e-8969-3e500d636f4b",
//   campCycleId = "345079",
// }) => {
//   const [list, setList] = useState([]);
//   const [uploadedCount, setUploadedCount] = useState(0);

//   // Fetch employee list
//   const fetchListOfEmployees = async () => {
//     const url = `https://apibackend.uno.care/api/org/superMasterData?corpId=${corpId}&campCycleId=${campCycleId}`;
//     const result = await getData(url);
//     if (result && result.data) {
//       const temp = result?.data?.filter((item) => item.pftUrl);
//       const sorted = sortDataByName(temp);
//       setList(sorted);
//       console.log("Total PFT employees:", sorted.length);
//     } else {
//       enqueueSnackbar("Error fetching employee list", { variant: "error" });
//     }
//   };

//   useEffect(() => {
//     fetchListOfEmployees();
//   }, [corpId, campCycleId]);

//   // ✅ Modify and upload a single PDF
//   const handleModify = async () => {
//     try {
//       const data = list[0]; // pick first item for demo
//       if (!data || !data.pftUrl) {
//         enqueueSnackbar("No valid PFT URL found!", { variant: "warning" });
//         return;
//       }

//       const modifiedBlob = await modifyPftPdf(data.pftUrl, normalImage);

//       const url = URL.createObjectURL(modifiedBlob);
//       window.open(url, "_blank");

//       //   const formData = new FormData();
//       //   formData.append("file", modifiedBlob, `PFT_${data?.empId}.pdf`);

//       //   const fileType = "PFT"; // 👈 define your fileType here
//       //   const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;

//       //   const result = await uploadFile(uploadUrl, formData);

//       //   if (result && result.data) {
//       //     enqueueSnackbar("Successfully Uploaded Modified PDF!", {
//       //       variant: "success",
//       //     });
//       //     setUploadedCount((prev) => prev + 1);
//       //   } else {
//       //     enqueueSnackbar("Upload failed!", { variant: "error" });
//       //   }
//     } catch (err) {
//       console.error("Error modifying/uploading PDF:", err);
//       enqueueSnackbar("Error modifying/uploading PDF!", { variant: "error" });
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleModify}>Modify PDF</button>
//       <p>Total Employees: {list.length}</p>
//       <p>Uploaded Count: {uploadedCount}</p>
//     </div>
//   );
// };

// export default PftPdfModifier;

// import React from "react";
// import { PDFDocument, rgb } from "pdf-lib";
// import normalImage from "./normalImage.png";

// // ✅ Load official PDF.js build + worker from CDN dynamically
// async function loadPdfJs() {
//   const pdfjsLib = await import(
//     "https://mozilla.github.io/pdf.js/build/pdf.mjs"
//   );
//   pdfjsLib.GlobalWorkerOptions.workerSrc =
//     "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
//   return pdfjsLib;
// }

// // 🔹 Step 1: Detect “Pre Medication Report Indicates” position
// // 🔹 Step 1: Detect “Pre Medication Report Indicates” even if split across fragments
// async function findLinePosition(pdfUrl, searchText) {
//   const pdfjsLib = await loadPdfJs();
//   const loadingTask = pdfjsLib.getDocument(pdfUrl);
//   const pdf = await loadingTask.promise;
//   const numPages = pdf.numPages;

//   for (let pageNum = 1; pageNum <= numPages; pageNum++) {
//     const page = await pdf.getPage(pageNum);
//     const textContent = await page.getTextContent();

//     // Group fragments by Y position (same text line)
//     const lines = {};
//     for (const item of textContent.items) {
//       const [x, y] = item.transform.slice(4, 6);
//       const roundedY = Math.round(y); // cluster nearby Y values
//       if (!lines[roundedY]) lines[roundedY] = [];
//       lines[roundedY].push({ x, text: item.str });
//     }

//     // Combine and check each line
//     for (const [yKey, parts] of Object.entries(lines)) {
//       // Sort fragments left to right
//       parts.sort((a, b) => a.x - b.x);
//       const combinedText = parts
//         .map((p) => p.text)
//         .join("")
//         .replace(/\s+/g, " ")
//         .trim();

//       if (combinedText.toLowerCase().includes(searchText.toLowerCase())) {
//         await pdf.destroy();
//         console.log(
//           "Found text on page",
//           pageNum,
//           "at Y =",
//           yKey,
//           "text:",
//           combinedText
//         );
//         return Number(yKey);
//       }
//     }
//   }

//   await pdf.destroy();
//   return null; // not found
// }

// // 🔹 Step 2: Modify the PDF below that Y using pdf-lib
// async function modifyPftPdf(pftUrl, imageUrl, targetY) {
//   const pdfBytes = await fetch(pftUrl).then((r) => r.arrayBuffer());
//   const pdfDoc = await PDFDocument.load(pdfBytes);

//   const imageBytes = await fetch(imageUrl).then((r) => r.arrayBuffer());
//   const embeddedImage = imageUrl.endsWith(".png")
//     ? await pdfDoc.embedPng(imageBytes)
//     : await pdfDoc.embedJpg(imageBytes);

//   const pages = pdfDoc.getPages();
//   for (const page of pages) {
//     const { width } = page.getSize();

//     if (targetY) {
//       // ✅ White out everything below detected line
//       page.drawRectangle({
//         x: 20,
//         y: 0,
//         width: width - 40,
//         height: targetY,
//         color: rgb(0, 0, 0),
//       });
//     }

//     // ✅ Overlay image full-width inside margins
//     const aspect = embeddedImage.height / embeddedImage.width;
//     const imageHeight = (width - 40) * aspect;

//     page.drawImage(embeddedImage, {
//       x: 20,
//       y: targetY - 20,
//       width: width - 40,
//       height: imageHeight,
//     });
//   }

//   const modifiedPdfBytes = await pdfDoc.save();
//   const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
//   return URL.createObjectURL(blob);
// }

// // 🔹 Step 3: React component
// const PftPdfModifier = () => {
//   const handleModify = async () => {
//     const pftUrl =
//       "https://storage-echikitsalaya.s3.ap-south-1.amazonaws.com/corpAllReports/b1821b42-807b-419e-8969-3e500d636f4b/PFT/20251011162655/7.pdf";

//     // 1️⃣ Detect the line position dynamically
//     const foundY = await findLinePosition(
//       pftUrl,
//       "Pre Medication Report Indicates"
//     );
//     console.log("Detected line Y:", foundY);

//     if (!foundY) {
//       alert("Could not find the text in PDF!");
//       return;
//     }

//     // 2️⃣ Modify and preview
//     const modifiedUrl = await modifyPftPdf(pftUrl, normalImage, foundY + 10);
//     window.open(modifiedUrl, "_blank");
//   };

//   return <button onClick={handleModify}>Modify PDF Dynamically</button>;
// };

// export default PftPdfModifier;

import React, { useEffect, useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import normalImage from "./normalImage.png";
import { sortDataByName } from "../assets/utils";
import { getData } from "../assets/services/GetApiCall";

import { updateData } from "../assets/services/PatchApi";
import { useSnackbar } from "notistack";
import { uploadFile } from "../assets/services/PostApiCall";

// ✅ Load official PDF.js build + worker from CDN dynamically
async function loadPdfJs() {
  const pdfjsLib = await import(
    "https://mozilla.github.io/pdf.js/build/pdf.mjs"
  );
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
  return pdfjsLib;
}

// ✅ Detect “Pre Medication Report Indicates” (robust across fragments)
async function findLinePosition(pdfUrl, searchText) {
  const pdfjsLib = await loadPdfJs();
  const loadingTask = pdfjsLib.getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Group fragments by Y
    const lines = {};
    for (const item of textContent.items) {
      const [x, y] = item.transform.slice(4, 6);
      const roundedY = Math.round(y);
      if (!lines[roundedY]) lines[roundedY] = [];
      lines[roundedY].push({ x, text: item.str });
    }

    // Combine & search
    for (const [yKey, parts] of Object.entries(lines)) {
      parts.sort((a, b) => a.x - b.x);
      const combinedText = parts
        .map((p) => p.text)
        .join("")
        .replace(/\s+/g, " ");
      if (combinedText.toLowerCase().includes(searchText.toLowerCase())) {
        await pdf.destroy();
        console.log(
          `Found "${searchText}" on page ${pageNum} baseline Y=${yKey}`
        );
        return { y: Number(yKey), pageNum };
      }
    }
  }

  await pdf.destroy();
  return null;
}

// ✅ Modify PDF: draw 40px-high white rectangle above baseline
async function modifyPftPdf(pftUrl, imageUrl, found) {
  const { y: targetY, pageNum } = found;
  const pdfBytes = await fetch(pftUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const imageBytes = await fetch(imageUrl).then((r) => r.arrayBuffer());
  const embeddedImage = imageUrl.endsWith(".png")
    ? await pdfDoc.embedPng(imageBytes)
    : await pdfDoc.embedJpg(imageBytes);

  const page = pdfDoc.getPages()[pageNum - 1];
  const { width } = page.getSize();

  // ✅ Draw 40px-high rectangle starting 35 units above the text baseline
  const rectOffset = 35; // how far above baseline to start rectangle
  const rectHeight = 40; // rectangle height
  const rectY = targetY - rectOffset; // top edge = baseline - offset

  // Draw rectangle
  page.drawRectangle({
    x: 20,
    y: rectY,
    width: width - 40,
    height: rectHeight,
    color: rgb(1, 1, 1),
  });

  // ✅ Embed image exactly starting from same Y as rectangle
  const aspect = embeddedImage.height / embeddedImage.width;
  const imageHeight = (width - 40) * aspect;

  page.drawImage(embeddedImage, {
    x: 20,
    y: rectY + 20, // <-- aligned perfectly with rectangle
    width: width - 40,
    height: imageHeight,
  });

  const modifiedPdfBytes = await pdfDoc.save();
  const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
  return blob;
}

// ✅ React Component
const PftPdfModifier = ({
  corpId = "b1821b42-807b-419e-8969-3e500d636f4b",
  campCycleId = "345079",
  fileType = "PFT",
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
      const temp = result?.data?.filter((item) => item.pftUrl);
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

  const handleModify = async (data) => {
    try {
      const pftUrl = data?.pftUrl;
      if (!pftUrl) {
        enqueueSnackbar("Missing PFT URL!", { variant: "warning" });
        return;
      }

      // Step 1️⃣: Find where the line occurs in PDF
      const found = await findLinePosition(
        pftUrl,
        "Pre Medication Report Indicates"
      );
      if (!found) {
        alert(
          "Could not find the text 'Pre Medication Report Indicates' in PDF!"
        );
        return;
      }

      console.log("Detected line position:", found);

      // Step 2️⃣: Modify the PDF (apply rectangle + image)
      const modifiedBlob = await modifyPftPdf(pftUrl, normalImage, found);

      // Step 3️⃣: Open for preview (uncomment if needed)
      // const previewUrl = URL.createObjectURL(modifiedBlob);
      // window.open(previewUrl, "_blank");

      // Step 4️⃣: (Optional) Upload back to server

      const formData = new FormData();
      formData.append("file", modifiedBlob, `PFT_${data?.empId}.pdf`);

      const uploadUrl = `https://apibackend.uno.care/api/org/upload?empId=${data?.empId}&fileType=${fileType}&corpId=${corpId}&campCycleId=${campCycleId}`;

      const result = await uploadFile(uploadUrl, formData);

      if (result && result.data) {
        enqueueSnackbar("Successfully Uploaded Modified PDF!", {
          variant: "success",
        });
        setUploadedCount((prev) => prev + 1);
      } else {
        enqueueSnackbar("Upload failed!", { variant: "error" });
      }
    } catch (err) {
      console.error("Error modifying/uploading PDF:", err);
      enqueueSnackbar("Error modifying/uploading PDF!", { variant: "error" });
    }
  };

  const handleGeneratePDFs = async () => {
    for (let i = 0; i < list.length; i++) {
      await handleModify(list[i], i);
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
          <a href={item.pftUrl}>
            <div key={index}>{item.pftUrl}</div>
          </a>
          <br />
        </div>
      ))}
    </div>
  );
};

export default PftPdfModifier;
