const express = require('express');
const pool = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- GET Routes ---

// Fetch all latest movies
app.get('/latest-movies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM latest_movies');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all upcoming movies
app.get('/upcoming-movies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM upcoming_movies ORDER BY release_date ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all events
app.get('/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new user
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Fetch all bookings
app.get('/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new booking
app.post('/bookings', async (req, res) => {
  const { movie_name, event_name, time, date, seats } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO bookings (movie_name, event_name, time, date, seats) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [movie_name, event_name, time, date, seats]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Booking failed:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// ✅ NEW: Get already booked seats for a movie + date + time
app.get('/booked-seats', async (req, res) => {
  const { movie, date, time } = req.query;

  if (!movie || !date || !time) {
    return res.status(400).json({ error: 'Missing movie, date, or time' });
  }

  try {
    const result = await pool.query(
      'SELECT seats FROM bookings WHERE movie_name = $1 AND date = $2 AND time = $3',
      [movie, date, time]
    );

    const bookedSeats = result.rows.flatMap(row => row.seats);
    res.json({ bookedSeats });
  } catch (err) {
    console.error('❌ Failed to fetch booked seats:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all cancelled bookings
app.get('/cancelled-bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cancelled_bookings');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel a booking
app.post('/cancelled-bookings', async (req, res) => {
  const { booking_id, reason } = req.body;
  try {
    const cancelResult = await pool.query(
      'INSERT INTO cancelled_bookings (booking_id, reason) VALUES ($1, $2) RETURNING *',
      [booking_id, reason]
    );
    await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2',
      ['cancelled', booking_id]
    );
    res.status(201).json(cancelResult.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Start Server ---
app.listen(process.env.PORT, () => {
  console.log(`✅ Server running on http://localhost:${process.env.PORT}`);
});
