//MODELS/SCAN.JS

const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  technicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'technician',
    required: true,
  },
  scannedData: {
    type: String,
    required: true,
  },
  scannedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Scan', scanSchema);
