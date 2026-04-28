// DKU Campus Map Data
// SVG viewport: 1000 x 800
// Coordinates based on approximate real campus layout.
// Adjust polygon points here to fine-tune zone boundaries.

export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 800;

// Visual (non-interactive) features: roads, lake, greenery
export const MAP_FEATURES = [
  // ── Background ──────────────────────────────────────────────────
  { type: 'rect', id: 'campus-bg', x: 0, y: 0, w: 1000, h: 800, fill: '#e8f0e8', label: null },

  // ── Main Lake (center-left) ──────────────────────────────────────
  {
    type: 'polygon',
    id: 'lake',
    points: '180,340 240,300 310,290 360,310 380,370 360,430 300,460 230,450 180,410',
    fill: '#7ec8e3',
    stroke: '#5aabcf',
    strokeWidth: 1.5,
    label: null,
  },

  // ── Roads ────────────────────────────────────────────────────────
  // Main east-west road
  { type: 'rect', id: 'road-ew', x: 0, y: 375, w: 1000, h: 14, fill: '#d0c8b0', label: null },
  // Main north-south road
  { type: 'rect', id: 'road-ns', x: 490, y: 0, w: 14, h: 800, fill: '#d0c8b0', label: null },
  // Secondary road (top)
  { type: 'rect', id: 'road-top', x: 0, y: 160, w: 1000, h: 10, fill: '#d8d0b8', label: null },
  // Secondary road (bottom)
  { type: 'rect', id: 'road-bottom', x: 0, y: 620, w: 1000, h: 10, fill: '#d8d0b8', label: null },
  // Diagonal path near lake
  {
    type: 'polygon',
    id: 'path-lake',
    points: '390,375 410,340 430,340 415,375',
    fill: '#d8d0b8',
    label: null,
  },

  // ── Green spaces ─────────────────────────────────────────────────
  { type: 'rect', id: 'green-nw', x: 10, y: 10, w: 120, h: 140, fill: '#b8d4a0', label: null },
  { type: 'rect', id: 'green-ne', x: 820, y: 10, w: 170, h: 140, fill: '#b8d4a0', label: null },
  { type: 'rect', id: 'green-se', x: 820, y: 640, w: 170, h: 150, fill: '#b8d4a0', label: null },
  { type: 'rect', id: 'green-sw', x: 10, y: 640, w: 160, h: 150, fill: '#b8d4a0', label: null },
  { type: 'rect', id: 'green-center', x: 420, y: 200, w: 60, h: 160, fill: '#c4dba8', label: null },

  // ── Campus boundary ──────────────────────────────────────────────
  { type: 'rect', id: 'boundary', x: 2, y: 2, w: 996, h: 796, fill: 'none', stroke: '#003366', strokeWidth: 3, label: null },
];

