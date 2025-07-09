import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, DataTable, Divider } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ReportsScreen = () => {
  const [reportPeriod, setReportPeriod] = useState('month');
  
  const screenWidth = Dimensions.get('window').width - 32;

  const medicationData = {
    labels: ['Taken', 'Missed'],
    data: [0.85, 0.15]
  };

  const weightData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [75, 74, 72, 71, 70, 69],
        color: (opacity = 1) => `rgba(106, 61, 232, ${opacity})`,
        strokeWidth: 2
      }
    ],
  };

  const bpData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [140, 138, 135, 132, 130, 125],
        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
        strokeWidth: 2
      },
      {
        data: [90, 88, 87, 85, 84, 82],
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
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

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.headerTitle}>Health Reports</Title>
          <Paragraph style={styles.headerSubtitle}>
            View and export your health data reports
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.contentContainer}>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Health Summary</Title>
            
            <View style={styles.periodSelector}>
              <Button
                mode={reportPeriod === 'week' ? 'contained' : 'outlined'}
                onPress={() => setReportPeriod('week')}
                style={[styles.periodButton, reportPeriod === 'week' && styles.activePeriodButton]}
                labelStyle={reportPeriod === 'week' ? styles.activePeriodLabel : styles.periodLabel}
              >
                Week
              </Button>
              <Button
                mode={reportPeriod === 'month' ? 'contained' : 'outlined'}
                onPress={() => setReportPeriod('month')}
                style={[styles.periodButton, reportPeriod === 'month' && styles.activePeriodButton]}
                labelStyle={reportPeriod === 'month' ? styles.activePeriodLabel : styles.periodLabel}
              >
                Month
              </Button>
              <Button
                mode={reportPeriod === 'year' ? 'contained' : 'outlined'}
                onPress={() => setReportPeriod('year')}
                style={[styles.periodButton, reportPeriod === 'year' && styles.activePeriodButton]}
                labelStyle={reportPeriod === 'year' ? styles.activePeriodLabel : styles.periodLabel}
              >
                Year
              </Button>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>85%</Text>
                <Text style={styles.statLabel}>Medication Adherence</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>-6 kg</Text>
                <Text style={styles.statLabel}>Weight Change</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>125/82</Text>
                <Text style={styles.statLabel}>Avg. Blood Pressure</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>72 bpm</Text>
                <Text style={styles.statLabel}>Avg. Heart Rate</Text>
              </View>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button 
              icon="file-pdf-box" 
              mode="contained" 
              onPress={() => {/* Export PDF */}}
              style={styles.exportButton}
            >
              Export PDF
            </Button>
            <Button 
              icon="microsoft-excel" 
              mode="outlined" 
              onPress={() => {/* Export Excel */}}
            >
              Export Excel
            </Button>
          </Card.Actions>
        </Card>
        
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Medication Adherence</Title>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={[
                  {
                    name: 'Taken',
                    population: 85,
                    color: '#6A3DE8',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 15,
                  },
                  {
                    name: 'Missed',
                    population: 15,
                    color: '#F00',
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 15,
                  },
                ]}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Weight Trend</Title>
            <LineChart
              data={weightData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Blood Pressure Trend</Title>
            <LineChart
              data={bpData}
              width={screenWidth}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
              legend={['Systolic', 'Diastolic']}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.detailsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Detailed Reports</Title>
            
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Report Type</DataTable.Title>
                <DataTable.Title>Period</DataTable.Title>
                <DataTable.Title>Actions</DataTable.Title>
              </DataTable.Header>
              
              <DataTable.Row>
                <DataTable.Cell>Medication Report</DataTable.Cell>
                <DataTable.Cell>May 2025</DataTable.Cell>
                <DataTable.Cell>
                  <Button compact onPress={() => {/* View report */}}>View</Button>
                </DataTable.Cell>
              </DataTable.Row>
              
              <DataTable.Row>
                <DataTable.Cell>Vitals Report</DataTable.Cell>
                <DataTable.Cell>May 2025</DataTable.Cell>
                <DataTable.Cell>
                  <Button compact onPress={() => {/* View report */}}>View</Button>
                </DataTable.Cell>
              </DataTable.Row>
              
              <DataTable.Row>
                <DataTable.Cell>Diet Report</DataTable.Cell>
                <DataTable.Cell>May 2025</DataTable.Cell>
                <DataTable.Cell>
                  <Button compact onPress={() => {/* View report */}}>View</Button>
                </DataTable.Cell>
              </DataTable.Row>
              
              <DataTable.Row>
                <DataTable.Cell>Progress Report</DataTable.Cell>
                <DataTable.Cell>May 2025</DataTable.Cell>
                <DataTable.Cell>
                  <Button compact onPress={() => {/* View report */}}>View</Button>
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
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
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  periodButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  activePeriodButton: {
    backgroundColor: '#6A3DE8',
  },
  periodLabel: {
    color: '#6A3DE8',
  },
  activePeriodLabel: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A3DE8',
  },
  statLabel: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },
  exportButton: {
    backgroundColor: '#6A3DE8',
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
  pieChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsCard: {
    marginBottom: 30,
  },
});

export default ReportsScreen;
