/**
 * Define enum for models
 */

// Product States
const productStates = Object.freeze({
  ACTIVE: "Đang bán",
  PAUSE: "Ngừng bán",
  OUT_OF_STOCK: "Hết hàng",
});

const orderShippingStatuses = {
  PREPARING: "Đang chuẩn bị",
  DELIVERING: "Đang giao",
  RECEIVED: "Đã nhận",
  CANCLED: "Đã hủy",
};

const orderPaymentStatuses = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
};

// Role Names
const roleNames = Object.freeze({
  OWNER: "Chủ cửa hàng",
  STAFF: "Nhân viên",
  CLIENT: "Khách hàng",
});

// User: Gender & Status
const genders = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Khác",
};

const staffStates = {
  ACTIVE: "Đang làm",
  NONACTIVE: "Đã nghỉ",
};

const sizes = {
  SIZE_S: "S",
  SIZE_M: "M",
  SIZE_L: "L",
  SIZE_XL: "XL",
};

const ITEMS_PER_PAGE = 12;

const orderShippingMethods = {
  FAST_DELIVERY: "Giao hàng nhanh",
};

const orderPaymentMethods = {
  COD: "Thanh toán khi nhận hàng",
  ONLINE_VNPAY: "Thanh toán qua VNPay",
};

module.exports = {
  productStates,
  orderShippingStatuses,
  orderPaymentStatuses,
  roleNames,
  genders,
  staffStates,
  sizes,
  ITEMS_PER_PAGE,
  orderShippingMethods,
  orderPaymentMethods,
};
