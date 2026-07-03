import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

const IconBtn = ({ to, label, count, children }) => (
  <Link
    to={to}
    className="header-icon-btn d-inline-flex align-items-center justify-content-center position-relative"
    title={label}
    aria-label={count > 0 ? `${label}, ${count} new` : label}
  >
    {children}
    {count > 0 && (
      <span className="notif-badge position-absolute top-0 start-100 translate-middle badge rounded-pill">
        {count > 99 ? "99+" : count}
      </span>
    )}
  </Link>
);

const HeaderIcons = () => {
  const { role, isAuthenticated } = useAuth();
  const { pendingApplications, unreadChat } = useNotifications();

  if (!isAuthenticated || role === "admin") return null;

  return (
    <div className="d-flex align-items-center gap-2 me-1">
      {role === "client" && (
        <IconBtn
          to="/applications"
          label="New job applications"
          count={pendingApplications}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" aria-hidden>
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4 1 1 1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
            <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z" />
          </svg>
        </IconBtn>
      )}
      <IconBtn to="/chat" label="Messages" count={unreadChat}>
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16" aria-hidden>
          <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.637c.639.085.92.178 1.011.223.035.012.072.025.11.037.062.02.124.04.185.06.09.028.18.053.27.075.002 0 .003 0 .005 0a.75.75 0 0 0 .287-.801 10.97 10.97 0 0 1-.398-2z" />
        </svg>
      </IconBtn>
    </div>
  );
};

export default HeaderIcons;
