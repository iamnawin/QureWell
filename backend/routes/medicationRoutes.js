const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateJWT);

// Get all medications
router.get('/', medicationController.getMedications);

// Get a single medication
router.get('/:id', medicationController.getMedication);

// Create a new medication
router.post('/', medicationController.createMedication);

// Update a medication
router.put('/:id', medicationController.updateMedication);

// Delete a medication
router.delete('/:id', medicationController.deleteMedication);

module.exports = router;
