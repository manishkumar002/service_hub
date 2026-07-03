import { capitalize } from "../utils/helpers";

const STATUS_STYLES = {
  open: "sh-status sh-status-open",
  assigned: "sh-status sh-status-assigned",
  in_progress: "sh-status sh-status-assigned",
  completed: "sh-status sh-status-completed",
  cancelled: "sh-status sh-status-cancelled",
  pending: "sh-status sh-status-pending",
  accepted: "sh-status sh-status-accepted",
  rejected: "sh-status sh-status-rejected",
  withdrawn: "sh-status sh-status-cancelled",
};

const StatusBadge = ({ status, className = "", style }) => (
  <span
    className={`${STATUS_STYLES[status] || "sh-status sh-status-cancelled"} ${className}`}
    style={style}
  >
    {capitalize(status?.replace(/_/g, " ") || "unknown")}
  </span>
);

export default StatusBadge;
