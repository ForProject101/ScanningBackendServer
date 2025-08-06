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
const PORT = process.env.PORT ?? 5000;

// **1. Safely grab your Mongo URI**
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ MONGO_URI is not set in the environment.');
  process.exit(1); // stop the process immediately
}

app.use(cors());
app.use(express.json());

// health check
app.get('/', (_, res) => res.send('Technician API is running ✅'));

app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/operations', operationsRoutes);
app.use('/api/sessions', sessionRoutes);

// **2. Connect without the non-null operator**
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));
