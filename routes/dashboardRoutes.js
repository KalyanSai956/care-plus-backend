const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getRevenueStats,
  getTopSellingMedicines,
  getRevenueTrend,
  getLowStockMedicines,
getExpiringMedicines
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");

router.get("/stats", protect, getDashboardStats);
router.get(
  "/revenue",
  protect,
  getRevenueStats
);
router.get(
  "/top-selling",
  protect,
  getTopSellingMedicines
);
router.get(
  "/revenue-trend",
  protect,
  getRevenueTrend
);
router.get(
  "/low-stock",
  protect,
  getLowStockMedicines
);

router.get(
  "/expiring",
  protect,
  getExpiringMedicines
);
module.exports = router;