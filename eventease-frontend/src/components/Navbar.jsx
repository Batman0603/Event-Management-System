// frontend/src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const auth = useAuth();

  // Render nothing until the auth state is determined to avoid crashes.
  if (!auth) return null;

  const { user, logout } = auth;
  
  return (
    <nav style={{ backgroundColor: 'royalblue', color: 'white', padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
          EventEase
        </Link>
        {/* Conditional links based on user role */}
          {user && user.role === "student" && (
            <Link to="/dash/student" style={{ marginLeft: 20, color: 'white', textDecoration: 'none' }}>Student</Link>
          )}
          {user && user.role === "club_admin" && (
            <Link to="/dash/club-admin" style={{ marginLeft: 20, color: 'white', textDecoration: 'none' }}>Club Admin</Link>
          )}
          {user && user.role === "admin" && (
            <Link to="/dash/admin" style={{ marginLeft: 20, color: 'white', textDecoration: 'none' }}>Admin</Link>
          )}
      </div>
      <div>
        {!user ? (
          <>
            <Link to="/login" style={{ marginRight: 12, color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
          </>
        ) : (
          <>
            <span style={{ marginRight: 12 }}>{user.name || user.email}</span>
            <button onClick={() => logout()} style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}