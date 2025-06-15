// index.js
require('dotenv').config();
const express = require('express');
const pool = require('./db');
const cors = require('cors'); // ✅ Add this
const app = express();
const PORT = process.env.PORT || 5000;


// ✅ Enable CORS
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

/**
 * GET Routes
 */

// Get all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all bookings
app.get('/bookings', async (req, res) => {
  const { name } = req.query;

  try {
    let result;
    if (name) {
      result = await pool.query('SELECT * FROM bookings WHERE name = $1', [name]);
    } else {
      result = await pool.query('SELECT * FROM bookings');
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});







/**
 * POST Routes
 */

// Example: Create a new user
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Received data:', req.body);
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});


// Example: Create a new booking
const { v4: uuidv4 } = require('uuid');

app.post('/bookings', async (req, res) => {
  const { name, movie_name, event_name, date, time, seats } = req.body;

  try {
    // Option 1: Let PostgreSQL generate UUID (recommended if DEFAULT is set in DB)
    const result = await pool.query(
      `INSERT INTO bookings 
        (name, movie_name, event_name, date, time, seats) 
       VALUES 
        ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, movie_name, event_name, date, time, seats]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting booking:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});





// DELETE a booking by ID
app.delete('/bookings/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM bookings WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted', deletedBooking: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
