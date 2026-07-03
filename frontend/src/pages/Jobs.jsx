import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { getAllJobs, getCategories, getErrorMessage } from "../api/services";
import { formatCurrency, formatDate } from "../utils/helpers";
import StatusBadge from "../components/StatusBadge";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", categoryId: "", city: "", status: "" });

  const load = async () => {
    setLoading(true);
    try {
      const [jobsRes, catRes] = await Promise.all([
        getAllJobs(filters),
        getCategories(),
      ]);
      setJobs(jobsRes.data.jobs || jobsRes.data.data || []);
      setCategories(catRes.data.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Browse Jobs</h1>
      </div>

      <Card className="sh-card border-0 p-3 mb-4">
        <Form onSubmit={handleFilter} className="row g-2 align-items-end">
          <Col md={3}>
            <Form.Label className="small">Search</Form.Label>
            <Form.Control
              placeholder="Title, description..."
              value={filters.search}
              onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
            />
          </Col>
          <Col md={3}>
            <Form.Label className="small">Category</Form.Label>
            <Form.Select
              value={filters.categoryId}
              onChange={(e) => setFilters((p) => ({ ...p, categoryId: e.target.value }))}
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={2}>
            <Form.Label className="small">City</Form.Label>
            <Form.Control
              value={filters.city}
              onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
            />
          </Col>
          <Col md={2}>
            <Form.Label className="small">Status</Form.Label>
            <Form.Select
              value={filters.status}
              onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))}
            >
              <option value="">All</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Col>
          <Col md={2}>
            <Button type="submit" className="w-100 btn-sh-primary">Filter</Button>
          </Col>
        </Form>
      </Card>

      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : jobs.length === 0 ? (
        <p className="text-center text-muted py-5">No jobs found.</p>
      ) : (
        <Row className="g-4">
          {jobs.map((job) => (
            <Col md={6} lg={4} key={job._id}>
              <Card className="sh-card job-card border-0 h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <StatusBadge status={job.status} />
                    <span className="fw-bold">{formatCurrency(job.budget)}</span>
                  </div>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Text className="text-muted small text-truncate">{job.description}</Card.Text>
                  <p className="small mb-2">
                    📍 {job.city || "—"} · {job.categoryId?.name || "General"}
                  </p>
                  <p className="small text-muted mb-3">Posted {formatDate(job.createdAt)}</p>
                  <Button as={Link} to={`/jobs/${job._id}`} size="sm" className="w-100 btn-sh-outline">
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Jobs;
