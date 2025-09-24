import express from 'express';
import TempLog from '../models/TempLog.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.post('/', async (req, res) => {
  try {
    const { valueCelsius, note, recordedAt } = req.body;
    if (typeof valueCelsius !== 'number') return res.status(400).json({ message: 'valueCelsius must be number' });
    const log = await TempLog.create({
      user: req.userId,
      valueCelsius,
      note: note || '',
      recordedAt: recordedAt ? new Date(recordedAt) : new Date(),
    });
    res.status(201).json(log);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = { user: req.userId };
    if (from || to) {
      filter.recordedAt = {};
      if (from) filter.recordedAt.$gte = new Date(from);
      if (to) filter.recordedAt.$lte = new Date(to);
    }
    const logs = await TempLog.find(filter).sort({ recordedAt: 1 });
    res.json(logs);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const { range = 'day' } = req.query; // 'day' or 'week'

    const now = new Date();
    const start = new Date(now);
    if (range === 'week') {
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
    } else {
      // day
      start.setHours(0, 0, 0, 0);
    }

    const match = { user: new (await import('mongoose')).default.Types.ObjectId(req.userId), recordedAt: { $gte: start } };

    const groupId = range === 'week'
      ? { y: { $year: '$recordedAt' }, m: { $month: '$recordedAt' }, d: { $dayOfMonth: '$recordedAt' } }
      : { y: { $year: '$recordedAt' }, m: { $month: '$recordedAt' }, d: { $dayOfMonth: '$recordedAt' }, h: { $hour: '$recordedAt' } };

    const pipeline = [
      { $match: match },
      { $group: { _id: groupId, avg: { $avg: '$valueCelsius' }, min: { $min: '$valueCelsius' }, max: { $max: '$valueCelsius' }, count: { $sum: 1 } } },
      { $sort: { '_id.y': 1, '_id.m': 1, '_id.d': 1, ...(range === 'day' ? { '_id.h': 1 } : {}) } },
    ];

    const data = await TempLog.aggregate(pipeline);

    res.json({ range, start, data });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
