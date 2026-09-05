const mongoose = require('mongoose');

const privacyReportSchema = new mongoose.Schema(
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
    privacyRisk: {
      type: String,
      enum: ['low', 'medium', 'high'],
      required: true,
      default: 'low',
    },
    findingsCount: {
      emails: { type: Number, default: 0 },
      phoneNumbers: { type: Number, default: 0 },
      urls: { type: Number, default: 0 },
      names: { type: Number, default: 0 },
      metadataFields: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      attachments: { type: Number, default: 0 },
    },
    findingsList: [
      {
        category: { type: String, required: true },
        type: { type: String, required: true },
        sample: { type: String, default: '' },
        page: { type: Number, default: 1 },
        confidence: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
      },
    ],
    metadataExposed: {
      author: { type: String, default: '' },
      creator: { type: String, default: '' },
      producer: { type: String, default: '' },
      creationDate: { type: String, default: '' },
      modificationDate: { type: String, default: '' },
    },
    remediationActionsAvailable: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, default: '' },
      },
    ],
    sanitizedFilePath: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PrivacyReport', privacyReportSchema);
