const express = require('express');
const router = express.Router();
const db = require('../db');
const { scrapeSteamCharts } = require('../services/scraper');

// GET /games/:id/stats - Get player stats history
router.get('/:id/stats', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT timestamp, players 
       FROM player_stats 
       WHERE game_id = $1 
       ORDER BY timestamp DESC 
       LIMIT 100`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No stats found for this game' });
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 