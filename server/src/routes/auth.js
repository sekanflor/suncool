import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

function sign(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password });
    const token = sign(user._id.toString());
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = sign(user._id.toString());
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    const user = await User.findById(payload.userId).select('_id name email');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
