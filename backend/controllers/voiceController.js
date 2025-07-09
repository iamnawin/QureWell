const { admin } = require('../middleware/authMiddleware');
const AudioRecording = require('../models/audioRecordingModel');
const { Storage } = require('@google-cloud/storage');
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');
const util = require('util');
const os = require('os');

// Initialize Google Cloud clients
const speechClient = new speech.SpeechClient();
const ttsClient = new textToSpeech.TextToSpeechClient();

// Get all audio recordings for a user
exports.getAudioRecordings = async (req, res) => {
  try {
    const recordings = await AudioRecording.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: recordings.length,
      data: recordings
    });
  } catch (error) {
    console.error('Get audio recordings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving audio recordings',
      error: error.message
    });
  }
};

// Get a single audio recording
exports.getAudioRecording = async (req, res) => {
  try {
    const recording = await AudioRecording.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!recording) {
      return res.status(404).json({
        success: false,
        message: 'Audio recording not found'
      });
    }

    res.status(200).json({
      success: true,
      data: recording
    });
  } catch (error) {
    console.error('Get audio recording error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving audio recording',
      error: error.message
    });
  }
};

// Upload and create a new audio recording
exports.createAudioRecording = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file uploaded'
      });
    }

    const { title, description, category } = req.body;
    const file = req.file;
    
    // Upload to Firebase Storage
    const bucket = admin.storage().bucket();
    const fileName = `audio/${req.user.id}/${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    blobStream.on('error', (error) => {
      console.error('Upload error:', error);
      return res.status(500).json({
        success: false,
        message: 'Error uploading audio file',
        error: error.message
      });
    });

    blobStream.on('finish', async () => {
      // Make the file public
      await fileUpload.makePublic();
      
      // Get public URL
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      
      // Calculate duration (simplified, in a real app you'd use audio metadata)
      const duration = 60; // Placeholder for actual duration calculation
      
      // Create recording record in database
      const recording = await AudioRecording.create({
        user: req.user.id,
        title,
        description,
        fileUrl: publicUrl,
        duration,
        category: category || 'other'
      });

      res.status(201).json({
        success: true,
        data: recording,
        message: 'Audio recording created successfully'
      });
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error('Create audio recording error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating audio recording',
      error: error.message
    });
  }
};

// Delete an audio recording
exports.deleteAudioRecording = async (req, res) => {
  try {
    const recording = await AudioRecording.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!recording) {
      return res.status(404).json({
        success: false,
        message: 'Audio recording not found'
      });
    }

    // Delete from Firebase Storage
    if (recording.fileUrl) {
      const bucket = admin.storage().bucket();
      const fileUrl = recording.fileUrl;
      const fileName = fileUrl.split('/').pop();
      const file = bucket.file(`audio/${req.user.id}/${fileName}`);
      
      try {
        await file.delete();
      } catch (deleteError) {
        console.error('Error deleting file from storage:', deleteError);
      }
    }

    // Delete from database
    await AudioRecording.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Audio recording deleted successfully'
    });
  } catch (error) {
    console.error('Delete audio recording error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting audio recording',
      error: error.message
    });
  }
};

// Speech to text conversion
exports.speechToText = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No audio file uploaded'
      });
    }

    const audioBytes = req.file.buffer.toString('base64');

    const audio = {
      content: audioBytes,
    };
    
    const config = {
      encoding: 'LINEAR16',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
    };
    
    const request = {
      audio: audio,
      config: config,
    };

    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    res.status(200).json({
      success: true,
      data: {
        transcription
      }
    });
  } catch (error) {
    console.error('Speech to text error:', error);
    res.status(500).json({
      success: false,
      message: 'Error converting speech to text',
      error: error.message
    });
  }
};

// Text to speech conversion
exports.textToSpeech = async (req, res) => {
  try {
    const { text, voice = 'en-US-Standard-B', pitch = 0, speakingRate = 1 } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    const request = {
      input: { text },
      voice: { 
        languageCode: voice.split('-').slice(0, 2).join('-'),
        name: voice
      },
      audioConfig: { 
        audioEncoding: 'MP3',
        pitch,
        speakingRate
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    
    // Create a temporary file
    const tempFilePath = path.join(os.tmpdir(), `tts-${Date.now()}.mp3`);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(tempFilePath, response.audioContent, 'binary');

    // Upload to Firebase Storage
    const bucket = admin.storage().bucket();
    const fileName = `tts/${req.user.id}/${Date.now()}.mp3`;
    
    await bucket.upload(tempFilePath, {
      destination: fileName,
      metadata: {
        contentType: 'audio/mp3'
      }
    });

    // Make the file public
    await bucket.file(fileName).makePublic();
    
    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
    
    // Clean up temp file
    fs.unlinkSync(tempFilePath);

    res.status(200).json({
      success: true,
      data: {
        audioUrl: publicUrl
      }
    });
  } catch (error) {
    console.error('Text to speech error:', error);
    res.status(500).json({
      success: false,
      message: 'Error converting text to speech',
      error: error.message
    });
  }
};
