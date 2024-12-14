const express = require("express");
const router = express.Router();

const receiptController = require("../controllers/receipt");
const isStaffAuth = require("../middleware/isStaffAuth");
const { createReceiptValidations, updateReceiptValidations } = require("../validations/receipt");
const validationErrorHandler = require("../middleware/validationErrorHandler");

router.get("/receipts", receiptController.getReceipts);

router.get("/receipts/:receiptId", receiptController.getReceiptById);

router.post(
  "/receipts/create",
  isStaffAuth,
  createReceiptValidations,
  validationErrorHandler,
  receiptController.importGoods
);

router.put(
  "/receipts/update",
  isStaffAuth,
  updateReceiptValidations,
  validationErrorHandler,
  receiptController.updateReceipt
);

module.exports = router;
