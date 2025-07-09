# AllForYourHealth Application Deployment Guide

This guide provides comprehensive instructions for deploying the AllForYourHealth mobile application, including both frontend and backend components.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Frontend Deployment](#frontend-deployment)
- [Backend Deployment](#backend-deployment)
- [Environment Configuration](#environment-configuration)
- [Firebase Setup](#firebase-setup)
- [Google Cloud APIs Setup](#google-cloud-apis-setup)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying the application, ensure you have the following:

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher) or yarn (v1.22.0 or higher)
- MongoDB (v4.4 or higher)
- Firebase account
- Google Cloud Platform account
- Android Studio (for Android deployment)
- Xcode (for iOS deployment, Mac only)
- Expo CLI (for React Native development)

## Frontend Deployment

### Development Environment Setup

1. Install Expo CLI globally:
   ```bash
   npm install -g expo-cli
   ```

2. Navigate to the frontend directory:
   ```bash
   cd allforyourhealth/frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Create a `.env` file in the frontend directory with the following variables:
   ```
   API_URL=http://your-backend-url:5000/api
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   ```

5. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

### Building for Android

1. Ensure you have Android Studio installed and properly configured.

2. Build the Android APK:
   ```bash
   expo build:android -t apk
   ```

   For an Android App Bundle (recommended for Play Store):
   ```bash
   expo build:android -t app-bundle
   ```

3. Follow the prompts to complete the build process. Expo will provide a URL to download the built APK/AAB.

### Building for iOS (Mac only)

1. Ensure you have Xcode installed and properly configured.

2. Build the iOS IPA:
   ```bash
   expo build:ios -t archive
   ```

   For a simulator build:
   ```bash
   expo build:ios -t simulator
   ```

3. Follow the prompts to complete the build process. Expo will provide a URL to download the built IPA.

### Publishing to App Stores

#### Google Play Store

1. Create a developer account on the Google Play Console.
2. Create a new application and fill in all required information.
3. Upload the AAB file generated from the build process.
4. Complete the store listing, content rating, and pricing & distribution sections.
5. Submit the app for review.

#### Apple App Store (Mac only)

1. Create a developer account on the Apple Developer portal.
2. Create a new application in App Store Connect.
3. Upload the IPA file using Transporter or Xcode.
4. Complete the app information, pricing, and availability sections.
5. Submit the app for review.

## Backend Deployment

### Local Deployment

1. Navigate to the backend directory:
   ```bash
   cd allforyourhealth/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the backend directory with the following variables (adjust as needed):
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/allforyourhealth
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d

   # Firebase Configuration
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY_ID=your_private_key_id
   FIREBASE_PRIVATE_KEY=your_private_key
   FIREBASE_CLIENT_EMAIL=your_client_email
   FIREBASE_CLIENT_ID=your_client_id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_X509_CERT_URL=your_client_cert_url

   # Google Cloud APIs
   GOOGLE_APPLICATION_CREDENTIALS=path_to_your_google_credentials.json
   ```

4. Start the server:
   ```bash
   npm start
   # or
   yarn start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Cloud Deployment (Heroku)

1. Create a Heroku account and install the Heroku CLI.

2. Log in to Heroku:
   ```bash
   heroku login
   ```

3. Create a new Heroku app:
   ```bash
   heroku create allforyourhealth-api
   ```

4. Add MongoDB add-on or configure an external MongoDB connection:
   ```bash
   heroku addons:create mongodb:sandbox
   ```

   Or set the `MONGODB_URI` environment variable to your external MongoDB connection string:
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   ```

5. Set other environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_jwt_secret_key_here
   heroku config:set JWT_EXPIRES_IN=7d
   # Set all Firebase and Google Cloud variables
   ```

6. Deploy to Heroku:
   ```bash
   git init
   git add .
   git commit -m "Initial deployment"
   git push heroku master
   ```

### Cloud Deployment (AWS)

1. Create an AWS account and install the AWS CLI.

2. Configure AWS credentials:
   ```bash
   aws configure
   ```

3. Create an Elastic Beanstalk application:
   ```bash
   eb init allforyourhealth-api
   ```

4. Create an environment:
   ```bash
   eb create production
   ```

5. Set environment variables:
   ```bash
   eb setenv JWT_SECRET=your_jwt_secret_key_here JWT_EXPIRES_IN=7d MONGODB_URI=your_mongodb_connection_string
   # Set all Firebase and Google Cloud variables
   ```

6. Deploy the application:
   ```bash
   eb deploy
   ```

## Environment Configuration

### Frontend Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```
API_URL=http://your-backend-url:5000/api
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id
```

### Backend Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/allforyourhealth
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Firebase Configuration
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_client_cert_url

# Google Cloud APIs
GOOGLE_APPLICATION_CREDENTIALS=path_to_your_google_credentials.json
```

## Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).

2. Enable Authentication and select Email/Password as a sign-in method.

3. Create a Firestore database.

4. Set up Firebase Storage for audio files.

5. Generate a Firebase configuration for the web app:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app icon (</>) to create a new web app
   - Register the app with a nickname
   - Copy the configuration object for use in the frontend

6. Generate a Firebase Admin SDK service account key:
   - Go to Project Settings > Service accounts
   - Click "Generate new private key"
   - Save the JSON file securely
   - Use the values from this file to set the backend environment variables

## Google Cloud APIs Setup

1. Create a Google Cloud Platform project or use the one created by Firebase.

2. Enable the following APIs:
   - Speech-to-Text API
   - Text-to-Speech API

3. Create a service account with appropriate permissions:
   - Go to IAM & Admin > Service accounts
   - Create a new service account
   - Grant it the necessary roles (Speech-to-Text User, Text-to-Speech User)
   - Create a key (JSON format)
   - Save the JSON file securely

4. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable to the path of this JSON file.

## Troubleshooting

### Frontend Issues

1. **Expo build fails**:
   - Ensure all dependencies are correctly installed
   - Check that the Expo CLI is up to date
   - Verify that your Firebase configuration is correct

2. **API connection issues**:
   - Verify that the `API_URL` environment variable is correctly set
   - Ensure the backend server is running and accessible
   - Check for CORS issues in the backend configuration

### Backend Issues

1. **MongoDB connection fails**:
   - Verify that MongoDB is running
   - Check the connection string in the `MONGODB_URI` environment variable
   - Ensure network access is properly configured

2. **Firebase authentication issues**:
   - Verify that all Firebase environment variables are correctly set
   - Check that the service account has the necessary permissions
   - Ensure the Firebase project is properly configured

3. **Google Cloud API issues**:
   - Verify that the APIs are enabled in the Google Cloud Console
   - Check that the service account has the necessary permissions
   - Ensure the `GOOGLE_APPLICATION_CREDENTIALS` environment variable is correctly set

For additional support, please refer to the documentation for each service or contact the development team.
