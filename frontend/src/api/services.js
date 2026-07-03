import api from "./axios";

const getErrorMessage = (err) => {
  const data = err.response?.data;
  if (data?.errors && typeof data.errors === "object") {
    return Object.values(data.errors).join(", ");
  }
  return data?.message || err.message || "Something went wrong";
};

export { getErrorMessage };

// —— Auth ——
export const registerUser = (payload) => api.post("/register", payload);
export const loginUser = (payload) => api.post("/login", payload);
export const getProfile = () => api.get("/profile");
export const updateProfile = (payload) => api.put("/profile", payload);

// —— Categories ——
export const getCategories = () => api.get("/categories");
export const getCategoryById = (id) => api.get(`/categories/${id}`);
export const createCategory = (payload) => api.post("/categories", payload);
export const updateCategory = (id, payload) => api.put(`/categories/${id}`, payload);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// —— Jobs ——
export const getAllJobs = (params) => api.get("/job", { params });
export const getJobById = (id) => api.get(`/job/${id}`);
export const createJob = (payload) => api.post("/job", payload);
export const updateJob = (id, payload) => api.put(`/${id}`, payload);
export const deleteJob = (id) => api.delete(`/${id}`);
export const getMyPostedJobs = () => api.get("/job/posted");
export const getPendingApplicationsSummary = () => api.get("/applications/summary");
export const getMyAppliedJobs = () => api.get("/my/applied");
export const applyOnJob = (jobId, payload) => api.post(`/apply/${jobId}`, payload);
export const withdrawApplication = (jobId) => api.put(`/${jobId}/withdraw`);
export const getApplicationsForJob = (jobId) => api.get(`/${jobId}/applications`);
export const acceptProvider = (jobId, providerId) =>
  api.put(`/${jobId}/accept-provider/${providerId}`);
export const markJobCompleted = (jobId) => api.put(`/${jobId}/complete`);

// —— Chat ——
export const sendMessage = (payload) => api.post("/send", payload);
export const getMessages = (conversationId) => api.get(`/${conversationId}`);
export const getMyConversations = () => api.get("/my/conversations");

// —— Reviews ——
export const giveReview = (jobId, payload) => api.post(`/review/${jobId}`, payload);
export const getProviderRating = (providerId) => api.get(`/provider-rating/${providerId}`);

// —— Payments ——
export const createPaymentOrder = (payload) => api.post("/payment/create-order", payload);
export const verifyPayment = (payload) => api.post("/payment/verify", payload);

// —— Subscription ——
export const buySubscription = (payload) => api.post("/subscription/buy", payload);
export const getMySubscription = () => api.get("/my-subscription");
