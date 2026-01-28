import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Store fan state in memory (in production, you'd want to use a database)
let fanState = {
  isOn: false,
  lastToggled: new Date(),
  userId: null
};

router.use(requireAuth);

// Get current fan status
router.get('/status', async (req, res) => {
  try {
    res.json({
      fanOn: fanState.isOn,
      lastToggled: fanState.lastToggled,
      userId: req.userId
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Toggle fan on/off
router.post('/toggle', async (req, res) => {
  try {
    const { fanOn } = req.body;
    
    // Update fan state
    fanState = {
      isOn: fanOn,
      lastToggled: new Date(),
      userId: req.userId
    };

    // In a real application, you would:
    // 1. Send command to actual fan hardware
    // 2. Log the action to database
    // 3. Send notification to other connected devices
    
    console.log(`Fan ${fanOn ? 'turned ON' : 'turned OFF'} by user ${req.userId}`);
    
    res.json({
      success: true,
      fanOn: fanState.isOn,
      lastToggled: fanState.lastToggled,
      message: `Fan ${fanOn ? 'turned on' : 'turned off'} successfully`
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Set fan speed (bonus feature)
router.post('/speed', async (req, res) => {
  try {
    const { speed } = req.body; // 1-5 speed levels
    
    if (speed < 1 || speed > 5) {
      return res.status(400).json({ message: 'Speed must be between 1 and 5' });
    }

    // In a real application, you would control actual fan speed
    console.log(`Fan speed set to ${speed} by user ${req.userId}`);
    
    res.json({
      success: true,
      speed: speed,
      message: `Fan speed set to level ${speed}`
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;


