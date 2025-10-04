import express from 'express';
import TempLog from '../models/TempLog.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', async (req, res) => {
  try {
    const { valueCelsius, note, recordedAt } = req.body;
    if (typeof valueCelsius !== 'number') return res.status(400).json({ message: 'valueCelsius must be number' });
    
    // Mock response for frontend testing
    const mockLog = {
      _id: 'mock_log_' + Date.now(),
      user: req.userId || 'mock123',
      valueCelsius,
      note: note || '',
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    res.status(201).json(mockLog);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/', async (req, res) => {
  try {
    // Mock data for frontend testing
    const mockLogs = [
      {
        _id: 'mock_log_1',
        user: req.userId || 'mock123',
        valueCelsius: 36.5,
        note: 'Morning reading',
        recordedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'mock_log_2',
        user: req.userId || 'mock123',
        valueCelsius: 37.1,
        note: 'Afternoon reading',
        recordedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'mock_log_3',
        user: req.userId || 'mock123',
        valueCelsius: 36.8,
        note: 'Evening reading',
        recordedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    res.json(mockLogs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const { range = 'day' } = req.query; // 'day' or 'week'

    // Mock stats data for frontend testing
    const mockStats = {
      range,
      start: new Date(),
      data: [
        {
          _id: { y: 2024, m: 10, d: 4, h: 8 },
          avg: 36.5,
          min: 36.2,
          max: 36.8,
          count: 3
        },
        {
          _id: { y: 2024, m: 10, d: 4, h: 9 },
          avg: 36.8,
          min: 36.6,
          max: 37.0,
          count: 2
        },
        {
          _id: { y: 2024, m: 10, d: 4, h: 10 },
          avg: 37.1,
          min: 36.9,
          max: 37.3,
          count: 4
        },
        {
          _id: { y: 2024, m: 10, d: 4, h: 11 },
          avg: 36.9,
          min: 36.7,
          max: 37.1,
          count: 2
        }
      ]
    };

    res.json(mockStats);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
