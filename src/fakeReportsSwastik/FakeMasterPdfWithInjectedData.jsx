import React, { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import dummyFilesPdf from "./dummyFiles.pdf";
import employeeData from "./data";

const REPORT_PAGE_INDEX = {
  pft: 0,
  bloodStart: 1,
  bloodEnd: 4,
  physicalFitness: 5,
  eyeExam: 6,
};

const dateToReadableFormat = (dateString = "") => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-IN", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const dateToBloodReportFormat = (dateString = "") => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-IN", { month: "short" });
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const drawField = ({
  page,
  text,
  x,
  y,
  width,
  height = 14,
  font,
  size = 11,
  whiteout = true,
  color = rgb(0, 0, 0),
}) => {
  const safeText = toSafePdfText(text);

  if (whiteout) {
    page.drawRectangle({
      x,
      y: y - 2,
      width,
      height,
      color: rgb(1, 1, 1),
    });
  }

  page.drawText(safeText, {
    x: x + 2,
    y,
    size,
    font,
    color,
  });
};

const toSafePdfText = (value = "") => {
  const text = String(value ?? "");

  // Replace common Cyrillic lookalikes that break WinAnsi encoding.
  const mapped = text
    .replace(/А/g, "A")
    .replace(/В/g, "B")
    .replace(/Е/g, "E")
    .replace(/К/g, "K")
    .replace(/М/g, "M")
    .replace(/Н/g, "H")
    .replace(/О/g, "O")
    .replace(/Р/g, "P")
    .replace(/С/g, "C")
    .replace(/Т/g, "T")
    .replace(/Х/g, "X")
    .replace(/а/g, "a")
    .replace(/е/g, "e")
    .replace(/о/g, "o")
    .replace(/р/g, "p")
    .replace(/с/g, "c")
    .replace(/у/g, "y")
    .replace(/х/g, "x");

  // Drop any remaining non-WinAnsi characters to avoid runtime failure.
  return mapped.replace(/[^\x20-\x7E]/g, "");
};

const patchPftPage = (page, employee, font) => {
  drawField({
    page,
    text: employee.name,
    x: 80,
    y: 764,
    width: 205,
    height: 16,
    font,
    size: 10,
  });

  drawField({
    page,
    text: String(employee.age),
    x: 258,
    y: 764,
    width: 45,
    height: 16,
    font,
    size: 10,
  });

  drawField({
    page,
    text: employee.gender === "MALE" ? "Male" : "Female",
    x: 420,
    y: 764,
    width: 70,
    height: 16,
    font,
    size: 10,
  });

  drawField({
    page,
    text: dateToBloodReportFormat(employee.date),
    x: 70,
    y: 742,
    width: 125,
    height: 16,
    font,
    size: 10,
  });
};

const patchBloodPage = (page, employee, font) => {
  drawField({
    page,
    text: employee.name,
    x: 112,
    y: 724,
    width: 220,
    height: 15,
    font,
    size: 10,
  });

  drawField({
    page,
    text: `${employee.age} Yrs / ${employee.gender === "MALE" ? "Male" : "Female"}`,
    x: 112,
    y: 684,
    width: 170,
    height: 15,
    font,
    size: 10,
  });

  const reportDate = dateToBloodReportFormat(employee.date);

  drawField({
    page,
    text: `${reportDate} 05:30 PM`,
    x: 532,
    y: 724,
    width: 130,
    height: 15,
    font,
    size: 9.5,
  });
  drawField({
    page,
    text: `${reportDate} 05:45 PM`,
    x: 532,
    y: 703,
    width: 130,
    height: 15,
    font,
    size: 9.5,
  });
  drawField({
    page,
    text: `${reportDate} 11:55 AM`,
    x: 532,
    y: 682,
    width: 130,
    height: 15,
    font,
    size: 9.5,
  });

  // Blood report rule: hide both QR codes with white rectangles.
  page.drawRectangle({
    x: 52,
    y: 52,
    width: 78,
    height: 78,
    color: rgb(1, 1, 1),
  });

  page.drawRectangle({
    x: 286,
    y: 52,
    width: 78,
    height: 78,
    color: rgb(1, 1, 1),
  });
};

const patchPhysicalFitnessPage = (page, employee, font) => {
  const readableDate = dateToReadableFormat(employee.date);

  drawField({
    page,
    text: readableDate,
    x: 510,
    y: 781,
    width: 130,
    height: 16,
    font,
    size: 12,
  });

  drawField({
    page,
    text: employee.name,
    x: 314,
    y: 627,
    width: 92,
    height: 16,
    font,
    size: 14,
  });

  // Physical fitness rule: put a blue square over QR.
  page.drawRectangle({
    x: 896,
    y: 788,
    width: 84,
    height: 84,
    color: rgb(0.1, 0.49, 0.82),
  });
};

const patchEyeExamPage = (page, employee, font) => {
  const readableDate = dateToReadableFormat(employee.date);

  drawField({
    page,
    text: readableDate,
    x: 760,
    y: 810,
    width: 180,
    height: 18,
    font,
    size: 15,
  });

  drawField({
    page,
    text: employee.name,
    x: 532,
    y: 589,
    width: 210,
    height: 18,
    font,
    size: 15,
  });

  drawField({
    page,
    text: employee.gender,
    x: 532,
    y: 516,
    width: 85,
    height: 18,
    font,
    size: 15,
  });

  drawField({
    page,
    text: String(employee.age),
    x: 532,
    y: 480,
    width: 85,
    height: 18,
    font,
    size: 15,
  });
};

const FakeMasterPdfWithInjectedData = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const buildFinalPdf = async () => {
    setIsGenerating(true);
    try {
      const templateBytes = await fetch(dummyFilesPdf).then((res) =>
        res.arrayBuffer()
      );
      const finalDoc = await PDFDocument.create();

      for (const employee of employeeData) {
        const oneEmployeeDoc = await PDFDocument.load(templateBytes);
        const pages = oneEmployeeDoc.getPages();
        const font = await oneEmployeeDoc.embedFont(StandardFonts.Helvetica);

        patchPftPage(pages[REPORT_PAGE_INDEX.pft], employee, font);

        for (
          let i = REPORT_PAGE_INDEX.bloodStart;
          i <= REPORT_PAGE_INDEX.bloodEnd;
          i += 1
        ) {
          patchBloodPage(pages[i], employee, font);
        }

        patchPhysicalFitnessPage(
          pages[REPORT_PAGE_INDEX.physicalFitness],
          employee,
          font
        );
        patchEyeExamPage(pages[REPORT_PAGE_INDEX.eyeExam], employee, font);

        const pageIndexes = pages.map((_, idx) => idx);
        const copiedPages = await finalDoc.copyPages(oneEmployeeDoc, pageIndexes);
        copiedPages.forEach((page) => finalDoc.addPage(page));
      }

      const finalBytes = await finalDoc.save();
      const blob = new Blob([finalBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "Swastik_All_Employees_Reports_Final.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed generating combined PDF", error);
      alert("PDF generation failed. Please check console once.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ padding: "16px" }}>
      <button onClick={buildFinalPdf} disabled={isGenerating}>
        {isGenerating ? "Generating Final PDF..." : "Generate Final PDF"}
      </button>
      <div style={{ marginTop: "8px", fontSize: "14px" }}>
        Employees to process: {employeeData.length}
      </div>
    </div>
  );
};

export default FakeMasterPdfWithInjectedData;
