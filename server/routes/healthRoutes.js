const express = require('express');
const router = express.Router();
const fs = require('fs');
const { uploadPdf, handleUploadError } = require('../middleware/upload');
const { optionalAuth } = require('../middleware/auth');
const { analyzePdfHealth, healPdfDocument } = require('../services/healthService');

router.use(optionalAuth);

// POST /api/health-check/analyze - Analyze PDF health score and metrics
router.post('/analyze', uploadPdf.single('file'), handleUploadError, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please upload a PDF file to analyze.' });

    const report = await analyzePdfHealth(req.file.path);
    res.json({
      success: true,
      report,
    });
  } catch (err) {
    next(err);
  } finally {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch { /* ignore */ }
    }
  }
});

// POST /api/health-check/doctor-heal - Smart PDF Doctor auto-healing
router.post('/doctor-heal', uploadPdf.single('file'), handleUploadError, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please upload a PDF file to heal.' });

    let fixes = ['fix-metadata', 'normalize-rotation', 'optimize-streams'];
    if (req.body.selectedFixes) {
      if (Array.isArray(req.body.selectedFixes)) {
        fixes = req.body.selectedFixes;
      } else if (typeof req.body.selectedFixes === 'string') {
        try {
          fixes = JSON.parse(req.body.selectedFixes);
        } catch {
          fixes = req.body.selectedFixes.split(',').map((s) => s.trim().replace(/['"\[\]]/g, ''));
        }
      }
    }

    const result = await healPdfDocument(req.file.path, fixes);
    res.json({
      success: true,
      message: 'PDF successfully treated and healed by PDF Doctor.',
      filename: result.filename,
      beforeScore: result.beforeScore,
      afterScore: result.afterScore,
      scoreImprovement: result.scoreImprovement,
      fixesApplied: result.fixesApplied,
      healedAudit: result.healedAudit,
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
