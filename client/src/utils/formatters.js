/**
 * Format bytes to human-readable string: 1048576 → "1.0 MB"
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Format a date to locale string
 */
export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

/**
 * Format savings percentage
 */
export const formatSavings = (original, compressed) => {
  if (!original || !compressed) return '0%';
  return `${Math.round((1 - compressed / original) * 100)}%`;
};

/**
 * Truncate filename if too long
 */
export const truncateFilename = (name, maxLength = 30) => {
  if (name.length <= maxLength) return name;
  const ext = name.split('.').pop();
  return `${name.substring(0, maxLength - ext.length - 4)}...${ext}`;
};

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename) => filename.split('.').pop().toUpperCase();
