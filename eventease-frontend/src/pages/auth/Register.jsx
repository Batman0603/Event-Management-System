import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './signup.css';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signup, authError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // Default role
    department: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.name || formData.name.length < 2) {
      setError('Username must be at least 2 characters');
      return false;
    }
    if (!formData.department) {
      setError('Department is required');
      return false;
    }
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department,
      });
      // Navigation is handled by AuthContext
      setSuccess(`Account created for ${formData.name}! Redirecting to your dashboard...`);
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page-container">
      <div className="signup-form-section">
        <form className="form" onSubmit={handleSubmit}>
          <p className="form-title">Create your account</p>
          <p className="form-subtitle">
            Join the community to manage and attend events.
          </p>

          {(error || authError) && (
            <div className="error-message">{error || authError}</div>
          )}
          {success && <div className="success-message">{success}</div>}

          <div className="input-container">
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter Username"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              placeholder="Enter Department"
              value={formData.department}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-container">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" name="email" placeholder="Enter Email Address" value={formData.email} onChange={handleInputChange} required />
          </div>

          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleInputChange} required />
          </div>

          <div className="input-container">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleInputChange} required />
          </div>

          <div className="input-container">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleInputChange}>
              <option value="student">Student</option>
              <option value="club_admin">Club Admin</option> 
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="login-link">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
      <div className="signup-decorative-section"></div>
    </div>
  );
};

export default Register;