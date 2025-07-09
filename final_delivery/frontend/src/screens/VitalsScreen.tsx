import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, DataTable, IconButton, Portal, Dialog, TextInput } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const VitalsScreen = () => {
  const [visible, setVisible] = useState(false);
  const [vitalType, setVitalType] = useState('blood_pressure');
  
  const { readings, loading } = useSelector((state: RootState) => state.vitals);

  const screenWidth = Dimensions.get('window').width - 32;

  const showDialog = () => {
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [120, 118, 119, 121, 122, 120],
        color: (opacity = 1) => `rgba(106, 61, 232, ${opacity})`,
        strokeWidth: 2
      }
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(106, 61, 232, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#6A3DE8'
    }
  };

  const getVitalIcon = (type) => {
    switch (type) {
      case 'blood_pressure':
        return 'heart-pulse';
      case 'heart_rate':
        return 'heart';
      case 'blood_sugar':
        return 'water';
      case 'weight':
        return 'scale-bathroom';
      case 'temperature':
        return 'thermometer';
      case 'oxygen':
        return 'lungs';
      default:
        return 'medical-bag';
    }
  };

  const getVitalName = (type) => {
    switch (type) {
      case 'blood_pressure':
        return 'Blood Pressure';
      case 'heart_rate':
        return 'Heart Rate';
      case 'blood_sugar':
        return 'Blood Sugar';
      case 'weight':
        return 'Weight';
      case 'temperature':
        return 'Temperature';
      case 'oxygen':
        return 'Oxygen Saturation';
      default:
        return 'Vital Sign';
    }
  };

  const getVitalUnit = (type) => {
    switch (type) {
      case 'blood_pressure':
        return 'mmHg';
      case 'heart_rate':
        return 'bpm';
      case 'blood_sugar':
        return 'mg/dL';
      case 'weight':
        return 'kg';
      case 'temperature':
        return '°C';
      case 'oxygen':
        return '%';
      default:
        return '';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.headerTitle}>Vitals Tracking</Title>
          <Paragraph style={styles.headerSubtitle}>
            Monitor your vital signs and health metrics
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.contentContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Title style={styles.cardTitle}>Vital Signs Summary</Title>
              <Button 
                mode="contained" 
                icon="plus" 
                onPress={showDialog}
                style={styles.addButton}
              >
                Add Reading
              </Button>
            </View>
            
            <View style={styles.vitalsSummary}>
              <View style={styles.vitalItem}>
                <Icon name="heart-pulse" size={30} color="#6A3DE8" />
                <Text style={styles.vitalLabel}>Blood Pressure</Text>
                <Text style={styles.vitalValue}>120/80 mmHg</Text>
              </View>
              
              <View style={styles.vitalItem}>
                <Icon name="heart" size={30} color="#6A3DE8" />
                <Text style={styles.vitalLabel}>Heart Rate</Text>
                <Text style={styles.vitalValue}>72 bpm</Text>
              </View>
              
              <View style={styles.vitalItem}>
                <Icon name="water" size={30} color="#6A3DE8" />
                <Text style={styles.vitalLabel}>Blood Sugar</Text>
                <Text style={styles.vitalValue}>110 mg/dL</Text>
              </View>
              
              <View style={styles.vitalItem}>
                <Icon name="scale-bathroom" size={30} color="#6A3DE8" />
                <Text style={styles.vitalLabel}>Weight</Text>
                <Text style={styles.vitalValue}>68 kg</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Blood Pressure Trend</Title>
            <LineChart
              data={chartData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.historyCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Recent Readings</Title>
            
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Type</DataTable.Title>
                <DataTable.Title>Value</DataTable.Title>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Actions</DataTable.Title>
              </DataTable.Header>
              
              {readings && readings.length > 0 ? (
                readings.map((reading) => (
                  <DataTable.Row key={reading.id}>
                    <DataTable.Cell>
                      <View style={styles.typeCell}>
                        <Icon name={getVitalIcon(reading.type)} size={20} color="#6A3DE8" />
                        <Text style={styles.typeText}>{getVitalName(reading.type)}</Text>
                      </View>
                    </DataTable.Cell>
                    <DataTable.Cell>{reading.value} {getVitalUnit(reading.type)}</DataTable.Cell>
                    <DataTable.Cell>{new Date(reading.timestamp).toLocaleDateString()}</DataTable.Cell>
                    <DataTable.Cell>
                      <IconButton
                        icon="delete"
                        size={20}
                        onPress={() => {/* Delete reading */}}
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                ))
              ) : (
                <DataTable.Row>
                  <DataTable.Cell style={{ flex: 4 }}>
                    <Text style={styles.emptyText}>No readings recorded yet</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              )}
            </DataTable>
          </Card.Content>
        </Card>
      </View>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Add Vital Sign Reading</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Type"
              mode="outlined"
              style={styles.input}
              value={getVitalName(vitalType)}
              disabled
            />
            <View style={styles.vitalTypeButtons}>
              <Button 
                mode={vitalType === 'blood_pressure' ? 'contained' : 'outlined'} 
                onPress={() => setVitalType('blood_pressure')}
                style={styles.vitalTypeButton}
              >
                BP
              </Button>
              <Button 
                mode={vitalType === 'heart_rate' ? 'contained' : 'outlined'} 
                onPress={() => setVitalType('heart_rate')}
                style={styles.vitalTypeButton}
              >
                HR
              </Button>
              <Button 
                mode={vitalType === 'blood_sugar' ? 'contained' : 'outlined'} 
                onPress={() => setVitalType('blood_sugar')}
                style={styles.vitalTypeButton}
              >
                BS
              </Button>
              <Button 
                mode={vitalType === 'weight' ? 'contained' : 'outlined'} 
                onPress={() => setVitalType('weight')}
                style={styles.vitalTypeButton}
              >
                WT
              </Button>
            </View>
            
            {vitalType === 'blood_pressure' ? (
              <View style={styles.bpInputs}>
                <TextInput
                  label="Systolic"
                  mode="outlined"
                  style={[styles.input, styles.bpInput]}
                  keyboardType="number-pad"
                />
                <Text style={styles.bpSeparator}>/</Text>
                <TextInput
                  label="Diastolic"
                  mode="outlined"
                  style={[styles.input, styles.bpInput]}
                  keyboardType="number-pad"
                />
              </View>
            ) : (
              <TextInput
                label={`Value (${getVitalUnit(vitalType)})`}
                mode="outlined"
                style={styles.input}
                keyboardType="number-pad"
              />
            )}
            
            <TextInput
              label="Notes (Optional)"
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
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
  summaryCard: {
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
  vitalsSummary: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  vitalItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  vitalLabel: {
    marginTop: 8,
    color: '#666',
  },
  vitalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  chartCard: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  historyCard: {
    marginBottom: 16,
  },
  typeCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeText: {
    marginLeft: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
  },
  input: {
    marginBottom: 12,
  },
  vitalTypeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  vitalTypeButton: {
    flex: 1,
    marginHorizontal: 2,
  },
  bpInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bpInput: {
    flex: 1,
  },
  bpSeparator: {
    fontSize: 24,
    marginHorizontal: 8,
    color: '#6A3DE8',
    fontWeight: 'bold',
  },
});

export default VitalsScreen;
