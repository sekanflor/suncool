import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRouter from './routes/auth.js';
import logsRouter from './routes/logs.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/logs', logsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/suncool';

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (e) {
    console.error('Failed to start server', e);
    process.exit(1);
  }
}

start();
