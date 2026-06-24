const express = require("express");
const router = express.Router();

const {
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

router.post("/login", login);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password/:token",
  resetPassword
);

router.get(
  "/profile",
  protect,
  (req, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  }
);

module.exports = router;