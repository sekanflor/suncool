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
    
    // Mock response for frontend testing
    const mockUser = { id: 'mock123', name, email };
    const mockToken = 'mock_jwt_token_for_testing';
    res.status(201).json({ token: mockToken, user: mockUser });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
    
    // Mock response for frontend testing
    const mockUser = { id: 'mock123', name: 'Test User', email };
    const mockToken = 'mock_jwt_token_for_testing';
    res.json({ token: mockToken, user: mockUser });
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
