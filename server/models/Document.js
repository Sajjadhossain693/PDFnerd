const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    originalFileName: {
      type: String,
      required: true,
    },
    currentFilePath: {
      type: String,
      required: true,
    },
    fileSizeBytes: {
      type: Number,
      required: true,
    },
    pageCount: {
      type: Number,
      default: 1,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    latestHealthScore: {
      type: Number,
      default: null,
    },
    latestAccessibilityScore: {
      type: Number,
      default: null,
    },
    latestPrivacyRisk: {
      type: String,
      enum: ['low', 'medium', 'high', null],
      default: null,
    },
    isWorkspaceActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Document', documentSchema);
