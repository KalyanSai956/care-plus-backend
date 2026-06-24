const Medicine = require("../models/Medicine");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");
const createMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.create({
      ...req.body,
      owner: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Medicine added successfully",
      medicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();

    res.status(200).json({
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
const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Medicine updated",
      medicine,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const deleteMedicine = async (
  req,
  res
) => {
  try {
    const medicine =
      await Medicine.findById(
        req.params.id
      );

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message:
          "Medicine not found",
      });
    }

    await medicine.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Medicine deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const lowStockMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({
      stockQuantity: { $lt: 10 },
    });

    res.status(200).json({
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
const expiringMedicines = async (req, res) => {
  try {
    const today = new Date();

    const next30Days = new Date();

    next30Days.setDate(
      today.getDate() + 30
    );

    const medicines = await Medicine.find({
      expiryDate: {
        $gte: today,
        $lte: next30Days,
      },
    });

    res.status(200).json({
      success: true,
      count: medicines.length,
      medicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const checkExpiryAlerts = async (
  req,
  res
) => {
  try {
    const today = new Date();

    const next30Days = new Date();

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

    if (medicines.length > 0) {
      const medicineList =
        medicines
          .map(
            (m) =>
              `${m.name} (${new Date(
                m.expiryDate
              ).toLocaleDateString()})`
          )
          .join("<br>");

     const user =
  await User.findById(
    req.user.id
  );

await sendEmail({
  email: user.email,
  subject:
    "Medicine Expiry Alert",
  message: `
      <h2>Expiring Medicines</h2>
      <p>The following medicines will expire within 30 days:</p>
      <br>
      ${medicineList}
    `,
});
    }

    res.json({
      success: true,
      count: medicines.length,
    });
  }catch (error) {
  console.error(
    "Expiry Alert Error:",
    error
  );

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

module.exports = {
  createMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
  lowStockMedicines,
  expiringMedicines,
  deleteMedicine,
    checkExpiryAlerts,
};