import { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Grid, CssBaseline } from '@mui/material';

function App() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/games')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => setGames(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          🎮 Steam Game Stats Dashboard
        </Typography>

        <Grid container spacing={2}>
          {games.map((game: any) => (
            <Grid xs={12} sm={6} md={4} key={game.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{game.name}</Typography>
                  <Typography variant="body2">App ID: {game.id}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}

export default App;
