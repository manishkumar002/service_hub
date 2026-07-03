import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  Button,
  NavDropdown,
  Badge,
} from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";
import HeaderIcons from "../HeaderIcons";
import { useNotifications } from "../../context/NotificationContext";

const Header = () => {
  const { isAuthenticated, role, user, logout } = useAuth();
  const { pendingApplications } = useNotifications();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="sh-navbar sticky-top" variant="light">
      <Container>
        <Navbar.Brand as={Link} to="/">
          ServiceHub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={NavLink} to="/jobs">
                  Browse Jobs
                </Nav.Link>

                {role === "client" && (
                  <>
                    <Nav.Link as={NavLink} to="/jobs/my-posted">
                      My Posted Jobs
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/applications" className="d-flex align-items-center gap-1">
                      Applications
                      {pendingApplications > 0 && (
                        <Badge pill className="ms-1">
                          {pendingApplications}
                        </Badge>
                      )}
                    </Nav.Link>
                  </>
                )}
                {role === "provider" && (
                  <>
                    <Nav.Link as={NavLink} to="/jobs/my-applied">
                      My Applications
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/categories">
                      Categories
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/subscription">
                      Subscription
                    </Nav.Link>
                  </>
                )}
                {role === "admin" && (
                  <>
                    <Nav.Link as={NavLink} to="/admin/categories">
                      Categories
                    </Nav.Link>
                  </>
                )}
              </>
            )}
          </Nav>
          <Nav className="align-items-lg-center gap-2">
            <HeaderIcons />
            {!isAuthenticated ? (
              <>
                <Button
                  as={Link}
                  to="/login"
                  className="btn-sh-outline"
                  size="sm"
                >
                  Login
                </Button>
                <Button
                  as={Link}
                  to="/register"
                  className="btn-sh-primary"
                  size="sm"
                >
                  Register
                </Button>
              </>
            ) : (
              <NavDropdown
                title={user?.fullName || "Account"}
                align="end"
                id="user-dropdown"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
