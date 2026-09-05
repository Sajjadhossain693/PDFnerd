const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    logo: {
      type: String,
      default: '',
    },
    departments: [
      {
        name: { type: String, required: true },
        code: { type: String, uppercase: true },
        programs: [{ type: String }],
      },
    ],
    templates: [
      {
        type: String, // references AcademicTemplate templateId
      },
    ],
    formattingRules: {
      defaultPageSize: { type: String, default: 'A4' },
      defaultMargins: {
        top: { type: Number, default: 25 },
        bottom: { type: Number, default: 25 },
        left: { type: Number, default: 25 },
        right: { type: Number, default: 25 },
      },
      preferredFont: { type: String, default: 'Helvetica' },
      showUniversityLogo: { type: Boolean, default: true },
      primaryColor: { type: String, default: '#0F172A' },
      secondaryColor: { type: String, default: '#2563EB' },
    },
    isCustom: {
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

module.exports = mongoose.model('University', universitySchema);
