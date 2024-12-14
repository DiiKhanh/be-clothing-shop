const { body } = require("express-validator");

const validator = {
  name: body("name", "Tên danh mục không được để trống").notEmpty().trim(),
  types: body("types").isArray().withMessage("Danh sách loại danh mục không hợp lệ"),
  id: body("categoryId").isMongoId().withMessage("Mã danh mục sản phẩm không hợp lệ"),
};

const createCategoryValidations = [validator.name];

const updateCategoryValidations = [validator.name, validator.types, validator.id];

const deleteCategoryValidations = [validator.id];

module.exports = { createCategoryValidations, updateCategoryValidations, deleteCategoryValidations };
