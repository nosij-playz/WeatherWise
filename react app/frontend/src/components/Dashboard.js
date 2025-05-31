import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [error, setError] = useState('');
  const username = localStorage.getItem('username');
  const API_KEY = '44956704cc6ab804672cdee5f5ba2f5f';
  const navigate = useNavigate();

  const fetchSavedCities = useCallback(async () => {
    if (!username) return;
    try {
      setError('');
      const res = await axios.get(`http://localhost:5000/cities/${username}`);
      const cities = res.data.cities;

      if (!cities.length) {
        setWeatherData([]);
        return;
      }

      const weatherResponses = await Promise.allSettled(
        cities.map(city =>
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          )
        )
      );

      const validWeather = weatherResponses
        .filter(r => r.status === 'fulfilled')
        .map(r => r.value.data);

      setWeatherData(validWeather);

      if (validWeather.length !== cities.length) {
        setError('Some cities could not be loaded. Please check city names.');
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to load weather data. Please check your connection.');
    }
  }, [username]);

  const handleAddCity = async () => {
    const trimmedCity = city.trim();
    if (!trimmedCity) return;

    if (weatherData.find(w => w.name.toLowerCase() === trimmedCity.toLowerCase())) {
      setError('City already added.');
      setCity('');
      return;
    }

    try {
      await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&appid=${API_KEY}`
      );

      await axios.post('http://localhost:5000/add-city', {
        username,
        city: trimmedCity,
      });

      setCity('');
      fetchSavedCities();
    } catch (err) {
      console.error('Error adding city:', err);
      setError('City not found or error occurred.');
    }
  };

  const handleDeleteCity = async (cityToDelete) => {
    try {
      await axios.delete('http://localhost:5000/delete-city', {
        data: {
          username,
          city: cityToDelete
        }
      });

      setWeatherData(prevData =>
        prevData.filter(w => w.name.toLowerCase() !== cityToDelete.toLowerCase())
      );
    } catch (err) {
      console.error('Error deleting city:', err);
      setError('Could not delete city.');
    }
  };

  useEffect(() => {
    fetchSavedCities();
  }, [fetchSavedCities]);

  if (!username) {
    return (
      <div className="dashboard-container">
        <p>Please log in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {username}</h1>
        <FaUserCircle
          className="profile-icon"
          onClick={() => navigate('/profile')}
          title="Profile"
        />
      </div>

      <div className="dashboard-input-group">
        <input
          className="dashboard-input"
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button className="dashboard-button" onClick={handleAddCity}>
          Add City
        </button>
      </div>

      {error && <p style={{ color: 'salmon', marginTop: '10px' }}>{error}</p>}

      <div className="weather-cards">
        {weatherData.map((weather, index) => (
          <div key={index} className="weather-card">
            <div className="card-header">
              <h2>{weather.name}</h2>
              <button
                className="remove-btn"
                onClick={() => handleDeleteCity(weather.name)}
                title="Remove city"
              >
                <span role="img" aria-label="trash">🗑️</span>
              </button>
            </div>
            <p>{weather.weather[0].description}</p>
            <p>{weather.main.temp}°C</p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={`Weather icon for ${weather.weather[0].description}`}
            />
            <button
              className="details-btn"
              onClick={() =>
                window.open(
                  `https://openweathermap.org/city/${weather.id}`,
                  '_blank'
                )
              }
            >
              More Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
