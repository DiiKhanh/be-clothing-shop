const express = require("express");
const router = express.Router();

const paymentController = require("../controllers/payment");

router.get("/payments/vnpay", paymentController.checkOutVNPay);

module.exports = router;
