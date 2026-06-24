const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "pharmacist"],
      default: "pharmacist",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    resetPasswordToken: {
  type: String,
},

resetPasswordExpire: {
  type: Date,
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);