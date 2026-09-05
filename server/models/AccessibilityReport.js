const mongoose = require('mongoose');

const accessibilityReportSchema = new mongoose.Schema(
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
    standards: {
      pdfUa1: { type: Boolean, default: false },
      wcag22: { type: Boolean, default: false },
    },
    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    summaryCounts: {
      passed: { type: Number, default: 0 },
      warnings: { type: Number, default: 0 },
      errors: { type: Number, default: 0 },
      critical: { type: Number, default: 0 },
    },
    checks: [
      {
        ruleId: { type: String, required: true },
        name: { type: String, required: true },
        standard: { type: String, default: 'WCAG 2.2 / PDF/UA-1' },
        severity: { type: String, enum: ['critical', 'error', 'warning', 'pass'], required: true },
        description: { type: String, required: true },
        guidance: { type: String, default: '' },
      },
    ],
    disclaimer: {
      type: String,
      default: 'Automated checking does not guarantee formal legal or regulatory certification. Manual testing with assistive technology is advised.',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AccessibilityReport', accessibilityReportSchema);
