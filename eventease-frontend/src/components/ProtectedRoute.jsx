// frontend/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasRole } from "../utils/roleCheck";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <p>Checking session...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(user, allowedRoles)) {
    // If authenticated but wrong role, redirect to correct dashboard
    switch (user.role) {
      case "student":
        return <Navigate to="/dash/student" replace />;
      case "club_admin":
        return <Navigate to="/dash/club-admin" replace />;
      case "admin":
        return <Navigate to="/dash/admin" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
}