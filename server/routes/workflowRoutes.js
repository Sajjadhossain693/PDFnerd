const express = require('express');
const router = express.Router();
const fs = require('fs');
const { uploadPdf, handleUploadError } = require('../middleware/upload');
const { optionalAuth } = require('../middleware/auth');
const { PRESET_WORKFLOWS, executeWorkflow } = require('../services/workflowService');

router.use(optionalAuth);

// GET /api/workflows/presets - Get available preset workflows
router.get('/presets', (_req, res) => {
  res.json({
    success: true,
    workflows: PRESET_WORKFLOWS,
  });
});

// POST /api/workflows/execute - Run a chained workflow pipeline on an uploaded PDF
router.post('/execute', uploadPdf.single('file'), handleUploadError, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please upload a PDF file to run through the workflow.' });

    const workflowSlug = req.body.workflowSlug || 'assignment-workflow';
    const result = await executeWorkflow(req.file.path, workflowSlug);

    res.json({
      success: true,
      result,
      downloadUrl: `/api/pdf/download/${result.finalFile}`,
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
