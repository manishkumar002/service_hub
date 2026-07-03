import { Button } from "react-bootstrap";
import { formatCurrency } from "../utils/helpers";
import StatusBadge from "./StatusBadge";
import UserAvatar from "./UserAvatar";

const ApplicantCard = ({ application, jobStatus, onAccept, onMessage, accepting }) => {
  const provider = application.providerId;
  const canAccept = jobStatus === "open" && application.status === "pending";

  return (
    <div className="applicant-card p-3 border mb-3 bg-white animate-in">
      <div className="d-flex flex-wrap gap-3 align-items-start">
        <UserAvatar
          src={provider?.profileImage}
          name={provider?.fullName || "Provider"}
          size={52}
        />
        <div className="flex-grow-1 min-width-0">
          <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
            <strong>{provider?.fullName}</strong>
            <StatusBadge status={application.status} />
          </div>
          <p className="small text-muted mb-1">
            {provider?.city || "—"} · {provider?.phone}
            {provider?.experienceYears != null && ` · ${provider.experienceYears} yrs`}
          </p>
          {application.message && (
            <p className="small mb-2 fst-italic text-secondary">&ldquo;{application.message}&rdquo;</p>
          )}
          {application.proposedBudget != null && (
            <span className="small fw-semibold text-primary">
              Bid: {formatCurrency(application.proposedBudget)}
            </span>
          )}
        </div>
        <div className="d-flex flex-column gap-2 w-100 w-sm-auto">
          {canAccept && (
            <Button
              size="sm"
              className="btn-sh-primary"
              disabled={accepting}
              onClick={() => onAccept(provider._id)}
            >
              {accepting ? "Accepting…" : "Accept Provider"}
            </Button>
          )}
          {application.status === "accepted" && onMessage && (
            <Button size="sm" className="btn-sh-outline" onClick={onMessage}>
              💬 Message
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicantCard;
