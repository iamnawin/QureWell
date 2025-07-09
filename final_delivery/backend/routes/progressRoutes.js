const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateJWT);

// Get all progress entries
router.get('/', progressController.getProgressEntries);

// Get progress entries by type
router.get('/type/:type', progressController.getProgressEntriesByType);

// Get a single progress entry
router.get('/:id', progressController.getProgressEntry);

// Create a new progress entry
router.post('/', progressController.createProgressEntry);

// Update a progress entry
router.put('/:id', progressController.updateProgressEntry);

// Delete a progress entry
router.delete('/:id', progressController.deleteProgressEntry);

module.exports = router;
