import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Card, Row, Col, Button, Spinner, Badge, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { getMyAppliedJobs, getMyConversations, getErrorMessage } from "../api/services";
import { formatCurrency, formatDate, findConversationForJob } from "../utils/helpers";
import StatusBadge from "../components/StatusBadge";

const MyAppliedJobs = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getMyAppliedJobs()
      .then((res) => setApplications(res.data.applications || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openChat = async (jobId) => {
    try {
      const { data } = await getMyConversations();
      const conv = findConversationForJob(data.conversations, jobId);
      if (conv) navigate(`/chat?conversation=${conv._id}`);
      else {
        toast.info("Chat is available after the client accepts you.");
        navigate("/chat");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const acceptedCount = applications.filter((a) => a.status === "accepted").length;

  return (
    <Container>
      <h1 className="mb-2">My Applications</h1>
      {acceptedCount > 0 && (
        <Alert variant="success" className="py-2">
          You have been <strong>accepted</strong> on {acceptedCount} job{acceptedCount > 1 ? "s" : ""}. Use Message to chat with the client.
        </Alert>
      )}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : applications.length === 0 ? (
        <p className="text-muted">
          You have not applied to any jobs yet. <Link to="/jobs">Browse jobs</Link>
        </p>
      ) : (
        <Row className="g-4">
          {applications.map((app) => {
            const job = app.jobId;
            if (!job) return null;
            return (
              <Col md={6} key={app._id}>
                <Card className="sh-card border-0 h-100 p-3">
                  <div className="d-flex justify-content-between mb-2">
                    <StatusBadge status={app.status} />
                    <span className="fw-bold">{formatCurrency(job.budget)}</span>
                  </div>
                  <h5>{job.title}</h5>
                  <p className="small text-muted mb-2">
                    {job.city} · Applied {formatDate(app.createdAt)}
                  </p>
                  {app.status === "pending" && (
                    <p className="small text-warning mb-2">Waiting for client to review your application.</p>
                  )}
                  {app.status === "rejected" && (
                    <p className="small text-muted mb-2">Client chose another provider.</p>
                  )}
                  {app.status === "accepted" && (
                    <p className="small text-success mb-2">You can start work and message the client.</p>
                  )}
                  <div className="d-flex gap-2 flex-wrap">
                    <Button as={Link} to={`/jobs/${job._id}`} size="sm" className="btn-sh-outline">
                      View Job
                    </Button>
                    {app.status === "accepted" && (
                      <Button size="sm" className="btn-sh-primary" onClick={() => openChat(job._id)}>
                        💬 Message Client
                      </Button>
                    )}
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default MyAppliedJobs;
