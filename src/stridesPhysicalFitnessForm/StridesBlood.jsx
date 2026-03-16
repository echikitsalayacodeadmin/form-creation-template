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

// export async function modifyBloodPdfDynamic(bloodUrl) {
//   // Load pdf-lib + fonts
//   const pdfBytes = await fetch(bloodUrl).then((r) => r.arrayBuffer());
//   const pdfDoc = await PDFDocument.load(pdfBytes);
//   const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

//   const searchText = "ANNUAL HEALTH CHECK UP- BASIC ONSITE CAMP";
//   const replaceText = "Annual Medical Check-Up – February 2026";

//   // --- Load pdf.js ---
//   const pdfjsLib = await import(
//     "https://mozilla.github.io/pdf.js/build/pdf.mjs"
//   );
//   pdfjsLib.GlobalWorkerOptions.workerSrc =
//     "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";

//   const loadingTask = pdfjsLib.getDocument({ url: bloodUrl });
//   const pdf = await loadingTask.promise;

//   // --- PAGE 1: Add header text near top (200pt gap) ---
//   const firstPage = pdfDoc.getPages()[0];
//   const { height } = firstPage.getSize();
//   const fontSize = 9;
//   const x = 40;
//   const y = height - 195;

//   // Draw the text
//   firstPage.drawText(replaceText, {
//     x,
//     y,
//     size: fontSize,
//     font: helveticaFont,
//     color: rgb(0, 0, 0),
//   });

//   // Measure text width for underline
//   const textWidth = helveticaFont.widthOfTextAtSize(replaceText, fontSize);

//   // Draw underline below text
//   firstPage.drawLine({
//     start: { x, y: y - 1.5 }, // slightly below baseline
//     end: { x: x + textWidth, y: y - 1.5 },
//     thickness: 0.5,
//     color: rgb(0, 0, 0),
//   });

//   // --- ALSO ADD SAME TEXT TO PAGE 6 AND 7 ---
//   const totalPages = pdfDoc.getPageCount();
//   [6, 7].forEach((pageNum) => {
//     if (pageNum <= totalPages) {
//       const page = pdfDoc.getPages()[pageNum - 1]; // zero-based index
//       const { height: pageHeight } = page.getSize();

//       page.drawText(replaceText, {
//         x,
//         y: pageHeight - 195,
//         size: fontSize,
//         font: helveticaFont,
//         color: rgb(0, 0, 0),
//       });

//       const underlineWidth = helveticaFont.widthOfTextAtSize(
//         replaceText,
//         fontSize
//       );
//       page.drawLine({
//         start: { x, y: pageHeight - 196.5 },
//         end: { x: x + underlineWidth, y: pageHeight - 196.5 },
//         thickness: 0.5,
//         color: rgb(0, 0, 0),
//       });

//       console.log(`✅ Added header text with underline on page ${pageNum}`);
//     }
//   });

//   // --- Pages 2–5: find and replace dynamically ---
//   for (let pageNum = 2; pageNum <= 5 && pageNum <= pdf.numPages; pageNum++) {
//     const page = await pdf.getPage(pageNum);
//     const textContent = await page.getTextContent();

//     const normalize = (s) =>
//       s
//         .toLowerCase()
//         .replace(/[^a-z0-9]+/g, " ")
//         .replace(/\s+/g, " ")
//         .trim();

//     const normalizedSearch = normalize(searchText);

//     // Combine all text items for approximate match
//     const combinedText = normalize(
//       textContent.items.map((t) => t.str).join(" ")
//     );

//     // Check if searchText exists approximately anywhere
//     if (combinedText.includes(normalizedSearch)) {
//       console.log(`✅ Found match on page ${pageNum}`);

//       // Find the first text item roughly containing any keyword
//       const keyPart = searchText.split(" ")[0].toLowerCase(); // "annual"
//       let found = null;
//       for (const item of textContent.items) {
//         if (item.str.toLowerCase().includes(keyPart)) {
//           const [x, y] = item.transform.slice(4, 6);
//           found = { x, y };
//           break;
//         }
//       }

//       if (found) {
//         const pageLib = pdfDoc.getPages()[pageNum - 1];
//         const { x, y } = found;

//         const scale = 1.33;
//         const adjX = x;
//         const adjY = y;

//         pageLib.drawRectangle({
//           x: adjX - 2,
//           y: adjY - 5,
//           width: 450,
//           height: 11,
//           color: rgb(1, 1, 1),
//         });

