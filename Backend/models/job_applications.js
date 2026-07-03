const mongoose = require("mongoose");
const ErrorHandler = require("../utils/errorHandler");

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    proposedBudget: {
      type: Number,
      default: null,
      min: [1, "Proposed budget must be greater than 0"],
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "withdrawn", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

jobApplicationSchema.index({ jobId: 1, providerId: 1 }, { unique: true });

// accepted check
jobApplicationSchema.methods.isAccepted = function () {
  return this.status === "accepted";
};

// withdrawn check
jobApplicationSchema.methods.isWithdrawn = function () {
  return this.status === "withdrawn";
};

// withdraw application

jobApplicationSchema.methods.withdraw = async function () {
  const Job = mongoose.model("Job");

  // if accepted provider cancels
  if (this.status === "accepted") {
    await Job.findByIdAndUpdate(this.jobId, {
      status: "open",
      selectedProviderId: null,
    });
  }

  // update application status
  this.status = "withdrawn";

  return await this.save();
};

// accept application
jobApplicationSchema.methods.accept = async function () {
  this.status = "accepted";
  return await this.save();
};

// already applied?
jobApplicationSchema.statics.findProviderApplication = function (
  jobId,
  providerId,
) {
  return this.findOne({ jobId, providerId });
};

// reject others
jobApplicationSchema.statics.rejectOtherApplications = function (
  jobId,
  providerId,
) {
  return this.updateMany(
    {
      jobId,
      providerId: { $ne: providerId },
      status: "pending",
    },
    {
      $set: { status: "rejected" },
    },
  );
};

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);
module.exports = JobApplication;
