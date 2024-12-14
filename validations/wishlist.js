const { body } = require("express-validator");

const validator = {
  productId: body("productId").isMongoId().withMessage("Mã sản phẩm không hợp lệ"),
};

const addToWishlistValidations = [validator.productId];

const removeFromWishlistValidations = [validator.productId];

module.exports = { addToWishlistValidations, removeFromWishlistValidations };