//         const fontSize = 9;
//         pageLib.drawText(replaceText, {
//           x: adjX,
//           y: adjY - 2,
//           size: fontSize,
//           font: helveticaFont,
//           color: rgb(0, 0, 0),
//         });

//         // Measure text width to know how long the underline should be
//         const textWidth = helveticaFont.widthOfTextAtSize(
//           replaceText,
//           fontSize
//         );

//         // Draw underline (a thin black line under text)
//         pageLib.drawLine({
//           start: { x: adjX, y: adjY - 3 }, // just below text baseline
//           end: { x: adjX + textWidth, y: adjY - 3 },
//           thickness: 0.5,
//           color: rgb(0, 0, 0),
//         });

//         console.log(`✅ Replaced at approx (${adjX}, ${adjY})`);
//       }
//     } else {
//       console.log(`❌ Not found on page ${pageNum}`);
//     }
//   }

//   await pdf.destroy();

//   // Save modified file
//   const modifiedBytes = await pdfDoc.save();
//   return new Blob([modifiedBytes], { type: "application/pdf" });
// }

// ✅ React Component


// export async function replaceUreaUricCreatinineWithRFT(bloodUrl) {
//   const pdfBytes = await fetch(bloodUrl).then((r) => r.arrayBuffer());
//   const pdfDoc = await PDFDocument.load(pdfBytes);

//   const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);





//   const pdfjsLib = await loadPdfJs();
//   const loadingTask = pdfjsLib.getDocument({ url: bloodUrl });
//   const pdf = await loadingTask.promise;




//   const fontSize = 10;

//   const targets = {
//     "CREATININE SERUM": "RFT – RENAL FUNCTION TEST (CREATININE SERUM)",
//     "UREA": "RFT – Renal Function Test (Urea)",
//     "URIC ACID": "RFT – RENAL FUNCTION TEST (URIC ACID)",
//     "URIC ACID (UA)": "RFT – RENAL FUNCTION TEST (URIC ACID (UA)",
//     "UREA": "RFT – RENAL FUNCTION TEST (UREA)",
//   };

//   for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//     const page = await pdf.getPage(pageNum);
//     const textContent = await page.getTextContent();

//     const pageLib = pdfDoc.getPages()[pageNum - 1];
//     const { width, height } = pageLib.getSize();

//     for (const item of textContent.items) {
//       const text = item.str.trim().toUpperCase();

//       for (const key in targets) {

//         if (text.includes(key)) {

//           const replaceText = targets[key];
//           const [x, y] = item.transform.slice(4, 6);

//           if (height - y < 230) {

//             const textWidth = font.widthOfTextAtSize(replaceText, fontSize);
//             const centerX = (width - textWidth) / 2;

//             pageLib.drawRectangle({
//               x: 0,
//               y: y - 2,
//               width: width,
//               height: 10,
//               color: rgb(1, 1, 1),
//             });

//             pageLib.drawText(replaceText, {
//               x: centerX,
//               y: y + 1,
//               size: fontSize,
//               font,
//               color: rgb(0, 0, 0),
//             });

//             console.log(`✅ Replaced ${key} on page ${pageNum}`);
//           }
//         }
//       }
//     }
//   }
//   await pdf.destroy();

//   const modifiedBytes = await pdfDoc.save();
//   return new Blob([modifiedBytes], { type: "application/pdf" });
// }

