const { body } = require("express-validator");

exports.registerValidator = [
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["client", "provider"])
    .withMessage("Only client or provider can register"),

  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 digits"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

exports.loginValidator = [
  body("password").notEmpty().withMessage("Password is required"),

  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phone) {
      throw new Error("Either email or phone is required");
    }
    return true;
  }),
];

exports.updateProfileValidator = [
  body("fullName")
    .optional()
    .notEmpty()
    .withMessage("Full name cannot be empty"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please enter a valid email"),

  body("phone")
    .optional()
    .notEmpty()
    .withMessage("Phone cannot be empty"),

  body("experienceYears")
    .optional()
    .isNumeric()
    .withMessage("Experience years must be a number"),

  body("hourlyRate")
    .optional()
    .isNumeric()
    .withMessage("Hourly rate must be a number"),

  body("availability")
    .optional()
    .isIn(["available", "busy", "offline"])
    .withMessage("Availability must be available, busy, or offline"),

  body("location.type")
    .optional()
    .equals("Point")
    .withMessage("Location type must be Point"),

  body("location.coordinates")
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage("Coordinates must be [longitude, latitude]"),
];