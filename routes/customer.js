const express = require("express");
const router = express.Router();

const isCustomerAuth = require("../middleware/isCustomerAuth");
const isStaffAuth = require("../middleware/isStaffAuth");
const customerController = require("../controllers/customer");
const validationErrorHandler = require("../middleware/validationErrorHandler");
const {
  updateProfileValidations,
  verifyPhoneNumberValidations,
  changePasswordValidations,
  addAddressValidations,
  editAddressValidations,
  removeAddressValidations,
  updateAddressToDefault,
  verifyEmailValidations,
} = require("../validations/customer");

router.get("/customer", isStaffAuth, customerController.getCustomers);

router.get("/customer/:customerId", isStaffAuth, customerController.getCustomerById);

router.post(
  "/customer/update-profile",
  isCustomerAuth,
  updateProfileValidations,
  validationErrorHandler,
  customerController.updateProfile
);

router.post(
  "/customer/verify-phone-number",
  isCustomerAuth,
  verifyPhoneNumberValidations,
  validationErrorHandler,
  customerController.verifyPhoneNumber
);

router.post(
  "/customer/verify-email",
  isCustomerAuth,
  verifyEmailValidations,
  validationErrorHandler,
  customerController.verifyEmail
);

router.post("/customer/user-is-verified", isCustomerAuth, customerController.updateUserIsVerified);

router.post(
  "/customer/change-password",
  isCustomerAuth,
  changePasswordValidations,
  validationErrorHandler,
  customerController.changePassword
);

router.post(
  "/customer/add-address",
  isCustomerAuth,
  addAddressValidations,
  validationErrorHandler,
  customerController.addAddress
);

router.post(
  "/customer/edit-address",
  isCustomerAuth,
  editAddressValidations,
  validationErrorHandler,
  customerController.editAddress
);

router.post(
  "/customer/remove-address",
  isCustomerAuth,
  removeAddressValidations,
  validationErrorHandler,
  customerController.removeAddress
);

router.post(
  "/customer/update-address-to-default",
  isCustomerAuth,
  updateAddressToDefault,
  validationErrorHandler,
  customerController.updateAddressToDefault
);

module.exports = router;
