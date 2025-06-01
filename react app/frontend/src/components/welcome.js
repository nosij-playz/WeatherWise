import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Welcome.css';
 // make sure this matches your file structure

function Welcome() {
  return (
    <div className="welcome-page">
  <h1 className="center-title">WeatherWise</h1>

  <div className="feature-list scrollable">
    <ul>
      <li>🌤 Real-time weather updates</li>
      <li>📍 Save and manage your favorite cities</li>
      <li>📱 Responsive and mobile-friendly UI</li>
      <li>🔐 Secure login and signup system</li>
      <li>🖼 Weather icons, temperature, and descriptions</li>
    </ul>
  </div>

  <div className="welcome-container">
    <div className="welcome-subtitle">Join Now</div>
    <div className="button-group">
      <a href="/login" className="animated-button">Login</a>
      <a href="/signup" className="animated-button">Sign Up</a>
    </div>
  </div>
</div>
  );
}

export default Welcome;
