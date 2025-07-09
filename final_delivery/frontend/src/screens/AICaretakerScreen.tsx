import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Button, IconButton, Avatar, Title, Paragraph, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const AICaretakerScreen = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedTime, setRecordedTime] = useState(0);
  const [recordingTimer, setRecordingTimer] = useState(null);
  
  const user = useSelector((state: RootState) => state.user.profile);

  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer);
      }
    };
  }, [recordingTimer]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordedTime(0);
    const timer = setInterval(() => {
      setRecordedTime((prevTime) => prevTime + 1);
    }, 1000);
    setRecordingTimer(timer);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingTimer) {
      clearInterval(recordingTimer);
      setRecordingTimer(null);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <Avatar.Icon size={60} icon="robot" style={styles.avatar} />
            <View style={styles.headerText}>
              <Title style={styles.title}>AI Caretaker</Title>
              <Paragraph style={styles.subtitle}>
                Stay on track with your daily medication, diet, and more.
              </Paragraph>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.voiceSection}>
        <Card style={styles.recordCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Voice Assistant</Title>
            <Paragraph style={styles.paragraph}>
              Talk to your AI assistant to get help with your health management.
            </Paragraph>
            
            <View style={styles.recordingContainer}>
              {isRecording ? (
                <View style={styles.recordingStatus}>
                  <Text style={styles.recordingText}>Recording... {formatTime(recordedTime)}</Text>
                  <TouchableOpacity onPress={stopRecording} style={styles.recordButton}>
                    <Icon name="stop" size={30} color="#fff" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={startRecording} style={styles.recordButton}>
                  <Icon name="microphone" size={30} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
            
            <Text style={styles.recordingHint}>
              {isRecording 
                ? "Tap the stop button when you're done speaking" 
                : "Tap the microphone to start speaking"}
            </Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.featuresSection}>
        <Title style={styles.sectionTitle}>Features</Title>
        
        <Card style={styles.featureCard} onPress={() => navigation.navigate('Diet')}>
          <Card.Content style={styles.featureContent}>
            <Icon name="food-apple" size={40} color="#6A3DE8" style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Title style={styles.featureTitle}>Diet Plans</Title>
              <Paragraph style={styles.featureDescription}>
                View and manage your personalized diet plans
              </Paragraph>
            </View>
            <IconButton icon="chevron-right" size={24} color="#6A3DE8" />
          </Card.Content>
        </Card>
        
        <Card style={styles.featureCard} onPress={() => navigation.navigate('Medications')}>
          <Card.Content style={styles.featureContent}>
            <Icon name="pill" size={40} color="#6A3DE8" style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Title style={styles.featureTitle}>Medication Management</Title>
              <Paragraph style={styles.featureDescription}>
                Track and manage your medications and reminders
              </Paragraph>
            </View>
            <IconButton icon="chevron-right" size={24} color="#6A3DE8" />
          </Card.Content>
        </Card>
        
        <Card style={styles.featureCard}>
          <Card.Content style={styles.featureContent}>
            <Icon name="text-to-speech" size={40} color="#6A3DE8" style={styles.featureIcon} />
            <View style={styles.featureTextContainer}>
              <Title style={styles.featureTitle}>Usage Instructions</Title>
              <Paragraph style={styles.featureDescription}>
                Learn how to use the AI Caretaker features
              </Paragraph>
            </View>
            <IconButton icon="chevron-right" size={24} color="#6A3DE8" />
          </Card.Content>
        </Card>
      </View>

      <View style={styles.caretakerHubSection}>
        <Title style={styles.sectionTitle}>Caretaker Hub</Title>
        
        <Card style={styles.hubCard}>
          <Card.Content>
            <Title style={styles.hubTitle}>Record Audio Clips</Title>
            <Paragraph style={styles.paragraph}>
              Record audio messages for your caretaker to listen to later.
            </Paragraph>
            
            <Button 
              mode="contained" 
              icon="record" 
              style={styles.hubButton}
              onPress={() => {/* Navigate to audio recording screen */}}
            >
              Record New Clip
            </Button>
            
            <Divider style={styles.divider} />
            
            <Title style={styles.hubTitle}>Recent Recordings</Title>
            {/* This would be populated with actual recordings */}
            <Text style={styles.emptyState}>No recordings yet</Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerCard: {
    margin: 16,
    elevation: 4,
    backgroundColor: '#6A3DE8',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#fff',
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 24,
  },
  subtitle: {
    color: '#fff',
    opacity: 0.8,
  },
  voiceSection: {
    margin: 16,
  },
  recordCard: {
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 8,
    color: '#333',
  },
  paragraph: {
    color: '#666',
    marginBottom: 16,
  },
  recordingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#6A3DE8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingStatus: {
    alignItems: 'center',
  },
  recordingText: {
    marginBottom: 10,
    color: '#6A3DE8',
    fontWeight: 'bold',
  },
  recordingHint: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
  },
  featuresSection: {
    margin: 16,
  },
  featureCard: {
    marginBottom: 12,
    elevation: 2,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
  },
  featureDescription: {
    color: '#666',
  },
  caretakerHubSection: {
    margin: 16,
    marginBottom: 32,
  },
  hubCard: {
    elevation: 2,
  },
  hubTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  hubButton: {
    marginTop: 8,
    backgroundColor: '#6A3DE8',
  },
  divider: {
    marginVertical: 16,
  },
  emptyState: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 16,
    marginBottom: 8,
  },
});

export default AICaretakerScreen;
