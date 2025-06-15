const db = require('../db');

// Sample game data
const sampleGames = [
  { id: 730, name: "Counter-Strike 2", genre: ["FPS", "Action"] },
  { id: 570, name: "Dota 2", genre: ["MOBA", "Strategy"] },
  { id: 1172470, name: "Apex Legends", genre: ["FPS", "Battle Royale"] },
  { id: 578080, name: "PUBG: BATTLEGROUNDS", genre: ["Battle Royale", "Shooter"] },
  { id: 1091500, name: "Cyberpunk 2077", genre: ["RPG", "Open World"] },
  { id: 1174180, name: "Red Dead Redemption 2", genre: ["Action", "Adventure"] },
  { id: 1085660, name: "Destiny 2", genre: ["FPS", "MMO"] },
  { id: 1172470, name: "Grand Theft Auto V", genre: ["Action", "Open World"] },
  { id: 1172470, name: "Rust", genre: ["Survival", "Multiplayer"] },
  { id: 1172470, name: "Team Fortress 2", genre: ["FPS", "Team-based"] }
];

// Generate random player count with realistic fluctuations
function generatePlayerCount(baseCount, timestamp) {
  // Add some randomness to the base count
  const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  // Add time-based variation (more players during peak hours)
  const hour = new Date(timestamp).getHours();
  const timeFactor = 0.7 + (Math.sin((hour - 12) * Math.PI / 12) * 0.3); // 0.4 to 1.0
  return Math.floor(baseCount * randomFactor * timeFactor);
}

// Generate mock data for all games
async function generateMockData() {
  try {
    console.log('Generating mock data...');
    const timestamp = new Date();
    
    for (const game of sampleGames) {
      // Base player count varies by game
      const baseCount = Math.floor(Math.random() * 100000) + 1000;
      const currentPlayers = generatePlayerCount(baseCount, timestamp);

      // Update or insert game metadata
      await db.query(
        `INSERT INTO games (id, name, genre) 
         VALUES ($1, $2, $3)
         ON CONFLICT (id) DO UPDATE 
         SET name = $2, genre = $3`,
        [game.id, game.name, game.genre]
      );

      // Insert player stats
      await db.query(
        `INSERT INTO player_stats (game_id, players, timestamp)
         VALUES ($1, $2, $3)`,
        [game.id, currentPlayers, timestamp]
      );

      console.log(`Updated ${game.name} with ${currentPlayers} players`);
    }

    console.log('Mock data generation completed');
    return sampleGames;
  } catch (error) {
    console.error('Error generating mock data:', error);
    throw error;
  }
}

module.exports = {
  generateMockData
}; 