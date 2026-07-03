const Razorpay = require("razorpay");
const Payment = require("../models/payment");
const Job = require("../models/jobs");
const ErrorHandler = require("../utils/errorHandler");

const razorpay = new Razorpay({
  key_id: "rzp_test_SrzchOr4ZrErhh",
  key_secret: "5puZV5h71evsmfQn4pNSX2Ez",
});
// exports.createOrder = async (req, res, next) => {
//   try {
//     const { amount, jobId } = req.body;

//     const job = await Job.findById(jobId);

//     if (!job) {
//       return next(new ErrorHandler("Job not found", 404));
//     }

//     const options = {
//       amount: Number(amount) * 100,
//       currency: "INR",
//       receipt: `job_${jobId}_${Date.now()}`,
//     };

//     let order;
//     try {
//       order = await razorpay.orders.create(options);
//     } catch (err) {
//       return next(new ErrorHandler("Razorpay failed", 400));
//     }

//     const payment = await Payment.create({
//       jobId,
//       clientId: req.user?._id || "69d62c57cec5914a314aef49",
//       amount,
//       razorpayOrderId: order.id,
//       paymentStatus: "created",
//     });

//     res.status(201).json({
//       success: true,
//       message: "Payment order created",
//       order,
//       payment,
//     });
//   } catch (error) {
//     console.log("GENERAL ERROR:", error);
//     next(error);
//   }
// };

exports.createOrder = async (req, res, next) => {
  try {
    const { amount, jobId } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }

    // Dummy order for testing
    const order = {
      id: "order_dummy_" + Date.now(),
      amount: Number(amount) * 100,
      currency: "INR",
      receipt: `job_${jobId}_${Date.now()}`,
      status: "created",
    };

    const payment = await Payment.create({
      jobId,
      clientId: req.user?._id || "69d62c57cec5914a314aef49",
      amount,
      razorpayOrderId: order.id,
      paymentStatus: "created",
    });
    res.status(201).json({
      success: true,
      message: "Dummy payment order created",
      order,
      payment,
    });
  } catch (error) {
    console.log("GENERAL ERROR:", error);
    next(error);
  }
};
exports.verifyPayment = async (req, res, next) => {
  try {
    const { paymentId, orderId } = req.body;

    const payment = await Payment.findOne({
      razorpayOrderId: orderId,
    });

    if (!payment) {
      return next(new ErrorHandler("Payment not found", 404));
    }
    payment.razorpayPaymentId = paymentId;
    payment.paymentStatus = "paid";

    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    next(error);
  }
};
