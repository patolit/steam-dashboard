CREATE TABLE games (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  genre TEXT[],
  image_url TEXT
);

CREATE TABLE player_stats (
  id SERIAL PRIMARY KEY,
  game_id INTEGER REFERENCES games(id),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  players INTEGER
); 