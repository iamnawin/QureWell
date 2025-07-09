const VitalReading = require('../models/vitalModel');

// Get all vital readings for a user
exports.getVitalReadings = async (req, res) => {
  try {
    const vitalReadings = await VitalReading.find({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      count: vitalReadings.length,
      data: vitalReadings
    });
  } catch (error) {
    console.error('Get vital readings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving vital readings',
      error: error.message
    });
  }
};

// Get vital readings by type
exports.getVitalReadingsByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    const vitalReadings = await VitalReading.find({
      user: req.user.id,
      type
    }).sort({ timestamp: -1 });
    
    res.status(200).json({
      success: true,
      count: vitalReadings.length,
      data: vitalReadings
    });
  } catch (error) {
    console.error('Get vital readings by type error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving vital readings',
      error: error.message
    });
  }
};

// Get a single vital reading
exports.getVitalReading = async (req, res) => {
  try {
    const vitalReading = await VitalReading.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!vitalReading) {
      return res.status(404).json({
        success: false,
        message: 'Vital reading not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vitalReading
    });
  } catch (error) {
    console.error('Get vital reading error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving vital reading',
      error: error.message
    });
  }
};

// Create a new vital reading
exports.createVitalReading = async (req, res) => {
  try {
    const { type, value, unit, notes } = req.body;
    
    const vitalReading = await VitalReading.create({
      user: req.user.id,
      type,
      value,
      unit,
      notes
    });

    res.status(201).json({
      success: true,
      data: vitalReading,
      message: 'Vital reading created successfully'
    });
  } catch (error) {
    console.error('Create vital reading error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating vital reading',
      error: error.message
    });
  }
};

// Update a vital reading
exports.updateVitalReading = async (req, res) => {
  try {
    const { value, unit, notes } = req.body;
    
    const updateData = {};
    if (value !== undefined) updateData.value = value;
    if (unit) updateData.unit = unit;
    if (notes !== undefined) updateData.notes = notes;
    
    const vitalReading = await VitalReading.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!vitalReading) {
      return res.status(404).json({
        success: false,
        message: 'Vital reading not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vitalReading,
      message: 'Vital reading updated successfully'
    });
  } catch (error) {
    console.error('Update vital reading error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating vital reading',
      error: error.message
    });
  }
};

// Delete a vital reading
exports.deleteVitalReading = async (req, res) => {
  try {
    const vitalReading = await VitalReading.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!vitalReading) {
      return res.status(404).json({
        success: false,
        message: 'Vital reading not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vital reading deleted successfully'
    });
  } catch (error) {
    console.error('Delete vital reading error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting vital reading',
      error: error.message
    });
  }
};
