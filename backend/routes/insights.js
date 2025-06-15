const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /insights/trending - Get trending games
router.get('/trending', async (req, res) => {
  try {
    const result = await db.query(`
      WITH current_stats AS (
        SELECT 
          game_id,
          players as current_players,
          timestamp as current_time
        FROM player_stats
        WHERE timestamp >= NOW() - INTERVAL '24 hours'
        ORDER BY timestamp DESC
        LIMIT 1
      ),
      previous_stats AS (
        SELECT 
          game_id,
          players as previous_players,
          timestamp as previous_time
        FROM player_stats
        WHERE timestamp >= NOW() - INTERVAL '48 hours'
        AND timestamp < NOW() - INTERVAL '24 hours'
        ORDER BY timestamp DESC
        LIMIT 1
      ),
      player_changes AS (
        SELECT 
          g.id,
          g.name,
          cs.current_players,
          ps.previous_players,
          CASE 
            WHEN ps.previous_players = 0 THEN 0
            ELSE ((cs.current_players - ps.previous_players)::float / ps.previous_players) * 100
          END as percent_change
        FROM games g
        JOIN current_stats cs ON g.id = cs.game_id
        JOIN previous_stats ps ON g.id = ps.game_id
      )
      SELECT * FROM player_changes
      ORDER BY percent_change DESC
      LIMIT 5
    `);

    const trendingUp = result.rows;

    // Get trending down games
    const downResult = await db.query(`
      WITH current_stats AS (
        SELECT 
          game_id,
          players as current_players,
          timestamp as current_time
        FROM player_stats
        WHERE timestamp >= NOW() - INTERVAL '24 hours'
        ORDER BY timestamp DESC
        LIMIT 1
      ),
      previous_stats AS (
        SELECT 
          game_id,
          players as previous_players,
          timestamp as previous_time
        FROM player_stats
        WHERE timestamp >= NOW() - INTERVAL '48 hours'
        AND timestamp < NOW() - INTERVAL '24 hours'
        ORDER BY timestamp DESC
        LIMIT 1
      ),
      player_changes AS (
        SELECT 
          g.id,
          g.name,
          cs.current_players,
          ps.previous_players,
          CASE 
            WHEN ps.previous_players = 0 THEN 0
            ELSE ((cs.current_players - ps.previous_players)::float / ps.previous_players) * 100
          END as percent_change
        FROM games g
        JOIN current_stats cs ON g.id = cs.game_id
        JOIN previous_stats ps ON g.id = ps.game_id
      )
      SELECT * FROM player_changes
      ORDER BY percent_change ASC
      LIMIT 5
    `);

    const trendingDown = downResult.rows;

    res.json({
      trendingUp,
      trendingDown
    });
  } catch (error) {
    console.error('Error fetching trending games:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 