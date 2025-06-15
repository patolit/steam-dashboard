const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../db');

async function scrapeSteamCharts() {
  try {
    console.log('Starting SteamCharts scraping...');
    const response = await axios.get('https://steamcharts.com/top');
    const $ = cheerio.load(response.data);
    const games = [];

    // Process each game row
    $('.table-body .table-row').each((_, element) => {
      const $row = $(element);
      const $link = $row.find('a');
      const appId = $link.attr('href').split('/app/')[1];
      const name = $link.text().trim();
      const currentPlayers = parseInt($row.find('.num').first().text().replace(/,/g, ''), 10);

      console.log(`Found game: ${name} (ID: ${appId}) with ${currentPlayers} players`);

      games.push({
        id: parseInt(appId, 10),
        name,
        currentPlayers
      });
    });

    console.log(`Scraped ${games.length} games`);

    // Update database
    for (const game of games) {
      console.log(`Updating database for game: ${game.name}`);
      // Update or insert game metadata
      await db.query(
        `INSERT INTO games (id, name) 
         VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE 
         SET name = $2`,
        [game.id, game.name]
      );

      // Insert player stats
      await db.query(
        `INSERT INTO player_stats (game_id, players)
         VALUES ($1, $2)`,
        [game.id, game.currentPlayers]
      );
    }

    console.log('Database update completed');
    return games;
  } catch (error) {
    console.error('Error scraping SteamCharts:', error);
    throw error;
  }
}

module.exports = {
  scrapeSteamCharts
}; 