# Notification System Setup and Usage Guide

This document provides comprehensive instructions for setting up and using the notification system in the AllForYourHealth application, including WhatsApp notifications and push notifications.

## Table of Contents
1. [Overview](#overview)
2. [WhatsApp Notification Setup](#whatsapp-notification-setup)
3. [Push Notification Setup](#push-notification-setup)
4. [Environment Configuration](#environment-configuration)
5. [User Notification Preferences](#user-notification-preferences)
6. [Developer Integration Guide](#developer-integration-guide)
7. [Troubleshooting](#troubleshooting)

## Overview

The AllForYourHealth application supports multiple notification channels:
- In-app notifications (always enabled)
- Push notifications via Firebase Cloud Messaging (FCM)
- WhatsApp notifications via WhatsApp Business API
- Email notifications (optional)
- SMS notifications (optional)
- Caregiver notifications (for all enabled channels)

These notifications are used for:
- Medication reminders
- Appointment reminders
- Diet plan reminders
- Vitals check reminders
- System notifications

## WhatsApp Notification Setup

### Prerequisites
1. A WhatsApp Business Account
2. Access to Meta/Facebook Developer Portal
3. Approved WhatsApp Business API access

### Step 1: Create a WhatsApp Business Account
1. Visit [Facebook Business Manager](https://business.facebook.com/)
2. Create a new business account if you don't have one
3. Navigate to the WhatsApp section and set up your WhatsApp Business account

### Step 2: Register for WhatsApp Business API
1. Go to [Facebook Developer Portal](https://developers.facebook.com/)
2. Create a new app with WhatsApp Business API integration
3. Complete the verification process
4. Note your WhatsApp Business Account ID

### Step 3: Create Message Templates
You need to create and get approval for message templates for each notification type:

1. **Medication Reminder Template**
   - Name: `medication_reminder`
   - Content: "Time to take {{1}} {{2}}. Scheduled for {{3}}."
   - Variables: Medication name, dosage, time

2. **Appointment Reminder Template**
   - Name: `appointment_reminder`
   - Content: "Reminder: You have an appointment with {{1}} on {{2}} at {{3}} at {{4}}."
   - Variables: Doctor name, date, time, location

3. **Diet Plan Reminder Template**
   - Name: `diet_reminder`
   - Content: "Time for your {{1}} at {{2}}. Menu: {{3}}."
   - Variables: Meal type, time, description

4. **Vitals Check Reminder Template**
   - Name: `vitals_reminder`
   - Content: "Time to check your {{1}} at {{2}}."
   - Variables: Vitals type, time

5. **Caregiver Templates**
   - Create similar templates with prefix `caregiver_` for each type
   - Include the patient's name as the first variable

### Step 4: Get API Credentials
1. Generate an API key from the Facebook Developer Portal
2. Note your WhatsApp Phone Number ID
3. Store these securely for configuration

## Push Notification Setup

### Prerequisites
1. Firebase account
2. Firebase project created for your app

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Add Android and/or iOS apps to your project
4. Follow the setup instructions to integrate Firebase into your mobile app

### Step 2: Configure Firebase Cloud Messaging
1. In Firebase Console, navigate to Project Settings
2. Go to the Cloud Messaging tab
3. Note your Server Key and Sender ID
4. For Android, download the `google-services.json` file
5. For iOS, download the `GoogleService-Info.plist` file

### Step 3: Generate Service Account Key
1. In Firebase Console, go to Project Settings > Service Accounts
2. Generate a new private key
3. Download the JSON file containing your service account credentials
4. Store this file securely for backend configuration

## Environment Configuration

Add the following variables to your backend `.env` file:

```
# WhatsApp Business API Configuration
WHATSAPP_API_URL=https://graph.facebook.com
WHATSAPP_AUTH_TOKEN=your_whatsapp_auth_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id

# Firebase Configuration
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_DATABASE_URL=https://your-project-id.firebaseio.com
```

## User Notification Preferences

Users can manage their notification preferences through the Profile or Notifications screens:

1. **Notification Types**
   - Medication reminders
   - Appointment reminders
   - Diet reminders
   - Vitals reminders

2. **Notification Channels**
   - Push notifications (enabled by default)
   - WhatsApp notifications
   - Email notifications
   - SMS notifications
   - Caregiver notifications

3. **Setting Up Notifications as a User**
   - Navigate to Profile > Notification Settings
   - Toggle on/off different notification types and channels
   - Ensure phone number is verified for WhatsApp notifications
   - Add caregiver information to enable caregiver notifications

## Developer Integration Guide

### Sending Notifications

The backend provides a unified API for sending notifications through multiple channels:

```javascript
// Example: Sending a medication reminder
const notificationData = {
  userId: "user_id_here",
  title: "Medication Reminder",
  message: "Time to take your medication",
  type: "medication",
  actionRequired: true,
  actionUrl: "/medications",
  data: {
    medicationId: "medication_id_here",
    medicationName: "Medication Name",
    dosage: "10mg",
    time: "09:00 AM"
  }
};

// Send through API
const response = await axios.post('/api/notifications/send', notificationData);
```

### Registering Device Tokens

For push notifications, device tokens must be registered:

```javascript
// Example: Registering a device token
const tokenData = {
  token: "fcm_device_token_here"
};

// Register through API
const response = await axios.post('/api/notifications/register-device', tokenData);
```

### Handling Push Notifications in the Mobile App

1. **Android Setup**
   - Add Firebase dependencies to `build.gradle`
   - Configure Firebase Messaging Service
   - Request notification permissions

2. **iOS Setup**
   - Add Firebase dependencies to Podfile
   - Configure APNs
   - Request notification permissions

3. **React Native Implementation**
   - Use `@react-native-firebase/messaging` package
   - Set up foreground and background handlers
   - Request permissions and register token

## Troubleshooting

### WhatsApp Notifications
- Ensure the user's phone number is in international format (e.g., +919876543210)
- Verify WhatsApp templates are approved
- Check WhatsApp Business API rate limits
- Verify the user has an active WhatsApp account

### Push Notifications
- Ensure device tokens are correctly registered
- Check Firebase configuration in both frontend and backend
- Verify notification permissions are granted on the device
- Test with Firebase Console notification testing tool

### General Issues
- Check server logs for error messages
- Verify environment variables are correctly set
- Ensure user notification preferences are enabled
- Check network connectivity
