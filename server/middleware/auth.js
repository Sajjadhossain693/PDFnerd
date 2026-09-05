const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes — verifies JWT from Authorization header or cookie.
 * Attaches the full user object to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // Check Authorization header first, then cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'User not found or account deactivated.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token. Please log in again.',
    });
  }
};

/**
 * Optional auth — attaches user if token is valid, but does not block if missing.
 * Useful for tools that work for both guests and logged-in users.
 */
const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch {
      // Ignore invalid token for optional auth
    }
  }
  next();
};

/**
 * Restrict to specific plan tiers.
 */
const requirePlan = (...plans) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required.' });
  }
  if (!plans.includes(req.user.plan)) {
    return res.status(403).json({
      success: false,
      error: `This feature requires a ${plans.join(' or ')} plan.`,
    });
  }
  next();
};

module.exports = { protect, optionalAuth, requirePlan };
