import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Login.css';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        email,
        password
      });

      if (response.status === 201) {
        setMessage("✅ Signup successful!");
      } else {
        setMessage("❌ Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setMessage(`❌ ${err.response?.data?.error || "Signup failed: Server error"}`);
    }
  };

  return (
    <div className="welcome-page">
      <h1 className="center-title">WeatherWise</h1>

      <div className="login-wrapper">
        {/* Left side - text/image */}
        <div className="side-box">
      <img src="/images/60065761.png" alt="Weather Graphic" className="side-image" />
      <p className="side-text">“Wherever you go, no matter what the weather, always bring your own sunshine.”</p>
    </div>

        {/* Right side - signup form */}
        <div className="form-box">
          <h2 className="form-title">Sign Up</h2>
          <form onSubmit={handleSignup} className="form">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-input"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
            <button type="submit" className="form-button">
              Sign Up
            </button>
          </form>
          {message && <p className="form-message">{message}</p>}
          <p className="form-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
