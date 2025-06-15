// // index.js
// require('dotenv').config();
// const express = require('express');
// const pool = require('./db');

// const cors = require('cors'); // ✅ Add this
// const app = express();
// const PORT = process.env.PORT || 5000;


// // ✅ Enable CORS
// app.use(cors());
// // Middleware to parse JSON bodies
// app.use(express.json());

// /**
//  * GET Routes
//  */

// // Get all users
// app.get('/users', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// });
// //user
// app.get('/user', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM users');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch users' });
//   }
// });

// // Get all bookings
// app.get('/bookings', async (req, res) => {
//   const { name } = req.query;

//   try {
//     let result;
//     if (name) {
//       result = await pool.query('SELECT * FROM bookings WHERE name = $1', [name]);
//     } else {
//       result = await pool.query('SELECT * FROM bookings');
//     }

//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch bookings' });
//   }
// });
// // Get all booking
// app.get('/booking', async (req, res) => {
//   const { name } = req.query;

//   try {
//     let result;
//     if (name) {
//       result = await pool.query('SELECT * FROM bookings WHERE name = $1', [name]);
//     } else {
//       result = await pool.query('SELECT * FROM bookings');
//     }

//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch bookings' });
//   }
// });

// // Get all events
// app.get('/events', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM events');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch events' });
//   }
// });

// // Get all latest movies
// app.get('/latest_movies', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM latest_movies');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch latest movies' });
//   }
// });

// // Get all upcoming movies
// app.get('/upcoming_movies', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT * FROM upcoming_movies');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch upcoming movies' });
//   }
// });

// /**
//  * POST Routes
//  */

// // Example: Create a new user
// app.post('/users', async (req, res) => {
//     const { name, email, password } = req.body;
//     console.log('Received data:', req.body);  // 👈 add this
//     try {
//       const result = await pool.query(
//         'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
//         [name, email, password]
//       );
//       res.status(201).json(result.rows[0]);
//     } catch (err) {
//       console.error('Error inserting user:', err); // 👈 see the actual error
//       res.status(500).json({ error: 'Failed to create user' });
//     }
//   });
//   ///user
// app.post('/user', async (req, res) => {
//     const { name, email, password } = req.body;
//     console.log('Received data:', req.body);  // 👈 add this
//     try {
//       const result = await pool.query(
//         'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
//         [name, email, password]
//       );
//       res.status(201).json(result.rows[0]);
//     } catch (err) {
//       console.error('Error inserting user:', err); // 👈 see the actual error
//       res.status(500).json({ error: 'Failed to create user' });
//     }
//   });
// // Example: Create a new booking
// app.post('/bookings', async (req, res) => {
//   const { name, movie_name, event_name, date, time, seats } = req.body;
//   const id = uuidv4().slice(0, 10);

//   console.log("📦 Incoming booking data:", req.body); // ✅
//   try {
//     const result = await pool.query(
//       `INSERT INTO bookings 
//         (id, name, movie_name, event_name, date, time, seats) 
//        VALUES 
//         ($1, $2, $3, $4, $5, $6, $7) 
//        RETURNING *`,
//       [id, name, movie_name, event_name, date, time, seats]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error("❌ Booking insert failed:", err); // ✅
//     res.status(500).json({ error: 'Failed to create booking' });
//   }
// });
// // Example: Create a new booking
// const { v4: uuidv4 } = require('uuid'); // Make sure this is at the top

// app.post('/booking', async (req, res) => {
//   const { name, movie_name, event_name, date, time, seats } = req.body;
//   const id = uuidv4().slice(0, 10);

//   console.log("📦 Incoming booking data (to booking table):", req.body);
//   try {
//     const result = await pool.query(
//       `INSERT INTO booking 
//         (id, name, movie_name, event_name, date, time, seats) 
//        VALUES 
//         ($1, $2, $3, $4, $5, $6, $7) 
//        RETURNING *`,
//       [id, name, movie_name, event_name, date, time, seats]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error("❌ Booking insert failed (booking table):", err);
//     res.status(500).json({ error: 'Failed to create booking' });
//   }
// });



// // Example: Create a new event
// app.post('/events', async (req, res) => {
//   const { event_name, event_date, location } = req.body;
//   try {
//     const result = await pool.query(
//       'INSERT INTO events (event_name, event_date, location) VALUES ($1, $2, $3) RETURNING *',
//       [event_name, event_date, location]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create event' });
//   }
// });

