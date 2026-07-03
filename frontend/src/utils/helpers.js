export const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatCurrency = (amount) => {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const statusBadgeClass = (status) => {
  const map = {
    open: "badge-status-open",
    assigned: "badge-status-in_progress",
    in_progress: "badge-status-in_progress",
    completed: "badge-status-completed",
    cancelled: "bg-secondary",
    pending: "bg-warning text-dark",
    accepted: "bg-success",
    rejected: "bg-secondary",
  };
  return map[status] || "bg-secondary";
};

export const findConversationForJob = (conversations, jobId) => {
  if (!jobId || !conversations?.length) return null;
  const id = jobId.toString();
  return conversations.find(
    (c) => (c.jobId?._id || c.jobId)?.toString() === id,
  );
};

export const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
