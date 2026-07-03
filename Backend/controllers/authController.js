const { validationResult } = require("express-validator");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/users");
const {
  getUserByEmail,
  getUserById,
  getUserByLogin,
  updateUserById,
  isEmail,
  isPhone,
} = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// REGISTER
exports.register = async (req, res, next) => {
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
    const { role, fullName, email, phone, password } = req.body;
    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return next(new ErrorHandler("Email already exists", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      role,
      fullName,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
    });
    const userData = await getUserById(user._id);
    return res.status(201).json({
      status: "success",
      message: `${role} registered successfully`,
      data: userData,
    });
  } catch (error) {
    console.error("Register Error:", error);
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

//LOGIN
exports.login = async (req, res, next) => {
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
    const { email, phone, password } = req.body;
    if ((!email && !phone) || !password) {
      return next(
        new ErrorHandler("Email/Phone and password are required", 400),
      );
    }
    const user = await getUserByLogin({ email, phone });
    if (!user) {
      return next(new ErrorHandler("Invalid email/phone", 401));
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid password", 401));
    }
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES || "7d",
      },
    );
    const userData = await getUserById(user._id);
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      role: user.role,
      data: userData,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};

// GET MY PROFILE
exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await getUserById(req.user._id);
    //console.log(req.user._id, "@@@@@@@@@@@@@@@@@2222");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Get My Profile Error:", error);
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};
// UPDATE / COMPLETE PROFILE
exports.updateMyProfile = async (req, res, next) => {
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
    const userId = req.user._id;
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return next(new ErrorHandler("User not found", 404));
    }
    const {
      fullName,
      email,
      phone,
      profileImage,
      bio,
      address,
      city,
      state,
      pincode,
      location,
      servicesOffered,
      skills,
      experienceYears,
      hourlyRate,
      availability,
    } = req.body;

    if (email && email.toLowerCase().trim() !== existingUser.email) {
      const emailTaken = await isEmail(email, userId);
      if (emailTaken) {
        return next(new ErrorHandler("Email already exists", 400));
      }
    }
    if (phone && phone.trim() !== existingUser.phone) {
      const phoneTaken = await isPhone(phone, userId);
      if (phoneTaken) {
        return next(new ErrorHandler("Phone already exists", 400));
      }
    }
    // COMMON UPDATE DATA
    const updateData = {
      ...(fullName && { fullName: fullName.trim() }),
      ...(email && { email: email.toLowerCase().trim() }),
      ...(phone && { phone: phone.trim() }),
      ...(profileImage !== undefined && { profileImage }),
      ...(bio !== undefined && { bio }),
      ...(address !== undefined && { address }),
      ...(city !== undefined && { city }),
      ...(state !== undefined && { state }),
      ...(pincode !== undefined && { pincode }),
      ...(location !== undefined && { location }),
    };
    // ONLY FOR PROVIDER
    if (existingUser.role === "provider") {
      if (servicesOffered !== undefined) {
        updateData.servicesOffered = servicesOffered;
      }
      if (skills !== undefined) {
        updateData.skills = skills;
      }
      if (experienceYears !== undefined) {
        updateData.experienceYears = experienceYears;
      }
      if (hourlyRate !== undefined) {
        updateData.hourlyRate = hourlyRate;
      }
      if (availability !== undefined) {
        updateData.availability = availability;
      }
    }
    const updatedUser = await updateUserById(userId, updateData);
    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return next(new ErrorHandler(error.message || "Server Error", 500));
  }
};
