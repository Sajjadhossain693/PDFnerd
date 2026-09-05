const mongoose = require('mongoose');

const academicTemplateSchema = new mongoose.Schema(
  {
    templateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['cover', 'multi-page', 'report', 'lab', 'thesis'],
      default: 'cover',
    },
    description: {
      type: String,
      default: '',
    },
    pageSize: {
      type: String,
      default: 'A4',
    },
    margins: {
      top: { type: Number, default: 36 },
      bottom: { type: Number, default: 36 },
      left: { type: Number, default: 36 },
      right: { type: Number, default: 36 },
    },
    typography: {
      headingFont: { type: String, default: 'Helvetica-Bold' },
      bodyFont: { type: String, default: 'Helvetica' },
      accentFont: { type: String, default: 'Helvetica-Oblique' },
    },
    sections: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        enabled: { type: Boolean, default: true },
        order: { type: Number, default: 0 },
        alignment: { type: String, enum: ['left', 'center', 'right'], default: 'center' },
      },
    ],
    fields: [
      {
        key: { type: String, required: true },
        label: { type: String, required: true },
        section: { type: String, required: true },
        required: { type: Boolean, default: false },
        defaultValue: { type: String, default: '' },
      },
    ],
    logoPosition: {
      type: String,
      enum: ['top-center', 'top-left', 'top-right', 'watermark', 'none'],
      default: 'top-center',
    },
    styleConfig: {
      primaryColor: { type: String, default: '#0F172A' },
      accentColor: { type: String, default: '#2563EB' },
      borderStyle: { type: String, enum: ['none', 'single', 'double', 'minimal', 'modern'], default: 'minimal' },
    },
    isBuiltIn: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AcademicTemplate', academicTemplateSchema);
