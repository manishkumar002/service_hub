const Job = require("../models/jobs");
const User =require("../models/users")
const Conversation = require("../models/conversation");
const JobApplication = require("../models/job_applications");
const Category = require("../models/category");
const ErrorHandler = require("../utils/errorHandler");
const {
  getJobById,
  getActiveJobById,
  getMyJobs,
  updateJobById,
  getFilteredJobs,
} = require("../models/jobs");
//CREATE JOB
exports.createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      categoryId,
      budget,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      serviceDate,
      serviceTime,
    } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return next(new ErrorHandler("Category not found", 404));
    }
    const job = await Job.create({
      clientId: req.user._id,
      title,
      description,
      categoryId,
      budget,
      address,
      city,
      state,
      pincode,
      location: {
        type: "Point",
        coordinates: [Number(longitude) || 0, Number(latitude) || 0],
      },
      serviceDate,
      serviceTime,
    });
    const createdJob = await getJobById(job._id);
    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: createdJob,
    });
  } catch (error) {
    next(error);
  }
};
//GET ALL JOBS
exports.getAllJobs = async (req, res, next) => {
  try {
    const {
      search,
      categoryId,
      city,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const result = await getFilteredJobs({
      search,
      categoryId,
      city,
      status,
      page,
      limit,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
//GET SINGLE JOB
exports.getSingleJob = async (req, res, next) => {
  try {
    const job = await getActiveJobById(req.params.id);

    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }

    const applicationCount = await JobApplication.countDocuments({
      jobId: job._id,
      status: { $in: ["pending", "accepted"] },
    });

    res.status(200).json({
      success: true,
      job,
      applicationCount,
    });
  } catch (error) {
    next(error);
  }
};
//  UPDATE JOB

exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job || job.isDeleted) {
      return next(new ErrorHandler("Job not found", 404));
    }

    if (job.clientId.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You can update only your own job", 403));
    }

    if (job.status !== "open") {
      return next(new ErrorHandler("Only open jobs can be updated", 400));
    }

    const updateData = { ...req.body };

    if (updateData.categoryId) {
      const category = await Category.findById(updateData.categoryId);
      if (!category) {
        return next(new ErrorHandler("Category not found", 404));
      }
    }

    if (req.body.latitude && req.body.longitude) {
      updateData.location = {
        type: "Point",
        coordinates: [Number(req.body.longitude), Number(req.body.latitude)],
      };
    }

    delete updateData.latitude;
    delete updateData.longitude;

    job = await updateJobById(req.params.id, updateData);

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    next(error);
  }
};
//  DELETE JOB
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job || job.isDeleted) {
      return next(new ErrorHandler("Job not found", 404));
    }

    if (job.clientId.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You can delete only your own job", 403));
    }

    job.isDeleted = true;
    await job.save();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
