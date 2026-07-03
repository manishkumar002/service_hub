import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    title: "Post a Job",
    text: "Describe your task, set a budget, and receive offers from verified professionals.",
    icon: "📋",
  },
  {
    title: "Hire Providers",
    text: "Review applications, compare bids, and accept the best match in one tap.",
    icon: "🔧",
  },
  {
    title: "Chat & Pay",
    text: "Message in real time and pay securely when the work is complete.",
    icon: "💬",
  },
];

const stats = [
  { value: "500+", label: "Providers" },
  { value: "1.2k+", label: "Jobs done" },
  { value: "4.8★", label: "Avg rating" },
];

const Home = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <>
      <section className="sh-hero">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={7} className="animate-in">
              <span className="sh-hero-badge">🏠 Trusted home services</span>
              <h1 className="display-5 display-md-4 mb-3">
                Book local experts in minutes
              </h1>
              <p className="lead mb-4 opacity-90 pe-lg-4">
                Plumbers, electricians, cleaners and more — transparent pricing,
                built-in chat, and reviews you can trust.
              </p>
              {!isAuthenticated ? (
                <div className="d-flex flex-column flex-sm-row gap-2">
                  <Button
                    as={Link}
                    to="/register"
                    size="lg"
                    className="btn-sh-primary px-4"
                  >
                    Get Started Free
                  </Button>
                  <Button
                    as={Link}
                    to="/login"
                    size="lg"
                    variant="outline-light"
                    className="px-4"
                  >
                    Sign In
                  </Button>
                </div>
              ) : (
                <Button
                  as={Link}
                  to={role === "client" ? "/jobs/create" : "/jobs"}
                  size="lg"
                  className="btn-sh-primary px-4"
                >
                  {role === "client" ? "+ Post a Job" : "Browse Open Jobs"}
                </Button>
              )}
              <Row className="g-3 mt-4 pt-2">
                {stats.map((s) => (
                  <Col xs={4} key={s.label}>
                    <div className="fw-bold fs-5">{s.value}</div>
                    <div className="small opacity-75">{s.label}</div>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col
              lg={5}
              className="sh-hero-visual animate-in animate-in-delay-2"
            >
              <div className="hero-float-card">
                <div className="small opacity-75 mb-2">Live now</div>
                <div className="fw-bold fs-5 mb-1">Plumber · Lucknow</div>
                <div className="small mb-3">Pipe repair · ₹800</div>
                <div className="d-flex gap-2">
                  <span className="badge">3 applied</span>
                  <span className="badge bg-light text-dark border">Open</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="mt-4 mt-md-5 px-3 px-md-4">
        <Row className="g-3 g-md-4 mb-4 mb-md-5">
          {features.map((f, i) => (
            <Col xs={12} sm={6} lg={4} key={f.title}>
              <Card
                className={`sh-card feature-card h-100 p-4 text-center animate-in animate-in-delay-${i + 1}`}
              >
                <div className="feature-icon-wrap">{f.icon}</div>
                <Card.Title className="fw-bold">{f.title}</Card.Title>
                <Card.Text className="text-muted small mb-0">
                  {f.text}
                </Card.Text>
              </Card>
            </Col>
          ))}
        </Row>

        <Card className="sh-card cta-section text-center p-4 p-md-5 animate-in border-0">
          <h2 className="fw-bold mb-2">Ready to hire or earn?</h2>
          <p className="mb-4 mx-auto opacity-75" style={{ maxWidth: 480 }}>
            Join as a client to post jobs, or register as a provider and grow
            your business.
          </p>
          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
            <Button
              as={Link}
              to="/register"
              className="btn-sh-primary btn-lg px-4"
            >
              Create Free Account
            </Button>
            <Button
              as={Link}
              to="/login"
              className="btn-sh-outline btn-lg px-4"
            >
              Sign In
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
};

export default Home;
