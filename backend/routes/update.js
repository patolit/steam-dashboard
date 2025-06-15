const express = require('express');
const router = express.Router();
const { generateMockData } = require('../services/mockData');

// POST /update - Trigger data update
router.post('/', async (req, res) => {
  try {
    const games = await generateMockData();
    res.json({ 
      message: 'Update successful',
      gamesUpdated: games.length,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Failed to update data' });
  }
});

module.exports = router; 