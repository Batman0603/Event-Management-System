import React, { useState } from 'react';
import './login.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, authError } = useAuth();
    const [error, setError] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await login({ email, password });
            // Navigation is handled by AuthContext's login function
        } catch (err) {
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

  return (
        <div className='container'>
             <div className="login">
                <form className="form" onSubmit={handleSubmit}>
                    <p className="form-title">Sign in to your account</p>
                    {(error || authError) && <div className="error-message">{error || authError}</div>}

                    <div className="input-container">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            required
                        />
                    </div>

                    <button type="submit" className="submit" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>

                    <p className="signup-link">
                         No account? <Link to="/register">Sign up</Link>
                    </p>
                </form>
            </div>
        </div>

  );
};