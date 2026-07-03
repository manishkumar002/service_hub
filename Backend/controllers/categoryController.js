const { validationResult } = require("express-validator");
const ErrorHandler = require("../utils/errorHandler");
const Category = require("../models/category");
const {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  getCategoryBySlug,
} = require("../models/category");
// GET ALL CATEGORIES
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    return res.status(200).json({
      status: "success",
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.error("Get Categories Error:", error);
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};
// GET CATEGORY DETAILS
exports.getCategoryDetails = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorObj = {};
      errors.array().forEach((err) => {
        if (!errorObj[err.path]) errorObj[err.path] = err.msg;
      });
      return res.status(422).json({
        status: "error",
        errors: errorObj,
      });
    }
    const { id } = req.params;
    const category = await getCategoryById(id);
    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }
    return res.status(200).json({
      status: "success",
      data: category,
    });
  } catch (error) {
    console.error("Get Category Details Error:", error);
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};
// CREATE CATEGORY (ADMIN)
exports.createCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorObj = {};
      errors.array().forEach((err) => {
        if (!errorObj[err.path]) errorObj[err.path] = err.msg;
      });
      return res.status(422).json({
        status: "error",
        errors: errorObj,
      });
    }
    const { name, slug, icon, description, isActive } = req.body;
    const existingName = await getCategoryByName(name);
    if (existingName) {
      return next(new ErrorHandler("Category name already exists", 400));
    }
    const existingSlug = await getCategoryBySlug(slug);
    if (existingSlug) {
      return next(new ErrorHandler("Category slug already exists", 400));
    }
    const category = await Category.create({
      name: name.trim(),
      slug: slug.toLowerCase().trim(),
      icon: icon || "",
      description: description || "",
      isActive: isActive !== undefined ? isActive : true,
    });
    const categoryData = await getCategoryById(category._id);
    return res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: categoryData,
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};
// UPDATE CATEGORY (ADMIN)
exports.updateCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorObj = {};
      errors.array().forEach((err) => {
        if (!errorObj[err.path]) errorObj[err.path] = err.msg;
      });
      return res.status(422).json({
        status: "error",
        errors: errorObj,
      });
    }

    const { id } = req.params;
    const { name, slug, icon, description, isActive } = req.body;
    const category = await getCategoryById(id);
    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }
    if (name && name.trim() !== category.name) {
      const existingName = await getCategoryByName(name);
      if (existingName && existingName._id.toString() !== id) {
        return next(new ErrorHandler("Category name already exists", 400));
      }
    }
    if (slug && slug.toLowerCase().trim() !== category.slug) {
      const existingSlug = await getCategoryBySlug(slug);
      if (existingSlug && existingSlug._id.toString() !== id) {
        return next(new ErrorHandler("Category slug already exists", 400));
      }
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        ...(name && { name: name.trim() }),
        ...(slug && { slug: slug.toLowerCase().trim() }),
        ...(icon !== undefined && { icon }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
      { new: true, runValidators: true, projection: { __v: 0 } }
    );
    return res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Update Category Error:", error);
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};
// DELETE CATEGORY (ADMIN)
exports.deleteCategory = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorObj = {};
      errors.array().forEach((err) => {
        if (!errorObj[err.path]) errorObj[err.path] = err.msg;
      });
      return res.status(422).json({
        status: "error",
        errors: errorObj,
      });
    }
    const { id } = req.params;
    const category = await getCategoryById(id);
    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }
    await Category.findByIdAndDelete(id);
    return res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete Category Error:", error);
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};