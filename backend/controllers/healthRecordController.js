const HealthRecord = require('../models/healthRecordModel');
const User = require('../models/userModel');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const admin = require('firebase-admin');

// Configure storage for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/health-records');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueFilename = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// Configure upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function(req, file, cb) {
    // Accept images, PDFs, and common document formats
    const allowedFileTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|txt/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and common document formats are allowed!'));
    }
  }
}).single('file');

// Get all health records for a user
exports.getHealthRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find({ user: req.user.id })
      .sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Get health records error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving health records',
      error: error.message
    });
  }
};

// Get health records by type
exports.getHealthRecordsByType = async (req, res) => {
  try {
    const { recordType } = req.params;
    
    const records = await HealthRecord.find({ 
      user: req.user.id,
      recordType
    }).sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Get health records by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving health records by type',
      error: error.message
    });
  }
};

// Get a single health record
exports.getHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Health record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('Get health record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving health record',
      error: error.message
    });
  }
};

// Upload a new health record
exports.uploadHealthRecord = async (req, res) => {
  try {
    upload(req, res, async function(err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a file'
        });
      }

      const { title, description, recordType, tags, doctor, hospital, date } = req.body;
      
      // Process tags if provided
      let tagArray = [];
      if (tags) {
        tagArray = tags.split(',').map(tag => tag.trim());
      }

      // Create health record
      const record = await HealthRecord.create({
        user: req.user.id,
        title,
        description,
        recordType,
        fileUrl: `/uploads/health-records/${req.file.filename}`,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        originalFilename: req.file.originalname,
        tags: tagArray,
        metadata: {
          doctor,
          hospital,
          date: date ? new Date(date) : undefined,
          additionalInfo: {}
        }
      });

      res.status(201).json({
        success: true,
        data: record,
        message: 'Health record uploaded successfully'
      });
    });
  } catch (error) {
    console.error('Upload health record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading health record',
      error: error.message
    });
  }
};

// Update a health record
exports.updateHealthRecord = async (req, res) => {
  try {
    const { title, description, recordType, tags, doctor, hospital, date } = req.body;
    
    // Process tags if provided
    let tagArray;
    if (tags) {
      tagArray = tags.split(',').map(tag => tag.trim());
    }

    // Find and update the record
    const record = await HealthRecord.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        title,
        description,
        recordType,
        tags: tagArray,
        'metadata.doctor': doctor,
        'metadata.hospital': hospital,
        'metadata.date': date ? new Date(date) : undefined,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Health record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: record,
      message: 'Health record updated successfully'
    });
  } catch (error) {
    console.error('Update health record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating health record',
      error: error.message
    });
  }
};

// Delete a health record
exports.deleteHealthRecord = async (req, res) => {
  try {
    const record = await HealthRecord.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Health record not found'
      });
    }

    // Delete file from storage
    const filePath = path.join(__dirname, '..', record.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete record from database
    await record.remove();

    res.status(200).json({
      success: true,
      message: 'Health record deleted successfully'
    });
  } catch (error) {
    console.error('Delete health record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting health record',
      error: error.message
    });
  }
};

// Share a health record with another user
exports.shareHealthRecord = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find the user to share with
    const shareWithUser = await User.findOne({ email });
    if (!shareWithUser) {
      return res.status(404).json({
        success: false,
        message: 'User to share with not found'
      });
    }

    // Find the record
    const record = await HealthRecord.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Health record not found'
      });
    }

    // Check if already shared with this user
    if (record.sharedWith.includes(shareWithUser._id)) {
      return res.status(400).json({
        success: false,
        message: 'Record already shared with this user'
      });
    }

    // Update the record
    record.isShared = true;
    record.sharedWith.push(shareWithUser._id);
    await record.save();

    res.status(200).json({
      success: true,
      data: record,
      message: 'Health record shared successfully'
    });
  } catch (error) {
    console.error('Share health record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing health record',
      error: error.message
    });
  }
};

// Unshare a health record
exports.unshareHealthRecord = async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Find the record
    const record = await HealthRecord.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Health record not found'
      });
    }

    // Remove user from sharedWith array
    record.sharedWith = record.sharedWith.filter(id => id.toString() !== userId);
    
    // Update isShared flag if no more shares
    if (record.sharedWith.length === 0) {
      record.isShared = false;
    }
    
    await record.save();

    res.status(200).json({
      success: true,
      data: record,
      message: 'Health record unshared successfully'
    });
  } catch (error) {
    console.error('Unshare health record error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unsharing health record',
      error: error.message
    });
  }
};

// Get shared health records
exports.getSharedHealthRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find({ 
      sharedWith: req.user.id 
    }).populate('user', 'firstName lastName email');
    
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Get shared health records error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving shared health records',
      error: error.message
    });
  }
};

// Search health records
exports.searchHealthRecords = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const records = await HealthRecord.find({
      $and: [
        { user: req.user.id },
        { $text: { $search: query } }
      ]
    }).sort({ score: { $meta: 'textScore' } });
    
    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    console.error('Search health records error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching health records',
      error: error.message
    });
  }
};
