const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db/database');

const IMAGES_DIR = path.join(__dirname, '../../public/images');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }
    cb(null, IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `round_${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// GET /api/admin/rounds — list all rounds
router.get('/rounds', (req, res) => {
  const rounds = db.prepare('SELECT * FROM rounds ORDER BY created_at DESC').all();
  res.json(rounds);
});

// POST /api/admin/rounds — add a new round
router.post('/rounds', upload.single('image'), (req, res) => {
  const { building_name, floor, hint } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }
  if (!building_name || !floor) {
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ error: 'building_name and floor are required' });
  }

  const image_path = `/images/${req.file.filename}`;
  const stmt = db.prepare(
    'INSERT INTO rounds (image_path, building_name, floor, hint) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(image_path, building_name.trim(), floor.trim(), hint?.trim() || null);

  console.log(`[Admin] Added round: ${building_name} / ${floor} (id: ${result.lastInsertRowid})`);
  res.json({ id: result.lastInsertRowid, image_path, building_name, floor, hint });
});

// DELETE /api/admin/rounds/:id — delete a round
router.delete('/rounds/:id', (req, res) => {
  const round = db.prepare('SELECT * FROM rounds WHERE id = ?').get(req.params.id);
  if (!round) {
    return res.status(404).json({ error: 'Round not found' });
  }

  // Delete image file if it exists
  const imgPath = path.join(__dirname, '../../public', round.image_path);
  if (fs.existsSync(imgPath)) {
    fs.unlinkSync(imgPath);
  }

  db.prepare('DELETE FROM rounds WHERE id = ?').run(req.params.id);
  console.log(`[Admin] Deleted round ${req.params.id}`);
  res.json({ message: 'Round deleted' });
});

module.exports = router;
