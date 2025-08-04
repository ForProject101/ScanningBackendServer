//AUTH/SCAN.JS
const express = require('express');
const router = express.Router();
const Scan = require('../models/Scan');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'franceman99'; // same as your existing one

// Middleware to verify token
const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// POST /api/scan - Save scan data
router.post('/scan', authenticate, async (req, res) => {
  try {
    const { scannedData } = req.body;

    if (!scannedData) {
      return res.status(400).json({ error: 'Scanned data is required' });
    }

    const scan = new Scan({
      technicianId: req.user._id,
      scannedData,
    });

    await scan.save();
    res.json({ message: 'Scan saved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/scan - Get scan history for technician
router.get('/scan', authenticate, async (req, res) => {
  try {
    const scans = await Scan.find({ technicianId: req.user._id }).sort({ scannedAt: -1 });
    res.json(scans);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
