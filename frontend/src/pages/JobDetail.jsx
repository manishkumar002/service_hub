import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner, Badge, Form, Modal, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import ApplicantCard from "../components/ApplicantCard";
import ReviewModal from "../components/ReviewModal";
import StatusBadge from "../components/StatusBadge";
import { useNotifications } from "../context/NotificationContext";
import {
  getJobById,
  applyOnJob,
  withdrawApplication,
  getApplicationsForJob,
  getMyAppliedJobs,
  getMyConversations,
  acceptProvider,
  markJobCompleted,
  giveReview,
  createPaymentOrder,
  verifyPayment,
  getErrorMessage,
} from "../api/services";
import {
  formatCurrency,
  formatDate,
  capitalize,
  findConversationForJob,
} from "../utils/helpers";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const { refresh: refreshBadges } = useNotifications();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [myApplication, setMyApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const [applyForm, setApplyForm] = useState({ message: "", proposedBudget: "" });
  const [reviewForm, setReviewForm] = useState({ rating: 5, review: "" });
  const [showReview, setShowReview] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadJob = async () => {
    try {
      const { data } = await getJobById(id);
      setJob(data.job);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const loadApplications = async () => {
    if (role !== "client") return;
    try {
      const { data } = await getApplicationsForJob(id);
      setApplications(data.applications || []);
    } catch {
      setApplications([]);
    }
  };

  const loadProviderApplication = async () => {
    if (role !== "provider") return;
    try {
      const { data } = await getMyAppliedJobs();
      const mine = (data.applications || []).find(
        (a) => (a.jobId?._id || a.jobId)?.toString() === id,
      );
      setMyApplication(mine || null);
    } catch {
      setMyApplication(null);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadJob();
      await loadApplications();
      await loadProviderApplication();
      setLoading(false);
    })();
  }, [id, role]);

  const goToChat = async (jobId) => {
    try {
      const { data } = await getMyConversations();
      const conv = findConversationForJob(data.conversations, jobId);
      if (conv) navigate(`/chat?conversation=${conv._id}`);
      else {
        toast.info("Chat opens after the client accepts your application.");
        navigate("/chat");
      }
    } catch {
      navigate("/chat");
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await applyOnJob(id, {
        message: applyForm.message,
        proposedBudget: applyForm.proposedBudget ? Number(applyForm.proposedBudget) : undefined,
      });
      toast.success("Application sent! The client will be notified.");
      setShowApply(false);
      await loadProviderApplication();
      refreshBadges();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdrawApplication(id);
      toast.success("Application withdrawn");
      setMyApplication(null);
      refreshBadges();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleAccept = async (providerId) => {
    setAcceptingId(providerId);
    try {
      const { data } = await acceptProvider(id, providerId);
      toast.success("Provider accepted! You can message them now.");
      await loadJob();
      await loadApplications();
      refreshBadges();
      if (data.conversation?._id) {
        navigate(`/chat?conversation=${data.conversation._id}`);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAcceptingId(null);
    }
  };

  const handleComplete = async () => {
    try {
      await markJobCompleted(id);
      await loadJob();
      setReviewForm({ rating: 5, review: "" });
      setShowReview(true);
      toast.success("Job completed! Rate your provider below.");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handlePayment = async () => {
    try {
      const { data } = await createPaymentOrder({ jobId: id, amount: job.budget });
      await verifyPayment({
        orderId: data.order.id,
        paymentId: "pay_dummy_" + Date.now(),
      });
      toast.success("Payment verified");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await giveReview(id, reviewForm);
      toast.success("Thank you for your review!");
      setShowReview(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!job) {
    return (
      <Container>
        <Alert variant="warning">Job not found</Alert>
      </Container>
    );
  }

  const clientId = job.clientId?._id || job.clientId;
  const isOwner = clientId?.toString() === user?._id?.toString();
  const pendingCount = applications.filter((a) => a.status === "pending").length;

  return (
    <Container>
      <Button as={Link} to={role === "client" ? "/jobs/my-posted" : "/jobs"} variant="link" className="ps-0 mb-3">
        ← Back
      </Button>

      {role === "client" && isOwner && pendingCount > 0 && (
        <Alert variant="warning" className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span>
            <strong>{pendingCount}</strong> provider{pendingCount > 1 ? "s have" : " has"} applied on this job!
          </span>
          <Button as={Link} to="/applications" size="sm" className="btn-sh-primary">
            Review applications
          </Button>
        </Alert>
      )}

      {role === "provider" && myApplication && (
        <Alert
          variant={
            myApplication.status === "accepted"
              ? "success"
              : myApplication.status === "rejected"
                ? "secondary"
                : "info"
          }
        >
          Your application: <strong>{capitalize(myApplication.status)}</strong>
          {myApplication.status === "accepted" && (
            <Button
              size="sm"
              className="btn-sh-outline ms-2"
              onClick={() => goToChat(id)}
            >
              💬 Message client
            </Button>
          )}
          {myApplication.status === "pending" && (
            <span className="d-block small mt-1">Waiting for the client to accept.</span>
          )}
          {myApplication.status === "rejected" && (
            <span className="d-block small mt-1">Another provider was selected for this job.</span>
          )}
        </Alert>
      )}

      <Card className="sh-card border-0 p-4 mb-4">
        <div className="d-flex flex-wrap justify-content-between gap-2 mb-3">
          <StatusBadge status={job.status} />
          <span className="h4 fw-bold mb-0">{formatCurrency(job.budget)}</span>
        </div>
        <h1>{job.title}</h1>
        <p className="text-muted">{job.description}</p>
        <hr />
        <div className="row g-2 small">
          <div className="col-md-4">
            <strong>Category:</strong> {job.categoryId?.name || "—"}
          </div>
          <div className="col-md-4">
            <strong>City:</strong> {job.city}
          </div>
          <div className="col-md-4">
            <strong>Service date:</strong> {formatDate(job.serviceDate)}
          </div>
          <div className="col-md-12">
            <strong>Address:</strong>{" "}
            {[job.address, job.city, job.state, job.pincode].filter(Boolean).join(", ")}
          </div>
          {job.selectedProviderId && (
            <div className="col-md-12">
              <strong>Assigned provider:</strong> {job.selectedProviderId.fullName}
            </div>
          )}
        </div>

        <div className="mt-4 d-flex flex-wrap gap-2">
          {role === "provider" && job.status === "open" && !isOwner && !myApplication && (
            <Button className="btn-sh-primary" onClick={() => setShowApply(true)}>
              Apply Now
            </Button>
          )}
          {role === "provider" && myApplication?.status === "pending" && (
            <Button className="btn-sh-danger-outline" onClick={handleWithdraw}>
              Withdraw Application
            </Button>
          )}
          {role === "provider" && (job.status === "assigned" || job.status === "completed") && myApplication?.status === "accepted" && (
            <Button className="btn-sh-outline" onClick={() => goToChat(id)}>
              💬 Message Client
            </Button>
          )}
          {role === "client" && isOwner && job.status === "open" && (
            <Button as={Link} to={`/jobs/edit/${id}`} className="btn-sh-outline">
              Edit Job
            </Button>
          )}
          {role === "client" && isOwner && job.status === "assigned" && (
            <>
              <Button className="btn-sh-primary" onClick={handleComplete}>
                ✓ Mark Completed
              </Button>
              <Button className="btn-sh-success" onClick={handlePayment}>
                Pay Provider
              </Button>
              <Button className="btn-sh-outline" onClick={() => goToChat(id)}>
                💬 Message Provider
              </Button>
            </>
          )}
          {role === "client" && isOwner && job.status === "completed" && (
            <Button className="btn-sh-outline" onClick={() => setShowReview(true)}>
              ★ Leave Review
            </Button>
          )}
        </div>
      </Card>

      {role === "client" && isOwner && (
        <Card className="sh-card border-0 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">
              Applications
              {pendingCount > 0 && (
                <Badge className="ms-2" style={{ background: "var(--sh-black)" }}>
                  {pendingCount} new
                </Badge>
              )}
            </h4>
          </div>
          {applications.length === 0 ? (
            <p className="text-muted mb-0">No applications yet. Providers will appear here when they apply.</p>
          ) : (
            applications.map((app) => (
              <ApplicantCard
                key={app._id}
                application={app}
                jobStatus={job.status}
                accepting={acceptingId === app.providerId?._id}
                onAccept={(providerId) => handleAccept(providerId)}
                onMessage={
                  app.status === "accepted"
                    ? () => goToChat(id)
                    : undefined
                }
              />
            ))
          )}
        </Card>
      )}

      <Modal show={showApply} onHide={() => setShowApply(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Apply for Job</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleApply}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Message to client</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={applyForm.message}
                onChange={(e) => setApplyForm((p) => ({ ...p, message: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Proposed Budget (optional)</Form.Label>
              <Form.Control
                type="number"
                value={applyForm.proposedBudget}
                onChange={(e) => setApplyForm((p) => ({ ...p, proposedBudget: e.target.value }))}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowApply(false)}>
              Cancel
            </Button>
            <Button type="submit" className="btn-sh-primary">
              Submit Application
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <ReviewModal
        show={showReview}
        onHide={() => setShowReview(false)}
        rating={reviewForm.rating}
        onRatingChange={(r) => setReviewForm((p) => ({ ...p, rating: r }))}
        review={reviewForm.review}
        onReviewChange={(text) => setReviewForm((p) => ({ ...p, review: text }))}
        onSubmit={handleReview}
        submitting={submittingReview}
      />
    </Container>
  );
};

export default JobDetail;
