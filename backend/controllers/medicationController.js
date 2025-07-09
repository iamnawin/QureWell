const Medication = require('../models/medicationModel');

// Get all medications for a user
exports.getMedications = async (req, res) => {
  try {
    const medications = await Medication.find({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      count: medications.length,
      data: medications
    });
  } catch (error) {
    console.error('Get medications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving medications',
      error: error.message
    });
  }
};

// Get a single medication
exports.getMedication = async (req, res) => {
  try {
    const medication = await Medication.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    res.status(200).json({
      success: true,
      data: medication
    });
  } catch (error) {
    console.error('Get medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving medication',
      error: error.message
    });
  }
};

// Create a new medication
exports.createMedication = async (req, res) => {
  try {
    const { 
      name, 
      dosage, 
      frequency, 
      timeOfDay, 
      startDate, 
      endDate, 
      notes, 
      reminderEnabled 
    } = req.body;
    
    const medication = await Medication.create({
      user: req.user.id,
      name,
      dosage,
      frequency,
      timeOfDay,
      startDate,
      endDate,
      notes,
      reminderEnabled
    });

    res.status(201).json({
      success: true,
      data: medication,
      message: 'Medication created successfully'
    });
  } catch (error) {
    console.error('Create medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating medication',
      error: error.message
    });
  }
};

// Update a medication
exports.updateMedication = async (req, res) => {
  try {
    const { 
      name, 
      dosage, 
      frequency, 
      timeOfDay, 
      startDate, 
      endDate, 
      notes, 
      reminderEnabled 
    } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (dosage) updateData.dosage = dosage;
    if (frequency) updateData.frequency = frequency;
    if (timeOfDay) updateData.timeOfDay = timeOfDay;
    if (startDate) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (notes !== undefined) updateData.notes = notes;
    if (reminderEnabled !== undefined) updateData.reminderEnabled = reminderEnabled;
    
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    res.status(200).json({
      success: true,
      data: medication,
      message: 'Medication updated successfully'
    });
  } catch (error) {
    console.error('Update medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating medication',
      error: error.message
    });
  }
};

// Delete a medication
exports.deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!medication) {
      return res.status(404).json({
        success: false,
        message: 'Medication not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Medication deleted successfully'
    });
  } catch (error) {
    console.error('Delete medication error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting medication',
      error: error.message
    });
  }
};
