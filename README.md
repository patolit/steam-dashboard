# Steam Dashboard

A fullstack application for tracking Steam game statistics.

## Project Structure

```
steam-dashboard/
├── backend/         # Express.js server
├── frontend/        # React app (coming soon)
├── db/             # Database initialization scripts
├── docker-compose.yml
└── .env
```

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

## Setup

1. Create a `.env` file in the root directory with:
   ```
   DATABASE_URL=postgres://steam:steam@db:5432/steamstats
   PORT=3001
   ```

2. Start the services:
   ```bash
   docker-compose up
   ```

## Development

### Backend

The backend is an Express.js server running on port 3001. It connects to a PostgreSQL database and provides API endpoints for the frontend.

To run the backend locally:
```bash
cd backend
npm install
npm run dev
```

### Database

The PostgreSQL database runs on port 5432 with the following credentials:
- Database: steamstats
- User: steam
- Password: steam

The database schema is automatically initialized when the container starts.

## API Endpoints

- `GET /health` - Health check endpoint 