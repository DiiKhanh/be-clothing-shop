const express = require("express");
const router = express.Router();

const isStaffAuth = require("../middleware/isStaffAuth");
const staffController = require("../controllers/staff");
const validationErrorHandler = require("../middleware/validationErrorHandler");
const {
  createStaffValidations,
  updateStaffValidations,
  deleteStaffValidations,
  changeStaffPasswordValidations,
} = require("../validations/staff");

router.get("/staffs", isStaffAuth, staffController.getStaffs);

router.get("/staffs/:staffId", isStaffAuth, staffController.getStaffById);

router.post("/staffs/create", isStaffAuth, createStaffValidations, validationErrorHandler, staffController.createStaff);

router.put("/staffs/update", isStaffAuth, updateStaffValidations, validationErrorHandler, staffController.updateStaff);

router.post("/staffs/delete", isStaffAuth, deleteStaffValidations, validationErrorHandler, staffController.deleteStaff);

router.post(
  "/staffs/change-password",
  isStaffAuth,
  changeStaffPasswordValidations,
  validationErrorHandler,
  staffController.changePassword
);

module.exports = router;
