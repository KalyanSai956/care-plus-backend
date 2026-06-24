const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    genericName: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
    },

    unitPrice: {
      type: Number,
      required: true,
    },

    batchNumber: {
      type: String,
      required: true,
    },

    manufacturer: {
      type: String,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    supplier: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Medicine",
  medicineSchema
);