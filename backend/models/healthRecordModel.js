const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const healthRecordSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  recordType: {
    type: String,
    enum: ['lab_result', 'prescription', 'imaging', 'vaccination', 'discharge_summary', 'doctor_note', 'insurance', 'other'],
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  tags: [String],
  metadata: {
    doctor: String,
    hospital: String,
    date: Date,
    additionalInfo: Schema.Types.Mixed
  },
  isShared: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
healthRecordSchema.index({ 
  title: 'text', 
  description: 'text', 
  recordType: 'text',
  'metadata.doctor': 'text',
  'metadata.hospital': 'text',
  tags: 'text'
});

// Update the updatedAt field on save
healthRecordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
