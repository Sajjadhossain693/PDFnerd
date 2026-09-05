const express = require('express');
const router = express.Router();
const fs = require('fs');
const { uploadPdf, handleUploadError } = require('../middleware/upload');
const { optionalAuth } = require('../middleware/auth');
const { scanPrivacyRisk, sanitizePdfDocument } = require('../services/privacyService');

router.use(optionalAuth);

// POST /api/privacy/scan - Scan PDF for sensitive PII and metadata
router.post('/scan', uploadPdf.single('file'), handleUploadError, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please upload a PDF file to scan.' });

    const scanResult = await scanPrivacyRisk(req.file.path);
    res.json({
      success: true,
      scanResult,
    });
  } catch (err) {
    next(err);
  } finally {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch { /* ignore */ }
    }
  }
});

// POST /api/privacy/sanitize - Sanitize metadata, comments, and sensitive elements
router.post('/sanitize', uploadPdf.single('file'), handleUploadError, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please upload a PDF file to sanitize.' });

    const options = {
      stripMetadata: req.body.stripMetadata !== 'false',
      removeAnnotations: req.body.removeAnnotations !== 'false',
      removeAttachments: req.body.removeAttachments !== 'false',
    };

    const result = await sanitizePdfDocument(req.file.path, options);
    res.json({
      success: true,
      message: 'PDF successfully sanitized.',
      filename: result.filename,
      actionsDone: result.actionsDone,
      downloadUrl: `/api/pdf/download/${result.filename}`,
    });
  } catch (err) {
    next(err);
  } finally {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch { /* ignore */ }
    }
  }
});

module.exports = router;
