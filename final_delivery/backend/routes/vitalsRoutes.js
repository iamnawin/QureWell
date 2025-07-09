const express = require('express');
const router = express.Router();
const vitalsController = require('../controllers/vitalsController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateJWT);

// Get all vital readings
router.get('/', vitalsController.getVitalReadings);

// Get vital readings by type
router.get('/type/:type', vitalsController.getVitalReadingsByType);

// Get a single vital reading
router.get('/:id', vitalsController.getVitalReading);

// Create a new vital reading
router.post('/', vitalsController.createVitalReading);

// Update a vital reading
router.put('/:id', vitalsController.updateVitalReading);

// Delete a vital reading
router.delete('/:id', vitalsController.deleteVitalReading);

module.exports = router;
