import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth';
import scanRoutes from './routes/scan';
import operationsRoutes from './routes/operations';
import sessionRoutes from './routes/sessions';

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_: Request, res: Response) => res.send('✅ Technician API is up'));
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/operations', operationsRoutes);
app.use('/api/sessions', sessionRoutes);

// MongoDB Connection Cache
let isConnected = false;

async function connectToDB(): Promise<void> {
  if (isConnected) return;

  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) throw new Error('❌ MONGO_URI is not defined');

  await mongoose.connect(MONGO_URI, { dbName: 'tech-db' });
  isConnected = true;
  console.log('✅ MongoDB connected (Vercel)');
}

// Main handler (Vercel Serverless-compatible)
export default async function handler(req: Request, res: Response) {
  try {
    await connectToDB();
    return app(req, res); // Forward request to Express
  } catch (err: any) {
    console.error('❌ Handler error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
