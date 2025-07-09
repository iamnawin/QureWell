const express = require('express');
const router = express.Router();
const { verifyFirebaseToken } = require('../middleware/authMiddleware');
const notificationController = require('../controllers/notificationController');

console.log('notificationController:', notificationController);
console.log('notificationController.getNotifications:', notificationController ? notificationController.getNotifications : 'notificationController is undefined');

// Get all notifications for the authenticated user
router.get('/', verifyFirebaseToken, notificationController.getNotifications);

// Get unread notifications for the authenticated user
router.get('/unread', verifyFirebaseToken, notificationController.getUnreadNotifications);

// Get a single notification
router.get('/:id', verifyFirebaseToken, notificationController.getNotification);

// Create a new notification
router.post('/', verifyFirebaseToken, notificationController.createNotification);

// Send notification via multiple channels (in-app, push, WhatsApp)
router.post('/send', verifyFirebaseToken, notificationController.sendNotification);

// Mark notification as read
router.put('/:id/read', verifyFirebaseToken, notificationController.markNotificationAsRead);

// Mark all notifications as read
router.put('/read-all', verifyFirebaseToken, notificationController.markAllNotificationsAsRead);

// Delete a notification
router.delete('/:id', verifyFirebaseToken, notificationController.deleteNotification);

// Update notification settings
router.put('/settings', verifyFirebaseToken, notificationController.updateNotificationSettings);

// Register device token for push notifications
router.post('/register-device', verifyFirebaseToken, notificationController.registerDeviceToken);

// Unregister device token
router.post('/unregister-device', verifyFirebaseToken, notificationController.unregisterDeviceToken);

module.exports = router;
