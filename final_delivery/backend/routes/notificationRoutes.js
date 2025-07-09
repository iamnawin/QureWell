const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(authenticateJWT);

// Get all notifications
router.get('/', notificationController.getNotifications);

// Get unread notifications
router.get('/unread', notificationController.getUnreadNotifications);

// Get a single notification
router.get('/:id', notificationController.getNotification);

// Create a new notification
router.post('/', notificationController.createNotification);

// Mark notification as read
router.put('/:id/read', notificationController.markNotificationAsRead);

// Mark all notifications as read
router.put('/read-all', notificationController.markAllNotificationsAsRead);

// Delete a notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
