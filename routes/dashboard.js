const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboard");
const isStaffAuth = require("../middleware/isStaffAuth");

router.get("/dashboard/stat-card", isStaffAuth, dashboardController.getStatCardData);

router.get("/dashboard/revenue/:days", isStaffAuth, dashboardController.getRevenue);

router.get("/dashboard/best-seller", isStaffAuth, dashboardController.getBestSellerProducts);

router.get("/dashboard/category/percentage", isStaffAuth, dashboardController.getPercentageCategories);

router.get("/dashboard/sold-quantity", isStaffAuth, dashboardController.getSoldQuantityProducts);

router.get("/dashboard/trend-of-categories", isStaffAuth, dashboardController.getTrendOfCategories);

module.exports = router;
