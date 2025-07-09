# AllForYourHealth API Documentation

This document provides comprehensive documentation for the AllForYourHealth API endpoints.

## Base URL

All API endpoints are relative to the base URL:

```
https://your-api-domain.com/api
```

For local development:

```
http://localhost:5000/api
```

## Authentication

Most API endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

#### Register a new user

```
POST /auth/register
```

Request body:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "userId": "user_id_here",
  "message": "User registered successfully"
}
```

#### Login user

```
POST /auth/login
```

Request body:
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "userId": "user_id_here",
  "message": "Login successful"
}
```

#### Reset password

```
POST /auth/reset-password
```

Request body:
```json
{
  "email": "john.doe@example.com"
}
```

Response:
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

#### Get current user

```
GET /auth/me
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "user_id_here",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "photoUrl": "https://example.com/photo.jpg",
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "+1 (555) 987-6543",
      "relationship": "Spouse"
    },
    "createdAt": "2025-05-21T14:00:00.000Z",
    "updatedAt": "2025-05-21T14:00:00.000Z"
  }
}
```

### User Endpoints

#### Get user profile

```
GET /users/profile
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "user_id_here",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "photoUrl": "https://example.com/photo.jpg",
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "+1 (555) 987-6543",
      "relationship": "Spouse"
    },
    "createdAt": "2025-05-21T14:00:00.000Z",
    "updatedAt": "2025-05-21T14:00:00.000Z"
  }
}
```

#### Update user profile

```
PUT /users/profile
```

Request body:
```json
{
  "name": "John Smith",
  "photoUrl": "https://example.com/new-photo.jpg",
  "emergencyContact": {
    "name": "Jane Smith",
    "phone": "+1 (555) 987-6543",
    "relationship": "Spouse"
  }
}
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "user_id_here",
    "name": "John Smith",
    "email": "john.doe@example.com",
    "photoUrl": "https://example.com/new-photo.jpg",
    "emergencyContact": {
      "name": "Jane Smith",
      "phone": "+1 (555) 987-6543",
      "relationship": "Spouse"
    },
    "createdAt": "2025-05-21T14:00:00.000Z",
    "updatedAt": "2025-05-21T14:30:00.000Z"
  },
  "message": "Profile updated successfully"
}
```

#### Delete user account

```
DELETE /users
```

Response:
```json
{
  "success": true,
  "message": "User account deleted successfully"
}
```

### Medication Endpoints

#### Get all medications

