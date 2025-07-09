import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, List, Switch, Badge, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const NotificationsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [dietReminders, setDietReminders] = useState(true);
  const [vitalsReminders, setVitalsReminders] = useState(true);
  const [caregiverNotifications, setCaregiverNotifications] = useState(false);
  
  const { notifications, settings } = useSelector((state: RootState) => state.notifications);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.headerTitle}>Notifications</Title>
          <Paragraph style={styles.headerSubtitle}>
            Manage your reminders and notification preferences
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.contentContainer}>
        <Card style={styles.settingsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Notification Settings</Title>
            
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Enable All Notifications</Text>
                <Text style={styles.settingDescription}>Master toggle for all notifications</Text>
              </View>
              <Switch 
                value={notificationsEnabled} 
                onValueChange={setNotificationsEnabled}
                color="#6A3DE8"
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Medication Reminders</Text>
                <Text style={styles.settingDescription}>Reminders for taking medications</Text>
              </View>
              <Switch 
                value={medicationReminders} 
                onValueChange={setMedicationReminders}
                disabled={!notificationsEnabled}
                color="#6A3DE8"
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Appointment Reminders</Text>
                <Text style={styles.settingDescription}>Reminders for upcoming appointments</Text>
              </View>
              <Switch 
                value={appointmentReminders} 
                onValueChange={setAppointmentReminders}
                disabled={!notificationsEnabled}
                color="#6A3DE8"
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Diet Plan Reminders</Text>
                <Text style={styles.settingDescription}>Reminders for meals and nutrition</Text>
              </View>
              <Switch 
                value={dietReminders} 
                onValueChange={setDietReminders}
                disabled={!notificationsEnabled}
                color="#6A3DE8"
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Vitals Check Reminders</Text>
                <Text style={styles.settingDescription}>Reminders to check vital signs</Text>
              </View>
              <Switch 
                value={vitalsReminders} 
                onValueChange={setVitalsReminders}
                disabled={!notificationsEnabled}
                color="#6A3DE8"
              />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Caregiver Notifications</Text>
                <Text style={styles.settingDescription}>Send alerts to your caregiver</Text>
              </View>
              <Switch 
                value={caregiverNotifications} 
                onValueChange={setCaregiverNotifications}
                disabled={!notificationsEnabled}
                color="#6A3DE8"
              />
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.upcomingCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitle}>Upcoming Reminders</Title>
              <Badge style={styles.badge}>3</Badge>
            </View>
            
            <List.Item
              title="Take Lisinopril"
              description="Today at 8:00 PM"
              left={props => <List.Icon {...props} icon="pill" color="#6A3DE8" />}
              right={props => <List.Icon {...props} icon="bell" color="#6A3DE8" />}
              style={styles.listItem}
            />
            
            <List.Item
              title="Check Blood Pressure"
              description="Tomorrow at 9:00 AM"
              left={props => <List.Icon {...props} icon="heart-pulse" color="#6A3DE8" />}
              right={props => <List.Icon {...props} icon="bell" color="#6A3DE8" />}
              style={styles.listItem}
            />
            
            <List.Item
              title="Dr. Smith Appointment"
              description="May 25, 2025 at 2:30 PM"
              left={props => <List.Icon {...props} icon="calendar" color="#6A3DE8" />}
              right={props => <List.Icon {...props} icon="bell" color="#6A3DE8" />}
              style={styles.listItem}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.historyCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Notification History</Title>
            
            <List.Item
              title="Medication Reminder"
              description="Metformin - Today at 1:00 PM"
              left={props => <List.Icon {...props} icon="pill" color="#888" />}
              style={styles.listItem}
            />
            
            <List.Item
              title="Diet Plan Update"
              description="New meal plan available - Today at 10:30 AM"
              left={props => <List.Icon {...props} icon="food-apple" color="#888" />}
              style={styles.listItem}
            />
            
            <List.Item
              title="Medication Reminder"
              description="Lisinopril - Today at 8:00 AM"
              left={props => <List.Icon {...props} icon="pill" color="#888" />}
              style={styles.listItem}
            />
            
            <List.Item
              title="Weight Progress"
              description="Goal achieved! - Yesterday at 9:15 AM"
              left={props => <List.Icon {...props} icon="trophy" color="#888" />}
              style={styles.listItem}
            />
          </Card.Content>
          <Card.Actions>
            <Button>View All History</Button>
            <Button>Clear History</Button>
          </Card.Actions>
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
    marginBottom: 8,
    backgroundColor: '#6A3DE8',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
  },
  headerSubtitle: {
    color: '#fff',
    opacity: 0.8,
  },
  contentContainer: {
    padding: 16,
  },
  settingsCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingDescription: {
    color: '#666',
  },
  divider: {
    marginVertical: 16,
  },
  upcomingCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    backgroundColor: '#6A3DE8',
    marginLeft: 10,
  },
  listItem: {
    paddingLeft: 0,
  },
  historyCard: {
    marginBottom: 16,
  },
});

export default NotificationsScreen;
