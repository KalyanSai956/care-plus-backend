const Invoice = require("../models/Invoice");
const Medicine = require("../models/Medicine");

const createInvoice = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      items,
    } = req.body;

    let invoiceItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const medicine = await Medicine.findById(
        item.medicineId
      );

      if (!medicine) {
        return res.status(404).json({
          success: false,
          message: `Medicine not found`,
        });
      }

      if (medicine.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${medicine.name} out of stock`,
        });
      }

      const subtotal =
        medicine.unitPrice * item.quantity;

      invoiceItems.push({
        medicine: medicine._id,
        quantity: item.quantity,
        unitPrice: medicine.unitPrice,
        subtotal,
      });

      totalAmount += subtotal;

      medicine.stockQuantity -= item.quantity;

      await medicine.save();
      if (medicine.stockQuantity < 10) {
  await sendEmail({
    email: req.user.email,
    subject: "Low Stock Alert",
    message: `
      <h2>Low Stock Alert</h2>
      <p>${medicine.name} has only ${medicine.stockQuantity} units remaining.</p>
    `,
  });
}
    }

    const invoice = await Invoice.create({
      invoiceNumber:
        "INV-" + Date.now(),
      customerName,
      customerPhone,
      items: invoiceItems,
      totalAmount,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Invoice generated",
      invoice,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("createdBy", "name role")
      .populate("items.medicine", "name");

    res.status(200).json({
      success: true,
      invoices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createInvoice,
  getInvoices,
};