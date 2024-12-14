const { body } = require("express-validator");

const { genders } = require("../constants");

const phoneRegEx = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

const validator = {
  name: body("name", "Tên không được để trống").notEmpty().trim(),
  address: body("address").trim().notEmpty().withMessage("Địa chỉ không được để trống"),
  email: body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail({ gmail_remove_dots: false }),
  phone: body("phone").trim().notEmpty().withMessage("Số điện thoại không được để trống").matches(phoneRegEx),
  gender: body("gender").isIn(Object.values(genders)).withMessage("Giới tính không hợp lệ"),
  birthday: body("birthday", "Ngày sinh không hợp lệ").isISO8601(),
  staffId: body("staffId").isMongoId().withMessage("Mã nhân viên không hợp lệ"),
  newPassword: body("newPassword", "Mật khẩu mới phải có ít nhất 8 ký tự").isLength({ min: 8 }).isAlphanumeric().trim(),
  oldPassword: body("oldPassword", "Mật khẩu cũ không hợp lệ").isLength({ min: 8 }).isAlphanumeric().trim(),
};

const createStaffValidations = [
  validator.name,
  validator.address,
  validator.email,
  validator.phone,
  validator.gender,
  validator.birthday,
];

const updateStaffValidations = [
  validator.name,
  validator.address,
  validator.email,
  validator.phone,
  validator.gender,
  validator.birthday,
  validator.staffId,
];

const deleteStaffValidations = [validator.staffId];

const changeStaffPasswordValidations = [validator.newPassword, validator.oldPassword];

module.exports = {
  createStaffValidations,
  updateStaffValidations,
  deleteStaffValidations,
  changeStaffPasswordValidations,
};
