const PDFDocument = require("pdfkit");

const generatePDF = (
  invoice,
  response
) => {
  const doc = new PDFDocument();

  response.setHeader(
    "Content-Type",
    "application/pdf"
  );

  response.setHeader(
    "Content-Disposition",
    `attachment; filename=${invoice.invoiceNumber}.pdf`
  );

  doc.pipe(response);

  doc.fontSize(22).text(
    "Care Plus Pharmacy"
  );

  doc.moveDown();

  doc.text(
    `Invoice No: ${invoice.invoiceNumber}`
  );

  doc.text(
    `Customer: ${invoice.customerName}`
  );

  doc.text(
    `Phone: ${invoice.customerPhone}`
  );

  doc.moveDown();

  invoice.items.forEach((item) => {
    doc.text(
      `${item.medicine.name} | Qty: ${item.quantity} | ₹${item.subtotal}`
    );
  });

  doc.moveDown();

  doc.fontSize(18).text(
    `Total: ₹${invoice.totalAmount}`
  );

  doc.end();
};

module.exports = generatePDF;