```
GET /medications
```

Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "medication_id_1",
      "user": "user_id_here",
      "name": "Lisinopril",
      "dosage": "10mg",
      "frequency": "daily",
      "timeOfDay": ["morning"],
      "startDate": "2025-05-01T00:00:00.000Z",
      "endDate": null,
      "notes": "Take with food",
      "reminderEnabled": true,
      "createdAt": "2025-05-21T14:00:00.000Z",
      "updatedAt": "2025-05-21T14:00:00.000Z"
    },
    {
      "_id": "medication_id_2",
      "user": "user_id_here",
      "name": "Metformin",
      "dosage": "500mg",
      "frequency": "twice daily",
      "timeOfDay": ["morning", "evening"],
      "startDate": "2025-05-01T00:00:00.000Z",
      "endDate": null,
      "notes": "Take with meals",
      "reminderEnabled": true,
      "createdAt": "2025-05-21T14:00:00.000Z",
      "updatedAt": "2025-05-21T14:00:00.000Z"
    }
  ]
}
```

#### Get a single medication

```
GET /medications/:id
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "medication_id_1",
    "user": "user_id_here",
    "name": "Lisinopril",
    "dosage": "10mg",
    "frequency": "daily",
    "timeOfDay": ["morning"],
    "startDate": "2025-05-01T00:00:00.000Z",
    "endDate": null,
    "notes": "Take with food",
    "reminderEnabled": true,
    "createdAt": "2025-05-21T14:00:00.000Z",
    "updatedAt": "2025-05-21T14:00:00.000Z"
  }
}
```

#### Create a new medication

```
POST /medications
```

Request body:
```json
{
  "name": "Aspirin",
  "dosage": "81mg",
  "frequency": "daily",
  "timeOfDay": ["morning"],
  "startDate": "2025-05-21T00:00:00.000Z",
  "notes": "Take with water",
  "reminderEnabled": true
}
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "medication_id_3",
    "user": "user_id_here",
    "name": "Aspirin",
    "dosage": "81mg",
    "frequency": "daily",
    "timeOfDay": ["morning"],
    "startDate": "2025-05-21T00:00:00.000Z",
    "endDate": null,
    "notes": "Take with water",
    "reminderEnabled": true,
    "createdAt": "2025-05-21T14:30:00.000Z",
    "updatedAt": "2025-05-21T14:30:00.000Z"
  },
  "message": "Medication created successfully"
}
```

#### Update a medication

```
PUT /medications/:id
```

Request body:
```json
{
  "dosage": "162mg",
  "notes": "Take with food and water"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "medication_id_3",
    "user": "user_id_here",
    "name": "Aspirin",
    "dosage": "162mg",
    "frequency": "daily",
    "timeOfDay": ["morning"],
    "startDate": "2025-05-21T00:00:00.000Z",
    "endDate": null,
    "notes": "Take with food and water",
    "reminderEnabled": true,
    "createdAt": "2025-05-21T14:30:00.000Z",
    "updatedAt": "2025-05-21T14:45:00.000Z"
  },
  "message": "Medication updated successfully"
}
```

#### Delete a medication

```
DELETE /medications/:id
```

Response:
```json
{
  "success": true,
  "message": "Medication deleted successfully"
}
```

### Diet Plan Endpoints

#### Get all diet plans

```
GET /diet-plans
```

Response:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "diet_plan_id_1",
      "user": "user_id_here",
      "name": "Low Carb Diet",
      "description": "A diet plan focused on reducing carbohydrate intake",
      "meals": [
        {
          "name": "Breakfast",
          "time": "8:00 AM",
          "foods": [
            {
              "name": "Scrambled eggs",
              "quantity": "2 eggs",
              "calories": 180
            },
            {
              "name": "Avocado",
              "quantity": "1/2",
              "calories": 120
            }
          ]
        },
        {
          "name": "Lunch",
          "time": "12:00 PM",
          "foods": [
            {
              "name": "Grilled chicken",
              "quantity": "6 oz",
              "calories": 280
            },
            {
              "name": "Mixed greens",
              "quantity": "2 cups",
              "calories": 50
            }
          ]
        }
      ],
      "totalCalories": 1500,
      "restrictions": ["gluten", "sugar"],
      "notes": "Drink plenty of water",
      "createdAt": "2025-05-21T14:00:00.000Z",
      "updatedAt": "2025-05-21T14:00:00.000Z"
    }
  ]
}
```

Similar patterns apply for other diet plan endpoints (GET, POST, PUT, DELETE) following the same structure as the medication endpoints.

### Vitals Endpoints

#### Get all vital readings

```
GET /vitals
```

Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "vital_id_1",
      "user": "user_id_here",
      "type": "blood_pressure",
      "value": {
        "systolic": 120,
        "diastolic": 80
      },
      "unit": "mmHg",
      "timestamp": "2025-05-21T08:00:00.000Z",
      "notes": "Morning reading",
      "createdAt": "2025-05-21T08:05:00.000Z"
    },
    {
      "_id": "vital_id_2",
      "user": "user_id_here",
      "type": "weight",
      "value": 70,
      "unit": "kg",
      "timestamp": "2025-05-21T08:10:00.000Z",
      "notes": "Before breakfast",
      "createdAt": "2025-05-21T08:15:00.000Z"
    }
  ]
}
```

#### Get vital readings by type

```
GET /vitals/type/:type
```

Response:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "vital_id_1",
      "user": "user_id_here",
      "type": "blood_pressure",
      "value": {
        "systolic": 120,
        "diastolic": 80
      },
      "unit": "mmHg",
      "timestamp": "2025-05-21T08:00:00.000Z",
      "notes": "Morning reading",
      "createdAt": "2025-05-21T08:05:00.000Z"
    }
  ]
}
```

Similar patterns apply for other vitals endpoints (GET, POST, PUT, DELETE) following the same structure as the medication endpoints.

### Progress Endpoints

#### Get all progress entries

