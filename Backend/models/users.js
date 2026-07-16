const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["client", "provider", "admin"],
      required: [true, "Role is required"],
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    profileImage: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    servicesOffered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    skills: {
      type: [String],
      default: [],
    },

    experienceYears: {
      type: Number,
      default: 0,
    },

    hourlyRate: {
      type: Number,
      default: 0,
    },

    availability: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "available",
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    jobApplyCount: {
      type: Number,
      default: 0,
    },
    premiumStatus: {
      type: Boolean,
      default: false,
    },
    premiumExpiresAt: {
      type: Date,
      default: null,
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "monthly", "yearly"],
      default: "free",
    },
  },
  { timestamps: true },
);

userSchema.index({ location: "2dsphere" });
userSchema.index({
  fullName: "text",
  email: "text",
  phone: "text",
  city: "text",
  state: "text",
  address: "text",
  skills: "text",
  bio: "text",
});
const User = mongoose.model("User", userSchema);
module.exports = User;

//   HELPER FUNCTIONS
module.exports.getUserById = async (user_id) => {
  return await User.findOne({ _id: user_id }, { __v: 0, password: 0 });
};

module.exports.getUser = async (user_id) => {
  return await User.findOne({ _id: user_id }, { __v: 0 }).select("+password");
};

module.exports.getUserByEmail = async (email) => {
  return await User.findOne(
    { email: email.toLowerCase() },
    { __v: 0, password: 0 },
  );
};

module.exports.getUserByLogin = async ({ email, phone }) => {
  const conditions = [];
  if (email) {
    conditions.push({ email: email.toLowerCase().trim() });
  }
  if (phone) {
    conditions.push({ phone: phone.trim() });
  }
  if (conditions.length === 0) {
    return null;
  }
  return await User.findOne({
    $or: conditions,
  }).select("+password");
};

module.exports.isEmail = async (email, userId = null) => {
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return false;
  if (userId && user._id.toString() === userId.toString()) {
    return false;
  }
  return true;
};
module.exports.isPhone = async (phone, userId = null) => {
  const user = await User.findOne({ phone: phone.trim() });
  if (!user) return false;
  if (userId && user._id.toString() === userId.toString()) {
    return false;
  }
  return true;
};

module.exports.updateUserById = async (user_id, updateData) => {
  return await User.findByIdAndUpdate(user_id, updateData, {
    new: true,
    runValidators: true,
    projection: { __v: 0, password: 0 },
  }).populate("servicesOffered", "name slug icon");
};