//GET MY POSTED JOBS
exports.getMyPostedJobs = async (req, res, next) => {
  try {
    const jobs = await getMyJobs(req.user._id);
    const jobIds = jobs.map((j) => j._id);

    const pendingCounts = await JobApplication.aggregate([
      { $match: { jobId: { $in: jobIds }, status: "pending" } },
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
    ]);

    const countMap = Object.fromEntries(
      pendingCounts.map((p) => [p._id.toString(), p.count]),
    );

    const jobsWithCounts = jobs.map((job) => {
      const obj = job.toObject ? job.toObject() : job;
      return {
        ...obj,
        pendingApplicationCount: countMap[job._id.toString()] || 0,
      };
    });

    res.status(200).json({
      success: true,
      jobs: jobsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// Pending applications summary (client notifications)
exports.getPendingApplicationsSummary = async (req, res, next) => {
  try {
    const jobs = await Job.find({
      clientId: req.user._id,
      isDeleted: false,
      status: "open",
    }).select("_id title");

    const jobIds = jobs.map((j) => j._id);

    if (!jobIds.length) {
      return res.status(200).json({
        success: true,
        totalPending: 0,
        jobs: [],
      });
    }

    const pendingCounts = await JobApplication.aggregate([
      { $match: { jobId: { $in: jobIds }, status: "pending" } },
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
    ]);

    const countMap = Object.fromEntries(
      pendingCounts.map((p) => [p._id.toString(), p.count]),
    );

    const jobsWithPending = jobs
      .map((j) => ({
        jobId: j._id,
        title: j.title,
        pendingCount: countMap[j._id.toString()] || 0,
      }))
      .filter((j) => j.pendingCount > 0);

    const totalPending = jobsWithPending.reduce((s, j) => s + j.pendingCount, 0);

    res.status(200).json({
      success: true,
      totalPending,
      jobs: jobsWithPending,
    });
  } catch (error) {
    next(error);
  }
};
//APPLY ON JOB
// exports.applyOnJob = async (req, res, next) => {
//   try {
//     const { message, proposedBudget } = req.body;
//     const { jobId } = req.params;
//     const job = await Job.findById(jobId);
//     if (!job || job.isDeleted) {
//       return next(new ErrorHandler("Job not found", 404));
//     }
//     if (job.status !== "open") {
//       return next(
//         new ErrorHandler("This job is not open for applications", 400),
//       );
//     }
//     if (job.clientId.toString() === req.user._id.toString()) {
//       return next(new ErrorHandler("You cannot apply on your own job", 400));
//     }
//     const alreadyApplied = await JobApplication.findProviderApplication(
//       jobId,
//       req.user._id,
//     );
//     if (alreadyApplied && !alreadyApplied.isWithdrawn()) {
//       return next(
//         new ErrorHandler("You have already applied on this job", 400),
//       );
//     }
//     let application;
//     if (alreadyApplied && alreadyApplied.isWithdrawn()) {
//       alreadyApplied.status = "pending";
//       alreadyApplied.message = message || alreadyApplied.message;
//       alreadyApplied.proposedBudget =
//         proposedBudget || alreadyApplied.proposedBudget;
//       await alreadyApplied.save();
//       application = alreadyApplied;
//     } else {
//       application = await JobApplication.create({
//         jobId,
//         providerId: req.user._id,
//         message,
//         proposedBudget,
//       });
//     }
//     res.status(201).json({
//       success: true,
//       message: "Applied on job successfully",
//       application,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
exports.applyOnJob = async (req, res, next) => {
  try {
    const { message, proposedBudget } = req.body;
    const { jobId } = req.params;

    // Provider details
    const provider = await User.findById(req.user._id);

    if (!provider) {
      return next(new ErrorHandler("Provider not found", 404));
    }

    // Only provider can apply
    if (provider.role !== "provider") {
      return next(new ErrorHandler("Only providers can apply on jobs", 400));
    }

    // Check subscription expiry
    if (
      provider.premiumStatus &&
      provider.premiumExpiresAt &&
      new Date() > provider.premiumExpiresAt
    ) {
      provider.premiumStatus = false;
      provider.subscriptionPlan = "free";

      await provider.save();
    }

    // Free provider limit
    if (!provider.premiumStatus && provider.jobApplyCount >= 5) {
      return next(
        new ErrorHandler(
          "Free providers can apply only to 5 jobs. Upgrade subscription.",
          400,
        ),
      );
    }

    // Job find
    const job = await Job.findById(jobId);

    if (!job || job.isDeleted) {
      return next(new ErrorHandler("Job not found", 404));
    }

    if (job.status !== "open") {
      return next(
        new ErrorHandler("This job is not open for applications", 400),
      );
    }

    // Own job restriction
    if (job.clientId.toString() === req.user._id.toString()) {
      return next(new ErrorHandler("You cannot apply on your own job", 400));
    }

    // Duplicate application check
    const alreadyApplied = await JobApplication.findProviderApplication(
      jobId,
      req.user._id,
    );

    if (alreadyApplied && !alreadyApplied.isWithdrawn()) {
      return next(
        new ErrorHandler("You have already applied on this job", 400),
      );
    }

    let application;

    // Re-apply withdrawn
    if (alreadyApplied && alreadyApplied.isWithdrawn()) {
      alreadyApplied.status = "pending";

      alreadyApplied.message = message || alreadyApplied.message;

      alreadyApplied.proposedBudget =
        proposedBudget || alreadyApplied.proposedBudget;

      await alreadyApplied.save();

      application = alreadyApplied;
    } else {
      application = await JobApplication.create({
        jobId,
        providerId: req.user._id,
        message,
        proposedBudget,
      });

      // Increase count only on new apply
      if (!provider.premiumStatus) {
        provider.jobApplyCount += 1;
        await provider.save();
      }
    }

    res.status(201).json({
      success: true,
      message: "Applied on job successfully",
      application,
      remainingJobs: provider.premiumStatus
        ? "Unlimited"
        : 5 - provider.jobApplyCount,
    });
  } catch (error) {
    next(error);
  }
};
// WITHDRAW APPLICATION
exports.withdrawApplication = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const application = await JobApplication.findProviderApplication(
      jobId,
      req.user._id,
    );

    if (!application) {
      return next(new ErrorHandler("Application not found", 404));
    }

    await application.withdraw();

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    next(error);
  }
};
//GET MY APPLIED JOBS
exports.getMyAppliedJobs = async (req, res, next) => {
  try {
    const applications = await JobApplication.find({
      providerId: req.user._id,
      status: { $ne: "withdrawn" },
    })
      .populate({
        path: "jobId",
        match: { isDeleted: false },
        populate: [
          { path: "categoryId", select: "name slug icon" },
          {
            path: "clientId",
            select: "fullName phone city state profileImage",
          },
        ],
      })
      .sort({ createdAt: -1 });

    const filteredApplications = applications.filter(
      (app) => app.jobId !== null,
    );

    res.status(200).json({
      success: true,
      applications: filteredApplications,
    });
  } catch (error) {
    next(error);
  }
};
//ACCEPT PROVIDER FOR JOB
exports.acceptProviderForJob = async (req, res, next) => {
  try {
    const { jobId, providerId } = req.params;

    const job = await Job.findById(jobId);

    if (!job || job.isDeleted) {
      return next(new ErrorHandler("Job not found", 404));
    }

    if (job.clientId.toString() !== req.user._id.toString()) {
      return next(
        new ErrorHandler("You can accept provider only for your own job", 403),
      );
    }

    if (job.status !== "open") {
      return next(new ErrorHandler("Only open jobs can be assigned", 400));
    }

    const selectedApplication = await JobApplication.findOne({
      jobId,
      providerId,
      status: "pending",
    });

    if (!selectedApplication) {
      return next(
        new ErrorHandler("Provider has not applied for this job", 400),
      );
    }
    job.status = "assigned";
    job.selectedProviderId = providerId;
    await job.save();
    await selectedApplication.accept();
    await JobApplication.rejectOtherApplications(jobId, providerId);
    const conversation = await Conversation.findOneAndUpdate(
      {
        jobId,
        clientId: job.clientId,
        providerId,
      },
      {
        jobId,
        clientId: job.clientId,
        providerId,
      },
      {
        upsert: true,
        new: true,
      },
    )
      .populate("clientId", "fullName email profileImage")
      .populate("providerId", "fullName email profileImage")
      .populate("jobId", "title status");

    const updatedJob = await getJobById(jobId);

    res.status(200).json({
      success: true,
      message: "Provider accepted successfully. You can now chat.",
      conversation,
      job: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

//MARK JOB COMPLETED
exports.markJobCompleted = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job || job.isDeleted) {
      return next(new ErrorHandler("Job not found", 404));
    }

    if (job.clientId.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You can complete only your own job", 403));
    }

    if (job.status !== "assigned") {
      return next(new ErrorHandler("Only assigned jobs can be completed", 400));
    }

    job.status = "completed";
    await job.save();

    const updatedJob = await getJobById(jobId);

    res.status(200).json({
      success: true,
      message: "Job marked as completed successfully",
      job: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};
//GET APPLICATIONS FOR MY JOB
exports.getApplicationsForMyJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job || job.isDeleted) {
      return next(new ErrorHandler("Job not found", 404));
    }
    if (job.clientId.toString() !== req.user._id.toString()) {
      return next(
        new ErrorHandler(
          "You can view applications only for your own job",
          403,
        ),
      );
    }
    const applications = await JobApplication.find({
      jobId,
      status: { $in: ["pending", "accepted"] },
    })
      .populate(
        "providerId",
        "fullName email phone city state skills experienceYears profileImage averageRating totalReviews",
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    next(error);
  }
};
