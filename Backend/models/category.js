const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    icon: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
// HELPER FUNCTIONS
module.exports.getAllCategories = async () => {
  return await Category.find({}, { __v: 0 }).sort({ createdAt: -1 });
};

module.exports.getCategoryById = async (category_id) => {
  return await Category.findOne({ _id: category_id }, { __v: 0 });
};

module.exports.getCategoryByName = async (name) => {
  return await Category.findOne({
    name: name.trim(),
  });
};

module.exports.getCategoryBySlug = async (slug) => {
  return await Category.findOne({
    slug: slug.toLowerCase().trim(),
  });
};