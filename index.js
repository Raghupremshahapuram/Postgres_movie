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

// Fetch filtered bookings
app.get('/bookings', async (req, res) => {
  const { movie_name, date, time } = req.query;

  try {
    let query = 'SELECT * FROM bookings WHERE status = $1';
    const params = ['active'];
    let index = 2;

    if (movie_name) {
      query += ` AND movie_name = $${index++}`;
      params.push(movie_name);
    }

    if (date) {
      query += ` AND date = $${index++}`;
      params.push(date);
    }

    if (time) {
      query += ` AND time = $${index++}`;
      params.push(time);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new booking
app.post('/bookings', async (req, res) => {
  const { movie_name, event_name, time, date, seats } = req.body;

  if (!movie_name || !time || !date || !Array.isArray(seats)) {
    return res.status(400).json({ error: 'Missing or invalid booking data' });
  }

  try {
    const result = await pool.query(
      `SELECT seats FROM bookings
       WHERE movie_name = $1 AND date = $2 AND time = $3 AND status = 'active'`,
      [movie_name, date, time]
    );

    const alreadyBooked = new Set();
    for (const row of result.rows) {
      const seatArray = JSON.parse(row.seats || '[]');
      seatArray.forEach(seat => alreadyBooked.add(seat));
    }

    const conflicts = seats.filter(seat => alreadyBooked.has(seat));
    if (conflicts.length > 0) {
      return res.status(409).json({
        error: `❌ These seats are already booked: ${conflicts.join(', ')}`,
      });
    }

    const insert = await pool.query(
      `INSERT INTO bookings (movie_name, event_name, time, date, seats, status)
       VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`,
      [movie_name, event_name, time, date, JSON.stringify(seats)]
    );

    res.status(201).json(insert.rows[0]);

  } catch (err) {
    console.error('❌ Booking error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get already booked seats (active only)
app.get('/booked-seats', async (req, res) => {
  const { movie, date, time } = req.query;

  if (!movie || !date || !time) {
    return res.status(400).json({ error: 'Missing movie, date, or time' });
  }

  try {
    const result = await pool.query(
      `SELECT seats FROM bookings
       WHERE movie_name = $1 AND date = $2 AND time = $3 AND status = 'active'`,
      [movie, date, time]
    );

    const bookedSeats = result.rows.flatMap(row => JSON.parse(row.seats || '[]'));
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
