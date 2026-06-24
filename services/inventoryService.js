const Medicine = require("../models/Medicine");

const reduceStock = async (
  medicineId,
  quantity
) => {
  const medicine =
    await Medicine.findById(medicineId);

  if (!medicine) {
    throw new Error("Medicine not found");
  }

  if (medicine.stockQuantity < quantity) {
    throw new Error(
      `${medicine.name} out of stock`
    );
  }

  medicine.stockQuantity -= quantity;

  await medicine.save();

  return medicine;
};

module.exports = {
  reduceStock,
};