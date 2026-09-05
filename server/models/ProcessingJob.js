const mongoose = require('mongoose');

const processingJobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    workflowSlug: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
    },
    progressPercent: {
      type: Number,
      default: 0,
    },
    currentStep: {
      type: Number,
      default: 0,
    },
    totalSteps: {
      type: Number,
      default: 1,
    },
    inputFile: {
      type: String,
      default: '',
    },
    outputFile: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: null,
    },
    stepResults: [
      {
        stepIndex: { type: Number },
        toolId: { type: String },
        status: { type: String },
        outputFile: { type: String },
        message: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProcessingJob', processingJobSchema);
