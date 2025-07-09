const Notification = require('../models/notificationModel');
const User = require('../models/userModel');
const whatsappService = require('../services/whatsappService');
const pushNotificationService = require('../services/pushNotificationService');

// Get all notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ timestamp: -1 });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving notifications',
      error: error.message
    });
  }
};

// Get unread notifications for a user
exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      user: req.user.id,
      read: false
    }).sort({ timestamp: -1 });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Get unread notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving unread notifications',
      error: error.message
    });
  }
};

// Get a single notification
exports.getNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving notification',
      error: error.message
    });
  }
};

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { title, message, type, actionRequired, actionUrl } = req.body;
    
    const notification = await Notification.create({
      user: req.user.id,
      title,
      message,
      type,
      actionRequired,
      actionUrl
    });

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notification created successfully'
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating notification',
      error: error.message
    });
  }
};

// Mark notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { read: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      data: notification,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notification as read',
      error: error.message
    });
  }
};

// Mark all notifications as read
exports.markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking all notifications as read',
      error: error.message
    });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification',
      error: error.message
    });
  }
};

// Send notification via multiple channels (in-app, push, WhatsApp)
exports.sendNotification = async (req, res) => {
  try {
    const { userId, title, message, type, actionRequired, actionUrl, data } = req.body;
    
    // Create in-app notification
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
      actionRequired,
      actionUrl
    });

    // Get user to check notification preferences
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Track notification delivery status
    const deliveryStatus = {
      inApp: { success: true, id: notification._id },
      push: { success: false },
      whatsapp: { success: false }
    };

    // Send push notification if enabled
    if (user.notificationPreferences?.pushNotifications) {
      try {
        const pushResult = await pushNotificationService.sendToDevices(
          user.deviceTokens,
          { title, body: message },
          { ...data, type, notificationId: notification._id.toString() }
        );
        deliveryStatus.push = pushResult;
      } catch (error) {
        console.error('Push notification error:', error);
        deliveryStatus.push = { success: false, error: error.message };
      }
    }

    // Send WhatsApp notification if enabled
    if (user.notificationPreferences?.whatsappNotifications && user.phone) {
      try {
        // Determine which template to use based on notification type
        let templateName = 'general_notification';
        let templateParams = [title, message];
        
        if (type === 'medication') {
          templateName = 'medication_reminder';
          templateParams = [data.medicationName, data.dosage, data.time || 'now'];
        } else if (type === 'appointment') {
          templateName = 'appointment_reminder';
          templateParams = [data.doctorName, data.date, data.time, data.location];
        } else if (type === 'diet') {
          templateName = 'diet_reminder';
          templateParams = [data.mealType, data.time, data.description];
        } else if (type === 'vitals') {
          templateName = 'vitals_reminder';
          templateParams = [data.vitalsType, data.time];
        }
        
        const whatsappResult = await whatsappService.sendTemplateMessage(
          user.phone,
          templateName,
          templateParams
        );
        deliveryStatus.whatsapp = { success: true, result: whatsappResult };
      } catch (error) {
        console.error('WhatsApp notification error:', error);
        deliveryStatus.whatsapp = { success: false, error: error.message };
      }
    }

    res.status(201).json({
      success: true,
      data: notification,
      deliveryStatus,
      message: 'Notification sent successfully'
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending notification',
      error: error.message
    });
  }
};

// Update notification settings
exports.updateNotificationSettings = async (req, res) => {
  try {
    const { pushNotifications, whatsappNotifications, emailNotifications, smsNotifications, caregiverNotifications } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        'notificationPreferences.pushNotifications': pushNotifications,
        'notificationPreferences.whatsappNotifications': whatsappNotifications,
        'notificationPreferences.emailNotifications': emailNotifications,
        'notificationPreferences.smsNotifications': smsNotifications,
        'notificationPreferences.caregiverNotifications': caregiverNotifications
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user.notificationPreferences,
      message: 'Notification settings updated successfully'
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notification settings',
      error: error.message
    });
  }
};

// Register device token for push notifications
exports.registerDeviceToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Device token is required'
      });
    }

    // Find user and update device tokens array
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add token if it doesn't exist already
    if (!user.deviceTokens) {
      user.deviceTokens = [token];
    } else if (!user.deviceTokens.includes(token)) {
      user.deviceTokens.push(token);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Device token registered successfully'
    });
  } catch (error) {
    console.error('Register device token error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering device token',
      error: error.message
    });
  }
};

// Unregister device token
exports.unregisterDeviceToken = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Device token is required'
      });
    }

    // Find user and update device tokens array
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove token if it exists
    if (user.deviceTokens && user.deviceTokens.includes(token)) {
      user.deviceTokens = user.deviceTokens.filter(t => t !== token);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Device token unregistered successfully'
    });
  } catch (error) {
    console.error('Unregister device token error:', error);
    res.status(500).json({
      success: false,
      message: 'Error unregistering device token',
      error: error.message
    });
  }
};
