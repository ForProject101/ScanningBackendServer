// routes/operations.js
const express = require('express');
const router = express.Router();
const Operation = require('../models/Operation');
const auth = require('../middleware/auth');

// POST - Create new operation
router.post('/', auth, async (req, res) => {
  try {
    const operation = new Operation({
      userId: req.user._id,
      operationType: req.body.operationType,
      details: req.body.details
    });

    await operation.save();
    res.status(201).send(operation);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET - Fetch operations for current user
router.get('/', auth, async (req, res) => {
  try {
    const operations = await Operation.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.send(operations);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;