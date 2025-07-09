const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vitalReadingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['blood_pressure', 'heart_rate', 'blood_sugar', 'weight', 'temperature', 'oxygen'],
    required: true
  },
  value: {
    type: Schema.Types.Mixed,
    required: true
  },
  unit: {
    type: String,
    required: true
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

module.exports = mongoose.model('VitalReading', vitalReadingSchema);
