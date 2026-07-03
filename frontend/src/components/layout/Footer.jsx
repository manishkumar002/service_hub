import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => (
  <footer className="sh-footer">
    <Container>
      <Row className="gy-4">
        <Col md={4}>
          <h5 className="text-white mb-3">ServiceHub</h5>
          <p className="small mb-0">
            Connect with trusted service providers for home repairs, cleaning,
            plumbing, and more — all in one place.
          </p>
        </Col>
        <Col md={4}>
          <h6 className="text-white mb-3">Quick Links</h6>
          <ul className="list-unstyled small">
            <li className="mb-2">
              <Link to="/">Home</Link>
            </li>
            <li className="mb-2">
              <Link to="/jobs">Jobs</Link>
            </li>
            <li className="mb-2">
              <Link to="/register">Register</Link>
            </li>
          </ul>
        </Col>
        <Col md={4}>
          <h6 className="text-white mb-3">Contact</h6>
          <p className="small mb-1">support@servicehub.com</p>
          <p className="small mb-0">+91 98765 43210</p>
        </Col>
      </Row>
      <hr className="border-secondary my-4" />
      <p className="small text-center mb-0">
        © {new Date().getFullYear()} ServiceHub. All rights reserved.
      </p>
    </Container>
  </footer>
);

export default Footer;
