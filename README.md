# DKU GeoGuesser

A GeoGuesser-style campus challenge for Duke Kunshan University. Players are shown a photo taken somewhere on campus and must identify the building — and floor — on an interactive map.

![DKU GeoGuesser](https://img.shields.io/badge/DKU-GeoGuesser-003366?style=for-the-badge)

## Gameplay

1. Enter your display name
2. Each round shows a campus photo — click the correct building on the map
3. **+300 pts** for the right building → then guess the floor for the full **+500 pts**
4. 10 rounds per game, max score **5,000 pts**
5. Top scores go on the all-time leaderboard

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | SQLite via `node:sqlite` (built into Node ≥ 22.5, no compilation needed) |
| Images | Local `/public/images/` directory |

## Getting Started

**Requirements:** Node.js 22.5 or later

```bash
# 1. Clone
git clone https://github.com/Hqroon/DKUGuesser.git
cd DKUGuesser

# 2. Install all dependencies
npm run install:all

# 3. Seed the database with placeholder rounds
npm run seed

# 4. Start (runs server + client concurrently)
npm run dev
```

| Service | URL |
|---|---|
| Game | http://localhost:5173 |
| Admin panel | http://localhost:5173/admin |
| API | http://localhost:3001/api |

## Adding Photos

### Via Admin Panel (recommended)
Go to **http://localhost:5173/admin**, fill in the building, floor, optional hint, and upload a photo. Done.

### Manually
Drop image files into `public/images/`, then insert a row:

```bash
node --no-warnings=ExperimentalWarning -e "
const db = require('./server/db/database');
db.prepare('INSERT INTO rounds (image_path, building_name, floor, hint) VALUES (?, ?, ?, ?)')
  .run('/images/your-photo.jpg', 'Academic Building', '2F', 'Optional hint');
console.log('Added!');
"
```

## Project Structure

```
DKUGuesser/
├── client/                   # React frontend (Vite)
│   └── src/
│       ├── components/
│       │   ├── Map.jsx           # Interactive SVG campus map
│       │   ├── PhotoViewer.jsx   # Zoomable photo display
│       │   ├── FloorSelector.jsx # Floor guess buttons
│       │   ├── GameHeader.jsx    # Progress bar, score, timer
│       │   ├── Leaderboard.jsx   # Top 20 all-time scores
│       │   ├── ScoreBreakdown.jsx
│       │   └── Confetti.jsx
│       ├── data/
│       │   └── mapData.js        # Building polygon coordinates (edit to adjust zones)
│       └── pages/
│           ├── Home.jsx          # Name entry + how-to
│           ├── Game.jsx          # Main game loop
│           ├── Results.jsx       # End screen + leaderboard
│           └── Admin.jsx         # Round management
├── server/
│   ├── routes/
│   │   ├── game.js           # /api/game/*
│   │   ├── leaderboard.js    # /api/leaderboard
│   │   └── admin.js          # /api/admin/rounds
│   ├── db/
│   │   ├── schema.sql
│   │   ├── database.js
│   │   └── seed.js
│   └── server.js
├── public/
│   └── images/               # Game photos live here
└── package.json
```

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/game/start` | Returns 10 random rounds (no answers) |
| `POST` | `/api/game/guess` | Submit building guess → `{ correct, correctBuilding, points, floors[] }` |
| `POST` | `/api/game/guess-floor` | Submit floor guess → `{ correct, correctFloor, points }` |
| `GET` | `/api/leaderboard` | Top 20 scores |
| `POST` | `/api/leaderboard` | Save a completed game score |
| `GET` | `/api/admin/rounds` | List all rounds |
| `POST` | `/api/admin/rounds` | Add a round (multipart: image + building_name + floor + hint) |
| `DELETE` | `/api/admin/rounds/:id` | Delete a round |

## Scoring

| Result | Points |
|---|---|
| Wrong building | 0 / 500 |
| Correct building, wrong floor | 300 / 500 |
| Correct building **and** floor | 500 / 500 |

## Adjusting the Campus Map

Building zone polygons are defined in [`client/src/data/mapData.js`](client/src/data/mapData.js). Each building has a `points` property (SVG polygon coordinates on a 1000×800 canvas) that you can edit to better match the real campus layout.

```js
{
  id: 'academic-building',
  name: 'Academic Building',
  shortName: 'AB',
  points: '560,200 680,200 680,360 560,360',  // ← adjust these
  labelX: 620,
  labelY: 285,
  color: '#2563eb',
}
```

## Buildings Included

Academic Building · Innovation Building · Library · Conference Center · Water Pavilion · WHU-DUKE Research Institute · Administration Building · Sports Complex · Basketball Court · Residence Hall · Service Building I · Service Building II · Community Center · Graduate Student Center · Faculty Residence · Employee Center · Visitor Center
