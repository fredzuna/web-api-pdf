const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function loadPDF(filePath) {
  try {
    const existingPdfBytes = fs.readFileSync(filePath);
    return await PDFDocument.load(existingPdfBytes);
  } catch (error) {
    console.error("Error loading PDF:", error);
    throw new Error("Failed to load PDF");
  }
}

async function fillPDF(pdfDoc, formData) {
  const form = pdfDoc.getForm();

  for (const [key, value] of Object.entries(formData)) {
    const field = form.getField(key);
    if (field) {
      field.setText(value);
    }
  }

  return pdfDoc;
}

module.exports = {
  loadPDF,
  fillPDF,
};
