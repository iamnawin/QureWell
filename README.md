# AllForYourHealth

A smart, personalized digital health companion application that helps users manage their health through medication tracking, diet planning, vitals monitoring, and AI-powered assistance.

![AllForYourHealth App](/assets/app_screenshot.png)

## Features

### 1. User Authentication
- Secure login/registration system
- Profile management
- Emergency contact information

### 2. AI Caretaker
- Voice-enabled AI assistant
- Audio recording capability
- Personalized health recommendations
- Appointment booking assistance

### 3. Medication Management
- Add, edit, and track medications
- Customizable medication reminders
- Medication history and adherence tracking
- Detailed medication information

### 4. Diet Plan
- Create and manage personalized diet plans
- "How-to-prepare" guidance
- Nutritional information tracking
- Save and load diet plan templates

### 5. Vitals Monitoring
- Record various vital signs (blood pressure, heart rate, etc.)
- Historical data tracking
- Visual charts and trends
- Abnormal reading alerts

### 6. Progress Tracking
- Weight and exercise tracking
- Progress visualization
- Goal setting and achievement tracking
- Historical data analysis

### 7. Notifications
- Customizable notification settings
- Medication and appointment reminders
- Health alerts
- Multi-modal notifications (in-app, voice)

### 8. Reports
- Health summary reports
- Exportable data (PDF, Excel)
- Customizable reporting periods
- Comprehensive health insights

### 9. Voice and Audio Features
- Speech-to-text conversion
- Text-to-speech functionality
- Voice command recognition
- Audio health notes recording

## Technology Stack

### Frontend
- React Native
- Redux for state management
- React Navigation
- React Native Paper UI components
- Expo for development and building

### Backend
- Node.js with Express
- MongoDB for database
- Firebase Authentication
- Firebase Storage for files
- Google Cloud Speech-to-Text and Text-to-Speech APIs

## Installation and Setup

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher) or yarn (v1.22.0 or higher)
- MongoDB (v4.4 or higher)
- Firebase account
- Google Cloud Platform account
- Android Studio (for Android deployment)
- Xcode (for iOS deployment, Mac only)

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/iamnawin/allforyourhealth.git
   cd allforyourhealth/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file with the following variables:
   ```
   API_URL=http://your-backend-url:5000/api
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

### Backend Setup

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

3. Create a `.env` file with the following variables:
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

## Deployment

### Frontend Deployment

#### Android
1. Build the Android APK:
   ```bash
   expo build:android -t apk
   ```

2. For an Android App Bundle (recommended for Play Store):
   ```bash
   expo build:android -t app-bundle
   ```

#### iOS (Mac only)
1. Build the iOS IPA:
   ```bash
   expo build:ios -t archive
   ```

### Backend Deployment

The backend can be deployed to various cloud providers:

#### Heroku
```bash
heroku create allforyourhealth-api
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret_key_here
# Set all other environment variables
git push heroku master
```

#### AWS
```bash
eb init allforyourhealth-api
eb create production
eb setenv JWT_SECRET=your_jwt_secret_key_here MONGODB_URI=your_mongodb_connection_string
# Set all other environment variables
eb deploy
```

## Documentation

For more detailed information, please refer to the following documentation:

- [Deployment Guide](/docs/deployment_guide.md)
- [API Documentation](/docs/api_documentation.md)
- [User Manual](/docs/user_manual.md)

## Market Impact

AllForYourHealth addresses critical healthcare challenges in India:

- **Appointment Scheduling**: Reduces wait times (currently 20-40 minutes in hospitals, often 2-4 hours total)
- **Missed Appointments**: Tackles the 50-60% no-show rate for follow-up appointments
- **Medication Adherence**: Improves adherence rates (currently 18.7-74% non-adherence in India)
- **Diet Management**: Supports nutritional guidance for better health outcomes

For more details, see the [Market Alignment & Impact Analysis](/docs/market_alignment_impact.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Firebase for authentication and storage
- Google Cloud for voice services
- All open-source libraries used in this project
