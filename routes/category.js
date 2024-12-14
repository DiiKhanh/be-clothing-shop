const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category");
const {
  createCategoryValidations,
  updateCategoryValidations,
  deleteCategoryValidations,
} = require("../validations/category");
const validationErrorHandler = require("../middleware/validationErrorHandler");
const isStaffAuth = require("../middleware/isStaffAuth");

router.get("/categories", categoryController.getCategories);

router.get("/categories/:categoryId/products", categoryController.getProductsByCategory);

router.post(
  "/categories/create",
  isStaffAuth,
  createCategoryValidations,
  validationErrorHandler,
  categoryController.createCategory
);

router.put(
  "/categories/update",
  isStaffAuth,
  updateCategoryValidations,
  validationErrorHandler,
  categoryController.updateCategory
);

router.post(
  "/categories/delete",
  isStaffAuth,
  deleteCategoryValidations,
  validationErrorHandler,
  categoryController.deleteCategory
);

module.exports = router;
