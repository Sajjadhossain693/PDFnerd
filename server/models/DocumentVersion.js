const mongoose = require('mongoose');

const documentVersionSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    versionNumber: {
      type: Number,
      default: 1,
    },
    operation: {
      type: String,
      required: true, // e.g., 'upload', 'merge', 'compress', 'doctor-heal', 'sanitize'
    },
    inputFile: {
      type: String,
      default: '',
    },
    outputFile: {
      type: String,
      required: true,
    },
    fileSizeBytes: {
      type: Number,
      required: true,
    },
    deltaBytes: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DocumentVersion', documentVersionSchema);
