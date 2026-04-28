const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/leaderboard — top 20 scores
router.get('/', (req, res) => {
  const scores = db.prepare(`
    SELECT id, player_name, total_score, round_details, created_at
    FROM scores
    ORDER BY total_score DESC, created_at ASC
    LIMIT 20
  `).all();

  const parsed = scores.map((s) => ({
    ...s,
    round_details: JSON.parse(s.round_details),
  }));

  res.json(parsed);
});

// POST /api/leaderboard — submit a score
router.post('/', (req, res) => {
  const { playerName, totalScore, roundDetails } = req.body;

  if (!playerName || totalScore === undefined || !roundDetails) {
    return res.status(400).json({ error: 'Missing playerName, totalScore, or roundDetails' });
  }

  const stmt = db.prepare(
    'INSERT INTO scores (player_name, total_score, round_details) VALUES (?, ?, ?)'
  );

  const result = stmt.run(playerName.trim(), totalScore, JSON.stringify(roundDetails));
  console.log(`[Leaderboard] New score: ${playerName} — ${totalScore} pts (id: ${result.lastInsertRowid})`);

  res.json({ id: result.lastInsertRowid, message: 'Score saved' });
});

module.exports = router;
