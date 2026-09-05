require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const { errorHandler } = require('./middleware/errorHandler');
const { startCleanupJob } = require('./utils/fileCleanup');

const authRoutes = require('./routes/authRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to Database ─────────────────────────────────────────────────────
connectDB();

// ─── Directory Initialization ───────────────────────────────────────────────
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow file downloads
}));

// ─── CORS Configuration ──────────────────────────────────────────────────────
const defaultAllowedOrigins = [
  'https://pdf-nerd.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const envOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultAllowedOrigins, ...envOrigins]));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (server-to-server, health checkers, curl, render probes)
    if (!origin) return callback(null, true);

    const normalizedOrigin = origin.replace(/\/+$/, '');

    // Check exact match in configured & default allowed origins
    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Support Vercel preview branch deployments (e.g., https://pdf-nerd-git-*.vercel.app)
    if (/^https:\/\/pdf-nerd(-[a-z0-9-]+)?\.vercel\.app$/.test(normalizedOrigin)) {
      return callback(null, true);
    }

    // In development mode, allow any local network address
    if (process.env.NODE_ENV !== 'production') {
      if (
        normalizedOrigin.startsWith('http://localhost:') ||
        normalizedOrigin.startsWith('http://127.0.0.1:') ||
        normalizedOrigin.startsWith('http://192.168.') ||
        normalizedOrigin.startsWith('http://10.')
      ) {
        return callback(null, true);
      }
    }

    // Disallow origin safely without throwing unhandled 500 error
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Disposition', 'X-Original-Size', 'X-Compressed-Size', 'X-Saved-Percent'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ─── General Middleware ───────────────────────────────────────────────────────
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Rate Limiting ────────────────────────────────────────────────────────────
app.use('/api/', apiLimiter);

const { recordVisit, getStats } = require('./utils/statsTracker');

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'PDFnerd API is running',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── Real Visiting Counter ───────────────────────────────────────────────────
app.get('/api/stats/visit', (_req, res) => {
  const stats = recordVisit();
  res.json({
    success: true,
    ...stats,
  });
});

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/academic', require('./routes/academicRoutes'));
app.use('/api/health-check', require('./routes/healthRoutes'));
app.use('/api/accessibility', require('./routes/accessibilityRoutes'));
app.use('/api/privacy', require('./routes/privacyRoutes'));
app.use('/api/study', require('./routes/studyRoutes'));
app.use('/api/workflows', require('./routes/workflowRoutes'));

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Route not found.' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Process Error Handlers ───────────────────────────────────────────────────
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception thrown:', err);
});

// ─── Start Server ─────────────────────────────────────────────────────────────
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`\n🚀 PDFnerd API running on port ${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
    startCleanupJob();
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: shutting down HTTP server');
    server.close(() => {
      console.log('HTTP server closed.');
    });
  });
}

module.exports = app;
