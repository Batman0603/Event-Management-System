import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

// Public pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import EventDetails from "../pages/EventDetails";

// Dashboards (lazy-loaded for better performance)
const StudentDashboard = lazy(() => import("../pages/dashboards//StudentDashboard.jsx"));
const ClubAdminDashboard = lazy(() => import("../pages/dashboards/ClubAdminDashboard.jsx"));
const AdminDashboard = lazy(() => import("../pages/dashboards/AdminDashboard.jsx"));

// A simple loading fallback for lazy components
const Loading = () => <div style={{ padding: 20 }}>Loading page...</div>;

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Redirect root to login page */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/events/:id" element={<EventDetails />} />

        {/* Prevent logged-in users from seeing login/register pages */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dash/student" element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/dash/club-admin" element={<ProtectedRoute allowedRoles={["club_admin"]}><ClubAdminDashboard /></ProtectedRoute>} />
        <Route path="/dash/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />

      </Routes>
    </Suspense>
  );
}