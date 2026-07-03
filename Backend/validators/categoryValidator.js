const { body, param } = require("express-validator");

exports.createCategoryValidator = [
  body("name").notEmpty().withMessage("Category name is required"),

  body("slug").notEmpty().withMessage("Slug is required"),
];

exports.updateCategoryValidator = [
  param("id").isMongoId().withMessage("Invalid category ID"),

  body("name").optional().notEmpty().withMessage("Category name cannot be empty"),

  body("slug").optional().notEmpty().withMessage("Slug cannot be empty"),
];

exports.categoryIdValidator = [
  param("id").isMongoId().withMessage("Invalid category ID"),
];