const Review = require("../models/reviewModel");
const Job = require("../models/jobs");
const ErrorHandler = require("../utils/errorHandler");

// exports.giveReview = async (req, res, next) => {
//   try {
//     const { jobId } = req.params;
//     const { rating, review } = req.body;

//     const job = await Job.findById(jobId);

//     if (!job) {
//       return next(new ErrorHandler("Job not found", 404));
//     }

//     if (job.status !== "completed") {
//       return next(new ErrorHandler("You can review only completed jobs", 400));
//     }

//     const alreadyReviewed = await Review.findOne({
//       job: jobId,
//     });

//     if (alreadyReviewed) {
//       return next(new ErrorHandler("Review already submitted", 400));
//     }

//     const newReview = await Review.create({
//       job: jobId,
//       provider: job.selectedProviderId,
//       client: req.user._id,
//       rating,
//       review,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Review submitted successfully",
//       review: newReview,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

exports.giveReview = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { rating, review } = req.body;
    const job = await Job.findById(jobId);
    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }
    if (job.status !== "completed") {
      return next(new ErrorHandler("You can review only completed jobs", 400));
    }
    const alreadyReviewed = await Review.findOne({
      job: jobId,
      client: req.user._id,
    });
    if (alreadyReviewed) {
      return next(new ErrorHandler("Review already submitted", 400));
    }
    const newReview = await Review.create({
      job: jobId,
      provider: job.selectedProviderId,
      client: req.user._id,
      rating,
      review,
    });
    const reviews = await Review.find({
      provider: job.selectedProviderId,
    });
    const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
    const averageRating = totalRating / reviews.length;
    await User.findByIdAndUpdate(
      job.selectedProviderId,
      {
        averageRating: Number(averageRating.toFixed(1)),
        totalReviews: reviews.length,
      },
      { new: true },
    );

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review: newReview,
    });
  } catch (error) {
    next(error);
  }
};
exports.getProviderRating = async (req, res, next) => {
  try {
    const { providerId } = req.params;
    const reviews = await Review.find({ provider: providerId }).populate(
      "client",
      "name profileImage",
    );
    let totalRating = 0;
    reviews.forEach((item) => {
      totalRating += item.rating;
    });
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    res.status(200).json({
      success: true,
      averageRating: averageRating.toFixed(1),
      totalReviews: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
