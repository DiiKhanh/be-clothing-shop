const { body, param } = require("express-validator");

const validator = {
  name: body("name", "Tên sản phẩm không được để trống").notEmpty().trim(),
  categoryId: body("categoryId").isMongoId().withMessage("Mã danh mục sản phẩm không hợp lệ"),
  productId: param("productId").isMongoId().withMessage("Mã sản phẩm không hợp lệ"),
  price: body("price").isFloat({ min: 0 }).withMessage("Giá sản phẩm phải là số và lớn hơn hoặc bằng 0"),
  description: body("description", "Mô tả sản phẩm không được để trống").notEmpty().trim(),
  mainImg: body("mainImg").notEmpty().trim().withMessage("Link ảnh không được để trống"),
  subImg: body("subImg").notEmpty().trim().withMessage("Link ảnh không được để trống"),
};

const createProductValidations = [
  validator.name,
  validator.categoryId,
  validator.price,
  validator.description,
  validator.mainImg,
  validator.subImg,
];

const updateProductValidations = [validator.name, validator.price, validator.description];

module.exports = {
  createProductValidations,
  updateProductValidations,
};
