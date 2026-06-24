const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  scanPrescription,
} = require(
  "../controllers/aiController"
);

router.post(
  "/prescription",
  protect,
  upload.single("image"),
  scanPrescription
);

module.exports = router;