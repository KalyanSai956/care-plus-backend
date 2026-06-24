const {
  extractTextFromImage,
} = require("../services/aiService");
const stringSimilarity = require("string-similarity");

const Medicine = require("../models/Medicine");

const scanPrescription = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image required",
      });
    }

    const extractedText =
      await extractTextFromImage(
        req.file.path
      );

    const medicines =
      await Medicine.find();
      console.log("OCR TEXT:");
console.log(extractedText);

console.log("MEDICINES IN DB:");
medicines.forEach((m) =>
  console.log(m.name)
);

const detectedMedicines = [];

medicines.forEach((medicine) => {
  const medicineWords = medicine.name
    .toLowerCase()
    .split(" ");

  let matched = false;

  medicineWords.forEach((word) => {
    if (
      extractedText
        .toLowerCase()
        .includes(word)
    ) {
      matched = true;
    }
  });

  if (matched) {
    detectedMedicines.push(medicine.name);
  }
});

console.log("DETECTED:", detectedMedicines);
    res.status(200).json({
      success: true,
      extractedText,
      medicines:
        detectedMedicines,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  scanPrescription,
};