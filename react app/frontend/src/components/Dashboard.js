import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function getWindDirection(deg) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

function calculateDewPoint(tempC, humidity) {
  const a = 17.27;
  const b = 237.7;
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
  const dewPoint = (b * alpha) / (a - alpha);
  return dewPoint.toFixed(1);
}

function getUVGrade(uvi) {
  if (uvi === 'N/A' || uvi == null) return { label: 'N/A', color: '#6c757d' };
  if (uvi <= 2) return { label: 'Low', color: '#3fc380' };
  if (uvi <= 5) return { label: 'Moderate', color: '#f4d03f' };
  if (uvi <= 7) return { label: 'High', color: '#f39c12' };
  if (uvi <= 10) return { label: 'Very High', color: '#e74c3c' };
  return { label: 'Extreme', color: '#8e44ad' };
}

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

      const validWeather = [];

      for (const response of weatherResponses) {
        if (response.status === 'fulfilled') {
          const weather = response.value.data;

          // Fetch UV Index using lat/lon
          const { lat, lon } = weather.coord;
          try {
            const oneCallRes = await axios.get(
              `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&appid=${API_KEY}`
            );
            const uvi = oneCallRes.data.current.uvi;
            weather.uvi = uvi;
          } catch (err) {
            console.warn(`Could not fetch UV index for ${weather.name}`);
            weather.uvi = 'N/A';
          }

          validWeather.push(weather);
        }
      }

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
        {weatherData.map((weather, index) => {
          const uv = getUVGrade(weather.uvi);
          return (
            <div key={index} className="weather-card">
              <div className="card-header">
                <h2>{weather.name}</h2>
                <button
                  className="remove-btn"
                  onClick={() => handleDeleteCity(weather.name)}
                  title="Remove city"
                >
                  🗑️
                </button>
              </div>

              <p>{weather.weather[0].description}</p>
              <p>{weather.main.temp}°C / {(weather.main.temp * 9/5 + 32).toFixed(1)}°F</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={`Weather icon for ${weather.weather[0].description}`}
              />

              <div className="weather-details">
  <p><strong>Wind:</strong> {weather.wind.speed} m/s {getWindDirection(weather.wind.deg)}</p>
  <p><strong>Pressure:</strong> {weather.main.pressure} hPa</p>
  <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
  <p><strong>Visibility:</strong> {(weather.visibility / 1000).toFixed(1)} km</p>
  <p><strong>Dew Point:</strong> {calculateDewPoint(weather.main.temp, weather.main.humidity)}°C</p>

  {/* Only show UV Index if it's valid */}
  {weather.uvi !== 'N/A' && weather.uvi !== undefined && (
    <p>
      <strong>UV Index:</strong>{' '}
      <span className="uv-badge" style={{ backgroundColor: uv.color }}>
        {weather.uvi.toFixed(1)} ({uv.label})
      </span>
    </p>
  )}
</div>

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
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
