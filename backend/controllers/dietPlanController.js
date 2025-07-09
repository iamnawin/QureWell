const DietPlan = require('../models/dietPlanModel');

// Get all diet plans for a user
exports.getDietPlans = async (req, res) => {
  try {
    const dietPlans = await DietPlan.find({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      count: dietPlans.length,
      data: dietPlans
    });
  } catch (error) {
    console.error('Get diet plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving diet plans',
      error: error.message
    });
  }
};

// Get a single diet plan
exports.getDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    res.status(200).json({
      success: true,
      data: dietPlan
    });
  } catch (error) {
    console.error('Get diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving diet plan',
      error: error.message
    });
  }
};

// Create a new diet plan
exports.createDietPlan = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      meals, 
      totalCalories, 
      restrictions, 
      notes 
    } = req.body;
    
    const dietPlan = await DietPlan.create({
      user: req.user.id,
      name,
      description,
      meals,
      totalCalories,
      restrictions,
      notes
    });

    res.status(201).json({
      success: true,
      data: dietPlan,
      message: 'Diet plan created successfully'
    });
  } catch (error) {
    console.error('Create diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating diet plan',
      error: error.message
    });
  }
};

// Update a diet plan
exports.updateDietPlan = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      meals, 
      totalCalories, 
      restrictions, 
      notes 
    } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (meals) updateData.meals = meals;
    if (totalCalories) updateData.totalCalories = totalCalories;
    if (restrictions) updateData.restrictions = restrictions;
    if (notes !== undefined) updateData.notes = notes;
    
    const dietPlan = await DietPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    res.status(200).json({
      success: true,
      data: dietPlan,
      message: 'Diet plan updated successfully'
    });
  } catch (error) {
    console.error('Update diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating diet plan',
      error: error.message
    });
  }
};

// Delete a diet plan
exports.deleteDietPlan = async (req, res) => {
  try {
    const dietPlan = await DietPlan.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!dietPlan) {
      return res.status(404).json({
        success: false,
        message: 'Diet plan not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Diet plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete diet plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting diet plan',
      error: error.message
    });
  }
};
