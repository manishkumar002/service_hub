import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Alert, Collapse } from "react-bootstrap";
import { toast } from "react-toastify";
import ApplicantCard from "../components/ApplicantCard";
import {
  getPendingApplicationsSummary,
  getApplicationsForJob,
  acceptProvider,
  getErrorMessage,
} from "../api/services";
import { useNotifications } from "../context/NotificationContext";

const ApplicationsInbox = () => {
  const navigate = useNavigate();
  const { refresh: refreshBadges } = useNotifications();
  const [summaryJobs, setSummaryJobs] = useState([]);
  const [expandedJob, setExpandedJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);

  const loadSummary = async () => {
    try {
      const { data } = await getPendingApplicationsSummary();
      setSummaryJobs(data.jobs || []);
      if ((data.jobs || []).length === 0) setExpandedJob(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const openJob = async (jobId) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
      return;
    }
    setExpandedJob(jobId);
    setLoadingApps(true);
    try {
      const { data } = await getApplicationsForJob(jobId);
      setApplications(data.applications || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleAccept = async (jobId, providerId) => {
    setAcceptingId(providerId);
    try {
      const { data } = await acceptProvider(jobId, providerId);
      toast.success("Provider accepted! Opening chat…");
      refreshBadges();
      loadSummary();
      if (data.conversation?._id) {
        navigate(`/chat?conversation=${data.conversation._id}`);
      } else {
        navigate(`/chat?job=${jobId}`);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <Container>
      <h1 className="mb-2">Job Applications</h1>
      <p className="text-muted mb-4">
        Providers who applied on your open jobs appear here. Accept one to assign the job and start chatting.
      </p>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : summaryJobs.length === 0 ? (
        <Alert variant="info">
          No new applications right now.{" "}
          <Link to="/jobs/my-posted">View your posted jobs</Link>
        </Alert>
      ) : (
        summaryJobs.map((item) => (
          <Card key={item.jobId} className="sh-card border-0 mb-3">
            <Card.Body>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <h5 className="mb-1">{item.title}</h5>
                  <span className="badge rounded-pill" style={{ background: "var(--sh-black)", color: "#fff" }}>
                    {item.pendingCount} new application{item.pendingCount > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="d-flex gap-2">
                  <Button
                    className="btn-sh-outline"
                    size="sm"
                    onClick={() => openJob(item.jobId)}
                  >
                    {expandedJob === item.jobId ? "Hide" : "Review & Accept"}
                  </Button>
                  <Button
                    as={Link}
                    to={`/jobs/${item.jobId}`}
                    variant="link"
                    size="sm"
                  >
                    Job details
                  </Button>
                </div>
              </div>

              <Collapse in={expandedJob === item.jobId}>
                <div className="mt-3">
                  {loadingApps ? (
                    <Spinner size="sm" />
                  ) : (
                    applications
                      .filter((a) => a.status === "pending" || a.status === "accepted")
                      .map((app) => (
                        <ApplicantCard
                          key={app._id}
                          application={app}
                          jobStatus="open"
                          accepting={acceptingId === app.providerId?._id}
                          onAccept={(providerId) => handleAccept(item.jobId, providerId)}
                        />
                      ))
                  )}
                  {!loadingApps && applications.length === 0 && (
                    <p className="text-muted small mb-0">No applications for this job.</p>
                  )}
                </div>
              </Collapse>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
};

export default ApplicationsInbox;
