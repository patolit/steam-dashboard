const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

const gamesRouter = require('./routes/games');
const statsRouter = require('./routes/stats');
const insightsRouter = require('./routes/insights');
const updateRouter = require('./routes/update');

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Successfully connected to PostgreSQL database');
  release();
});

// Routes
app.use('/games', gamesRouter);
app.use('/games', statsRouter); // This handles /games/:id/stats
app.use('/insights', insightsRouter);
app.use('/update', updateRouter); // This handles /update

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 