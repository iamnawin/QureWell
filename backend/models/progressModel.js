const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const progressEntrySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['weight', 'exercise', 'diet', 'medication', 'other'],
    required: true
  },
  value: {
    type: Schema.Types.Mixed,
    required: true
  },
  unit: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProgressEntry', progressEntrySchema);
