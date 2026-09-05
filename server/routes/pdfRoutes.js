const express = require('express');
const router = express.Router();
const {
  mergePdf, splitPdf, compressPdf, rotatePdf, deletePdfPages,
  extractPdfPages, addWatermark, addPageNumbers, protectPdf, unlockPdf, downloadFile,
  jpgToPdf, getHistory, deleteHistoryItem,
} = require('../controllers/pdfController');
const { uploadPdf, uploadImages, handleUploadError } = require('../middleware/upload');
const { optionalAuth, protect } = require('../middleware/auth');
const { pdfLimiter } = require('../middleware/rateLimiter');

// All PDF processing routes use optionalAuth (works for guests + logs history for logged-in users)
router.use(optionalAuth);

router.post('/merge', pdfLimiter, uploadPdf.array('files', 20), handleUploadError, mergePdf);
router.post('/split', pdfLimiter, uploadPdf.single('file'), handleUploadError, splitPdf);
router.post('/compress', pdfLimiter, uploadPdf.single('file'), handleUploadError, compressPdf);
router.post('/rotate', pdfLimiter, uploadPdf.single('file'), handleUploadError, rotatePdf);
router.post('/delete-pages', pdfLimiter, uploadPdf.single('file'), handleUploadError, deletePdfPages);
router.post('/extract-pages', pdfLimiter, uploadPdf.single('file'), handleUploadError, extractPdfPages);
router.post('/watermark', pdfLimiter, uploadPdf.single('file'), handleUploadError, addWatermark);
router.post('/page-numbers', pdfLimiter, uploadPdf.single('file'), handleUploadError, addPageNumbers);
router.post('/protect', pdfLimiter, uploadPdf.single('file'), handleUploadError, protectPdf);
router.post('/unlock', pdfLimiter, uploadPdf.single('file'), handleUploadError, unlockPdf);
router.post('/jpg-to-pdf', pdfLimiter, uploadImages.array('files', 30), handleUploadError, jpgToPdf);

// History routes (logged-in user)
router.get('/history', protect, getHistory);
router.delete('/history/:id', protect, deleteHistoryItem);

// Secure download by filename
router.get('/download/:filename', downloadFile);

module.exports = router;
