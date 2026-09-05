const mongoose = require('mongoose');

const pdfHealthReportSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      default: null,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSizeBytes: {
      type: Number,
      required: true,
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    healthScore: {
      type: Number,
      required: true, // 0 to 100
      min: 0,
      max: 100,
    },
    metrics: {
      isSearchable: { type: Boolean, default: false },
      fontsEmbedded: { type: Boolean, default: false },
      hasMetadata: { type: Boolean, default: false },
      largeImagesCount: { type: Number, default: 0 },
      isEncrypted: { type: Boolean, default: false },
      brokenObjectsCount: { type: Number, default: 0 },
      hasBookmarks: { type: Boolean, default: false },
      accessibilityTagsPresent: { type: Boolean, default: false },
      linearized: { type: Boolean, default: false },
      pdfVersion: { type: String, default: '1.7' },
    },
    checks: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        status: { type: String, enum: ['pass', 'warning', 'fail'], required: true },
        detail: { type: String, default: '' },
        recommendation: { type: String, default: '' },
        suggestedTool: { type: String, default: '' },
      },
    ],
    doctorAvailableFixes: [
      {
        id: { type: String, required: true },
        name: { type: String, required: true },
        impact: { type: String, default: 'medium' },
        enabled: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('PDFHealthReport', pdfHealthReportSchema);
