import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/login', { username, password });
      setMessage(res.data.message);

      if (res.data.message === "Login successful") {
        localStorage.setItem('username', username);
        navigate('/dashboard');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="welcome-page">
  <h1 className="center-title">WeatherWise</h1>
  <div className="login-wrapper">
    <div className="form-box">
      <h2 className="form-title">Login</h2>
      <input
        className="form-input"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button className="form-button" onClick={handleLogin}>Login</button>
      <p className="form-message">{message}</p>
      <p className="form-link">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>

    <div className="side-box">
      <img src="/images/60065761.png" alt="Weather Graphic" className="side-image" />
      <p className="side-text">“Wherever you go, no matter what the weather, always bring your own sunshine.”</p>
    </div>
  </div>
</div>
  );
}

export default Login;
