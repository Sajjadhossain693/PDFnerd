const mongoose = require('mongoose');

const processingHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    toolUsed: {
      type: String,
      required: true,
      enum: [
        'merge', 'split', 'compress', 'pdf-to-jpg', 'jpg-to-pdf',
        'pdf-to-word', 'word-to-pdf', 'rotate', 'delete-pages',
        'extract-pages', 'watermark', 'page-numbers', 'protect',
        'unlock', 'ocr', 'repair', 'compare', 'sign',
      ],
    },
    originalFileName: { type: String, required: true },
    outputFileName: { type: String, default: null },
    fileSizeBytes: { type: Number, default: 0 },
    outputSizeBytes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['success', 'failed', 'processing'],
      default: 'processing',
    },
    errorMessage: { type: String, default: null },
    // Auto-delete after 30 days
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

// TTL index — MongoDB will auto-delete expired history
processingHistorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('ProcessingHistory', processingHistorySchema);
