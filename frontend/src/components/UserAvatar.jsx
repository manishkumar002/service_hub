import { useState } from "react";

const UserIcon = ({ size }) => (
  <svg
    width={size * 0.5}
    height={size * 0.5}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2h19.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
  </svg>
);

const getInitials = (name) => {
  if (!name || name === "User") return "";
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const isValidImageUrl = (src) => {
  if (!src || typeof src !== "string") return false;
  const trimmed = src.trim();
  return trimmed.length > 0 && trimmed !== "null" && trimmed !== "undefined";
};

const UserAvatar = ({ src, name = "User", size = 40, className = "" }) => {
  const [imgError, setImgError] = useState(false);
  const showImage = isValidImageUrl(src) && !imgError;
  const initials = getInitials(name);

  if (showImage) {
    return (
      <img
        src={src.trim()}
        alt={name}
        width={size}
        height={size}
        className={`user-avatar-img rounded-circle flex-shrink-0 ${className}`}
        style={{ width: size, height: size, objectFit: "cover" }}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className={`user-avatar-fallback rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
      title={name}
      aria-label={name}
    >
      {initials ? (
        <span className="user-avatar-initials" style={{ fontSize: size * 0.36 }}>
          {initials}
        </span>
      ) : (
        <UserIcon size={size} />
      )}
    </div>
  );
};

export default UserAvatar;
