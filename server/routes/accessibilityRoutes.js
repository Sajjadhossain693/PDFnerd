const express = require('express');
const router = express.Router();
const fs = require('fs');
const { uploadPdf, handleUploadError } = require('../middleware/upload');
const { optionalAuth } = require('../middleware/auth');
const { auditAccessibility } = require('../services/accessibilityService');

router.use(optionalAuth);

// POST /api/accessibility/audit - Verify PDF/UA-1 & WCAG 2.2 accessibility
router.post('/audit', uploadPdf.single('file'), handleUploadError, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please upload a PDF file to audit.' });

    const audit = await auditAccessibility(req.file.path);
    res.json({
      success: true,
      audit,
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
