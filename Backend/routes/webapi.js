const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const { uploadFile,chat,aiChat,aiSearch} = require("../controllers/chatAiController");
//controllers
const { register, login,getMyProfile,updateMyProfile } = require("../controllers/authController");
const {getCategories,getCategoryDetails,createCategory,updateCategory,deleteCategory,} = require("../controllers/categoryController");
const {sendMessage,getMessages,getMyConversations,} = require("../controllers/chatController");
const {createJob,getAllJobs, getSingleJob,updateJob,deleteJob,getMyPostedJobs,getPendingApplicationsSummary,applyOnJob,withdrawApplication,getMyAppliedJobs,
acceptProviderForJob,markJobCompleted,getApplicationsForMyJob} = require("../controllers/jobController");
const {giveReview,getProviderRating} = require("../controllers/reviewController");
const { createOrder, verifyPayment } = require("../controllers/paymentController");
const {buySubscription,getMySubscription}=require("../controllers/subscriptionController");
//middleware
const {checkRole,checkRoles,isAuthenticatedUser} = require("../middleware/verifyToken");
//validator
const {registerValidator,loginValidator,updateProfileValidator} = require("../validators/authValidator");
const {createCategoryValidator,updateCategoryValidator,categoryIdValidator} = require("../validators/categoryValidator");
const {createJobValidator} = require("../validators/jobValidator");
//auth
router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.get("/profile",isAuthenticatedUser,checkRoles("provider", "client"),getMyProfile);
router.put("/profile",isAuthenticatedUser,checkRoles("provider", "client"),updateProfileValidator,updateMyProfile);
//client only job apis
router.post("/job", isAuthenticatedUser, checkRole("client"),createJobValidator,createJob);
router.get("/job/posted", isAuthenticatedUser, checkRole("client"), getMyPostedJobs);
router.get("/applications/summary", isAuthenticatedUser, checkRole("client"), getPendingApplicationsSummary);
router.get("/:jobId/applications", isAuthenticatedUser, checkRole("client"), getApplicationsForMyJob);
router.put("/:jobId/accept-provider/:providerId", isAuthenticatedUser, checkRole("client"), acceptProviderForJob);
router.put("/:jobId/complete", isAuthenticatedUser, checkRole("client"), markJobCompleted);
router.put("/:id", isAuthenticatedUser, checkRole("client"), updateJob);
router.delete("/:id", isAuthenticatedUser, checkRole("client"), deleteJob);
//provider only job apis
router.post("/apply/:jobId", isAuthenticatedUser, checkRole("provider"), applyOnJob);
router.put("/:jobId/withdraw", isAuthenticatedUser, checkRole("provider"), withdrawApplication);
router.get("/my/applied", isAuthenticatedUser, checkRole("provider"), getMyAppliedJobs);
//both
router.get("/job", isAuthenticatedUser,checkRoles("admin", "provider", "client"),getAllJobs);
router.get("/job/:id", isAuthenticatedUser,checkRoles("admin", "provider", "client"),getSingleJob);
//category
router.get("/categories",isAuthenticatedUser,checkRoles("admin", "provider", "client"),getCategories);
router.get("/categories/:id",isAuthenticatedUser,checkRoles("admin", "provider", "client"),categoryIdValidator, getCategoryDetails);
router.post("/categories",isAuthenticatedUser,checkRole("admin"),createCategoryValidator,createCategory);
router.put("/categories/:id",isAuthenticatedUser,checkRole("admin"),updateCategoryValidator,updateCategory);
router.delete("/categories/:id",isAuthenticatedUser,checkRole("admin"),categoryIdValidator,deleteCategory);
//Chat / massage
router.post("/send",isAuthenticatedUser,checkRoles("provider", "client"),sendMessage);
router.get( "/:conversationId",isAuthenticatedUser,checkRoles("provider", "client"),getMessages);
router.get("/my/conversations",isAuthenticatedUser,checkRoles("provider", "client"),getMyConversations);
//rating / reviews
router.post("/review/:jobId",isAuthenticatedUser,checkRole("client"),giveReview);
router.get("/provider-rating/:providerId",isAuthenticatedUser,checkRoles("client","provider","admin"),getProviderRating);
//payments
router.post("/payment/create-order", isAuthenticatedUser, checkRole("client"), createOrder);
router.post("/payment/verify", isAuthenticatedUser, checkRole("client"), verifyPayment);
//subscriptions
router.post("/subscription/buy",isAuthenticatedUser,checkRole("provider"),buySubscription);
router.get("/my-subscription",isAuthenticatedUser,checkRole("provider"),getMySubscription);
//notifications

//reports

//chat
router.post("/upload-file",upload.single("file"),uploadFile);
router.post("/pdf-chat",chat);
router.post("/ai-chat",aiChat);
router.post("/ai-search", aiSearch);

module.exports = router;
