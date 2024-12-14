const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order");
const isStaffAuth = require("../middleware/isStaffAuth");
const validationErrorHandler = require("../middleware/validationErrorHandler");
const {
  createOrderValidations,
  checkOutOrderValidations,
  deleteOrderValidations,
  updateOrderStatusValidations,
} = require("../validations/order");

router.get("/orders", orderController.getOrders);

router.get("/orders/:orderId", orderController.getOrderById);

router.post("/orders/create-order", createOrderValidations, validationErrorHandler, orderController.createOrder);

router.put("/orders/check-out", checkOutOrderValidations, validationErrorHandler, orderController.checkOutOrder);

router.delete("/orders", isStaffAuth, deleteOrderValidations, validationErrorHandler, orderController.deleteOrder);

router.put(
  "/orders/:orderId/status",
  isStaffAuth,
  updateOrderStatusValidations,
  validationErrorHandler,
  orderController.updateOrderStatus
);

module.exports = router;
