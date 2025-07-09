import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, DataTable, Button, IconButton, Dialog, Portal, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const MedicationsScreen = () => {
  const [visible, setVisible] = useState(false);
  const [editingMedication, setEditingMedication] = useState(null);
  
  const { medications, loading } = useSelector((state: RootState) => state.medications);

  const showDialog = (medication = null) => {
    setEditingMedication(medication);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setEditingMedication(null);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.headerTitle}>My Medications</Title>
          <Paragraph style={styles.headerSubtitle}>
            Manage your medications and set reminders
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.contentContainer}>
        <Card style={styles.medicationCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitle}>Current Medications</Title>
              <Button 
                mode="contained" 
                icon="plus" 
                onPress={() => showDialog()}
                style={styles.addButton}
              >
                Add New
              </Button>
            </View>

            {medications && medications.length > 0 ? (
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Name</DataTable.Title>
                  <DataTable.Title>Dosage</DataTable.Title>
                  <DataTable.Title>Frequency</DataTable.Title>
                  <DataTable.Title>Actions</DataTable.Title>
                </DataTable.Header>

                {medications.map((med) => (
                  <DataTable.Row key={med.id}>
                    <DataTable.Cell>{med.name}</DataTable.Cell>
                    <DataTable.Cell>{med.dosage}</DataTable.Cell>
                    <DataTable.Cell>{med.frequency}</DataTable.Cell>
                    <DataTable.Cell>
                      <View style={styles.actionButtons}>
                        <IconButton
                          icon="pencil"
                          size={20}
                          onPress={() => showDialog(med)}
                        />
                        <IconButton
                          icon="delete"
                          size={20}
                          onPress={() => {/* Delete medication */}}
                        />
                      </View>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            ) : (
              <View style={styles.emptyState}>
                <Icon name="pill-off" size={50} color="#ccc" />
                <Text style={styles.emptyText}>No medications added yet</Text>
                <Text style={styles.emptySubtext}>
                  Add your medications to receive reminders and track your health
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.reminderCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Upcoming Reminders</Title>
            
            <View style={styles.reminderItem}>
              <View style={styles.reminderTime}>
                <Text style={styles.timeText}>8:00 AM</Text>
                <Text style={styles.dateText}>Today</Text>
              </View>
              <View style={styles.reminderDetails}>
                <Text style={styles.medicationName}>Lisinopril</Text>
                <Text style={styles.medicationDosage}>10mg - 1 tablet</Text>
              </View>
              <IconButton
                icon="check-circle"
                size={24}
                color="#6A3DE8"
                onPress={() => {/* Mark as taken */}}
              />
            </View>
            
            <View style={styles.reminderItem}>
              <View style={styles.reminderTime}>
                <Text style={styles.timeText}>1:00 PM</Text>
                <Text style={styles.dateText}>Today</Text>
              </View>
              <View style={styles.reminderDetails}>
                <Text style={styles.medicationName}>Metformin</Text>
                <Text style={styles.medicationDosage}>500mg - 1 tablet</Text>
              </View>
              <IconButton
                icon="check-circle"
                size={24}
                color="#6A3DE8"
                onPress={() => {/* Mark as taken */}}
              />
            </View>
            
            <View style={styles.reminderItem}>
              <View style={styles.reminderTime}>
                <Text style={styles.timeText}>8:00 PM</Text>
                <Text style={styles.dateText}>Today</Text>
              </View>
              <View style={styles.reminderDetails}>
                <Text style={styles.medicationName}>Lisinopril</Text>
                <Text style={styles.medicationDosage}>10mg - 1 tablet</Text>
              </View>
              <IconButton
                icon="check-circle"
                size={24}
                color="#6A3DE8"
                onPress={() => {/* Mark as taken */}}
              />
            </View>
          </Card.Content>
        </Card>
      </View>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>{editingMedication ? 'Edit Medication' : 'Add New Medication'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Medication Name"
              mode="outlined"
              style={styles.input}
              value={editingMedication?.name || ''}
            />
            <TextInput
              label="Dosage"
              mode="outlined"
              style={styles.input}
              value={editingMedication?.dosage || ''}
            />
            <TextInput
              label="Frequency"
              mode="outlined"
              style={styles.input}
              value={editingMedication?.frequency || ''}
            />
            <TextInput
              label="Time of Day"
              mode="outlined"
              style={styles.input}
              value={editingMedication?.timeOfDay?.join(', ') || ''}
            />
            <TextInput
              label="Notes (Optional)"
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
              value={editingMedication?.notes || ''}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={hideDialog}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
  medicationCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#6A3DE8',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 10,
    color: '#666',
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#888',
    marginTop: 5,
  },
  reminderCard: {
    marginBottom: 16,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reminderTime: {
    width: 80,
  },
  timeText: {
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    color: '#888',
    fontSize: 12,
  },
  reminderDetails: {
    flex: 1,
    marginLeft: 10,
  },
  medicationName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  medicationDosage: {
    color: '#666',
  },
  input: {
    marginBottom: 12,
  },
});

export default MedicationsScreen;
