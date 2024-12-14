const express = require("express");
const router = express.Router();

const isAuth = require("../middleware/isCustomerAuth");
const wishlistController = require("../controllers/wishlist");
const validationErrorHandler = require("../middleware/validationErrorHandler");
const { addToWishlistValidations, removeFromWishlistValidations } = require("../validations/wishlist");

router.post(
  "/wishlist/add",
  isAuth,
  addToWishlistValidations,
  validationErrorHandler,
  wishlistController.addToWishlist
);

router.post(
  "/wishlist/remove",
  isAuth,
  removeFromWishlistValidations,
  validationErrorHandler,
  wishlistController.removeFromWishlist
);

module.exports = router;
