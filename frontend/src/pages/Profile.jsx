import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { updateProfile, getErrorMessage } from "../api/services";
import { capitalize } from "../utils/helpers";
import UserAvatar from "../components/UserAvatar";

const Profile = () => {
  const { user, role, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        pincode: user.pincode || "",
        profileImage: user.profileImage || "",
        servicesOffered: (user.servicesOffered || []).join(", "),
        skills: (user.skills || []).join(", "),
        experienceYears: user.experienceYears ?? "",
        hourlyRate: user.hourlyRate ?? "",
        availability: user.availability || "available",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (role === "provider") {
        payload.servicesOffered = form.servicesOffered
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        payload.skills = form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (form.experienceYears !== "") payload.experienceYears = Number(form.experienceYears);
        if (form.hourlyRate !== "") payload.hourlyRate = Number(form.hourlyRate);
      } else {
        delete payload.servicesOffered;
        delete payload.skills;
        delete payload.experienceYears;
        delete payload.hourlyRate;
        delete payload.availability;
      }
      await updateProfile(payload);
      await refreshProfile();
      toast.success("Profile updated");
      setEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={8}>
          <div className="sh-card p-4">
            <div className="d-flex flex-wrap align-items-start justify-content-between gap-3 mb-4">
              <div className="d-flex align-items-center gap-3">
                <UserAvatar
                  src={user.profileImage}
                  name={user.fullName}
                  size={96}
                  className="profile-avatar-wrap"
                />
                <div>
                  <h2 className="mb-1">{user.fullName}</h2>
                  <Badge bg="primary" className="me-2">{capitalize(user.role)}</Badge>
                  {user.premiumStatus && <Badge bg="warning" text="dark">Premium</Badge>}
                  <p className="text-muted mb-0 mt-2">{user.email} · {user.phone}</p>
                </div>
              </div>
              <Button className={editing ? "btn-sh-outline" : "btn-sh-primary"} onClick={() => setEditing(!editing)}>
                {editing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            {editing ? (
              <Form onSubmit={handleSubmit}>
                <Row>
                  {["fullName", "email", "phone", "city", "state", "pincode", "address", "profileImage"].map((f) => (
                    <Col md={6} key={f} className="mb-3">
                      <Form.Label className="text-capitalize">{f.replace(/([A-Z])/g, " $1")}</Form.Label>
                      <Form.Control name={f} value={form[f] || ""} onChange={handleChange} />
                    </Col>
                  ))}
                  <Col md={12} className="mb-3">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control as="textarea" rows={3} name="bio" value={form.bio} onChange={handleChange} />
                  </Col>
                  {role === "provider" && (
                    <>
                      <Col md={6} className="mb-3">
                        <Form.Label>Services (comma separated)</Form.Label>
                        <Form.Control name="servicesOffered" value={form.servicesOffered} onChange={handleChange} />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Skills (comma separated)</Form.Label>
                        <Form.Control name="skills" value={form.skills} onChange={handleChange} />
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Experience (years)</Form.Label>
                        <Form.Control type="number" name="experienceYears" value={form.experienceYears} onChange={handleChange} />
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Hourly Rate (₹)</Form.Label>
                        <Form.Control type="number" name="hourlyRate" value={form.hourlyRate} onChange={handleChange} />
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Availability</Form.Label>
                        <Form.Select name="availability" value={form.availability} onChange={handleChange}>
                          <option value="available">Available</option>
                          <option value="busy">Busy</option>
                          <option value="offline">Offline</option>
                        </Form.Select>
                      </Col>
                    </>
                  )}
                </Row>
                <Button type="submit" className="btn-sh-primary" disabled={loading}>
                  {loading ? <Spinner size="sm" /> : "Save Changes"}
                </Button>
              </Form>
            ) : (
              <Row className="g-3">
                <Col sm={6}><strong>City:</strong> {user.city || "—"}</Col>
                <Col sm={6}><strong>State:</strong> {user.state || "—"}</Col>
                <Col sm={12}><strong>Address:</strong> {user.address || "—"}</Col>
                <Col sm={12}><strong>Bio:</strong> {user.bio || "—"}</Col>
                {role === "provider" && (
                  <>
                    <Col sm={6}><strong>Hourly Rate:</strong> ₹{user.hourlyRate ?? "—"}</Col>
                    <Col sm={6}><strong>Experience:</strong> {user.experienceYears ?? 0} years</Col>
                    <Col sm={12}><strong>Services:</strong> {(user.servicesOffered || []).join(", ") || "—"}</Col>
                  </>
                )}
              </Row>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
