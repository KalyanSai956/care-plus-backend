const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
await sendEmail({
  email: user.email,
  subject: "Login Alert",
  message: `
    <h2>Login Successful</h2>
    <p>Hello ${user.name},</p>
    <p>Your Care Plus account was accessed successfully.</p>
    <p>Time: ${new Date().toLocaleString()}</p>
  `,
});
    // Send response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const forgotPassword = async (
  req,
  res
) => {
  try {
    const { email } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found",
      });
    }

    const resetToken =
      crypto
        .randomBytes(20)
        .toString("hex");

    user.resetPasswordToken =
      resetToken;

    user.resetPasswordExpire =
      Date.now() +
      10 * 60 * 1000;

    await user.save();

    const resetUrl =
      `http://localhost:5173/reset-password/${resetToken}`;

    const message = `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${resetUrl}">
        Reset Password
      </a>
    `;

    await sendEmail({
      email: user.email,
      subject:
        "Password Reset",
      message,
    });

    res.status(200).json({
      success: true,
      message:
        "Reset email sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const resetPassword = async (
  req,
  res
) => {
  try {
    const user =
      await User.findOne({
        resetPasswordToken:
          req.params.token,

        resetPasswordExpire:
          { $gt: Date.now() },
      });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired token",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        req.body.password,
        10
      );

    user.password =
      hashedPassword;

    user.resetPasswordToken =
      undefined;

    user.resetPasswordExpire =
      undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
};