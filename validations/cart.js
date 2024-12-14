const { body } = require("express-validator");
const { sizes } = require("../constants");

const validator = {
  productId: body("productId").isMongoId().withMessage("Mã sản phẩm không hợp lệ"),
  size: body("size").isIn(Object.values(sizes)).withMessage("Size không hợp lệ"),
  quantity: body("quantity").isNumeric().withMessage("Số lượng sản phẩm phải là số"),
  items: body("items").isArray().withMessage("Danh sách sản phẩm không hợp lệ"),
};

const addToCartValidations = [validator.productId, validator.size, validator.quantity];

const updateQuantityValidations = [validator.productId, validator.size, validator.quantity];

const removeCartItemValidations = [validator.productId, validator.size];

const removeCartItemsValidations = [validator.items];

module.exports = {
  addToCartValidations,
  updateQuantityValidations,
  removeCartItemValidations,
  removeCartItemsValidations,
};
