const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");
const validationErrorHandler = require("../middleware/validationErrorHandler");
const {
  signupValidations,
  forgotPasswordValidations,
  resetPasswordValidations,
  loginValidations,
} = require("../validations/auth");

router.post("/login", loginValidations, validationErrorHandler, authController.login);

router.post("/login-with-social-media-account", authController.loginWithSocialMediaAccount);

router.post("/signup", signupValidations, validationErrorHandler, authController.signup);

router.post("/forgot-password", forgotPasswordValidations, validationErrorHandler, authController.forgotPassword);

router.post("/reset-password", resetPasswordValidations, validationErrorHandler, authController.resetPassword);

router.post("/check-reset-token", authController.checkResetToken);

router.post("/staffs/login", loginValidations, validationErrorHandler, authController.staffLogin);

// router.post("/test-email", authController.testEmail)

module.exports = router;
