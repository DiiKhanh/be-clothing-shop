const { body } = require("express-validator");

const { genders } = require("../constants/index");

const phoneRegEx = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

const validator = {
  email: body("email").isEmail().withMessage("Email không hợp lệ").normalizeEmail({ gmail_remove_dots: false }),
  name: body("name", "Tên không được để trống").notEmpty().trim(),
  password: body("password", "Mật khẩu phải có ít nhất 8 ký tự").isLength({ min: 8 }).isAlphanumeric().trim(),
  confirmPassword: body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Xác nhận mật khẩu không đúng");
    }
    return true;
  }),
  phone: body("phone").trim().notEmpty().withMessage("Số điện thoại không được để trống").matches(phoneRegEx),
  address: body("address").trim().notEmpty().withMessage("Địa chỉ không được để trống"),
  gender: body("gender").isIn(Object.values(genders)).withMessage("Giới tính không hợp lệ"),
  birthday: body("birthday", "Ngày sinh không hợp lệ").isISO8601(),
  username: body("username", "Tên đăng nhập không hợp lệ").notEmpty().trim(),
};

const signupValidations = [
  validator.email,
  validator.name,
  validator.password,
  validator.confirmPassword,
  validator.phone,
  validator.address,
  validator.gender,
  validator.birthday,
];

const loginValidations = [validator.username, validator.password];

const forgotPasswordValidations = [validator.email];

const resetPasswordValidations = [validator.password, validator.confirmPassword];

module.exports = { signupValidations, loginValidations, forgotPasswordValidations, resetPasswordValidations };
