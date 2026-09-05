const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { ALLOWED_PDF_TYPES, ALLOWED_IMAGE_TYPES, ALLOWED_WORD_TYPES } = require('../config/constants');

const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Disk storage — unique filenames to prevent collisions
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${ext}`);
  },
});

// Validate by MIME type and extension
const fileFilter = (allowedTypes, allowedExts = ['.pdf']) => (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (
    allowedTypes.includes(file.mimetype) ||
    (allowedExts.includes(ext) && (file.mimetype === 'application/octet-stream' || file.mimetype === 'binary/octet-stream'))
  ) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.mimetype}`), false);
  }
};

// PDF only uploader (10 MB default limit)
const uploadPdf = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_FREE) || 10 * 1024 * 1024 },
  fileFilter: fileFilter([...ALLOWED_PDF_TYPES], ['.pdf']),
});

// Images only uploader
const uploadImages = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_FREE) || 10 * 1024 * 1024 },
  fileFilter: fileFilter([...ALLOWED_IMAGE_TYPES]),
});

// PDF or Word documents
const uploadDocument = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_FREE) || 10 * 1024 * 1024 },
  fileFilter: fileFilter([...ALLOWED_PDF_TYPES, ...ALLOWED_WORD_TYPES]),
});

// Mixed (PDF + images) for watermark/signing
const uploadMixed = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE_FREE) || 10 * 1024 * 1024 },
  fileFilter: fileFilter([...ALLOWED_PDF_TYPES, ...ALLOWED_IMAGE_TYPES]),
});

// Multer error handler middleware
const handleUploadError = (err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, error: 'File too large. Please upgrade your plan for larger files.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ success: false, error: 'Too many files uploaded at once.' });
    }
    return res.status(400).json({ success: false, error: err.message });
  }
  if (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
  next();
};

module.exports = { uploadPdf, uploadImages, uploadDocument, uploadMixed, handleUploadError };
