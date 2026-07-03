import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Table, Button, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { getMyPostedJobs, deleteJob, getErrorMessage } from "../api/services";
import { formatCurrency, formatDate } from "../utils/helpers";
import StatusBadge from "../components/StatusBadge";

const MyPostedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await getMyPostedJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await deleteJob(id);
      toast.success("Job deleted");
      load();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const totalPending = jobs.reduce((s, j) => s + (j.pendingApplicationCount || 0), 0);

  return (
    <Container>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <div>
          <h1 className="page-title mb-1">My Posted Jobs</h1>
          {totalPending > 0 && (
            <p className="mb-0 small fw-semibold">
              {totalPending} new application{totalPending > 1 ? "s" : ""} waiting for review
            </p>
          )}
        </div>
        <div className="d-flex gap-2">
          {totalPending > 0 && (
            <Button as={Link} to="/applications" className="btn-sh-primary">
              Review applications ({totalPending})
            </Button>
          )}
          <Button as={Link} to="/jobs/create" className="btn-sh-primary">
            + Post Job
          </Button>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <div className="sh-card p-3 table-responsive">
          <Table hover className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Applications</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>
                    {job.title}
                    {(job.pendingApplicationCount || 0) > 0 && (
                      <Badge pill className="ms-2" style={{ background: "var(--sh-black)" }} title="New applications">
                        {job.pendingApplicationCount}
                      </Badge>
                    )}
                  </td>
                  <td>{formatCurrency(job.budget)}</td>
                  <td>
                    <StatusBadge status={job.status} />
                  </td>
                  <td>
                    {(job.pendingApplicationCount || 0) > 0 ? (
                      <Button
                        as={Link}
                        to={`/jobs/${job._id}`}
                        size="sm"
                        className="btn-sh-danger-outline"
                      >
                        {job.pendingApplicationCount} pending
                      </Button>
                    ) : (
                      <span className="text-muted small">—</span>
                    )}
                  </td>
                  <td>{formatDate(job.createdAt)}</td>
                  <td className="d-flex gap-1 flex-wrap">
                    <Button as={Link} to={`/jobs/${job._id}`} size="sm" className="btn-sh-outline">
                      View
                    </Button>
                    {job.status === "open" && (
                      <Button as={Link} to={`/jobs/edit/${job._id}`} size="sm" className="btn-sh-outline">
                        Edit
                      </Button>
                    )}
                    <Button size="sm" className="btn-sh-danger-outline" onClick={() => handleDelete(job._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {jobs.length === 0 && (
            <p className="text-center text-muted py-4 mb-0">No jobs posted yet.</p>
          )}
        </div>
      )}
    </Container>
  );
};

export default MyPostedJobs;