export async function modifyBloodPdfWithRFT(bloodUrl) {
  const pdfBytes = await fetch(bloodUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const headerText = "Annual Medical Check-Up – February 2026";
  const fontSize = 10;

  const targets = {
    "CREATININE SERUM": "RFT – RENAL FUNCTION TEST (CREATININE SERUM)",
    "UREA": "RFT – RENAL FUNCTION TEST (UREA)",
    "URIC ACID": "RFT – RENAL FUNCTION TEST (URIC ACID)",
    "URIC ACID (UA)": "RFT – RENAL FUNCTION TEST (URIC ACID)",
  };

  // load pdf.js
  const pdfjsLib = await loadPdfJs();
  const loadingTask = pdfjsLib.getDocument({ url: bloodUrl });
  const pdf = await loadingTask.promise;

  const pageCount = pdfDoc.getPageCount();

  /* ------------------------------------------------ */
  /* 1️⃣ WRITE HEADER ON EVERY PAGE */
  /* ------------------------------------------------ */

  for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
    const page = pdfDoc.getPages()[pageNum - 1];
    const { width, height } = page.getSize();

    const textWidth = font.widthOfTextAtSize(headerText, fontSize);
    const centerX = (width - textWidth) / 2;
    const y = height - 197;

    page.drawText(headerText, {
      x: centerX,
      y,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawLine({
      start: { x: centerX, y: y - 2 },
      end: { x: centerX + textWidth, y: y - 2 },
      thickness: 0.6,
      color: rgb(0, 0, 0),
    });

    console.log(`✅ Header added on page ${pageNum}`);
  }

  /* ------------------------------------------------ */
  /* 2️⃣ REPLACE UREA / URIC ACID / CREATININE */
  /* ------------------------------------------------ */

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    const pageLib = pdfDoc.getPages()[pageNum - 1];
    const { width, height } = pageLib.getSize();

    for (const item of textContent.items) {
      const text = item.str.trim().toUpperCase();

      for (const key in targets) {
        if (text.includes(key)) {
          const replaceText = targets[key];
          const [, y] = item.transform.slice(4, 6);

          if (height - y < 230) {
            const textWidth = font.widthOfTextAtSize(replaceText, fontSize);
            const centerX = (width - textWidth) / 2;

            // cover old heading
            pageLib.drawRectangle({
              x: 0,
              y: y - 3,
              width: width,
              height: 12,
              color: rgb(1, 1, 1),
            });

            // draw new centered heading
            pageLib.drawText(replaceText, {
              x: centerX,
              y: y + 1,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
            });

            console.log(`✅ Replaced ${key} on page ${pageNum}`);
          }
        }
      }
    }
  }

  await pdf.destroy();

  const modifiedBytes = await pdfDoc.save();
  return new Blob([modifiedBytes], { type: "application/pdf" });
}


export async function modifyBloodPdfDynamic(bloodUrl) {
  const pdfBytes = await fetch(bloodUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const text = "Annual Medical Check-Up – February 2026";

  const fontSize = 10;

  // Pages where you want to add text
  const pagesToModify = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  pagesToModify.forEach((pageNum) => {
    if (pageNum <= pdfDoc.getPageCount()) {
      const page = pdfDoc.getPages()[pageNum - 1];
      const { width, height } = page.getSize();

      // Center text horizontally
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const x = (width - textWidth) / 2;

      // 200pt from top
      const y = height - 197;

      // Draw text
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      // Draw underline
      page.drawLine({
        start: { x, y: y - 2 },
        end: { x: x + textWidth, y: y - 2 },
        thickness: 0.6,
        color: rgb(0, 0, 0),
      });

      console.log(`✅ Added header on page ${pageNum}`);
    }
  });

  const modifiedBytes = await pdfDoc.save();
  return new Blob([modifiedBytes], { type: "application/pdf" });
}

export async function replaceAgeSexInPdf(bloodUrl, age, sex) {
  const pdfBytes = await fetch(bloodUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pdfjsLib = await loadPdfJs();
  const loadingTask = pdfjsLib.getDocument({ url: bloodUrl });
  const pdf = await loadingTask.promise;

  const ageSexText = `:  ${age} Years\\${sex}`;
  const fontSize = 9;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    const pageLib = pdfDoc.getPages()[pageNum - 1];

    for (const item of textContent.items) {
      const text = item.str.trim().toUpperCase();

      // detect Age\Sex label
      if (text.includes("AGE") && text.includes("SEX")) {
        const [x, y] = item.transform.slice(4, 6);

        // cover old value
        pageLib.drawRectangle({
          x: x + 60,
          y: y - 3,
          width: 150,
          height: 12,
          color: rgb(1, 1, 1),
        });

        // draw new dynamic age/sex
        pageLib.drawText(ageSexText, {
          x: x + 60,
          y: y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });

        console.log(`✅ Replaced Age/Sex on page ${pageNum}`);
      }
    }
  }

  await pdf.destroy();

  const modifiedBytes = await pdfDoc.save();
  return new Blob([modifiedBytes], { type: "application/pdf" });
}

const StridesBlood = ({
  corpId = "b4055483-4ae1-4c35-851c-6922940bfa80",
  campCycleId = "385039",
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
      const temp = result?.data?.filter((item) => [
        "113257", "111372", "114375", "113414", "40003043", "114558", "114624", "109594", "615559U", "113999",
        "111049", "114574", "113378", "113379", "110606", "40002655", "113396", "114396", "180412", "114480",
        "113695", "180813", "112927", "109482", "113704", "40001563", "40003264", "40002094", "108757", "40003625",
        "112400", "40003628", "250497", "109251", "40003642", "113442", "111385", "112993", "40003301", "112873",
        "111402", "113482", "109355", "113269", "109595", "40000724", "114556", "109535", "111383", "40003158",
        "112195", "40002415", "111239", "114108", "40003588", "114557", "113696", "40000607", "113412", "114547",
        "131073C", "40003213", "250491", "113924", "113624", "114584", "40002957", "40003571", "114453", "20010392",
        "40003114", "40001326", "113317", "40002961", "615582U", "111838", "113291", "40002876", "114473", "114568",
        "113901", "114426", "112520", "111292", "40003302", "113648", "112713", "40003566", "110604", "40003110",
        "40003045", "40002538", "113371", "111296", "112006", "40003029", "40003608", "130889C", "40000351", "20030406",
        "40002555", "114418", "V711", "V061", "V079", "V615", "V088", "V100", "V979", "111290",
        "70053673C", "DTSS0388240", "DTSS0261719", "TME1014", "V127", "DTSS0261646", "V614", "TME1004", "40003132", "DTSS0261693",
        "DTSS0261718", "V780", "V723", "V119", "V045", "250621", "DTSS0388233", "DTSS0261662", "DTSS0425587", "TME1019",
        "TME1001", "Dtss021673", "V833", "V114", "V082", "40002206", "111221", "111389", "113603", "113900",
        "40003225", "TME1008", "DTSS0261623", "V212", "DTSS0261655", "TME1007", "DTSS0261698", "DTSS0261679", "DTSS0261647", "DTSS0261663",
        "DTSS0261650", "V1004", "DTSS0261674", "DTSS0359874", "V050", "V002", "V035", "V1023", "TME1003", "40002881",
        "V130", "TME1006", "V782", "TME1013", "40001062", "40002903", "40000526", "114585", "112609", "40001080",
        "DTSS0448600", "V059", "V019", "V058", "V101", "DTSS0261631", "DTSS0261627", "V1009", "V1011", "SV1073",
        "V954", "V797", "SV1077", "113566", "DTSS0569923", "V893", "V922", "DTSS0560032", "SV1025", "V415",
        "V086", "V944", "V899", "V190", "DTSS0261705", "DTSS0302892", "111687", "114255", "V044", "V560",
        "V816", "SV1027", "V388", "V092", "40002440", "V528", "V128", "V245", "SV1068", "V449",
        "V005", "40000901", "SV1011", "DTSS0492980", "SV1007", "V703", "V357", "V951", "SV1008", "V401",
        "V037", "DTSS0261708", "V056", "DTSS0298798", "V1005", "V533", "V379", "V779", "V823", "BSS14399",
        "V1012", "V1013", "V714", "40002844", "111306", "V871", "V221", "DTSS0359902", "DTSS0431603", "V1008",
        "V1042", "V057", "V390", "V693", "V1025", "V544", "V1030", "V095", "TME1012", "V1029",
        "SV1012", "SV1054", "V181", "SV1053", "V1007", "TME1024", "V428", "TME1017", "V084", "V605",
        "DTSS0368805", "TME1016", "V900", "V947", "DTSS0261671", "DTSS0261724", "V975", "BSS15069", "V054", "V830",
        "BSS16811", "BSS18102", "V066", "DTSS0388248", "DTSS0261780", "BSS17223", "V981", "V767", "V877", "V531",
        "V414", "PA092", "SV1062", "BSS15067", "SV1022", "SV1006", "V858", "V182", "111091", "40003605",
        "V976", "V213", "V113", "V774", "V024", "V946", "V391", "V980", "V022", "20010405",
        "615549U", "DTSS0623338", "V1020", "V126", "BSS14364", "BSS14381", "40002252", "PA151", "V957", "V041",
        "PA161", "40003343", "40002989", "BSS14398", "BSS14377", "DTSS0518012", "V1002", "V276", "V744", "V102",
        "BSS17584", "BSS14378", "PA165", "113650", "113567", "114378", "V1019", "V1038", "40003500", "40002556",
        "V210", "V987", "V881", "V106", "V916", "114395", "SV1001", "BSS14379", "BSS14678", "V1028",
        "V1032", "BSS18838", "V386", "V118", "V439", "V001", "250326", "113524", "PA146", "DTSS0261670",
        "DTSS0261667", "DTSS0261642", "V563", "110588", "V216"
      ].includes(item?.empId) && item?.bloodTestUrl
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

      const modifiedBlob = await replaceAgeSexInPdf(bloodTestUrl, data?.age, data?.gender);
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
