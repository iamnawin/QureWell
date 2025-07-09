const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateJWT, verifyFirebaseToken } = require('../middleware/authMiddleware');

// All routes in this file should ideally require Firebase authentication
// We will use verifyFirebaseToken middleware for consistency.
// Note: The original code used authenticateJWT. We are changing this
// to align with the Firebase ID token verification approach.
// router.use(authenticateJWT); // Remove this line if using verifyFirebaseToken on individual routes

// Route to create or update a user in MongoDB after Firebase authentication
router.post('/create-from-firebase', verifyFirebaseToken, userController.createOrUpdateUserFromFirebase);

// Get user profile (requires Firebase authentication)
router.get('/profile', verifyFirebaseToken, userController.getUserProfile);

// Update user profile (requires Firebase authentication)
router.put('/profile', verifyFirebaseToken, userController.updateUserProfile);

// Delete user account (requires Firebase authentication)
router.delete('/', verifyFirebaseToken, userController.deleteUserAccount);

module.exports = router;
