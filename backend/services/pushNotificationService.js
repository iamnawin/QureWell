const admin = require('firebase-admin');
const User = require('../models/userModel');
const config = require('../config/config');

/**
 * Push Notification Service
 * 
 * This service handles sending push notifications using Firebase Cloud Messaging (FCM)
 * It supports sending notifications to both users' devices and potentially caregiver devices
 */
class PushNotificationService {
  constructor() {
    // Initialize Firebase Admin SDK if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: config.firebase.projectId,
          clientEmail: config.firebase.clientEmail,
          privateKey: config.firebase.privateKey.replace(/\\n/g, '\n')
        }),
        databaseURL: config.firebase.databaseURL
      });
    }
    this.messaging = admin.messaging();
  }

  /**
   * Send a push notification to a device
   * @param {string} token - FCM device token
   * @param {Object} notification - Notification payload
   * @param {Object} data - Additional data payload
   * @returns {Promise} - Response from FCM
   */
  async sendToDevice(token, notification, data = {}) {
    try {
      const message = {
        token,
        notification,
        data,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            priority: 'high',
            channelId: 'allforyourhealth-reminders'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              category: 'REMINDER'
            }
          }
        }
      };

      const response = await this.messaging.send(message);
      console.log('Push notification sent successfully:', response);
      return { success: true, messageId: response };
    } catch (error) {
      console.error('Error sending push notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send a push notification to multiple devices
   * @param {Array} tokens - List of FCM device tokens
   * @param {Object} notification - Notification payload
   * @param {Object} data - Additional data payload
   * @returns {Promise} - Response from FCM
   */
  async sendToDevices(tokens, notification, data = {}) {
    try {
      if (!tokens || tokens.length === 0) {
        return { success: false, error: 'No valid device tokens provided' };
      }

      const message = {
        tokens,
        notification,
        data,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            priority: 'high',
            channelId: 'allforyourhealth-reminders'
          }
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              category: 'REMINDER'
            }
          }
        }
      };

      const response = await this.messaging.sendMulticast(message);
      console.log('Push notifications sent successfully:', response);
      return { 
        success: true, 
        successCount: response.successCount,
        failureCount: response.failureCount
      };
    } catch (error) {
      console.error('Error sending push notifications:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * A private helper to check user preferences and send a notification.
   * @param {string} userId - The user's ID.
   * @param {Object} notification - The notification payload.
   * @param {Object} data - The data payload.
   * @returns {Promise} - The result of the send operation.
   * @private
   */
  async _getUserAndSend(userId, notification, data) {
    const user = await User.findById(userId).select('deviceTokens notificationPreferences').lean();
    if (!user) {
      console.warn(`PushNotificationService: User not found for ID: ${userId}`);
      return { success: false, error: 'User not found' };
    }

    if (!user.notificationPreferences?.pushNotifications) {
      return { success: false, error: 'User has disabled push notifications.' };
    }

    if (!user.deviceTokens || user.deviceTokens.length === 0) {
      return { success: false, error: 'No device tokens available for user.' };
    }

    return this.sendToDevices(user.deviceTokens, notification, data);
  }

  /**
   * Send medication reminder push notification
   * @param {string} userId - User ID
   * @param {Object} medication - Medication details
   * @returns {Promise} - Response from FCM
   */
  async sendMedicationReminder(userId, medication) {
    try {
      const notification = {
        title: 'Medication Reminder',
        body: `Time to take ${medication.name} ${medication.dosage}`
      };

      const data = {
        type: 'medication_reminder',
        medicationId: medication._id.toString(),
        medicationName: medication.name,
        dosage: medication.dosage,
        time: medication.time || 'now',
        click_action: 'MEDICATION_REMINDER'
      };

      return await this._getUserAndSend(userId, notification, data);
    } catch (error) {
      console.error('Error sending medication reminder push notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send appointment reminder push notification
   * @param {string} userId - User ID
   * @param {Object} appointment - Appointment details
   * @returns {Promise} - Response from FCM
   */
  async sendAppointmentReminder(userId, appointment) {
    try {
      const notification = {
        title: 'Appointment Reminder',
        body: `Appointment with ${appointment.doctorName || 'your doctor'} at ${appointment.time} on ${appointment.date}`
      };

      const data = {
        type: 'appointment_reminder',
        appointmentId: appointment._id.toString(),
        doctorName: appointment.doctorName || 'your doctor',
        date: appointment.date,
        time: appointment.time,
        location: appointment.location || 'the clinic',
        click_action: 'APPOINTMENT_REMINDER'
      };

      return await this._getUserAndSend(userId, notification, data);
    } catch (error) {
      console.error('Error sending appointment reminder push notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send diet plan reminder push notification
   * @param {string} userId - User ID
   * @param {Object} dietPlan - Diet plan details
   * @returns {Promise} - Response from FCM
   */
  async sendDietPlanReminder(userId, dietPlan) {
    try {
      const notification = {
        title: 'Diet Plan Reminder',
        body: `Time for your ${dietPlan.mealType || 'meal'} at ${dietPlan.time || 'now'}`
      };

      const data = {
        type: 'diet_reminder',
        dietPlanId: dietPlan._id.toString(),
        mealType: dietPlan.mealType || 'meal',
        time: dietPlan.time || 'now',
        description: dietPlan.description || 'as per your diet plan',
        click_action: 'DIET_REMINDER'
      };

      return await this._getUserAndSend(userId, notification, data);
    } catch (error) {
      console.error('Error sending diet plan reminder push notification:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send vitals check reminder push notification
   * @param {string} userId - User ID
   * @param {Object} vitalsCheck - Vitals check details
   * @returns {Promise} - Response from FCM
   */
  async sendVitalsCheckReminder(userId, vitalsCheck) {
    try {
      const notification = {
        title: 'Vitals Check Reminder',
        body: `Time to check your ${vitalsCheck.type || 'vitals'}`
      };

      const data = {
        type: 'vitals_reminder',
        vitalsCheckId: vitalsCheck._id.toString(),
        vitalsType: vitalsCheck.type || 'vitals',
        time: vitalsCheck.time || 'now',
        click_action: 'VITALS_REMINDER'
      };

      return await this._getUserAndSend(userId, notification, data);
    } catch (error) {
      console.error('Error sending vitals check reminder push notification:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new PushNotificationService();
