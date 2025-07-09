const axios = require('axios');
const User = require('../models/userModel');
const config = require('../config/config');

/**
 * WhatsApp Notification Service
 * 
 * This service handles sending WhatsApp notifications using the WhatsApp Business API
 * It supports sending notifications to both users and their caregivers
 */
class WhatsappService {
  constructor() {
    this.apiUrl = config.whatsapp.apiUrl;
    this.authToken = config.whatsapp.authToken;
    this.fromPhoneNumberId = config.whatsapp.phoneNumberId;
  }

  /**
   * Send a WhatsApp message
   * @param {string} to - Recipient phone number with country code (e.g., +919876543210)
   * @param {string} templateName - Name of the template to use
   * @param {Array} templateParams - Parameters to fill in the template
   * @returns {Promise} - Response from WhatsApp API
   */
  async sendTemplateMessage(to, templateName, templateParams) {
    try {
      // Format the phone number if needed
      const formattedNumber = this.formatPhoneNumber(to);
      
      // Prepare template components
      const components = [];
      if (templateParams && templateParams.length > 0) {
        components.push({
          type: "body",
          parameters: templateParams.map(param => ({
            type: "text",
            text: param
          }))
        });
      }

      // Prepare the request payload
      const payload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: formattedNumber,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: "en"
          },
          components: components.length > 0 ? components : undefined
        }
      };

      // Send the request to WhatsApp API
      const response = await axios.post(
        `${this.apiUrl}/v1/${this.fromPhoneNumberId}/messages`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('WhatsApp message sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Format phone number to ensure it has country code
   * @param {string} phoneNumber - Phone number to format
   * @returns {string} - Formatted phone number
   */
  formatPhoneNumber(phoneNumber) {
    // Remove any spaces, dashes, or parentheses
    let formatted = phoneNumber.replace(/[\s\-\(\)]/g, '');
    
    // Ensure it starts with +
    if (!formatted.startsWith('+')) {
      formatted = '+' + formatted;
    }
    
    return formatted;
  }

  /**
   * A private helper to fetch user/caregiver and send WhatsApp messages based on preferences.
   * @param {string} userId - The user's ID.
   * @param {object} userMessage - The message for the user { templateName, templateParams }.
   * @param {object} caregiverMessage - The message for the caregiver { templateName, templateParams }.
   * @private
   */
  async _sendToUserAndCaregiver(userId, userMessage, caregiverMessage) {
    const user = await User.findById(userId).select('phone notificationPreferences caregiver').lean();
    if (!user) {
      throw new Error('User not found');
    }

    // Send to user if they have a phone and have enabled WhatsApp notifications
    if (user.phone && user.notificationPreferences?.whatsappNotifications) {
      await this.sendTemplateMessage(
        user.phone,
        userMessage.templateName,
        userMessage.templateParams
      );
    }

    // Send to caregiver if they exist and have notifications enabled
    if (user.caregiver?.phone && user.notificationPreferences?.caregiverNotifications) {
      // Add user's name as the first parameter for the caregiver message
      const caregiverParams = [user.name || 'The patient', ...caregiverMessage.templateParams];
      await this.sendTemplateMessage(
        user.caregiver.phone,
        caregiverMessage.templateName,
        caregiverParams
      );
    }
  }

  /**
   * Send medication reminder
   * @param {string} userId - User ID
   * @param {Object} medication - Medication details
   * @returns {Promise} - Response from WhatsApp API
   */
  async sendMedicationReminder(userId, medication) {
    try {
      const userMessage = {
        templateName: 'medication_reminder',
        templateParams: [medication.name, medication.dosage, medication.time || 'now']
      };

      const caregiverMessage = {
        templateName: 'caregiver_medication_reminder',
        // The user's name will be prepended by the helper
        templateParams: [medication.name, medication.dosage, medication.time || 'now']
      };

      await this._sendToUserAndCaregiver(userId, userMessage, caregiverMessage);

      return { success: true };
    } catch (error) {
      console.error('Error sending medication reminder via WhatsApp:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send appointment reminder
   * @param {string} userId - User ID
   * @param {Object} appointment - Appointment details
   * @returns {Promise} - Response from WhatsApp API
   */
  async sendAppointmentReminder(userId, appointment) {
    try {
      const userMessage = {
        templateName: 'appointment_reminder',
        templateParams: [appointment.doctorName || 'your doctor', appointment.date, appointment.time, appointment.location || 'the clinic']
      };
      const caregiverMessage = {
        templateName: 'caregiver_appointment_reminder',
        templateParams: [appointment.doctorName || 'the doctor', appointment.date, appointment.time, appointment.location || 'the clinic']
      };
      await this._sendToUserAndCaregiver(userId, userMessage, caregiverMessage);

      return { success: true };
    } catch (error) {
      console.error('Error sending appointment reminder via WhatsApp:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send diet plan reminder
   * @param {string} userId - User ID
   * @param {Object} dietPlan - Diet plan details
   * @returns {Promise} - Response from WhatsApp API
   */
  async sendDietPlanReminder(userId, dietPlan) {
    try {
      const userMessage = {
        templateName: 'diet_reminder',
        templateParams: [dietPlan.mealType || 'meal', dietPlan.time || 'now', dietPlan.description || 'as per your diet plan']
      };
      const caregiverMessage = {
        templateName: 'caregiver_diet_reminder',
        templateParams: [dietPlan.mealType || 'meal', dietPlan.time || 'now']
      };
      await this._sendToUserAndCaregiver(userId, userMessage, caregiverMessage);

      return { success: true };
    } catch (error) {
      console.error('Error sending diet plan reminder via WhatsApp:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send vitals check reminder
   * @param {string} userId - User ID
   * @param {Object} vitalsCheck - Vitals check details
   * @returns {Promise} - Response from WhatsApp API
   */
  async sendVitalsCheckReminder(userId, vitalsCheck) {
    try {
      const userMessage = {
        templateName: 'vitals_reminder',
        templateParams: [vitalsCheck.type || 'vitals', vitalsCheck.time || 'now']
      };
      const caregiverMessage = {
        templateName: 'caregiver_vitals_reminder',
        templateParams: [vitalsCheck.type || 'vitals', vitalsCheck.time || 'now']
      };
      await this._sendToUserAndCaregiver(userId, userMessage, caregiverMessage);

      return { success: true };
    } catch (error) {
      console.error('Error sending vitals check reminder via WhatsApp:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new WhatsappService();
