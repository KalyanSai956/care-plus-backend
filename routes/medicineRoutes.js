const express = require("express");

const router = express.Router();

const {
  createMedicine,
  getMedicines,
  updateMedicine,
  deleteMedicine,
  lowStockMedicines,
  expiringMedicines,
    checkExpiryAlerts,
} = require("../controllers/medicineController");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, createMedicine);

router.get("/", protect, getMedicines);
router.put("/:id", protect, updateMedicine);

router.delete("/:id", protect, deleteMedicine);

router.get("/low-stock", protect, lowStockMedicines);
router.get(
  "/expiring",
  protect,
  expiringMedicines
);
router.delete(
  "/:id",
  protect,
  deleteMedicine
);
router.get(
  "/check-expiry-alerts",
  protect,
  checkExpiryAlerts
);

module.exports = router;