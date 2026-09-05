const mongoose = require('mongoose');

const connectDB = async () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const uri = process.env.MONGODB_URI || (!isProduction ? 'mongodb://localhost:27017/pdfnerd' : null);

  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not defined. Database features will be unavailable.');
    return;
  }

  // Setup connection event listeners
  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected.');
  });

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    console.log('⚠️  Running without database — auth and history features unavailable');
    // Don't exit — allow standalone PDF tools to continue working
  }
};

module.exports = connectDB;
