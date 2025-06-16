require('dotenv').config();
const express = require('express');
const pool = require('./db');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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

// Get bookings with optional filters
app.get('/bookings', async (req, res) => {
  const { name, movie_name, event_name, date, time } = req.query;

  try {
    let query = 'SELECT * FROM bookings WHERE 1=1';
    const values = [];

    if (name) {
      values.push(name);
      query += ` AND name = $${values.length}`;
    }
    if (movie_name) {
      values.push(movie_name);
      query += ` AND movie_name = $${values.length}`;
    }
    if (event_name) {
      values.push(event_name);
      query += ` AND event_name = $${values.length}`;
    }
    if (date) {
      values.push(date);
      query += ` AND date = $${values.length}`;
    }
    if (time) {
      values.push(time);
      query += ` AND time = $${values.length}`;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

/**
 * POST Routes
 */

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
    console.error('Error inserting user:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Create a new booking (with seat conflict check)
app.post('/bookings', async (req, res) => {
  const { name, movie_name, event_name, date, time, seats } = req.body;

  try {
    const result = await pool.query(
      `SELECT seats FROM bookings WHERE 
        (movie_name = $1 OR event_name = $2) AND 
        date = $3 AND 
        time = $4`,
      [movie_name || null, event_name || null, date, time]
    );

    const alreadyBooked = new Set();
    for (const row of result.rows) {
      const seatList = typeof row.seats === 'string'
        ? row.seats.split(',').map(s => s.replace(/[^a-zA-Z0-9 ]/g, '').trim())
        : Array.isArray(row.seats) ? row.seats : [];
      seatList.forEach(seat => alreadyBooked.add(seat));
    }

    const selectedSeats = typeof seats === 'string'
      ? seats.split(',').map(s => s.replace(/[^a-zA-Z0-9 ]/g, '').trim())
      : Array.isArray(seats)
        ? seats
        : [];

    const conflict = selectedSeats.some(seat => alreadyBooked.has(seat));
    if (conflict) {
      return res.status(400).json({ error: 'Some selected seats are already booked' });
    }

    const insertResult = await pool.query(
      `INSERT INTO bookings 
        (name, movie_name, event_name, date, time, seats) 
       VALUES 
        ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [name, movie_name, event_name, date, time, selectedSeats.join(', ')]
    );
    res.status(201).json(insertResult.rows[0]);
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
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
