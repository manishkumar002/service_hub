import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import { createJob, updateJob, getJobById, getCategories, getErrorMessage } from "../api/services";

const CreateJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    budget: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    serviceDate: "",
    serviceTime: "",
  });

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.data || []));
    if (isEdit) {
      getJobById(id).then((res) => {
        const j = res.data.job;
        setForm({
          title: j.title || "",
          description: j.description || "",
          categoryId: j.categoryId?._id || j.categoryId || "",
          budget: j.budget || "",
          address: j.address || "",
          city: j.city || "",
          state: j.state || "",
          pincode: j.pincode || "",
          latitude: j.location?.coordinates?.[1] || "",
          longitude: j.location?.coordinates?.[0] || "",
          serviceDate: j.serviceDate ? j.serviceDate.slice(0, 10) : "",
          serviceTime: j.serviceTime || "",
        });
      });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, budget: Number(form.budget) };
      if (isEdit) {
        await updateJob(id, payload);
        toast.success("Job updated");
      } else {
        await createJob(payload);
        toast.success("Job posted successfully");
      }
      navigate("/jobs/my-posted");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="sh-card border-0 p-4">
            <h2 className="mb-4">{isEdit ? "Edit Job" : "Post a New Job"}</h2>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control name="title" value={form.title} onChange={handleChange} required />
                </Col>
                <Col md={12} className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={4} name="description" value={form.description} onChange={handleChange} required />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Budget (₹)</Form.Label>
                  <Form.Control type="number" name="budget" value={form.budget} onChange={handleChange} required />
                </Col>
                {["address", "city", "state", "pincode", "serviceDate", "serviceTime"].map((f) => (
                  <Col md={6} key={f} className="mb-3">
                    <Form.Label className="text-capitalize">{f.replace(/([A-Z])/g, " $1")}</Form.Label>
                    <Form.Control
                      type={f === "serviceDate" ? "date" : "text"}
                      name={f}
                      value={form[f]}
                      onChange={handleChange}
                    />
                  </Col>
                ))}
                <Col md={6} className="mb-3">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control name="latitude" value={form.latitude} onChange={handleChange} />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control name="longitude" value={form.longitude} onChange={handleChange} />
                </Col>
              </Row>
              <Button type="submit" className="btn-sh-primary" disabled={loading}>
                {loading ? <Spinner size="sm" /> : isEdit ? "Update Job" : "Post Job"}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateJob;
