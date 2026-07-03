const jwt = require("jsonwebtoken");
const User = require("../models/users");
const isAuthenticatedUser = async (req, res, next) => {
  try {
    let token = "";
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Please login to access this resource",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error);
    return res.status(401).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
};
const checkRole = (role) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "User not authenticated",
        });
      }

      if (req.user.role !== role) {
        return res.status(403).json({
          status: "error",
          message: `Access denied. Only ${role} can access this route`,
        });
      }

      next();
    } catch (error) {
      console.error("Role Check Error:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  };
};
const checkRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "User not authenticated",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          status: "error",
          message: `Access denied. Allowed roles: ${roles.join(", ")}`,
        });
      }

      next();
    } catch (error) {
      console.error("Roles Check Error:", error);
      return res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  };
};

module.exports = { isAuthenticatedUser, checkRole, checkRoles };