// Interactive building zones
export const BUILDINGS = [
  // ── ACADEMIC BUILDING (AB) ── center-right ───────────────────────
  {
    id: 'academic-building',
    name: 'Academic Building',
    shortName: 'AB',
    points: '560,200 680,200 680,360 560,360',
    labelX: 620,
    labelY: 285,
    color: '#2563eb',
    description: 'Main academic complex with classrooms and faculty offices',
  },

  // ── INNOVATION BUILDING (IB) ── center ──────────────────────────
  {
    id: 'innovation-building',
    name: 'Innovation Building',
    shortName: 'IB',
    points: '510,200 555,200 555,360 510,360',
    labelX: 532,
    labelY: 285,
    color: '#7c3aed',
    description: 'Research and innovation labs',
  },

  // ── LIBRARY (LIB) ── right of center ────────────────────────────
  {
    id: 'library',
    name: 'Library',
    shortName: 'LIB',
    points: '690,220 790,220 790,340 690,340',
    labelX: 740,
    labelY: 285,
    color: '#b45309',
    description: 'University library and study spaces',
  },

  // ── CONFERENCE CENTER (CC) ── center-left, near lake ────────────
  {
    id: 'conference-center',
    name: 'Conference Center',
    shortName: 'CC',
    points: '390,240 480,240 480,360 390,360',
    labelX: 435,
    labelY: 305,
    color: '#0f766e',
    description: 'Conference and event facilities',
  },

  // ── WATER PAVILION ── on the lake ───────────────────────────────
  {
    id: 'water-pavilion',
    name: 'Water Pavilion',
    shortName: 'WP',
    points: '240,340 290,320 330,350 310,390 255,385',
    labelX: 283,
    labelY: 360,
    color: '#0369a1',
    description: 'Scenic pavilion situated on the campus lake',
  },

  // ── WHU-DUKE RESEARCH INSTITUTE (WDR) ── center-bottom ──────────
  {
    id: 'whu-duke-research',
    name: 'WHU-DUKE Research Institute',
    shortName: 'WDR',
    points: '510,395 680,395 680,500 510,500',
    labelX: 595,
    labelY: 452,
    color: '#9f1239',
    description: 'Joint research institute for Wuhan University and Duke',
  },

  // ── ADMINISTRATION BUILDING (ADB) ── far right ──────────────────
  {
    id: 'administration-building',
    name: 'Administration Building',
    shortName: 'ADB',
    points: '800,220 920,220 920,360 800,360',
    labelX: 860,
    labelY: 295,
    color: '#1e40af',
    description: 'University administration offices',
  },

  // ── SPORTS COMPLEX (SPC) ── left-center ─────────────────────────
  {
    id: 'sports-complex',
    name: 'Sports Complex',
    shortName: 'SPC',
    points: '50,390 160,390 160,550 50,550',
    labelX: 105,
    labelY: 475,
    color: '#15803d',
    description: 'Indoor sports facilities and gym',
  },

  // ── BASKETBALL COURT ── left of Innovation Building ──────────────
  {
    id: 'basketball-court',
    name: 'Basketball Court',
    shortName: 'BC',
    points: '175,390 280,390 280,450 175,450',
    labelX: 228,
    labelY: 424,
    color: '#a16207',
    description: 'Outdoor basketball courts',
  },

  // ── RESIDENCE HALL ── top-left ───────────────────────────────────
  {
    id: 'residence-hall',
    name: 'Residence Hall',
    shortName: 'RH',
    points: '40,20 200,20 200,150 40,150',
    labelX: 120,
    labelY: 90,
    color: '#be185d',
    description: 'Student dormitory buildings',
  },

  // ── SERVICE BUILDING I (SVB I) ── top-center ─────────────────────
  {
    id: 'service-building-1',
    name: 'Service Building I',
    shortName: 'SVB I',
    points: '380,20 480,20 480,145 380,145',
    labelX: 430,
    labelY: 88,
    color: '#6b7280',
    description: 'Campus services and facilities management',
  },

  // ── SERVICE BUILDING II (SVB II) ── top-center-right ─────────────
  {
    id: 'service-building-2',
    name: 'Service Building II',
    shortName: 'SVB II',
    points: '510,20 620,20 620,145 510,145',
    labelX: 565,
    labelY: 88,
    color: '#4b5563',
    description: 'Secondary campus services building',
  },

  // ── COMMUNITY CENTER (CCT) ── right area ─────────────────────────
  {
    id: 'community-center',
    name: 'Community Center',
    shortName: 'CCT',
    points: '800,395 920,395 920,530 800,530',
    labelX: 860,
    labelY: 467,
    color: '#c2410c',
    description: 'Community activities and student services',
  },

  // ── GRADUATE STUDENT CENTER ── top area ──────────────────────────
  {
    id: 'graduate-student-center',
    name: 'Graduate Student Center',
    shortName: 'GSC',
    points: '640,20 790,20 790,145 640,145',
    labelX: 715,
    labelY: 88,
    color: '#7e22ce',
    description: 'Graduate student offices and lounge',
  },

  // ── FACULTY RESIDENCE ── left area ───────────────────────────────
  {
    id: 'faculty-residence',
    name: 'Faculty Residence',
    shortName: 'FR',
    points: '40,560 160,560 160,700 40,700',
    labelX: 100,
    labelY: 635,
    color: '#0f766e',
    description: 'Faculty housing on campus',
  },

  // ── EMPLOYEE CENTER ── far right bottom ──────────────────────────
  {
    id: 'employee-center',
    name: 'Employee Center',
    shortName: 'EC',
    points: '800,545 920,545 920,650 800,650',
    labelX: 860,
    labelY: 600,
    color: '#1d4ed8',
    description: 'Employee facilities and HR services',
  },

  // ── VISITOR CENTER (VCT) ── right near entrance ──────────────────
  {
    id: 'visitor-center',
    name: 'Visitor Center',
    shortName: 'VCT',
    points: '800,665 920,665 920,770 800,770',
    labelX: 860,
    labelY: 720,
    color: '#065f46',
    description: 'Welcome center for campus visitors',
  },
];

// Map all building names to their IDs for quick lookup
export const BUILDING_NAME_MAP = Object.fromEntries(
  BUILDINGS.map((b) => [b.name, b.id])
);
