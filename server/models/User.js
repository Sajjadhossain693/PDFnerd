const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never return password in queries by default
    },
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },
    dailyUsage: {
      count: { type: Number, default: 0 },
      resetDate: { type: Date, default: Date.now },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare plain password with hashed
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Reset daily usage counter if it's a new day
userSchema.methods.resetDailyUsageIfNeeded = function () {
  const now = new Date();
  const resetDate = new Date(this.dailyUsage.resetDate);
  if (now.toDateString() !== resetDate.toDateString()) {
    this.dailyUsage.count = 0;
    this.dailyUsage.resetDate = now;
  }
};

module.exports = mongoose.model('User', userSchema);
