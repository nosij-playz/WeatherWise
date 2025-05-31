import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css'; // make sure this matches your file structure

function Welcome() {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">
        Welcome to WeatherWise{' '}
        <span role="img" aria-label="sun behind rain cloud">
          🌦️
        </span>
      </h1>
      <div className="button-group">
        <Link to="/login" className="animated-button">Login</Link>
        <Link to="/signup" className="animated-button">Sign Up</Link>
      </div>
    </div>
  );
}

export default Welcome;
