const path = require('path');
const fs = require('fs');
const { asyncHandler } = require('../middleware/errorHandler');
const pdfService = require('../services/pdfService');
const ProcessingHistory = require('../models/ProcessingHistory');

const OUTPUT_DIR = path.join(__dirname, '../output');

/**
 * Helper: send file as download and optionally record history.
 */
const sendFileResponse = async (res, req, { filename, filepath }, toolUsed, originalName, originalSize) => {
  if (!fs.existsSync(filepath)) {
    return res.status(500).json({ success: false, error: 'Output file not found after processing.' });
  }

  // Save to history if authenticated
  if (req.user) {
    try {
      await ProcessingHistory.create({
        userId: req.user._id,
        toolUsed,
        originalFileName: originalName,
        outputFileName: filename,
        fileSizeBytes: originalSize,
        outputSizeBytes: fs.statSync(filepath).size,
        status: 'success',
      });
    } catch { /* Non-critical */ }
  }

  res.download(filepath, filename, (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({ success: false, error: 'Failed to send file.' });
    }
  });
};

/**
 * Helper: delete uploaded temp files
 */
const cleanupFiles = (files) => {
  if (!files) return;
  const fileList = Array.isArray(files) ? files : [files];
  fileList.forEach((f) => {
    if (f && f.path && fs.existsSync(f.path)) {
      try { fs.unlinkSync(f.path); } catch { /* ignore */ }
    }
  });
};

// @route   POST /api/pdf/merge
const mergePdf = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length < 2) {
    return res.status(400).json({ success: false, error: 'Please upload at least 2 PDF files to merge.' });
  }
  const filePaths = req.files.map((f) => f.path);
  try {
    const result = await pdfService.mergePdfs(filePaths);
    await sendFileResponse(res, req, result, 'merge', req.files.map((f) => f.originalname).join(', '), req.files.reduce((s, f) => s + f.size, 0));
  } finally {
    cleanupFiles(req.files);
  }
});

// @route   POST /api/pdf/split
const splitPdf = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No PDF file uploaded.' });
  const { mode = 'every', start, end, every, pages } = req.body;
  try {
    const results = await pdfService.splitPdf(req.file.path, mode, { start, end, every, pages });
    if (results.length === 1) {
      return sendFileResponse(res, req, results[0], 'split', req.file.originalname, req.file.size);
    }
    // Multiple files — return JSON with filenames for client to download individually
    cleanupFiles(req.file);
    res.json({ success: true, files: results.map((r) => ({ filename: r.filename })) });
  } finally {
    cleanupFiles(req.file);
  }
});

// @route   POST /api/pdf/compress
const compressPdf = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No PDF file uploaded.' });
  try {
    const result = await pdfService.compressPdf(req.file.path);
    const savedPercent = Math.round((1 - result.compressedSize / result.originalSize) * 100);
    res.setHeader('X-Original-Size', result.originalSize);
    res.setHeader('X-Compressed-Size', result.compressedSize);
    res.setHeader('X-Saved-Percent', savedPercent);
    await sendFileResponse(res, req, result, 'compress', req.file.originalname, req.file.size);
  } finally {
    cleanupFiles(req.file);
  }
});

// @route   POST /api/pdf/rotate
const rotatePdf = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No PDF file uploaded.' });
  const rotation = parseInt(req.body.rotation) || 90;
  if (![90, 180, 270].includes(rotation)) {
    return res.status(400).json({ success: false, error: 'Invalid rotation. Use 90, 180, or 270.' });
  }
  try {
    const result = await pdfService.rotatePdf(req.file.path, rotation, req.body.pageRange || null);
    await sendFileResponse(res, req, result, 'rotate', req.file.originalname, req.file.size);
  } finally {
    cleanupFiles(req.file);
  }
});

// @route   POST /api/pdf/delete-pages
const deletePdfPages = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No PDF file uploaded.' });
  if (!req.body.pages) return res.status(400).json({ success: false, error: 'No pages specified.' });
  try {
    const result = await pdfService.deletePages(req.file.path, req.body.pages);
    await sendFileResponse(res, req, result, 'delete-pages', req.file.originalname, req.file.size);
  } finally {
    cleanupFiles(req.file);
  }
});

