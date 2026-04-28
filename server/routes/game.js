const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Building floor definitions
const BUILDING_FLOORS = {
  'Academic Building': ['B1', '1F', '2F', '3F', '4F', 'Rooftop'],
  'Innovation Building': ['1F', '2F', '3F', '4F'],
  'WHU-DUKE Research Institute': ['1F', '2F', '3F'],
  'Library': ['B1', '1F', '2F', '3F'],
  'Conference Center': ['B1', '1F', '2F', '3F'],
  'Water Pavilion': ['1F'],
  'Administration Building': ['1F', '2F', '3F'],
  'Sports Complex': ['1F', '2F'],
  'Basketball Court': ['1F'],
  'Residence Hall': ['1F', '2F', '3F', '4F', '5F', '6F'],
  'Service Building I': ['1F', '2F'],
  'Service Building II': ['1F', '2F'],
  'Community Center': ['1F', '2F', '3F'],
  'Graduate Student Center': ['1F', '2F', '3F'],
  'Faculty Residence': ['1F', '2F', '3F', '4F', '5F'],
  'Employee Center': ['1F', '2F'],
  'Visitor Center': ['1F', '2F'],
};

// GET /api/game/start — returns 10 random rounds (no answers)
router.get('/start', (req, res) => {
  const rounds = db.prepare(`
    SELECT id, image_path, hint
    FROM rounds
    ORDER BY RANDOM()
    LIMIT 10
  `).all();

  if (rounds.length === 0) {
    return res.status(404).json({ error: 'No rounds available. Run the seed script first.' });
  }

  console.log(`[Game] Starting new game with ${rounds.length} rounds`);
  res.json({ rounds });
});

// POST /api/game/guess — submit building guess
router.post('/guess', (req, res) => {
  const { roundId, buildingGuess } = req.body;

  if (!roundId || !buildingGuess) {
    return res.status(400).json({ error: 'Missing roundId or buildingGuess' });
  }

  const round = db.prepare('SELECT * FROM rounds WHERE id = ?').get(roundId);
  if (!round) {
    return res.status(404).json({ error: 'Round not found' });
  }

  const correct = round.building_name.toLowerCase() === buildingGuess.toLowerCase();
  console.log(`[Guess] Round ${roundId}: guessed "${buildingGuess}", correct is "${round.building_name}" — ${correct ? 'CORRECT' : 'WRONG'}`);

  if (!correct) {
    return res.json({
      correct: false,
      correctBuilding: round.building_name,
      points: 0,
      floors: null,
    });
  }

  const floors = BUILDING_FLOORS[round.building_name] || ['1F', '2F', '3F'];

  res.json({
    correct: true,
    correctBuilding: round.building_name,
    points: 300,
    floors,
  });
});

// POST /api/game/guess-floor — submit floor guess (only after correct building)
router.post('/guess-floor', (req, res) => {
  const { roundId, floorGuess } = req.body;

  if (!roundId || !floorGuess) {
    return res.status(400).json({ error: 'Missing roundId or floorGuess' });
  }

  const round = db.prepare('SELECT * FROM rounds WHERE id = ?').get(roundId);
  if (!round) {
    return res.status(404).json({ error: 'Round not found' });
  }

  const correct = round.floor.toLowerCase() === floorGuess.toLowerCase();
  console.log(`[Floor] Round ${roundId}: guessed "${floorGuess}", correct is "${round.floor}" — ${correct ? 'CORRECT' : 'WRONG'}`);

  res.json({
    correct,
    correctFloor: round.floor,
    points: correct ? 500 : 300,
  });
});

module.exports = router;
