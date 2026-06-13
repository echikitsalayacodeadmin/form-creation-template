import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const PFT_TITLE_CONFIG = {
  headerHeight: 10,
  fontSize: 12,
  rectYOffset: 40,
  rectHeightExtra: 5,
  textYOffset: 33,
};

const AUDIOMETRY_TITLE_CONFIG = {
  headerHeight: 35,
  fontSize: 14,
  rectYOffset: 0,
  rectHeightExtra: 0,
  textYOffset: 10,
};

async function addReportTitleToPdf(pdfUrl, titleText, config) {
  const pdfBytes = await fetch(pdfUrl).then((r) => r.arrayBuffer());
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { headerHeight, fontSize, rectYOffset, rectHeightExtra, textYOffset } =
    config;

  for (const page of pdfDoc.getPages()) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(titleText, fontSize);
    const centerX = (width - textWidth) / 2;

    page.drawRectangle({
      x: 0,
      y: height - headerHeight - rectYOffset,
      width,
      height: headerHeight + rectHeightExtra,
      color: rgb(1, 1, 1),
    });

    page.drawText(titleText, {
      x: centerX,
      y: height - fontSize - textYOffset,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  return new Blob([await pdfDoc.save()], { type: "application/pdf" });
}

export function addPftReportTitleToPdf(pdfUrl, titleText) {
  return addReportTitleToPdf(pdfUrl, titleText, PFT_TITLE_CONFIG);
}

export function addAudiometryReportTitleToPdf(pdfUrl, titleText) {
  return addReportTitleToPdf(pdfUrl, titleText, AUDIOMETRY_TITLE_CONFIG);
}
