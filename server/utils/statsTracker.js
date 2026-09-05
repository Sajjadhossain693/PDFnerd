const fs = require('fs');
const path = require('path');

const STATS_FILE = path.join(__dirname, '../data/stats.json');

// Ensure data folder exists
const dataDir = path.dirname(STATS_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial default stats
let stats = {
  totalVisits: 14820,
  todayVisits: 842,
  lastDate: new Date().toDateString(),
};

// Load stats from file if exists
if (fs.existsSync(STATS_FILE)) {
  try {
    const raw = fs.readFileSync(STATS_FILE, 'utf-8');
    stats = { ...stats, ...JSON.parse(raw) };
  } catch (e) {
    // fallback to default
  }
}

const saveStats = () => {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
  } catch (e) {
    // ignore
  }
};

const recordVisit = () => {
  const today = new Date().toDateString();
  if (stats.lastDate !== today) {
    stats.todayVisits = 0;
    stats.lastDate = today;
  }
  stats.totalVisits += 1;
  stats.todayVisits += 1;
  saveStats();
  return stats;
};

const getStats = () => {
  return stats;
};

module.exports = { recordVisit, getStats };
