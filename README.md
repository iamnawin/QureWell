# QureWell

A smart, personalized digital health companion application that helps users manage their health through medication tracking, diet planning, vitals monitoring, and AI-powered assistance.

![QureWell App](/assets/app_screenshot.png)

## Features

### 1. User Authentication
- Secure login/registration system
- Profile management
- Emergency contact information

### 2. AI Caretaker
- Voice-enabled AI assistant (future feature)
- Personalized health recommendations (planned)

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

### Mobile App
- React Native (v0.80.1)
- React (v19.1.0)
- TypeScript
- Android and iOS support
- Custom QureWell UI components

### Backend
- Node.js with Express
- MongoDB for database
- RESTful API architecture

### Frontend (Web)
- React.js
- Modern responsive design
- Component-based architecture

### Additional Components
- Documentation and guides
- Project configuration files

## Installation and Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v8.0.0 or higher) or yarn (v1.22.0 or higher)
- Android Studio (for Android deployment)
- Xcode (for iOS deployment, Mac only)
- Git

### Mobile App Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/iamnawin/QureWell.git
   cd QureWell/final_delivery/mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Metro bundler:
   ```bash
   npm start
   # or
   npx react-native start
   ```

4. Run on Android:
   ```bash
   npx react-native run-android
   ```

5. Run on iOS (Mac only):
   ```bash
   npx react-native run-ios
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd QureWell/final_delivery/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/qurewell
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

4. Start the server:
   ```bash
   npm start
   # or
   npm run dev
   ```

### Frontend (Web) Setup

1. Navigate to the frontend directory:
   ```bash
   cd QureWell/final_delivery/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Deployment

### Mobile App Deployment

#### Android
1. Build the Android APK:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

2. For an Android App Bundle (recommended for Play Store):
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

#### iOS (Mac only)
1. Build the iOS app:
   ```bash
   cd ios
   xcodebuild -workspace QureWell.xcworkspace -scheme QureWell archive
   ```

### Backend Deployment

The backend can be deployed to various cloud providers:

#### Heroku
```bash
heroku create qurewell-api
heroku config:set MONGODB_URI=your_mongodb_connection_string
heroku config:set JWT_SECRET=your_jwt_secret_key_here
git push heroku main
```

#### AWS
```bash
eb init qurewell-api
eb create production
eb setenv JWT_SECRET=your_jwt_secret_key_here MONGODB_URI=your_mongodb_connection_string
eb deploy
```

## Documentation

For more detailed information, please refer to the following documentation:

- [Deployment Guide](/docs/deployment_guide.md)
- [API Documentation](/docs/api_documentation.md)
- [User Manual](/docs/user_manual.md)

## Market Impact

QureWell addresses critical healthcare challenges globally:

- **Digital Health Companion**: Provides 24/7 access to health management tools
- **Medication Adherence**: Improves medication compliance through smart reminders and tracking
- **Preventive Care**: Encourages regular health monitoring and vital sign tracking
- **AI-Powered Assistance**: Offers personalized health recommendations and support
- **Comprehensive Health Management**: Integrates multiple health aspects in one platform

## Project Structure

```
QureWell/
├── final_delivery/
│   ├── mobile/          # React Native mobile app
│   ├── backend/         # Node.js backend server
│   └── frontend/        # React.js web application
├── docs/               # Documentation files
└── README.md          # This file
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React Native community for the mobile framework
- Node.js and Express.js for backend development
- All open-source libraries used in this project
- Healthcare professionals who provided insights for feature development
