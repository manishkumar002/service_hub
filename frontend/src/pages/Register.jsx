import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/services";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    role: "client",
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
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
      await register(form);
      toast.success("Account created! Please login.");
      navigate("/login");
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
      <div className="sh-card auth-card" style={{ maxWidth: 480 }}>
        <h2 className="text-center mb-1">Join ServiceHub</h2>
        <p className="text-center text-muted mb-4">Register as client or service provider</p>

        <div className="d-flex gap-2 mb-4">
          {["client", "provider"].map((r) => (
            <Button
              key={r}
              type="button"
              className={`flex-grow-1 text-capitalize ${form.role === r ? "btn-sh-primary" : "btn-sh-outline"}`}
              onClick={() => setForm((p) => ({ ...p, role: r }))}
            >
              {r}
            </Button>
          ))}
        </div>

        <Form onSubmit={handleSubmit}>
          {[
            { name: "fullName", label: "Full Name", type: "text" },
            { name: "email", label: "Email", type: "email" },
            { name: "phone", label: "Phone", type: "tel" },
            { name: "password", label: "Password", type: "password" },
          ].map((field) => (
            <Form.Group className="mb-3" key={field.name}>
              <Form.Label>{field.label}</Form.Label>
              <Form.Control
                type={field.type}
                name={field.name}
                value={form[field.name]}
                onChange={handleChange}
                isInvalid={!!errors[field.name]}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors[field.name]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}

          <Button type="submit" className="w-100 btn-sh-primary mt-2" disabled={loading}>
            {loading ? <Spinner size="sm" /> : "Register"}
          </Button>
        </Form>

        <p className="text-center mt-4 mb-0 text-muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
