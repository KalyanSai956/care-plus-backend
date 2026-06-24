const Invoice = require("../models/Invoice");

const createInvoiceRecord = async (
  invoiceData
) => {
  return await Invoice.create(invoiceData);
};

module.exports = {
  createInvoiceRecord,
};