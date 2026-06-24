const PDFDocument = require("pdfkit");
const Invoice = require("../models/Invoice");

const generateInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("items.medicine", "name")
      .populate("createdBy", "name");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    const doc = new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${invoice.invoiceNumber}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(24).text("Care Plus Pharmacy", {
      align: "center",
    });

    doc.moveDown();

    // Invoice Details
    doc.fontSize(12);
    doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text(`Customer Name: ${invoice.customerName}`);
    doc.text(`Phone: ${invoice.customerPhone}`);
    doc.text(
      `Date: ${new Date(
        invoice.createdAt
      ).toLocaleDateString()}`
    );

    doc.moveDown();

    // Medicines
    doc.fontSize(16).text("Items");

    doc.moveDown();

    invoice.items.forEach((item) => {
      doc.text(
        `${item.medicine.name} | Qty: ${item.quantity} | Unit Price: ₹${item.unitPrice} | Subtotal: ₹${item.subtotal}`
      );
    });

    doc.moveDown();

    doc.fontSize(18).text(
      `Total Amount: ₹${invoice.totalAmount}`
    );

    doc.moveDown();

    doc.fontSize(12).text(
      "Thank you for visiting Care Plus Pharmacy.",
      {
        align: "center",
      }
    );

    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  generateInvoicePDF,
};