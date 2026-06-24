const Medicine = require("../models/Medicine");
const Invoice = require("../models/Invoice");
const chatBot = async (req, res) => {
  try {
    const { message } = req.body;

    const msg = message.toLowerCase();

    // Hello
    if (msg.includes("hello")) {
      return res.json({
        success: true,
        reply:
          "Hello 👋 I am Care Plus Assistant. Ask me about medicines, stock or inventory.",
      });
    }

    // Help
    if (msg.includes("help")) {
      return res.json({
        success: true,
        reply: `
Available Commands:

• total medicines
• low stock
• inventory value
• help
        `,
      });
    }

    // Total Medicines
    if (msg.includes("total medicines")) {
      const count =
        await Medicine.countDocuments();

      return res.json({
        success: true,
        reply: `💊 Total medicines available: ${count}`,
      });
    }
    if (msg.includes("today revenue")) {

  const invoices =
    await Invoice.find();

  const today = new Date();

  const todayInvoices =
    invoices.filter(
      (invoice) =>
        new Date(
          invoice.createdAt
        ).toDateString() ===
        today.toDateString()
    );

  const revenue =
    todayInvoices.reduce(
      (sum, invoice) =>
        sum + invoice.totalAmount,
      0
    );

  return res.json({
    success: true,
    reply:
      `💰 Today's Revenue: ₹${revenue}`,
  });
}

if (msg.includes("monthly revenue")) {

  const invoices =
    await Invoice.find();

  const today = new Date();

  const monthlyInvoices =
    invoices.filter(
      (invoice) => {
        const date =
          new Date(
            invoice.createdAt
          );

        return (
          date.getMonth() ===
            today.getMonth() &&
          date.getFullYear() ===
            today.getFullYear()
        );
      }
    );

  const revenue =
    monthlyInvoices.reduce(
      (sum, invoice) =>
        sum + invoice.totalAmount,
      0
    );

  return res.json({
    success: true,
    reply:
      `📈 Monthly Revenue: ₹${revenue}`,
  });
}

if (
  msg.includes("expiring") ||
  msg.includes("expiry")
) {

  const today = new Date();

  const next30Days =
    new Date();

  next30Days.setDate(
    today.getDate() + 30
  );

  const medicines =
    await Medicine.find({
      expiryDate: {
        $gte: today,
        $lte: next30Days,
      },
    });

  if (
    medicines.length === 0
  ) {
    return res.json({
      success: true,
      reply:
        "✅ No medicines expiring soon.",
    });
  }

  const list =
    medicines
      .map((m) => m.name)
      .join(", ");

  return res.json({
    success: true,
    reply:
      `⏰ Expiring Soon:\n${list}`,
  });
}

if (
  msg.startsWith("search ")
) {

  const medicineName =
    msg.replace(
      "search ",
      ""
    );

  const medicine =
    await Medicine.findOne({
      name: {
        $regex:
          medicineName,
        $options: "i",
      },
    });

  if (!medicine) {
    return res.json({
      success: true,
      reply:
        "❌ Medicine not found.",
    });
  }

  return res.json({
    success: true,
    reply:
      `💊 ${medicine.name}
Stock: ${medicine.stockQuantity}
Price: ₹${medicine.unitPrice}`,
  });
}

    // Low Stock
    if (msg.includes("low stock")) {
      const medicines =
        await Medicine.find({
          stockQuantity: { $lt: 10 },
        });

      if (
        medicines.length === 0
      ) {
        return res.json({
          success: true,
          reply:
            "✅ No low stock medicines found.",
        });
      }

      const list =
        medicines
          .map(
            (m) =>
              `${m.name} (${m.stockQuantity})`
          )
          .join(", ");

      return res.json({
        success: true,
        reply:
          `⚠️ Low Stock Medicines:\n${list}`,
      });
    }

    // Inventory Value
    if (
      msg.includes(
        "inventory value"
      )
    ) {
      const medicines =
        await Medicine.find();

      const total =
        medicines.reduce(
          (sum, medicine) =>
            sum +
            medicine.stockQuantity *
              medicine.unitPrice,
          0
        );

      return res.json({
        success: true,
        reply:
          `💰 Inventory Value: ₹${total}`,
      });
    }

    // Default
    return res.json({
      success: true,
      reply:
        "I didn't understand that. Type 'help' to see available commands.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  chatBot,
};