// index.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Signup endpoint
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Received signup request:', { username, email });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === '23505') {
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// ✅ Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    const match = await bcrypt.compare(password, result.rows[0].password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ✅ Add city
app.post('/add-city', async (req, res) => {
  const { username, city } = req.body;

  try {
    await pool.query(
      'INSERT INTO cities (username, city_name) VALUES ($1, $2)',
      [username, city]
    );
    res.json({ message: 'City added successfully' });
  } catch (err) {
    console.error('Add city error:', err);
    res.status(500).json({ error: 'Failed to add city' });
  }
});

// ✅ Get cities
app.get('/cities/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const result = await pool.query(
      'SELECT DISTINCT city_name FROM cities WHERE username = $1',
      [username]
    );
    const cities = result.rows.map(row => row.city_name);
    res.json({ cities });
  } catch (err) {
    console.error('Fetch cities error:', err);
    res.status(500).json({ error: 'Failed to fetch cities' });
  }
});
// ✅ Update password
app.get('/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const result = await pool.query(
      'SELECT username, email FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/get-user-id', async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required.' });
  }

  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE username = $1 AND email = $2',
      [username, email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ id: result.rows[0].id });
  } catch (err) {
    console.error('Error fetching user ID:', err);
    res.status(500).json({ error: 'Database error.' });
  }
});
app.put('/update-user', async (req, res) => {
  const { currentUsername, newUsername, newEmail, newPassword } = req.body;

  if (!currentUsername) {
    return res.status(400).json({ error: 'Current username is required.' });
  }

  try {
    // 1. Fetch the user ID
    const userResult = await pool.query(
      'SELECT id FROM users WHERE username = $1',
      [currentUsername]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const userId = userResult.rows[0].id;

    // 2. Check if new username is taken by someone else
    if (newUsername) {
      const usernameCheck = await pool.query(
        'SELECT id FROM users WHERE username = $1 AND id != $2',
        [newUsername, userId]
      );

      if (usernameCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Username already in use.' });
      }
    }

    // 3. Check if new email is taken by someone else
    if (newEmail) {
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [newEmail, userId]
      );

      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Email already in use.' });
      }
    }

    // 4. Build dynamic update query
    const fields = [];
    const values = [];
    let index = 1;

    if (newUsername) {
      fields.push(`username = $${index++}`);
      values.push(newUsername);
    }

    if (newEmail) {
      fields.push(`email = $${index++}`);
      values.push(newEmail);
    }

    if (newPassword) {
      const bcrypt = require('bcrypt');
      const hashed = await bcrypt.hash(newPassword, 10);
      fields.push(`password_hash = $${index++}`);
      values.push(hashed);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    // Add WHERE id = ...
    values.push(userId);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${index}`;

    await pool.query(query, values);

    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Database update failed.' });
  }
});
// ✅ Delete city
app.delete('/delete-city', async (req, res) => {
  const { username, city } = req.body;

  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await pool.query(
      'DELETE FROM cities WHERE username = $1 AND city_name = $2',
      [username, city]
    );

    res.json({ success: true, message: 'City deleted successfully' });
  } catch (err) {
    console.error('Error deleting city:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Start server
app.listen(5000, () => {
  console.log('🚀 Server running at http://localhost:5000');
});
