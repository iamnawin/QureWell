const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voiceController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const multer = require('multer');

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// All routes require authentication
router.use(authenticateJWT);

// Get all audio recordings
router.get('/recordings', voiceController.getAudioRecordings);

// Get a single audio recording
router.get('/recordings/:id', voiceController.getAudioRecording);

// Upload and create a new audio recording
router.post('/recordings', upload.single('audio'), voiceController.createAudioRecording);

// Delete an audio recording
router.delete('/recordings/:id', voiceController.deleteAudioRecording);

// Speech to text conversion
router.post('/speech-to-text', upload.single('audio'), voiceController.speechToText);

// Text to speech conversion
router.post('/text-to-speech', voiceController.textToSpeech);

module.exports = router;
