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
      </div>
      <div>
        {!user ? (
          <>
            <Link to="/login" style={{ marginRight: 12, color: 'white', textDecoration: 'none' }}>Login</Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
          </>
        ) : (
          <>
            <button onClick={() => logout()} style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}