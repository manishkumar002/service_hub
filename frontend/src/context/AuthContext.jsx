import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getProfile, loginUser, registerUser } from "../api/services";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);
  const [loading, setLoading] = useState(true);

  const persistAuth = (token, userData, userRole) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userRole);
    setUser(userData);
    setRole(userRole);
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    setUser(null);
    setRole(null);
  };

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await getProfile();
      const profile = data.data;
      setUser(profile);
      setRole(profile.role);
      localStorage.setItem("user", JSON.stringify(profile));
      localStorage.setItem("role", profile.role);
    } catch {
      clearAuth();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const login = async (credentials) => {
    const { data } = await loginUser(credentials);
    persistAuth(data.token, data.data, data.role);
    return data;
  };

  const register = async (payload) => {
    const { data } = await registerUser(payload);
    return data;
  };

  const logout = () => clearAuth();

  const isAuthenticated = Boolean(localStorage.getItem("token") && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        refreshProfile,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
