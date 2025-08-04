// models/Operation.js
const mongoose = require('mongoose');

const OperationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  operationType: {
    type: String,
    required: true,
    enum: ['SESSION_START', 'SCAN', 'STATUS_UPDATE', 'SESSION_END']
  },
  details: {
    type: Object,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Operation', OperationSchema);