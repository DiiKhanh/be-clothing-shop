const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/isCustomerAuth");
const cartController = require("../controllers/cart");
const validationErrorHandler = require("../middleware/validationErrorHandler");

const {
  addToCartValidations,
  updateQuantityValidations,
  removeCartItemValidations,
  removeCartItemsValidations,
} = require("../validations/cart");

router.put("/cart/add-to-cart", isAuth, addToCartValidations, validationErrorHandler, cartController.addToCart);

router.put(
  "/cart/update-quantity",
  isAuth,
  updateQuantityValidations,
  validationErrorHandler,
  cartController.updateQuantity
);

router.put(
  "/cart/remove-item",
  isAuth,
  removeCartItemValidations,
  validationErrorHandler,
  cartController.removeCartItem
);

router.put(
  "/cart/remove-items",
  isAuth,
  removeCartItemsValidations,
  validationErrorHandler,
  cartController.removeCartItems
);

module.exports = router;