```
GET /progress
```

Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "progress_id_1",
      "user": "user_id_here",
      "type": "weight",
      "value": 69,
      "unit": "kg",
      "timestamp": "2025-05-21T08:00:00.000Z",
      "notes": "Weight loss progress",
      "createdAt": "2025-05-21T08:05:00.000Z"
    },
    {
      "_id": "progress_id_2",
      "user": "user_id_here",
      "type": "exercise",
      "value": {
        "activity": "running",
        "duration": 30,
        "distance": 5
      },
      "unit": "minutes/km",
      "timestamp": "2025-05-21T17:00:00.000Z",
      "notes": "Evening run",
      "createdAt": "2025-05-21T17:30:00.000Z"
    }
  ]
}
```

Similar patterns apply for other progress endpoints (GET, POST, PUT, DELETE) following the same structure as the medication endpoints.

### Notification Endpoints

#### Get all notifications

```
GET /notifications
```

Response:
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "notification_id_1",
      "user": "user_id_here",
      "title": "Medication Reminder",
      "message": "Time to take Lisinopril",
      "type": "medication",
      "timestamp": "2025-05-21T08:00:00.000Z",
      "read": false,
      "actionRequired": true,
      "actionUrl": "/medications/medication_id_1",
      "createdAt": "2025-05-21T08:00:00.000Z"
    },
    {
      "_id": "notification_id_2",
      "user": "user_id_here",
      "title": "Appointment Reminder",
      "message": "Doctor appointment tomorrow at 2:30 PM",
      "type": "appointment",
      "timestamp": "2025-05-21T10:00:00.000Z",
      "read": true,
      "actionRequired": false,
      "createdAt": "2025-05-21T10:00:00.000Z"
    }
  ]
}
```

#### Get unread notifications

```
GET /notifications/unread
```

Response:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "notification_id_1",
      "user": "user_id_here",
      "title": "Medication Reminder",
      "message": "Time to take Lisinopril",
      "type": "medication",
      "timestamp": "2025-05-21T08:00:00.000Z",
      "read": false,
      "actionRequired": true,
      "actionUrl": "/medications/medication_id_1",
      "createdAt": "2025-05-21T08:00:00.000Z"
    }
  ]
}
```

Similar patterns apply for other notification endpoints (GET, POST, PUT, DELETE) following the same structure as the medication endpoints.

### Voice API Endpoints

#### Get all audio recordings

```
GET /voice/recordings
```

Response:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "recording_id_1",
      "user": "user_id_here",
      "title": "Health Note",
      "description": "Notes about today's symptoms",
      "fileUrl": "https://storage.googleapis.com/bucket-name/audio/user_id/timestamp-filename.mp3",
      "duration": 60,
      "transcription": "Today I noticed my blood pressure was a bit high...",
      "category": "health_note",
      "createdAt": "2025-05-21T14:00:00.000Z"
    }
  ]
}
```

#### Upload and create a new audio recording

```
POST /voice/recordings
```

Request:
- Content-Type: multipart/form-data
- Form fields:
  - title: "Health Note"
  - description: "Notes about today's symptoms"
  - category: "health_note"
- File: audio file (mp3, wav, etc.)

Response:
```json
{
  "success": true,
  "data": {
    "_id": "recording_id_2",
    "user": "user_id_here",
    "title": "Health Note",
    "description": "Notes about today's symptoms",
    "fileUrl": "https://storage.googleapis.com/bucket-name/audio/user_id/timestamp-filename.mp3",
    "duration": 45,
    "category": "health_note",
    "createdAt": "2025-05-21T15:00:00.000Z"
  },
  "message": "Audio recording created successfully"
}
```

#### Speech to text conversion

```
POST /voice/speech-to-text
```

Request:
- Content-Type: multipart/form-data
- File: audio file (mp3, wav, etc.)

Response:
```json
{
  "success": true,
  "data": {
    "transcription": "Today I noticed my blood pressure was a bit high after lunch. I'll monitor it again this evening."
  }
}
```

#### Text to speech conversion

```
POST /voice/text-to-speech
```

Request body:
```json
{
  "text": "Remember to take your medication at 8:00 PM tonight.",
  "voice": "en-US-Standard-B",
  "pitch": 0,
  "speakingRate": 1
}
```

Response:
```json
{
  "success": true,
  "data": {
    "audioUrl": "https://storage.googleapis.com/bucket-name/tts/user_id/timestamp.mp3"
  }
}
```

## Error Responses

All API endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Detailed error information (only in development mode)"
}
```

Common HTTP status codes:
- 400: Bad Request (invalid input)
- 401: Unauthorized (missing or invalid authentication)
- 403: Forbidden (authenticated but not authorized)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error (server-side issue)

## Rate Limiting

The API implements rate limiting to prevent abuse. Limits are as follows:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

When rate limited, the API will respond with a 429 Too Many Requests status code.
