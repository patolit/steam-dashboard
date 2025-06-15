const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /games - List all games
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM games ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /games/:id - Get single game details
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM games WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 