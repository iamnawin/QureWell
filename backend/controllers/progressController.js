const ProgressEntry = require('../models/progressModel');

// Get all progress entries for a user
exports.getProgressEntries = async (req, res) => {
  try {
    const progressEntries = await ProgressEntry.find({ user: req.user.id })
      .sort({ timestamp: -1 });
    
    res.status(200).json({
      success: true,
      count: progressEntries.length,
      data: progressEntries
    });
  } catch (error) {
    console.error('Get progress entries error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving progress entries',
      error: error.message
    });
  }
};

// Get progress entries by type
exports.getProgressEntriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    const progressEntries = await ProgressEntry.find({
      user: req.user.id,
      type
    }).sort({ timestamp: -1 });
    
    res.status(200).json({
      success: true,
      count: progressEntries.length,
      data: progressEntries
    });
  } catch (error) {
    console.error('Get progress entries by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving progress entries',
      error: error.message
    });
  }
};

// Get a single progress entry
exports.getProgressEntry = async (req, res) => {
  try {
    const progressEntry = await ProgressEntry.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!progressEntry) {
      return res.status(404).json({
        success: false,
        message: 'Progress entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: progressEntry
    });
  } catch (error) {
    console.error('Get progress entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving progress entry',
      error: error.message
    });
  }
};

// Create a new progress entry
exports.createProgressEntry = async (req, res) => {
  try {
    const { type, value, unit, notes } = req.body;
    
    const progressEntry = await ProgressEntry.create({
      user: req.user.id,
      type,
      value,
      unit,
      notes
    });

    res.status(201).json({
      success: true,
      data: progressEntry,
      message: 'Progress entry created successfully'
    });
  } catch (error) {
    console.error('Create progress entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating progress entry',
      error: error.message
    });
  }
};

// Update a progress entry
exports.updateProgressEntry = async (req, res) => {
  try {
    const { value, unit, notes } = req.body;
    
    const updateData = {};
    if (value !== undefined) updateData.value = value;
    if (unit) updateData.unit = unit;
    if (notes !== undefined) updateData.notes = notes;
    
    const progressEntry = await ProgressEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!progressEntry) {
      return res.status(404).json({
        success: false,
        message: 'Progress entry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: progressEntry,
      message: 'Progress entry updated successfully'
    });
  } catch (error) {
    console.error('Update progress entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating progress entry',
      error: error.message
    });
  }
};

// Delete a progress entry
exports.deleteProgressEntry = async (req, res) => {
  try {
    const progressEntry = await ProgressEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!progressEntry) {
      return res.status(404).json({
        success: false,
        message: 'Progress entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Progress entry deleted successfully'
    });
  } catch (error) {
    console.error('Delete progress entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting progress entry',
      error: error.message
    });
  }
};
