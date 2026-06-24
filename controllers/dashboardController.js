const Medicine = require("../models/Medicine");
const Invoice = require("../models/Invoice");

const getDashboardStats = async (req, res) => {
  try {
    const totalMedicines =
      await Medicine.countDocuments();

    const lowStock =
      await Medicine.countDocuments({
        stockQuantity: { $lt: 10 },
      });

    const outOfStock =
      await Medicine.countDocuments({
        stockQuantity: 0,
      });

    const medicines =
      await Medicine.find();

    const inventoryValue =
      medicines.reduce(
        (total, medicine) =>
          total +
          medicine.stockQuantity *
            medicine.unitPrice,
        0
      );

    // Invoice Stats
    const invoices =
      await Invoice.find();

    const totalInvoices =
      invoices.length;

    const totalRevenue =
      invoices.reduce(
        (sum, invoice) =>
          sum + invoice.totalAmount,
        0
      );
      const today = new Date();

const todayInvoices = invoices.filter(
  (invoice) =>
    new Date(invoice.createdAt).toDateString() ===
    today.toDateString()
);

const todayRevenue = todayInvoices.reduce(
  (sum, invoice) =>
    sum + invoice.totalAmount,
  0
);

const monthlyInvoices =
  invoices.filter((invoice) => {
    const date = new Date(
      invoice.createdAt
    );

    return (
      date.getMonth() ===
        today.getMonth() &&
      date.getFullYear() ===
        today.getFullYear()
    );
  });

const monthlyRevenue =
  monthlyInvoices.reduce(
    (sum, invoice) =>
      sum + invoice.totalAmount,
    0
  );

    res.status(200).json({
      success: true,
      stats: {
        totalMedicines,
        lowStock,
        outOfStock,
        inventoryValue,
        totalInvoices,
        totalRevenue,
        todayRevenue,
        monthlyRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getRevenueStats = async (req, res) => {
  try {
    const invoices = await Invoice.find();

    const totalRevenue = invoices.reduce(
      (sum, invoice) => sum + invoice.totalAmount,
      0
    );

    const totalInvoices = invoices.length;

    const today = new Date();

    const todayInvoices = invoices.filter(
      (invoice) =>
        new Date(invoice.createdAt).toDateString() ===
        today.toDateString()
    );

    const todayRevenue = todayInvoices.reduce(
      (sum, invoice) => sum + invoice.totalAmount,
      0
    );

    const monthlyInvoices = invoices.filter(
      (invoice) => {
        const date = new Date(invoice.createdAt);

        return (
          date.getMonth() === today.getMonth() &&
          date.getFullYear() ===
            today.getFullYear()
        );
      }
    );

    const monthlyRevenue = monthlyInvoices.reduce(
      (sum, invoice) => sum + invoice.totalAmount,
      0
    );

    res.status(200).json({
      success: true,
      stats: {
        todayRevenue,
        monthlyRevenue,
        totalRevenue,
        totalInvoices,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getTopSellingMedicines = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate("items.medicine", "name");

    const medicineSales = {};

    invoices.forEach((invoice) => {
      invoice.items.forEach((item) => {
        const medicineName =
          item.medicine.name;

        if (!medicineSales[medicineName]) {
          medicineSales[medicineName] = 0;
        }

        medicineSales[medicineName] +=
          item.quantity;
      });
    });

    const result = Object.entries(
      medicineSales
    )
      .map(([medicine, quantitySold]) => ({
        medicine,
        quantitySold,
      }))
      .sort(
        (a, b) =>
          b.quantitySold - a.quantitySold
      );

    res.status(200).json({
      success: true,
      medicines: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getRevenueTrend = async (req, res) => {
  try {
    const trend = [
      { month: "Jan", revenue: 1200 },
      { month: "Feb", revenue: 1800 },
      { month: "Mar", revenue: 1400 },
      { month: "Apr", revenue: 2500 },
      { month: "May", revenue: 3200 },
      { month: "Jun", revenue: 4200 },
    ];

    res.status(200).json({
      success: true,
      trend,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
  const getLowStockMedicines =
  async (req, res) => {
    try {
      const medicines =
        await Medicine.find({
          stockQuantity: { $lt: 10 },
        });

      res.json({
        success: true,
        medicines,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  const getExpiringMedicines =
  async (req, res) => {
    try {
      const sixMonthsLater =
        new Date();

      sixMonthsLater.setMonth(
        sixMonthsLater.getMonth() + 6
      );

      const medicines =
        await Medicine.find({
          expiryDate: {
            $lte: sixMonthsLater,
          },
        });

      res.json({
        success: true,
        medicines,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
module.exports = {
  getDashboardStats,
  getRevenueStats,
  getTopSellingMedicines,
  getRevenueTrend,
  getLowStockMedicines,
  getExpiringMedicines
};