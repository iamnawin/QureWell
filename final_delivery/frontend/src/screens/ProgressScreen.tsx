import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Avatar, List, Divider } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const ProgressScreen = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const { entries, loading } = useSelector((state: RootState) => state.progress);

  const screenWidth = Dimensions.get('window').width - 32;

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

  const renderOverview = () => {
    return (
      <View>
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Progress Summary</Title>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>-6 kg</Text>
                <Text style={styles.statLabel}>Weight Loss</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>85%</Text>
                <Text style={styles.statLabel}>Medication Adherence</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>92%</Text>
                <Text style={styles.statLabel}>Diet Plan Adherence</Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={styles.statValue}>45</Text>
                <Text style={styles.statLabel}>Exercise Sessions</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Weight Progress</Title>
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
        
        <Card style={styles.goalsCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Health Goals</Title>
            
            <List.Item
              title="Reach target weight of 65 kg"
              description="4 kg remaining • 80% complete"
              left={props => (
                <Avatar.Icon {...props} icon="scale-bathroom" style={styles.goalIcon} size={40} />
              )}
            />
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '80%' }]} />
            </View>
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Exercise 3 times per week"
              description="2/3 this week • On track"
              left={props => (
                <Avatar.Icon {...props} icon="run" style={styles.goalIcon} size={40} />
              )}
            />
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '66%' }]} />
            </View>
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Reduce blood pressure to 120/80"
              description="Current: 125/82 • Making progress"
              left={props => (
                <Avatar.Icon {...props} icon="heart-pulse" style={styles.goalIcon} size={40} />
              )}
            />
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '70%' }]} />
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const renderTimeline = () => {
    if (!entries || entries.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="timeline-clock" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No progress entries yet</Text>
          <Text style={styles.emptySubtext}>
            Your health journey will be displayed here
          </Text>
          <Button 
            mode="contained" 
            icon="plus" 
            onPress={() => {/* Add progress entry */}}
            style={styles.addButton}
          >
            Add Progress Entry
          </Button>
        </View>
      );
    }

    return (
      <Card style={styles.timelineCard}>
        <Card.Content>
          <View style={styles.timelineHeader}>
            <Title style={styles.cardTitle}>Progress Timeline</Title>
            <Button 
              mode="contained" 
              icon="plus" 
              onPress={() => {/* Add progress entry */}}
              style={styles.addButton}
            >
              Add Entry
            </Button>
          </View>
          
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineConnector} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineDate}>Today</Text>
                <Card style={styles.timelineCard}>
                  <Card.Content>
                    <Title style={styles.timelineTitle}>Weight Check</Title>
                    <Paragraph>Current weight: 69 kg</Paragraph>
                    <Paragraph>Down 1 kg from last week!</Paragraph>
                  </Card.Content>
                </Card>
              </View>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineConnector} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineDate}>Yesterday</Text>
                <Card style={styles.timelineCard}>
                  <Card.Content>
                    <Title style={styles.timelineTitle}>Blood Pressure Check</Title>
                    <Paragraph>Reading: 125/82 mmHg</Paragraph>
                    <Paragraph>Improving steadily</Paragraph>
                  </Card.Content>
                </Card>
              </View>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineConnector} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineDate}>May 18, 2025</Text>
                <Card style={styles.timelineCard}>
                  <Card.Content>
                    <Title style={styles.timelineTitle}>Exercise Session</Title>
                    <Paragraph>30 minutes walking</Paragraph>
                    <Paragraph>Feeling energized!</Paragraph>
                  </Card.Content>
                </Card>
              </View>
            </View>
            
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineDate}>May 15, 2025</Text>
                <Card style={styles.timelineCard}>
                  <Card.Content>
                    <Title style={styles.timelineTitle}>Diet Plan Started</Title>
                    <Paragraph>New meal plan implemented</Paragraph>
                    <Paragraph>Goal: Reduce calorie intake by 300 kcal/day</Paragraph>
                  </Card.Content>
                </Card>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.headerTitle}>Progress Tracking</Title>
          <Paragraph style={styles.headerSubtitle}>
            Monitor your health journey and achievements
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.tabContainer}>
        <Button
          mode={activeTab === 'overview' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('overview')}
          style={[styles.tabButton, activeTab === 'overview' && styles.activeTabButton]}
          labelStyle={activeTab === 'overview' ? styles.activeTabLabel : styles.tabLabel}
        >
          Overview
        </Button>
        <Button
          mode={activeTab === 'timeline' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('timeline')}
          style={[styles.tabButton, activeTab === 'timeline' && styles.activeTabButton]}
          labelStyle={activeTab === 'timeline' ? styles.activeTabLabel : styles.tabLabel}
        >
          Timeline
        </Button>
      </View>

      <View style={styles.contentContainer}>
        {activeTab === 'overview' ? renderOverview() : renderTimeline()}
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  activeTabButton: {
    backgroundColor: '#6A3DE8',
  },
  tabLabel: {
    color: '#6A3DE8',
  },
  activeTabLabel: {
    color: '#fff',
  },
  contentContainer: {
    padding: 16,
    paddingTop: 8,
  },
  summaryCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
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
  goalsCard: {
    marginBottom: 16,
  },
  goalIcon: {
    backgroundColor: '#6A3DE8',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#6A3DE8',
    borderRadius: 3,
  },
  divider: {
    marginBottom: 16,
  },
  timelineCard: {
    marginBottom: 16,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#6A3DE8',
  },
  timeline: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#6A3DE8',
    marginTop: 6,
  },
  timelineConnector: {
    width: 2,
    backgroundColor: '#6A3DE8',
    height: '100%',
    position: 'absolute',
    left: 7,
    top: 16,
    bottom: -20,
  },
  timelineContent: {
    flex: 1,
    marginLeft: 16,
  },
  timelineDate: {
    color: '#666',
    marginBottom: 8,
  },
  timelineTitle: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
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
    marginBottom: 20,
  },
});

export default ProgressScreen;
