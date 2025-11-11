// frontend/src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginApi, signupApi, logoutApi, verifyTokenApi } from "../services/authService.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // { id, name, email, role }
  const [loading, setLoading] = useState(true); // initial verify
  const [authError, setAuthError] = useState(null);

  // verify on mount to restore session if cookie exists
  const verify = useCallback(async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const data = await verifyTokenApi();
      // The user object is nested under `data` from the success_response
      setUser(data.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verify();
  }, []);

  // Login wrapper: call backend, then re-verify and route based on role
  async function login(credentials) {
    setAuthError(null);
    try {
      const data = await loginApi(credentials); // The login response now contains the user
      setUser(data.user);
      // Redirect based on role AFTER setting user
      routeAfterAuth(data.user); 
    } catch (err) {
      setAuthError(err.message || "Login failed");
      throw err;
    }
  }

  async function signup(details) {
    setAuthError(null);
    try {
      const data = await signupApi(details); // The signup response also contains the user
      setUser(data.user);
      // Redirect based on role AFTER setting user
      routeAfterAuth(data.user);
    } catch (err) {
      setAuthError(err.message || "Signup failed");
      throw err;
    }
  }

  async function logout() {
    setAuthError(null);
    try {
      await logoutApi();
    } catch (err) {
      // don't block logout UI on network flakiness
      console.error("Logout API error:", err);
    } finally {
      setUser(null);
      navigate("/login", { replace: true }); // Explicitly navigate to login
    }
  }

  function routeAfterAuth(userObj) {
    if (!userObj || !userObj.role) {
      navigate("/login", { replace: true });
      return;
    }
    switch (userObj.role) {
      case "student":
        navigate("/dash/student", { replace: true });
        break;
      case "club_admin":
        navigate("/dash/club-admin", { replace: true });
        break;
      case "admin":
        navigate("/dash/admin", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
    }
  }

  const value = {
    user,
    loading,
    authError,
    login,
    signup,
    logout,
    verify, // expose verify in case pages want to re-check
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}