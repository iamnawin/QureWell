const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  timeOfDay: [{
    type: String
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  notes: {
    type: String
  },
  reminderEnabled: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
medicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Medication', medicationSchema);
