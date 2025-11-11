import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../context/AuthContext";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import EventDetails from "../pages/EventDetails";

const StudentDashboard = lazy(() => import("../pages/dashboards/StudentDashboard.jsx"));
const ClubAdminDashboard = lazy(() => import("../pages/dashboards/ClubAdminDashboard.jsx"));
const AdminDashboard = lazy(() => import("../pages/dashboards/AdminDashboard.jsx"));
const Profile = lazy(() => import("../pages/Profile.jsx"));
const MyEvents = lazy(() => import("../components/Students/MyEvents.jsx"));
const MyFeedbacks = lazy(() => import("../pages/dashboards/MyFeedbacks.jsx"));
const UserManagement = lazy(() => import("../components/Admin/UserManagement.jsx"));
const SystemLogsView = lazy(() => import("../components/Admin/SystemLogsView.jsx"));
const FeedbackView = lazy(() => import("../components/Admin/FeedbackView.jsx"));

const Loading = () => <div style={{ padding: 20 }}>Loading page...</div>;

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />; // ✅ No redirects while verifying token

  return (
    <Suspense fallback={<Loading />}>
      <Routes>

        {/* ✅ Root redirects correctly */}
        <Route
          path="/"
          element={
            user
              ? <Navigate to={`/dash/${user.role}`} replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* ✅ Public Routes */}
        <Route path="/events/:id" element={<EventDetails />} />

        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to={`/dash/${user.role}`} replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to={`/dash/${user.role}`} replace />}
        />

        {/* ✅ Protected Routes */}
        <Route
          path="/dash/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dash/club-admin"
          element={
            <ProtectedRoute allowedRoles={["club_admin"]}>
              <ClubAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dash/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["student", "club_admin", "admin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-events"
          element={
            <ProtectedRoute allowedRoles={["student", "club_admin", "admin"]}>
              <MyEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-feedbacks"
          element={
            <ProtectedRoute allowedRoles={["student", "club_admin"]}>
              <MyFeedbacks />
            </ProtectedRoute>
          }
        />
        <Route
  path="/dash/admin/users"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <UserManagement />
    </ProtectedRoute>
  }
/>

        <Route
          path="/dash/admin/logs"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SystemLogsView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dash/admin/feedback"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <FeedbackView />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
