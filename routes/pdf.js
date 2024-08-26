const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

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

router.get("/fill-pdf", async (req, res) => {
  try {
    const pdfPath = path.join("templates", "template1.pdf");    

    const formData = req.query;
    console.log("Form Data:", formData);

    const pdfDoc = await loadPDF(pdfPath);
    await fillPDF(pdfDoc, formData);

    const pdfBytes = await pdfDoc.save();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=test.pdf",
      "Content-Length": pdfBytes.length, // Add Content-Length header
    });

    // Send the filled PDF back to the client
    res.send(Buffer.from(pdfBytes)); // Ensure buffer is used for binary data
  } catch (error) {
    console.error("Error in /fill-pdf route:", error);
    res.status(500).send("An error occurred while processing the PDF");
  }
});

module.exports = router;
