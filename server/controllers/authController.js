const { asyncHandler } = require('../middleware/errorHandler');
const authService = require('../services/authService');
const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const result = await authService.registerUser({ name, email, password });
  res.status(201).json({ success: true, ...result });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser({ email, password });
  res.status(200).json({ success: true, ...result });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      dailyUsage: user.dailyUsage,
      createdAt: user.createdAt,
    },
  });
});

// @desc    Forgot password — send reset link
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.generateResetToken(req.body.email);
  // In production, send an email with the reset link.
  // For now, return token in dev mode only.
  if (process.env.NODE_ENV === 'development' && result) {
    return res.status(200).json({
      success: true,
      message: 'Reset token generated (dev mode).',
      resetToken: result.resetToken,
    });
  }
  res.status(200).json({
    success: true,
    message: 'If that email exists, a reset link has been sent.',
  });
});

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const token = await authService.resetPassword(req.params.token, req.body.password);
  res.status(200).json({ success: true, token, message: 'Password updated successfully.' });
});

module.exports = { register, login, getMe, forgotPassword, resetPassword };
