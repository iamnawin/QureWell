const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateJWT);

// Get user profile
router.get('/profile', userController.getUserProfile);

// Update user profile
router.put('/profile', userController.updateUserProfile);

// Delete user account
router.delete('/', userController.deleteUserAccount);

module.exports = router;
