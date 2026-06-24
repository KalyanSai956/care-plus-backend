const express = require("express");

const router = express.Router();

const {
  createInvoice,
  getInvoices,
} = require("../controllers/invoiceController");

const {
  generateInvoicePDF,
} = require("../controllers/pdfController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, createInvoice);

router.get("/", protect, getInvoices);
router.get(
  "/:id/pdf",
  protect,
  generateInvoicePDF
);


module.exports = router;