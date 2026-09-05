const express = require('express');
const router = express.Router();
const fs = require('fs');
const { uploadPdf, handleUploadError } = require('../middleware/upload');
const { optionalAuth } = require('../middleware/auth');
const { generateStudyMaterials, askDocumentAssistant } = require('../services/studyService');

router.use(optionalAuth);

// POST /api/study/generate - Generate summary, key topics, flashcards, MCQs, revision notes
router.post('/generate', uploadPdf.single('file'), handleUploadError, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please upload a PDF document for Study Mode.' });

    const difficulty = req.body.difficulty || 'medium';
    const questionCount = req.body.questionCount || 10;
    const studyMaterials = await generateStudyMaterials(req.file.path, { difficulty, questionCount });

    res.json({
      success: true,
      studyMaterials,
    });
  } catch (err) {
    next(err);
  } finally {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch { /* ignore */ }
    }
  }
});

// POST /api/study/ask - Ask My Document conversational Q&A
router.post('/ask', uploadPdf.single('file'), handleUploadError, async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Please upload a PDF document to converse with.' });
    if (!req.body.query) return res.status(400).json({ success: false, error: 'Query prompt is required.' });

    const response = await askDocumentAssistant(req.file.path, req.body.query);
    res.json({
      success: true,
      response,
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
