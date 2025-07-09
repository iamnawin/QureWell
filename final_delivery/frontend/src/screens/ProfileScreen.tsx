import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Avatar, TextInput, Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  
  const [emergencyContactName, setEmergencyContactName] = useState('Jane Doe');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('+1 (555) 987-6543');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('Spouse');
  
  const [dataSharing, setDataSharing] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const user = useSelector((state: RootState) => state.user.profile);

  const handleSave = () => {
    // In a real app, dispatch an action to update profile
    setIsEditing(false);
  };

  const renderViewMode = () => {
    return (
      <View>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Image 
              size={100} 
              source={require('../../assets/avatar.png')} 
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Title style={styles.name}>{name}</Title>
              <View style={styles.infoRow}>
                <Icon name="email" size={20} color="#6A3DE8" style={styles.infoIcon} />
                <Text style={styles.infoText}>{email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="phone" size={20} color="#6A3DE8" style={styles.infoIcon} />
                <Text style={styles.infoText}>{phone}</Text>
              </View>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => setIsEditing(true)}
              style={styles.editButton}
            >
              Edit Profile
            </Button>
          </Card.Actions>
        </Card>
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Emergency Contact</Title>
            <View style={styles.contactInfo}>
              <View style={styles.infoRow}>
                <Icon name="account" size={20} color="#6A3DE8" style={styles.infoIcon} />
                <Text style={styles.infoText}>{emergencyContactName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="phone" size={20} color="#6A3DE8" style={styles.infoIcon} />
                <Text style={styles.infoText}>{emergencyContactPhone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon name="account-child" size={20} color="#6A3DE8" style={styles.infoIcon} />
                <Text style={styles.infoText}>Relationship: {emergencyContactRelationship}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Privacy & Notifications</Title>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Health Data Sharing</Text>
                <Text style={styles.settingDescription}>Allow sharing data with healthcare providers</Text>
              </View>
              <Switch 
                value={dataSharing} 
                onValueChange={setDataSharing}
                color="#6A3DE8"
              />
            </View>
            
            <View style={styles.settingRow}>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive reminders and alerts</Text>
              </View>
              <Switch 
                value={notificationsEnabled} 
                onValueChange={setNotificationsEnabled}
                color="#6A3DE8"
              />
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>App Information</Title>
            <Paragraph style={styles.appInfo}>
              AllForYourHealth v1.0.0
            </Paragraph>
            <Paragraph style={styles.appInfo}>
              A smart, personalized digital health companion
            </Paragraph>
          </Card.Content>
          <Card.Actions>
            <Button>Terms of Service</Button>
            <Button>Privacy Policy</Button>
          </Card.Actions>
        </Card>
      </View>
    );
  };

  const renderEditMode = () => {
    return (
      <View>
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.avatarContainer}>
              <Avatar.Image 
                size={100} 
                source={require('../../assets/avatar.png')} 
                style={styles.avatar}
              />
              <Button 
                mode="text" 
                icon="camera" 
                onPress={() => {/* Change photo */}}
                style={styles.changePhotoButton}
              >
                Change Photo
              </Button>
            </View>
            
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
            />
            
            <TextInput
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Emergency Contact</Title>
            
            <TextInput
              label="Contact Name"
              value={emergencyContactName}
              onChangeText={setEmergencyContactName}
              mode="outlined"
              style={styles.input}
            />
            
            <TextInput
              label="Contact Phone"
              value={emergencyContactPhone}
              onChangeText={setEmergencyContactPhone}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
            />
            
            <TextInput
              label="Relationship"
              value={emergencyContactRelationship}
              onChangeText={setEmergencyContactRelationship}
              mode="outlined"
              style={styles.input}
            />
          </Card.Content>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button 
            mode="outlined" 
            onPress={() => setIsEditing(false)}
            style={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button 
            mode="contained" 
            onPress={handleSave}
            style={styles.saveButton}
          >
            Save Changes
          </Button>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.headerTitle}>My Profile</Title>
          <Paragraph style={styles.headerSubtitle}>
            Manage your personal information and settings
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.contentContainer}>
        {isEditing ? renderEditMode() : renderViewMode()}
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
  profileCard: {
    marginBottom: 16,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#6A3DE8',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  name: {
    fontSize: 22,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    color: '#666',
  },
  editButton: {
    backgroundColor: '#6A3DE8',
  },
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  contactInfo: {
    marginBottom: 8,
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
  appInfo: {
    color: '#666',
    marginBottom: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  changePhotoButton: {
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#6A3DE8',
  },
});

export default ProfileScreen;
