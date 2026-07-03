const { body } = require("express-validator");

exports.createJobValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("categoryId").notEmpty().withMessage("Category is required"),
  body("budget").notEmpty().withMessage("Budget is required").isNumeric().withMessage("Budget must be a number"),
];