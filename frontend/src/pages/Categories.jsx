import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { getCategories, getErrorMessage } from "../api/services";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container>
      <h1 className="mb-4">Service Categories</h1>
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Row className="g-4">
          {categories.map((cat) => (
            <Col sm={6} md={4} lg={3} key={cat._id}>
              <Card className="sh-card job-card border-0 text-center p-4 h-100">
                <div className="fs-1 mb-2">{ "🛠️"}</div>
                <Card.Title>{cat.name}</Card.Title>
                <Card.Text className="small text-muted">{cat.description || "Professional services"}</Card.Text>
                <Link to="/jobs" className="btn btn-sm btn-sh-outline mt-auto">View Jobs</Link>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {!loading && categories.length === 0 && (
        <p className="text-muted text-center">No categories available.</p>
      )}
    </Container>
  );
};

export default Categories;
