const express = require('express');
const router = express.Router();
const dietPlanController = require('../controllers/dietPlanController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateJWT);

// Get all diet plans
router.get('/', dietPlanController.getDietPlans);

// Get a single diet plan
router.get('/:id', dietPlanController.getDietPlan);

// Create a new diet plan
router.post('/', dietPlanController.createDietPlan);

// Update a diet plan
router.put('/:id', dietPlanController.updateDietPlan);

// Delete a diet plan
router.delete('/:id', dietPlanController.deleteDietPlan);

module.exports = router;
