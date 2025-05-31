import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/Signup.css'; // ✅ correct


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
      if (err.response?.data?.error) {
        setMessage(`❌ ${err.response.data.error}`);
      } else {
        setMessage("❌ Signup failed: Server error");
      }
    }
  };

  return (
    <div className="form-container">
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
  );
}
