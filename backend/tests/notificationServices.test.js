const mongoose = require('mongoose');
const axios = require('axios');
const admin = require('firebase-admin');

const User = require('../models/userModel');
const whatsappService = require('../services/whatsappService');
const pushNotificationService = require('../services/pushNotificationService');
const config = require('../config/config'); // Import config for mocking

describe('Notification Services Tests', () => {
  // Sample test data
  const testUser = {
    _id: new mongoose.Types.ObjectId(),
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+919876543210',
    deviceTokens: ['test-device-token-1', 'test-device-token-2'],
    notificationPreferences: {
      whatsappNotifications: true,
      pushNotifications: true,
      caregiverNotifications: true
    },
    caregiver: {
      name: 'Test Caregiver',
      phone: '+919876543211',
      relationship: 'Family'
    }
  };

  const testMedication = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test Medication',
    dosage: '10mg',
    time: '09:00 AM'
  };

  const testAppointment = {
    _id: new mongoose.Types.ObjectId(),
    doctorName: 'Dr. Test',
    date: '2025-05-25',
    time: '10:00 AM',
    location: 'Test Clinic'
  };

  const testDietPlan = {
    _id: new mongoose.Types.ObjectId(),
    mealType: 'Breakfast',
    time: '08:00 AM',
    description: 'Oatmeal with fruits'
  };

  const testVitalsCheck = {
    _id: new mongoose.Types.ObjectId(),
    type: 'Blood Pressure',
    time: '07:00 PM'
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock external dependencies
    jest.mock('axios');
    jest.mock('../models/userModel');
    jest.mock('firebase-admin', () => ({
      apps: [], // Ensure it's not initialized
      initializeApp: jest.fn(),
      credential: {
        cert: jest.fn(() => 'mock-credential'),
      },
      messaging: jest.fn(() => ({
        send: jest.fn(),
        sendMulticast: jest.fn(),
      })),
    }));
    jest.mock('../config/config', () => ({
      whatsapp: {
        apiUrl: 'http://mock-whatsapp-api.com',
        authToken: 'mock_token',
        phoneNumberId: 'mock_phone_id',
      },
      firebase: {
        projectId: 'mock-project',
        clientEmail: 'mock-email',
        privateKey: 'mock-key',
        databaseURL: 'mock-db-url',
      },
    }));

    // Mock User.findById to return test user
    User.findById.mockResolvedValue(testUser);
  });

  describe('WhatsApp Notification Service', () => {
    it('should send medication reminder to user', async () => {
      const result = await whatsappService.sendMedicationReminder(testUser._id, testMedication);
      
      expect(result.success).to.be.true;
      expect(axios.post.calledOnce).to.be.true;
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String), // URL
        expect.objectContaining({ template: { name: 'medication_reminder' }, to: testUser.phone }),
        expect.any(Object)); // Headers
    });

    it('should send medication reminder to caregiver', async () => {
      const result = await whatsappService.sendMedicationReminder(testUser._id, testMedication);
      
      expect(result.success).to.be.true;
      expect(axios.post.calledTwice).to.be.true;
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String), // URL
        expect.objectContaining({ template: { name: 'caregiver_medication_reminder' }, to: testUser.caregiver.phone }),
        expect.any(Object)); // Headers
    });

    it('should handle missing user phone number', async () => {
      // Modify test user to have no phone number
      const noPhoneUser = { ...testUser, phone: null };
      User.findById.resolves(noPhoneUser);
      
      const result = await whatsappService.sendMedicationReminder(testUser._id, testMedication);
      
      expect(result.success).to.be.false;
      expect(result.error).toContain('User not found'); // The refactored _sendToUserAndCaregiver throws 'User not found'
      expect(axios.post).not.toHaveBeenCalled();
    });

    it('should respect user WhatsApp notification preferences', async () => {
      // Modify test user to disable WhatsApp notifications
      const noWhatsappUser = { 
        ...testUser, 
        notificationPreferences: { 
          ...testUser.notificationPreferences, 
          whatsappNotifications: false 
        } 
      };
      User.findById.resolves(noWhatsappUser);
      
      const result = await whatsappService.sendMedicationReminder(testUser._id, testMedication);

      // Should still return success but not call WhatsApp API for user
      expect(result.success).to.be.true;
      expect(axios.post).toHaveBeenCalledTimes(1); // Only for caregiver
      expect(axios.post).toHaveBeenCalledWith(
        expect.any(String), // URL
        expect.objectContaining({ to: testUser.caregiver.phone }),
        expect.any(Object)); // Headers
    });
  });

  describe('Push Notification Service', () => {
    it('should send medication reminder push notification', async () => {
      const result = await pushNotificationService.sendMedicationReminder(testUser._id, testMedication);
      
      expect(result.success).toBe(true);
      expect(admin.messaging().sendMulticast).toHaveBeenCalledTimes(1);
      
      const callArgs = admin.messaging().sendMulticast.mock.calls[0][0];
      expect(callArgs.tokens).toEqual(testUser.deviceTokens);
      expect(callArgs.notification.title).toEqual('Medication Reminder');
      expect(callArgs.data.medicationName).toEqual(testMedication.name);
    });

    it('should handle missing device tokens', async () => {
      // Modify test user to have no device tokens
      const noTokensUser = { ...testUser, deviceTokens: [] };
      User.findById.resolves(noTokensUser);
      
      const result = await pushNotificationService.sendMedicationReminder(testUser._id, testMedication);

      expect(result.success).toBe(false);
      expect(result.error).toContain('No device tokens available for user.');
      expect(admin.messaging().sendMulticast).not.toHaveBeenCalled();
    });

    it('should respect user push notification preferences', async () => {
      // Modify test user to disable push notifications
      const noPushUser = { 
        ...testUser, 
        notificationPreferences: { 
          ...testUser.notificationPreferences, 
          pushNotifications: false 
        } 
      };
      User.findById.resolves(noPushUser);
      
      const result = await pushNotificationService.sendMedicationReminder(testUser._id, testMedication);      
      expect(result.success).toBe(false);
      expect(result.error).toContain('User has disabled push notifications.');
      expect(admin.messaging().sendMulticast).not.toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('should send both WhatsApp and push notifications for appointment reminder', async () => {
      const whatsappResult = await whatsappService.sendAppointmentReminder(testUser._id, testAppointment);
      const pushResult = await pushNotificationService.sendAppointmentReminder(testUser._id, testAppointment);

      expect(whatsappResult.success).toBe(true);
      expect(pushResult.success).toBe(true);

      expect(axios.post).toHaveBeenCalledTimes(2); // User and caregiver
      expect(admin.messaging().sendMulticast).toHaveBeenCalledTimes(1);
    });

    it('should send both WhatsApp and push notifications for diet plan reminder', async () => {
      const whatsappResult = await whatsappService.sendDietPlanReminder(testUser._id, testDietPlan);
      const pushResult = await pushNotificationService.sendDietPlanReminder(testUser._id, testDietPlan);

      expect(whatsappResult.success).toBe(true);
      expect(pushResult.success).toBe(true);

      expect(axios.post).toHaveBeenCalledTimes(2); // User and caregiver
      expect(admin.messaging().sendMulticast).toHaveBeenCalledTimes(1);
    });

    it('should send both WhatsApp and push notifications for vitals check reminder', async () => {
      const whatsappResult = await whatsappService.sendVitalsCheckReminder(testUser._id, testVitalsCheck);
      const pushResult = await pushNotificationService.sendVitalsCheckReminder(testUser._id, testVitalsCheck);

      expect(whatsappResult.success).toBe(true);
      expect(pushResult.success).toBe(true);

      expect(axios.post).toHaveBeenCalledTimes(2); // User and caregiver
      expect(admin.messaging().sendMulticast).toHaveBeenCalledTimes(1);
    });
  });
});
