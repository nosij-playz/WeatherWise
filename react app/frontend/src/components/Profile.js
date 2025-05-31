import React, { useState, useEffect } from 'react';
import '../styles/Profile.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const navigate = useNavigate();
  const storedUsername = localStorage.getItem('username');
  const [userData, setUserData] = useState({
    newUsername: '',
    newEmail: '',
    newPassword: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [message, setMessage] = useState('');

  // Load current user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/user/${storedUsername}`);
        setOriginalData(res.data);
        setUserData({
          newUsername: res.data.username,
          newEmail: res.data.email,
          newPassword: ''
        });
      } catch (err) {
        console.error('Fetch user failed:', err);
        setMessage('Failed to load user data.');
      }
    };
    fetchUser();
  }, [storedUsername]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        currentUsername: storedUsername,
      };

      // Only include changed fields
      if (userData.newUsername && userData.newUsername !== originalData.username) {
        payload.newUsername = userData.newUsername;
      }
      if (userData.newEmail && userData.newEmail !== originalData.email) {
        payload.newEmail = userData.newEmail;
      }
      if (userData.newPassword) {
        payload.newPassword = userData.newPassword;
      }

      const res = await axios.put('http://localhost:5000/update-user', payload);
      setMessage(res.data.message);

      // Update stored username if changed
      if (payload.newUsername) {
        localStorage.setItem('username', payload.newUsername);
      }

    } catch (err) {
      console.error('Update failed:', err);
      setMessage(err.response?.data?.error || 'Update failed.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>

      <div className="profile-info">
        <input
          name="newUsername"
          placeholder="Username"
          value={userData.newUsername}
          onChange={handleChange}
        />
        <input
          name="newEmail"
          placeholder="Email"
          value={userData.newEmail}
          onChange={handleChange}
        />
        <input
          name="newPassword"
          type="password"
          placeholder="New Password"
          value={userData.newPassword}
          onChange={handleChange}
        />
        <button onClick={handleUpdate}>Update Profile</button>
      </div>

      {message && <p className="profile-message">{message}</p>}

      <button className="logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;
