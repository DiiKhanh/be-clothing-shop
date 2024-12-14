const express = require("express");
const router = express.Router();

const isStaffAuth = require("../middleware/isStaffAuth");
const isCustomerAuth = require("../middleware/isCustomerAuth");
const promotionController = require("../controllers/promotion");
const {
  createPromotionValidations,
  deletePromotionValidations,
  editPromotionValidations,
  savePromotionValidations,
  removePromotionValidations,
  updatePromotionQuantityValidations,
} = require("../validations/promotion");
const validationErrorHandler = require("../middleware/validationErrorHandler");

router.get("/promotions", promotionController.getPromotions);

router.get("/promotions/:promotionId", promotionController.getPromotionById);

router.post(
  "/promotions",
  isStaffAuth,
  createPromotionValidations,
  validationErrorHandler,
  promotionController.createPromotion
);

router.put(
  "/promotions/:promotionId",
  isStaffAuth,
  editPromotionValidations,
  validationErrorHandler,
  promotionController.editPromotion
);

router.delete(
  "/promotions/:promotionId",
  isStaffAuth,
  deletePromotionValidations,
  validationErrorHandler,
  promotionController.deletePromotion
);

router.post(
  "/promotions/save",
  isCustomerAuth,
  savePromotionValidations,
  validationErrorHandler,
  promotionController.savePromotion
);

router.delete(
  "/promotions/customer/:promotionId",
  isCustomerAuth,
  removePromotionValidations,
  validationErrorHandler,
  promotionController.removePromotion
);

router.put(
  "/promotions/:promotionId/quantity",
  updatePromotionQuantityValidations,
  validationErrorHandler,
  promotionController.updatePromotionQuantity
);

router.put("/promotions/:promotionId/restore", promotionController.restorePromotion);

module.exports = router;
