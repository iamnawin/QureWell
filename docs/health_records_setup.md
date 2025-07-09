# Health Records Management Setup and Usage Guide

This document provides comprehensive instructions for setting up and using the Health Records Management feature in the AllForYourHealth application.

## Table of Contents
1. [Overview](#overview)
2. [Backend Setup](#backend-setup)
3. [Frontend Integration](#frontend-integration)
4. [Security Considerations](#security-considerations)
5. [User Guide](#user-guide)
6. [Developer Integration Guide](#developer-integration-guide)
7. [Troubleshooting](#troubleshooting)

## Overview

The Health Records Management feature allows users to:
- Upload and store medical documents (lab results, prescriptions, imaging, etc.)
- Categorize and tag documents for easy retrieval
- Search through documents using metadata and content
- Share documents with caregivers or healthcare providers
- View document history and track changes

Supported document types include:
- Images (JPEG, PNG, GIF)
- PDFs
- Text documents (DOC, DOCX, TXT)
- Spreadsheets (XLS, XLSX)

## Backend Setup

### Prerequisites
1. Storage configuration for document files
2. MongoDB database for document metadata
3. Node.js environment with Express

### Installation Steps

1. **Configure Storage**
   - Create a directory for document storage:
   ```bash
   mkdir -p /path/to/backend/uploads/health-records
   ```
   - Ensure proper permissions:
   ```bash
   chmod 755 /path/to/backend/uploads/health-records
   ```

2. **Install Required Dependencies**
   ```bash
   npm install multer uuid fs-extra
   ```

3. **Environment Variables**
   Add the following to your `.env` file:
   ```
   HEALTH_RECORDS_STORAGE_PATH=/path/to/backend/uploads/health-records
   MAX_FILE_SIZE=10485760  # 10MB in bytes
   ```

4. **Register Routes**
   In your `server.js` or main application file:
   ```javascript
   const healthRecordRoutes = require('./routes/healthRecordRoutes');
   app.use('/api/health-records', healthRecordRoutes);
   ```

5. **Create Uploads Directory**
   Ensure the application creates the uploads directory if it doesn't exist:
   ```javascript
   const fs = require('fs-extra');
   const path = require('path');
   
   const uploadDir = path.join(__dirname, 'uploads/health-records');
   fs.ensureDirSync(uploadDir);
   ```

## Frontend Integration

### Required Components

1. **Redux Integration**
   - Import the health record slice in your store configuration:
   ```typescript
   import healthRecordReducer from './slices/healthRecordSlice';
   
   export const store = configureStore({
     reducer: {
       // other reducers
       healthRecords: healthRecordReducer,
     },
   });
   ```

2. **Navigation Setup**
   - Add health records screens to your navigation:
   ```typescript
   import HealthRecordsScreen from '../screens/HealthRecordsScreen';
   import AddHealthRecordScreen from '../screens/AddHealthRecordScreen';
   import HealthRecordDetailScreen from '../screens/HealthRecordDetailScreen';
   
   const Stack = createStackNavigator();
   
   function AppNavigator() {
     return (
       <Stack.Navigator>
         {/* Other screens */}
         <Stack.Screen name="HealthRecords" component={HealthRecordsScreen} />
         <Stack.Screen name="AddHealthRecord" component={AddHealthRecordScreen} />
         <Stack.Screen name="HealthRecordDetail" component={HealthRecordDetailScreen} />
       </Stack.Navigator>
     );
   }
   ```

3. **Document Picker Setup**
   - Install required packages:
   ```bash
   npm install expo-document-picker expo-file-system
   ```
   - For non-Expo projects:
   ```bash
   npm install react-native-document-picker react-native-fs
   ```

## Security Considerations

1. **Document Encryption**
   - All sensitive medical documents should be encrypted at rest
   - Implement AES-256 encryption for document storage
   - Store encryption keys securely using environment variables

2. **Access Control**
   - Implement strict user-based access control
   - Use middleware to verify document ownership before access
   - Maintain audit logs for all document access events

3. **Secure Transmission**
   - Use HTTPS for all API communications
   - Implement token-based authentication for API requests
   - Set appropriate CORS policies

4. **Document Sharing**
   - Implement granular permissions for shared documents
   - Allow time-limited access when sharing with providers
   - Notify users when their documents are accessed by others

## User Guide

### Managing Health Records

1. **Viewing Records**
   - Navigate to the Health Records tab
   - Browse records by category using the filter chips
   - Search for specific records using the search bar
   - View shared records by selecting the "Shared with me" filter

2. **Adding a New Record**
   - Tap the "+" button on the Health Records screen
   - Fill in the required information:
     - Title (required)
     - Record type (required)
     - Document file (required)
   - Add optional information:
     - Description
     - Doctor's name
     - Hospital/clinic
     - Record date
     - Tags for easier searching

3. **Viewing Record Details**
   - Tap on any record to view its details
   - View the document by tapping "Open Document"
   - See all metadata and tags associated with the record

4. **Editing Records**
   - From the record details screen, tap "Edit"
   - Update any information as needed
   - Save changes to update the record

5. **Sharing Records**
   - From the record details screen, tap "Share"
   - Enter the email of the user to share with
   - Optionally set an expiration date for access
   - The recipient will receive a notification

6. **Deleting Records**
   - From the record details screen, tap "Delete"
   - Confirm deletion when prompted
   - Note: Deleted records cannot be recovered

### Searching and Filtering

1. **Basic Search**
   - Use the search bar to find records by title, description, doctor, hospital, or tags
   - Results update in real-time as you type

2. **Filtering by Type**
   - Use the filter chips to view records of a specific type
   - Select "All" to view all record types

3. **Advanced Search**
   - Combine search terms with filters for more specific results
   - Use tags to create your own categorization system

## Developer Integration Guide

### API Endpoints

1. **Get All Health Records**
   ```
   GET /api/health-records
   ```

2. **Get Health Records by Type**
   ```
   GET /api/health-records/type/:recordType
   ```

3. **Get a Single Health Record**
   ```
   GET /api/health-records/:id
   ```

4. **Upload a Health Record**
   ```
   POST /api/health-records
   Content-Type: multipart/form-data
   ```
   Body:
   - title (string, required)
   - description (string)
   - recordType (string, required)
   - file (file, required)
   - tags (string, comma-separated)
   - doctor (string)
   - hospital (string)
   - date (ISO date string)

5. **Update a Health Record**
   ```
   PUT /api/health-records/:id
   ```

6. **Delete a Health Record**
   ```
   DELETE /api/health-records/:id
   ```

7. **Share a Health Record**
   ```
   POST /api/health-records/:id/share
   ```
   Body:
   - email (string, required)

8. **Unshare a Health Record**
   ```
   POST /api/health-records/:id/unshare
   ```
   Body:
   - userId (string, required)

9. **Search Health Records**
   ```
   GET /api/health-records/search?query=searchterm
   ```

### Example: Uploading a Health Record

```javascript
const uploadHealthRecord = async (recordData, file) => {
  const formData = new FormData();
  
  // Add record data
  formData.append('title', recordData.title);
  formData.append('description', recordData.description || '');
  formData.append('recordType', recordData.recordType);
  formData.append('tags', recordData.tags.join(','));
  formData.append('doctor', recordData.doctor || '');
  formData.append('hospital', recordData.hospital || '');
  
  if (recordData.date) {
    formData.append('date', recordData.date.toISOString());
  }
  
  // Add file
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type
  });
  
  try {
    const response = await axios.post(`${API_URL}/api/health-records`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};
```

## Troubleshooting

### Common Issues

1. **File Upload Failures**
   - Check file size (limit: 10MB)
   - Verify file type is supported
   - Ensure storage directory has proper permissions

2. **Search Not Working**
   - Verify MongoDB text indexes are properly set up
   - Check if search terms match any metadata fields
   - Try using more general search terms

3. **Document Viewing Issues**
   - Ensure the device has an app capable of viewing the file type
   - Check if the file was corrupted during upload
   - Verify the file path is correctly constructed

4. **Sharing Problems**
   - Confirm the recipient email is registered in the system
   - Check network connectivity
   - Verify the sender has proper permissions to share

### Support

For additional support with the Health Records Management feature, please contact the development team at support@allforyourhealth.com.
