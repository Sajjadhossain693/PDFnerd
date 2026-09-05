// File size limits in bytes
const MB = 1024 * 1024;

module.exports = {
  // Plan limits
  PLANS: {
    free: {
      maxFileSize: 10 * MB,      // 10 MB
      maxFiles: 5,
      dailyProcessingLimit: 20,
      tools: ['merge', 'split', 'compress', 'rotate', 'delete-pages', 'extract-pages', 'jpg-to-pdf', 'pdf-to-jpg'],
    },
    premium: {
      maxFileSize: 100 * MB,     // 100 MB
      maxFiles: 50,
      dailyProcessingLimit: Infinity,
      tools: 'all',
    },
  },

  // Allowed MIME types
  ALLOWED_PDF_TYPES: ['application/pdf'],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_WORD_TYPES: [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],

  // Allowed extensions
  ALLOWED_PDF_EXTENSIONS: ['.pdf'],
  ALLOWED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
  ALLOWED_WORD_EXTENSIONS: ['.doc', '.docx'],

  // Temp file TTL
  TEMP_FILE_TTL_MS: 60 * 60 * 1000, // 1 hour

  // JWT
  JWT_COOKIE_EXPIRE: 7, // days

  // Compression quality levels
  COMPRESS_LEVELS: {
    low: { quality: 0.9, label: 'Low compression (better quality)' },
    medium: { quality: 0.6, label: 'Medium compression (balanced)' },
    high: { quality: 0.3, label: 'High compression (smaller size)' },
  },
};
