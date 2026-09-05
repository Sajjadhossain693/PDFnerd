const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const UPLOAD_DIR = path.join(__dirname, '../uploads');
const OUTPUT_DIR = path.join(__dirname, '../output');
const TTL_MS = parseInt(process.env.TEMP_FILE_TTL_MINUTES || 60) * 60 * 1000;

/**
 * Delete files older than TTL_MS from a directory.
 */
const cleanDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) return;

  const now = Date.now();
  let deletedCount = 0;

  fs.readdirSync(dirPath).forEach((file) => {
    const filePath = path.join(dirPath, file);
    try {
      const stat = fs.statSync(filePath);
      if (stat.isFile() && now - stat.mtimeMs > TTL_MS) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    } catch { /* Ignore locked/already deleted files */ }
  });

  if (deletedCount > 0) {
    console.log(`🧹 Cleaned ${deletedCount} temp files from ${path.basename(dirPath)}/`);
  }
};

/**
 * Run cleanup once immediately and then on schedule.
 */
const startCleanupJob = () => {
  // Run every 30 minutes
  cron.schedule('*/30 * * * *', () => {
    cleanDirectory(UPLOAD_DIR);
    cleanDirectory(OUTPUT_DIR);
  });

  // Run once at startup to clear any leftover files
  cleanDirectory(UPLOAD_DIR);
  cleanDirectory(OUTPUT_DIR);

  console.log('🧹 File cleanup job started (runs every 30 minutes)');
};

module.exports = { startCleanupJob, cleanDirectory };
