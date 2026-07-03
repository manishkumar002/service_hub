const Subscription = require("../models/subscription");
const User = require("../models/users");
const ErrorHandler = require("../utils/errorHandler");

exports.buySubscription = async (req, res, next) => {
  try {
    const { plan, paymentId } = req.body;
    const provider = await User.findById(req.user._id);
    if (!provider) {
      return next(new ErrorHandler("Provider not found", 404));
    }

    if (provider.role !== "provider") {
      return next(new ErrorHandler("Only provider can buy subscription", 400));
    }

    let amount = 0;
    let endDate = new Date();
    if (plan === "monthly") {
      amount = 499;
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (plan === "yearly") {
      amount = 4999;
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      return next(new ErrorHandler("Invalid Plan", 400));
    }
    const subscription = await Subscription.create({
      provider: provider._id,
      plan,
      amount,
      paymentId,
      endDate,
    });
    provider.premiumStatus = true;
    provider.subscriptionPlan = plan;
    provider.premiumExpiresAt = endDate;
    await provider.save();
    res.status(200).json({
      success: true,
      message: "Subscription activated",
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMySubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      provider: req.user._id,
      status: "active",
    }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};
