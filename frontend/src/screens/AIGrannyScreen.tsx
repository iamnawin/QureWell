import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { TextInput, Button, Avatar, Chip, Card, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../redux/store';
import { sendMessage, processCommand } from '../redux/slices/aiGrannySlice';
import { Theme } from '../utils/theme';

const AIGrannyScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { messages, loading, processingCommand } = useSelector((state: RootState) => state.aiGranny);
  const { medications } = useSelector((state: RootState) => state.medication);
  const { records } = useSelector((state: RootState) => state.healthRecord);
  const { appointments } = useSelector((state: RootState) => state.booking);
  
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef(null);
  
  const quickReplies = [
    "Show my medications",
    "Book an appointment",
    "Show my latest blood test",
    "How am I doing today?",
    "Remind me about my next appointment"
  ];

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    dispatch(sendMessage({ text: inputText, sender: 'user' }));
    
    // Process the command
    dispatch(processCommand(inputText));
    
    setInputText('');
  };

  const handleQuickReply = (reply) => {
    dispatch(sendMessage({ text: reply, sender: 'user' }));
    dispatch(processCommand(reply));
  };

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.grannyMessageContainer
      ]}>
        {!isUser && (
          <Avatar.Image 
            source={require('../assets/images/granny-avatar.png')} 
            size={40} 
            style={styles.avatar}
          />
        )}
        <View style={[
          styles.messageBubble,
          isUser ? styles.userMessageBubble : styles.grannyMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.grannyMessageText
          ]}>
            {item.text}
          </Text>
          <Text style={styles.messageTime}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {isUser && (
          <Avatar.Text 
            label={item.sender.charAt(0).toUpperCase()} 
            size={40} 
            style={styles.avatar}
            color="white"
            backgroundColor={Theme.colors.primary}
          />
        )}
      </View>
    );
  };

  const renderHealthTip = () => {
    return (
      <Card style={styles.tipCard}>
        <Card.Content>
          <View style={styles.tipHeader}>
            <Icon name="lightbulb-outline" size={24} color={Theme.colors.primary} />
            <Text style={styles.tipTitle}>Granny's Health Tip</Text>
          </View>
          <Text style={styles.tipText}>
            Adding a handful of methi (fenugreek) seeds to your diet can help control blood sugar levels. 
            Try soaking them overnight and drinking the water in the morning.
          </Text>
        </Card.Content>
      </Card>
    );
  };

  const renderMedicationReminder = () => {
    // Show only if there are medications
    if (!medications || medications.length === 0) return null;
    
    const nextMedication = medications[0]; // Just for demo, in real app would find next scheduled
    
    return (
      <Card style={styles.reminderCard}>
        <Card.Content>
          <View style={styles.reminderHeader}>
            <Icon name="pill" size={24} color={Theme.colors.primary} />
            <Text style={styles.reminderTitle}>Medication Reminder</Text>
          </View>
          <Text style={styles.reminderText}>
            Don't forget to take your {nextMedication.name} {nextMedication.dosage} with lunch at 1:00 PM today.
          </Text>
          <View style={styles.reminderActions}>
            <Button 
              mode="contained" 
              compact 
              style={styles.reminderButton}
              color={Theme.colors.primary}
              onPress={() => navigation.navigate('Medications')}
            >
              View Details
            </Button>
            <Button 
              mode="outlined" 
              compact 
              style={styles.reminderButton}
              color={Theme.colors.primary}
              onPress={() => {
                dispatch(sendMessage({ 
                  text: "I've marked your medication as taken. Great job taking care of your health!", 
                  sender: 'granny' 
                }));
              }}
            >
              Mark as Taken
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderAppointmentCard = () => {
    // Show only if there are upcoming appointments
    if (!appointments || appointments.length === 0) return null;
    
    const nextAppointment = appointments[0]; // Just for demo, in real app would find next scheduled
    
    return (
      <Card style={styles.appointmentCard}>
        <Card.Content>
          <View style={styles.appointmentHeader}>
            <Icon name="calendar-clock" size={24} color={Theme.colors.primary} />
            <Text style={styles.appointmentTitle}>Upcoming Appointment</Text>
          </View>
          <Text style={styles.appointmentText}>
            You have an appointment with Dr. {nextAppointment.doctorName} on {new Date(nextAppointment.date).toLocaleDateString()} at {nextAppointment.time}.
          </Text>
          <View style={styles.appointmentActions}>
            <Button 
              mode="contained" 
              compact 
              style={styles.appointmentButton}
              color={Theme.colors.primary}
              onPress={() => navigation.navigate('Booking')}
            >
              View Details
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderHealthRecordPreview = () => {
    // Show only if there are health records and one was requested
    if (!records || records.length === 0) return null;
    
    // This would be triggered by a command to show a specific record
    const requestedRecord = records[0]; // Just for demo
    
    return (
      <Card style={styles.recordCard}>
        <Card.Content>
          <View style={styles.recordHeader}>
            <Icon name="file-document-outline" size={24} color={Theme.colors.primary} />
            <Text style={styles.recordTitle}>{requestedRecord.title}</Text>
          </View>
          <Text style={styles.recordText}>
            {requestedRecord.description || "Health record from " + new Date(requestedRecord.date).toLocaleDateString()}
          </Text>
          <View style={styles.recordActions}>
            <Button 
              mode="contained" 
              compact 
              style={styles.recordButton}
              color={Theme.colors.primary}
              onPress={() => navigation.navigate('HealthRecords')}
            >
              View Full Record
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  const renderCommandProcessing = () => {
    if (!processingCommand) return null;
    
    return (
      <View style={styles.processingContainer}>
        <Text style={styles.processingText}>AI Granny is thinking...</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Avatar.Image 
            source={require('../assets/images/granny-avatar.png')} 
            size={60} 
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerTitle}>AI Granny</Text>
            <Text style={styles.headerSubtitle}>Your personal health companion</Text>
          </View>
        </View>
      </View>
      
      <FlatList
        ref={scrollViewRef}
        style={styles.messagesContainer}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `message-${index}`}
        contentContainerStyle={styles.messagesList}
        ListHeaderComponent={() => (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Namaste! I'm your AI Granny. I can help you manage your health, medications, 
              appointments, and more. How can I assist you today?
            </Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View>
            {renderCommandProcessing()}
            {messages.length > 0 && messages[messages.length - 1].sender === 'granny' && renderHealthTip()}
            {messages.length > 0 && messages[messages.length - 1].sender === 'granny' && renderMedicationReminder()}
            {messages.length > 0 && messages[messages.length - 1].sender === 'granny' && renderAppointmentCard()}
            {messages.length > 0 && messages[messages.length - 1].sender === 'granny' && renderHealthRecordPreview()}
          </View>
        )}
      />
      
      {messages.length === 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRepliesContainer}>
          {quickReplies.map((reply, index) => (
            <Chip 
              key={`quick-reply-${index}`}
              style={styles.quickReplyChip}
              textStyle={styles.quickReplyText}
              onPress={() => handleQuickReply(reply)}
            >
              {reply}
            </Chip>
          ))}
        </ScrollView>
      )}
      
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.voiceButton} onPress={() => alert('Voice input coming soon!')}>
          <Icon name="microphone" size={24} color="white" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleSendMessage}
          returnKeyType="send"
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Icon name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: Theme.colors.primary,
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    marginRight: 16,
    backgroundColor: '#e6e0ff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 32,
  },
  welcomeContainer: {
    backgroundColor: '#e6e0ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  grannyMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginHorizontal: 8,
  },
  messageBubble: {
    maxWidth: '70%',
    borderRadius: 18,
    padding: 12,
  },
  userMessageBubble: {
    backgroundColor: Theme.colors.primary,
    borderTopRightRadius: 4,
  },
  grannyMessageBubble: {
    backgroundColor: '#e6e0ff',
    borderTopLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  grannyMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: 'rgba(0, 0, 0, 0.5)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  quickRepliesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  quickReplyChip: {
    marginRight: 8,
    backgroundColor: '#e6e0ff',
  },
  quickReplyText: {
    color: Theme.colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  tipCard: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.primary,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
  reminderCard: {
    marginVertical: 8,
    backgroundColor: '#e6e0ff',
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  reminderText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  reminderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  reminderButton: {
    marginLeft: 8,
  },
  appointmentCard: {
    marginVertical: 8,
    backgroundColor: '#f0f8ff',
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  appointmentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  appointmentButton: {
    marginLeft: 8,
  },
  recordCard: {
    marginVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  recordText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  recordActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  recordButton: {
    marginLeft: 8,
  },
  processingContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  processingText: {
    color: Theme.colors.primary,
    fontStyle: 'italic',
  },
});

export default AIGrannyScreen;
