import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { 
  uploadRecordStart,
  uploadRecordProgress,
  uploadRecordSuccess,
  uploadRecordFailure,
  resetUploadProgress
} from '../redux/slices/healthRecordSlice';
import { 
  TextInput, 
  Button, 
  Chip, 
  HelperText, 
  ProgressBar,
  RadioButton,
  Divider
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { API_URL } from '../config/constants';
import { formatDate } from '../utils/dateUtils';
import { getFileTypeFromMime } from '../utils/fileUtils';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  recordType: Yup.string().required('Record type is required'),
  file: Yup.object().required('File is required')
});

const AddHealthRecordScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, error, uploadProgress } = useSelector((state: RootState) => state.healthRecords);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');

  useEffect(() => {
    // Reset upload progress when component mounts
    dispatch(resetUploadProgress());
  }, []);

  const recordTypes = [
    { value: 'lab_result', label: 'Lab Result' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'imaging', label: 'Imaging' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'discharge_summary', label: 'Discharge Summary' },
    { value: 'doctor_note', label: 'Doctor Note' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'other', label: 'Other' }
  ];

  const pickDocument = async (setFieldValue) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        copyToCacheDirectory: true
      });
      
      if (result.type === 'success') {
        // Get file info
        const fileInfo = await FileSystem.getInfoAsync(result.uri);
        
        // Check file size (limit to 10MB)
        if (fileInfo.size > 10 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select a file smaller than 10MB');
          return;
        }
        
        setFieldValue('file', {
          uri: result.uri,
          name: result.name,
          type: getFileTypeFromMime(result.mimeType),
          size: fileInfo.size
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpload = async (values) => {
    dispatch(uploadRecordStart());
    
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description || '');
    formData.append('recordType', values.recordType);
    formData.append('tags', tags.join(','));
    formData.append('doctor', values.doctor || '');
    formData.append('hospital', values.hospital || '');
    
    if (values.date) {
      formData.append('date', values.date.toISOString());
    }
    
    // Append file
    formData.append('file', {
      uri: values.file.uri,
      name: values.file.name,
      type: values.file.type
    });
    
    try {
      const response = await axios.post(`${API_URL}/api/health-records`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          dispatch(uploadRecordProgress(percentCompleted));
        }
      });
      
      dispatch(uploadRecordSuccess(response.data.data));
      Alert.alert('Success', 'Health record uploaded successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error uploading health record:', error);
      dispatch(uploadRecordFailure(error.response?.data?.message || 'Failed to upload health record'));
      Alert.alert('Error', 'Failed to upload health record');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={{
          title: '',
          description: '',
          recordType: '',
          file: null,
          doctor: '',
          hospital: '',
          date: new Date()
        }}
        validationSchema={validationSchema}
        onSubmit={handleUpload}
      >
        {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
          <View style={styles.formContainer}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <TextInput
              label="Title *"
              value={values.title}
              onChangeText={handleChange('title')}
              style={styles.input}
              error={touched.title && !!errors.title}
            />
            {touched.title && errors.title && (
              <HelperText type="error">{errors.title}</HelperText>
            )}
            
            <TextInput
              label="Description"
              value={values.description}
              onChangeText={handleChange('description')}
              style={styles.input}
              multiline
              numberOfLines={3}
            />
            
            <Text style={styles.fieldLabel}>Record Type *</Text>
            <RadioButton.Group
              onValueChange={value => setFieldValue('recordType', value)}
              value={values.recordType}
            >
              <View style={styles.radioGroup}>
                {recordTypes.map((type) => (
                  <View key={type.value} style={styles.radioItem}>
                    <RadioButton value={type.value} />
                    <Text>{type.label}</Text>
                  </View>
                ))}
              </View>
            </RadioButton.Group>
            {touched.recordType && errors.recordType && (
              <HelperText type="error">{errors.recordType}</HelperText>
            )}
            
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Document</Text>
            
            <Button
              mode="outlined"
              onPress={() => pickDocument(setFieldValue)}
              style={styles.fileButton}
              icon="file-upload"
            >
              {values.file ? 'Change File' : 'Select File *'}
            </Button>
            
            {values.file && (
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{values.file.name}</Text>
                <Text style={styles.fileSize}>
                  {(values.file.size / 1024).toFixed(2)} KB
                </Text>
              </View>
            )}
            
            {touched.file && errors.file && (
              <HelperText type="error">{errors.file}</HelperText>
            )}
            
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Additional Information</Text>
            
            <TextInput
              label="Doctor's Name"
              value={values.doctor}
              onChangeText={handleChange('doctor')}
              style={styles.input}
            />
            
            <TextInput
              label="Hospital/Clinic"
              value={values.hospital}
              onChangeText={handleChange('hospital')}
              style={styles.input}
            />
            
            <Text style={styles.fieldLabel}>Record Date</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{formatDate(values.date)}</Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={values.date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setFieldValue('date', selectedDate);
                  }
                }}
              />
            )}
            
            <Text style={styles.fieldLabel}>Tags</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                value={currentTag}
                onChangeText={setCurrentTag}
                style={styles.tagInput}
                placeholder="Add tags"
                onSubmitEditing={handleAddTag}
              />
              <Button onPress={handleAddTag} mode="contained" style={styles.addTagButton}>
                Add
              </Button>
            </View>
            
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  onClose={() => handleRemoveTag(tag)}
                  style={styles.tag}
                >
                  {tag}
                </Chip>
              ))}
            </View>
            
            {loading && (
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  Uploading: {uploadProgress}%
                </Text>
                <ProgressBar
                  progress={uploadProgress / 100}
                  color="#6200ee"
                  style={styles.progressBar}
                />
              </View>
            )}
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                'Upload Health Record'
              )}
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  divider: {
    marginVertical: 16,
  },
  fileButton: {
    marginBottom: 16,
  },
  fileInfo: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  fileName: {
    fontWeight: '500',
    marginBottom: 4,
  },
  fileSize: {
    color: '#666',
    fontSize: 12,
  },
  datePickerButton: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 16,
  },
  tagInputContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#f9f9f9',
  },
  addTagButton: {
    justifyContent: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    margin: 4,
  },
  progressContainer: {
    marginVertical: 16,
  },
  progressText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
});

export default AddHealthRecordScreen;