// @route   POST /api/pdf/extract-pages
const extractPdfPages = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No PDF file uploaded.' });
  if (!req.body.pages) return res.status(400).json({ success: false, error: 'No pages specified.' });
  try {
    const result = await pdfService.extractPages(req.file.path, req.body.pages);
    await sendFileResponse(res, req, result, 'extract-pages', req.file.originalname, req.file.size);
  } finally {
    cleanupFiles(req.file);
  }
});

// @route   POST /api/pdf/watermark
const addWatermark = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No PDF file uploaded.' });
  const { text = 'CONFIDENTIAL', opacity = 0.25, fontSize = 60 } = req.body;
  try {
    const result = await pdfService.addWatermark(req.file.path, text, {
      opacity: parseFloat(opacity),
      fontSize: parseInt(fontSize),
    });
    await sendFileResponse(res, req, result, 'watermark', req.file.originalname, req.file.size);
  } finally {
    cleanupFiles(req.file);
  }
});

// @route   POST /api/pdf/page-numbers
const addPageNumbers = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No PDF file uploaded.' });
  const { position = 'bottom-center', startNumber = 1, fontSize = 12 } = req.body;
  try {
    const result = await pdfService.addPageNumbers(req.file.path, {
      position,
      startNumber: parseInt(startNumber),
      fontSize: parseInt(fontSize),
    });
    await sendFileResponse(res, req, result, 'page-numbers', req.file.originalname, req.file.size);
  } finally {
    cleanupFiles(req.file);
  }
});

// @route   POST /api/pdf/protect
const protectPdf = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No PDF file uploaded.' });
  if (!req.body.password) return res.status(400).json({ success: false, error: 'Password is required.' });
  try {
    const result = await pdfService.protectPdf(req.file.path, req.body.password);
    await sendFileResponse(res, req, result, 'protect', req.file.originalname, req.file.size);
  } finally {
    cleanupFiles(req.file);
  }
});

// @route   POST /api/pdf/unlock
const unlockPdf = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No PDF file uploaded.' });
  try {
    const result = await pdfService.unlockPdf(req.file.path, req.body.password || '');
    await sendFileResponse(res, req, result, 'unlock', req.file.originalname, req.file.size);
  } finally {
    cleanupFiles(req.file);
  }
});

// @route   POST /api/pdf/jpg-to-pdf
const jpgToPdf = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, error: 'Please upload at least one JPG or PNG image.' });
  }
  const filePaths = req.files.map((f) => f.path);
  try {
    const result = await pdfService.imagesToPdf(filePaths);
    await sendFileResponse(
      res,
      req,
      result,
      'jpg-to-pdf',
      req.files.map((f) => f.originalname).join(', '),
      req.files.reduce((s, f) => s + f.size, 0)
    );
  } finally {
    cleanupFiles(req.files);
  }
});

// @route   GET /api/pdf/history
const getHistory = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(200).json({ success: true, history: [] });
  }
  const history = await ProcessingHistory.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.status(200).json({ success: true, history });
});

// @route   DELETE /api/pdf/history/:id
const deleteHistoryItem = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  await ProcessingHistory.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  res.status(200).json({ success: true, message: 'History item removed' });
});

// @route   GET /api/pdf/download/:filename
const downloadFile = asyncHandler(async (req, res) => {
  const filename = path.basename(req.params.filename); // Sanitize
  const filepath = path.join(OUTPUT_DIR, filename);
  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ success: false, error: 'File not found or has expired.' });
  }
  res.download(filepath, filename, (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({ success: false, error: 'Failed to download file.' });
    }
  });
});

module.exports = {
  mergePdf, splitPdf, compressPdf, rotatePdf, deletePdfPages,
  extractPdfPages, addWatermark, addPageNumbers, protectPdf, unlockPdf, downloadFile,
  jpgToPdf, getHistory, deleteHistoryItem,
};
