const { body } = require("express-validator");
const { orderShippingStatuses, orderPaymentStatuses } = require("../constants");

const phoneRegEx = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

const validator = {
  toName: body("toName", "Tên không được để trống").notEmpty().trim(),
  toPhone: body("toPhone")
    .trim()
    .notEmpty()
    .withMessage("Số điện thoại không được để trống")
    .matches(phoneRegEx)
    .withMessage("Số điện thoại không hợp lệ"),
  toEmail: body("toEmail").isEmail().withMessage("Email không hợp lệ").normalizeEmail({ gmail_remove_dots: false }),
  toAddress: body("toAddress").trim().notEmpty().withMessage("Địa chỉ không được để trống"),
  products: body("products").isArray().withMessage("Danh sách sản phẩm không hợp lệ"),
  totalProductsPrice: body("totalProductsPrice").isNumeric().withMessage("Tổng tiền sản phẩm phải là số"),
  shippingPrice: body("shippingPrice").isNumeric().withMessage("Phí vận chuyển phải là số"),
  totalPrice: body("totalPrice").isNumeric().withMessage("Tổng tiền đơn hàng phải là số"),
  orderId: body("orderId").isMongoId().withMessage("Mã đơn hàng không hợp lệ"),
  shippingStatus: body("shippingStatus")
    .isIn(Object.values(orderShippingStatuses))
    .withMessage("Trạng thái đơn hàng không hợp lệ"),
  paymentStatus: body("paymentStatus")
    .isIn(Object.values(orderPaymentStatuses))
    .withMessage("Tình trạng thanh toán không hợp lệ"),
};

const createOrderValidations = [
  validator.toName,
  validator.toPhone,
  validator.toEmail,
  validator.toAddress,
  validator.products,
  validator.totalProductsPrice,
  validator.shippingPrice,
  validator.totalPrice,
];

const checkOutOrderValidations = [validator.orderId];

const deleteOrderValidations = [validator.orderId];

const updateOrderStatusValidations = [validator.shippingStatus, validator.paymentStatus];

module.exports = {
  createOrderValidations,
  checkOutOrderValidations,
  deleteOrderValidations,
  updateOrderStatusValidations,
};
