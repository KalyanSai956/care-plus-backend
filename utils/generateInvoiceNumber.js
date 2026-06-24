const generateInvoiceNumber = () => {
  return `INV-${Date.now()}`;
};

module.exports = generateInvoiceNumber;