const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['academic', 'submission', 'research', 'privacy', 'custom'],
      default: 'custom',
    },
    steps: [
      {
        stepIndex: { type: Number, required: true },
        toolId: { type: String, required: true },
        toolName: { type: String, required: true },
        config: { type: mongoose.Schema.Types.Mixed, default: {} },
        isOptional: { type: Boolean, default: false },
      },
    ],
    isPreset: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workflow', workflowSchema);
