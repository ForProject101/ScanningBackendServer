import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import scanRoutes from './routes/scan';
import operationsRoutes from './routes/operations';
import sessionRoutes from './routes/sessions';

const app = express();

// Load environment variables safely
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not defined in environment variables.');
  process.exit(1);
}

// Global middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (_, res) => {
  res.status(200).json({ status: '✅ API is live', timestamp: new Date().toISOString() });
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/operations', operationsRoutes);
app.use('/api/sessions', sessionRoutes);

// MongoDB connection
mongoose
  .connect(MONGO_URI, { dbName: 'tech-db' }) // optional: customize DB name
  .then(() => {
    console.log('✅ MongoDB connection successful');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Fail hard if DB is unreachable
  });

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (err) => {
  console.error('🔥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('🔥 Unhandled Rejection:', reason);
  process.exit(1);
});