// // Example: Create a new latest movie entry
// app.post('/latest_movies', async (req, res) => {
//   const { title, release_date, description } = req.body;
//   try {
//     const result = await pool.query(
//       'INSERT INTO latest_movies (title, release_date, description) VALUES ($1, $2, $3) RETURNING *',
//       [title, release_date, description]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create movie entry' });
//   }
// });

// // Example: Create a new upcoming movie entry
// app.post('/upcoming_movies', async (req, res) => {
//   const { title, release_date, description } = req.body;
//   try {
//     const result = await pool.query(
//       'INSERT INTO upcoming_movies (title, release_date, description) VALUES ($1, $2, $3) RETURNING *',
//       [title, release_date, description]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create upcoming movie entry' });
//   }
// });

// // DELETE a booking by ID
// app.delete('/bookings/:id', async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await pool.query(
//       'DELETE FROM bookings WHERE id = $1 RETURNING *',
//       [id]
//     );
//     if (result.rowCount === 0) {
//       return res.status(404).json({ error: 'Booking not found' });
//     }
//     res.json({ message: 'Booking deleted', deletedBooking: result.rows[0] });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to delete booking' });
//   }
// });

// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root health check
app.get('/', (req, res) => {
  res.send('🎉 Movie Booking API is running!');
});

/**
 * GET Routes
 */

// Get all users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.trace('❌ Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get all bookings or bookings by user name
app.get('/bookings', async (req, res) => {
  const { name } = req.query;
  try {
    const query = name
      ? await pool.query('SELECT * FROM bookings WHERE name = $1', [name])
      : await pool.query('SELECT * FROM bookings');
    res.json(query.rows);
  } catch (err) {
    console.trace('❌ Error fetching bookings:', err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// Get all events
app.get('/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events');
    res.json(result.rows);
  } catch (err) {
    console.trace('❌ Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get all latest movies
app.get('/latest_movies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM latest_movies');
    res.json(result.rows);
  } catch (err) {
    console.trace('❌ Error fetching latest movies:', err);
    res.status(500).json({ error: 'Failed to fetch latest movies' });
  }
});

// Get all upcoming movies
app.get('/upcoming_movies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM upcoming_movies');
    res.json(result.rows);
  } catch (err) {
    console.trace('❌ Error fetching upcoming movies:', err);
    res.status(500).json({ error: 'Failed to fetch upcoming movies' });
  }
});

/**
 * POST Routes
 */

// Create a new user
app.post('/user', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('📥 Creating user:', req.body);

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.trace('❌ User creation failed:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Create a new booking
app.post('/bookings', async (req, res) => {
  const { name, movie_name, event_name, date, time, seats } = req.body;
  const id = uuidv4().slice(0, 10);
  console.log('📥 Creating booking:', req.body);

  try {
    const result = await pool.query(
      `INSERT INTO bookings 
        (id, name, movie_name, event_name, date, time, seats) 
       VALUES 
        ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [id, name, movie_name, event_name, date, time, seats]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.trace('❌ Booking creation failed:', err);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Create a new event
app.post('/events', async (req, res) => {
  const { event_name, event_date, location } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO events (event_name, event_date, location) VALUES ($1, $2, $3) RETURNING *',
      [event_name, event_date, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.trace('❌ Event creation failed:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Create a new latest movie
app.post('/latest_movies', async (req, res) => {
  const { title, release_date, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO latest_movies (title, release_date, description) VALUES ($1, $2, $3) RETURNING *',
      [title, release_date, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.trace('❌ Latest movie creation failed:', err);
    res.status(500).json({ error: 'Failed to create movie entry' });
  }
});

// Create a new upcoming movie
app.post('/upcoming_movies', async (req, res) => {
  const { title, release_date, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO upcoming_movies (title, release_date, description) VALUES ($1, $2, $3) RETURNING *',
      [title, release_date, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.trace('❌ Upcoming movie creation failed:', err);
    res.status(500).json({ error: 'Failed to create upcoming movie entry' });
  }
});

/**
 * DELETE Route
 */

// Delete booking by ID
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
    console.trace('❌ Deletion failed:', err);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
