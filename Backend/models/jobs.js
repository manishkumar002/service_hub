const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    budget: {
      type: Number,
      required: [true, "Budget is required"],
      min: [1, "Budget must be greater than 0"],
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    city: {
      type: String,
      trim: true,
      default: "",
    },

    state: {
      type: String,
      trim: true,
      default: "",
    },

    pincode: {
      type: String,
      trim: true,
      default: "",
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },

    serviceDate: {
      type: Date,
      default: null,
    },

    serviceTime: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["open", "assigned", "completed", "cancelled"],
      default: "open",
    },

    selectedProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

jobSchema.index({ location: "2dsphere" });

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;

/* =====================================================
   HELPER FUNCTIONS ONLY
===================================================== */

// single job by id
module.exports.getJobById = async (jobId) => {
  return await Job.findById(jobId)
    .populate("categoryId", "name slug icon")
    .populate("clientId", "fullName phone city state profileImage")
    .populate("selectedProviderId", "fullName phone city state profileImage");
};

// active (not deleted) job by id
module.exports.getActiveJobById = async (jobId) => {
  return await Job.findOne({ _id: jobId, isDeleted: false })
    .populate("categoryId", "name slug icon")
    .populate("clientId", "fullName phone city state profileImage")
    .populate("selectedProviderId", "fullName phone city state profileImage");
};

// all jobs with basic filter
module.exports.getAllJobs = async (filters = {}) => {
  return await Job.find({ isDeleted: false, ...filters })
    .populate("categoryId", "name slug icon")
    .populate("clientId", "fullName phone city state profileImage")
    .populate("selectedProviderId", "fullName phone city state profileImage")
    .sort({ createdAt: -1 });
};

// my posted jobs
module.exports.getMyJobs = async (clientId) => {
  return await Job.find({ clientId, isDeleted: false })
    .populate("categoryId", "name slug icon")
    .populate("selectedProviderId", "fullName phone city state profileImage")
    .sort({ createdAt: -1 });
};

// update job by id
module.exports.updateJobById = async (jobId, updateData) => {
  return await Job.findByIdAndUpdate(jobId, updateData, {
    new: true,
    runValidators: true,
  })
    .populate("categoryId", "name slug icon")
    .populate("clientId", "fullName phone city state profileImage")
    .populate("selectedProviderId", "fullName phone city state profileImage");
};

// filtered + paginated jobs
module.exports.getFilteredJobs = async ({
  search,
  categoryId,
  city,
  status,
  page = 1,
  limit = 10,
}) => {
  const query = { isDeleted: false };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
    ];
  }

  if (categoryId) query.categoryId = categoryId;
  if (city) query.city = { $regex: city, $options: "i" };
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const jobs = await Job.find(query)
    .populate("categoryId", "name slug icon")
    .populate("clientId", "fullName phone city state profileImage")
    .populate("selectedProviderId", "fullName phone city state profileImage")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Job.countDocuments(query);

  return {
    jobs,
    total,
    currentPage: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  };
};
