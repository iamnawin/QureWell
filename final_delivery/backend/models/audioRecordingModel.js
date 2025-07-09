const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const audioRecordingSchema = new Schema({
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
  fileUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  transcription: {
    type: String
  },
  category: {
    type: String,
    enum: ['caretaker_message', 'voice_command', 'health_note', 'other'],
    default: 'other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AudioRecording', audioRecordingSchema);
