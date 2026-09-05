const express = require('express');
const router = express.Router();
const { uploadPdf, handleUploadError } = require('../middleware/upload');
const { optionalAuth } = require('../middleware/auth');
const {
  BUILTIN_TEMPLATES,
  INITIAL_UNIVERSITIES,
  generateCoverPdf,
  buildAcademicDocument,
} = require('../services/academicService');

router.use(optionalAuth);

// GET /api/academic/templates - List available academic templates
router.get('/templates', (_req, res) => {
  res.json({
    success: true,
    templates: BUILTIN_TEMPLATES,
  });
});

// GET /api/academic/universities - List university profiles
router.get('/universities', (_req, res) => {
  res.json({
    success: true,
    universities: INITIAL_UNIVERSITIES,
  });
});

// POST /api/academic/generate-cover - Generate single Cover Page PDF
router.post('/generate-cover', async (req, res, next) => {
  try {
    const result = await generateCoverPdf(req.body);
    res.json({
      success: true,
      message: 'Cover page compiled successfully.',
      filename: result.filename,
      downloadUrl: `/api/pdf/download/${result.filename}`,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/academic/build-document - Multi-page Academic Document Builder
router.post('/build-document', async (req, res, next) => {
  try {
    const result = await buildAcademicDocument(req.body);
    res.json({
      success: true,
      message: 'Academic document built successfully.',
      filename: result.filename,
      pageCount: result.pageCount,
      downloadUrl: `/api/pdf/download/${result.filename}`,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
