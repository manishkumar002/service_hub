import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/services";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/jobs";

  const [loginType, setLoginType] = useState("email");
  const [form, setForm] = useState({ email: "", phone: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const payload = { password: form.password };
      if (loginType === "email") payload.email = form.email;
      else payload.phone = form.phone;

      await login(payload);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) setErrors(data.errors);
      else toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="sh-card auth-card">
        <h2 className="text-center mb-1">Welcome back</h2>
        <p className="text-center text-muted mb-4">Sign in to your ServiceHub account</p>

        <div className="d-flex gap-2 mb-4">
          <Button
            className={`flex-grow-1 ${loginType === "email" ? "btn-sh-primary" : "btn-sh-outline"}`}
            onClick={() => setLoginType("email")}
            type="button"
          >
            Email
          </Button>
          <Button
            className={`flex-grow-1 ${loginType === "phone" ? "btn-sh-primary" : "btn-sh-outline"}`}
            onClick={() => setLoginType("phone")}
            type="button"
          >
            Phone
          </Button>
        </div>

        <Form onSubmit={handleSubmit}>
          {loginType === "email" ? (
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                required
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                isInvalid={!!errors.phone}
                required
              />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>
          )}

          <Form.Group className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
              required
            />
            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="w-100 btn-sh-primary" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Login"}
          </Button>
        </Form>

        <p className="text-center mt-4 mb-0 text-muted">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
