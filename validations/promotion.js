const { body, param } = require("express-validator");

const validator = {
  name: body("name", "Tên khuyến mãi không được rỗng").notEmpty().trim(),
  description: body("description", "Mô tả khuyến mãi không được rỗng").notEmpty().trim(),
  percentage: body("percentage").isInt({ min: 5, max: 100 }).withMessage("Phần trăm khuyến mãi không hợp lệ"),
  startDate: body("startDate", "Ngày bắt đầu không hợp lệ").isISO8601().toDate(),
  endDate: body("endDate", "Ngày kết thúc không hợp lệ").isISO8601().toDate(),
  amount: body("amount").isInt().withMessage("Số lượng khuyến mãi không hợp lệ"),
  minPrice: body("minPrice").isInt().withMessage("Số lượng khuyến mãi không hợp lệ"),
  promotionParamId: param("promotionId").isMongoId().withMessage("Mã sản phẩm không hợp lệ"),
  promotionBodyId: body("promotionId").isMongoId().withMessage("Mã khuyễn mãi không hợp lệ"),
  customerId: body("customerId").isMongoId().withMessage("Mã khách hàng không hợp lệ"),
};

const createPromotionValidations = [
  validator.name,
  validator.description,
  validator.percentage,
  validator.startDate,
  validator.endDate,
  validator.amount,
  validator.minPrice,
];

const editPromotionValidations = [
  validator.name,
  validator.description,
  validator.percentage,
  validator.startDate,
  validator.endDate,
  validator.amount,
  validator.promotionParamId,
  validator.minPrice,
];

const deletePromotionValidations = [validator.promotionParamId];

const savePromotionValidations = [validator.promotionBodyId, validator.customerId];

const removePromotionValidations = [validator.promotionParamId];

const updatePromotionQuantityValidations = [validator.promotionParamId];

module.exports = {
  createPromotionValidations,
  deletePromotionValidations,
  editPromotionValidations,
  savePromotionValidations,
  removePromotionValidations,
  updatePromotionQuantityValidations,
};
