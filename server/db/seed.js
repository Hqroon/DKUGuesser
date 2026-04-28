const path = require('path');
const fs = require('fs');

const db = require('./database');

const IMAGES_DIR = path.join(__dirname, '../../public/images');

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function createPlaceholderSVG(buildingName, floor, bgColor) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
  <rect width="800" height="500" fill="${bgColor}"/>
  <rect x="0" y="0" width="800" height="60" fill="#003366" opacity="0.9"/>
  <text x="400" y="38" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle">Duke Kunshan University</text>
  <rect x="50" y="100" width="700" height="300" rx="8" fill="white" opacity="0.15"/>
  <text x="400" y="220" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">${buildingName}</text>
  <text x="400" y="270" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">Floor: ${floor}</text>
  <text x="400" y="330" font-family="Arial, sans-serif" font-size="16" fill="white" opacity="0.7" text-anchor="middle">[ Placeholder — Replace with real photo ]</text>
  <rect x="0" y="460" width="800" height="40" fill="#003366" opacity="0.9"/>
  <text x="400" y="485" font-family="Arial, sans-serif" font-size="14" fill="#6DAA4A" text-anchor="middle">DKU GeoGuesser — Campus Photo Challenge</text>
</svg>`;
}

const seedRounds = [
  { building_name: 'Academic Building',       floor: '2F',  hint: 'Look for the large atrium with natural light from above.',            bg_color: '#1a5276', filename: 'ab_2f.svg' },
  { building_name: 'Innovation Building',     floor: '3F',  hint: 'This floor has collaborative workspaces and glass partitions.',        bg_color: '#145a32', filename: 'ib_3f.svg' },
  { building_name: 'Library',                 floor: '1F',  hint: 'Notice the reading area near the main entrance.',                      bg_color: '#6e2f1a', filename: 'lib_1f.svg' },
  { building_name: 'Conference Center',       floor: 'B1',  hint: 'Underground level with meeting rooms and event spaces.',               bg_color: '#4a235a', filename: 'cc_b1.svg' },
  { building_name: 'Administration Building', floor: '1F',  hint: 'The lobby area near the main reception desk.',                         bg_color: '#1b2631', filename: 'adb_1f.svg' },
  { building_name: 'Sports Complex',          floor: '2F',  hint: 'Upper level overlooking the main court.',                             bg_color: '#0b3d0b', filename: 'spc_2f.svg' },
  { building_name: 'Residence Hall',          floor: '4F',  hint: 'A corridor with student room doors on both sides.',                    bg_color: '#3b1f5e', filename: 'rh_4f.svg' },
  { building_name: 'Community Center',        floor: '1F',  hint: 'Ground floor with common seating and service windows.',                bg_color: '#5c1a00', filename: 'cct_1f.svg' },
  { building_name: 'Graduate Student Center', floor: '2F',  hint: 'Open lounge with large windows facing the campus green.',              bg_color: '#003333', filename: 'gsc_2f.svg' },
  { building_name: 'Library',                 floor: '3F',  hint: 'Upper floor silent study area with panoramic windows.',                bg_color: '#3d1a00', filename: 'lib_3f.svg' },
];

const existing = db.prepare('SELECT COUNT(*) as count FROM rounds').get();
if (existing.count > 0) {
  console.log(`Database already has ${existing.count} rounds. Skipping seed.`);
  console.log('To reseed: delete server/db/game.db and run npm run seed again.');
  process.exit(0);
}

const insert = db.prepare(
  'INSERT INTO rounds (image_path, building_name, floor, hint) VALUES (?, ?, ?, ?)'
);

db.exec('BEGIN');
try {
  for (const round of seedRounds) {
    const svgContent = createPlaceholderSVG(round.building_name, round.floor, round.bg_color);
    const filePath = path.join(IMAGES_DIR, round.filename);
    fs.writeFileSync(filePath, svgContent, 'utf8');
    console.log(`  Created: ${round.filename}`);
    insert.run(`/images/${round.filename}`, round.building_name, round.floor, round.hint);
    console.log(`  Inserted: ${round.building_name} / ${round.floor}`);
  }
  db.exec('COMMIT');
  console.log(`\nSeeded ${seedRounds.length} rounds successfully.`);
  console.log('Run "npm run dev" to start playing.');
} catch (err) {
  db.exec('ROLLBACK');
  console.error('Seed failed:', err);
  process.exit(1);
}
