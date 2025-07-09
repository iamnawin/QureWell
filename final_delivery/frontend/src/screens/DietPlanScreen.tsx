import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Divider, List } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

const DietPlanScreen = () => {
  const [activeTab, setActiveTab] = useState('current');
  
  const { currentPlan, dietPlans, loading } = useSelector((state: RootState) => state.dietPlans);

  const screenWidth = Dimensions.get('window').width - 32;

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [1800, 1650, 2100, 1950, 1800, 2200, 1900],
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

  const renderCurrentPlan = () => {
    if (!currentPlan) {
      return (
        <View style={styles.emptyState}>
          <Icon name="food-off" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No active diet plan</Text>
          <Text style={styles.emptySubtext}>
            Create a new diet plan to get started
          </Text>
          <Button 
            mode="contained" 
            icon="plus" 
            onPress={() => {/* Create new diet plan */}}
            style={styles.createButton}
          >
            Create Diet Plan
          </Button>
        </View>
      );
    }

    return (
      <View>
        <Card style={styles.planCard}>
          <Card.Content>
            <Title style={styles.planTitle}>{currentPlan.name}</Title>
            <Paragraph style={styles.planDescription}>{currentPlan.description}</Paragraph>
            
            <View style={styles.calorieInfo}>
              <Text style={styles.calorieText}>Daily Target: {currentPlan.totalCalories} calories</Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <Title style={styles.mealsTitle}>Today's Meals</Title>
            
            {currentPlan.meals.map((meal) => (
              <List.Item
                key={meal.id}
                title={meal.name}
                description={`${meal.time} • ${meal.foods.reduce((total, food) => total + food.calories, 0)} calories`}
                left={props => <List.Icon {...props} icon="food" color="#6A3DE8" />}
                style={styles.mealItem}
              />
            ))}
          </Card.Content>
        </Card>
        
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title style={styles.chartTitle}>Weekly Calorie Intake</Title>
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
      </View>
    );
  };

  const renderSavedPlans = () => {
    if (!dietPlans || dietPlans.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="folder-open" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No saved diet plans</Text>
          <Text style={styles.emptySubtext}>
            Your saved diet plans will appear here
          </Text>
        </View>
      );
    }

    return (
      <View>
        {dietPlans.map((plan) => (
          <Card key={plan.id} style={styles.savedPlanCard}>
            <Card.Content>
              <Title style={styles.savedPlanTitle}>{plan.name}</Title>
              <Paragraph style={styles.savedPlanDescription}>{plan.description}</Paragraph>
              <Text style={styles.savedPlanCalories}>{plan.totalCalories} calories/day</Text>
              <Text style={styles.savedPlanDate}>Created: {new Date(plan.createdAt).toLocaleDateString()}</Text>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => {/* Load this plan */}}>Load Plan</Button>
              <Button onPress={() => {/* Edit this plan */}}>Edit</Button>
              <Button onPress={() => {/* Delete this plan */}}>Delete</Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title style={styles.headerTitle}>Diet Plan</Title>
          <Paragraph style={styles.headerSubtitle}>
            Manage your nutrition and meal planning
          </Paragraph>
        </Card.Content>
      </Card>

      <View style={styles.tabContainer}>
        <Button
          mode={activeTab === 'current' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('current')}
          style={[styles.tabButton, activeTab === 'current' && styles.activeTabButton]}
          labelStyle={activeTab === 'current' ? styles.activeTabLabel : styles.tabLabel}
        >
          Current Plan
        </Button>
        <Button
          mode={activeTab === 'saved' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('saved')}
          style={[styles.tabButton, activeTab === 'saved' && styles.activeTabButton]}
          labelStyle={activeTab === 'saved' ? styles.activeTabLabel : styles.tabLabel}
        >
          Saved Plans
        </Button>
      </View>

      <View style={styles.contentContainer}>
        {activeTab === 'current' ? renderCurrentPlan() : renderSavedPlans()}
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
  createButton: {
    backgroundColor: '#6A3DE8',
  },
  planCard: {
    marginBottom: 16,
  },
  planTitle: {
    fontSize: 20,
  },
  planDescription: {
    color: '#666',
    marginBottom: 10,
  },
  calorieInfo: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  calorieText: {
    fontWeight: 'bold',
    color: '#6A3DE8',
  },
  divider: {
    marginVertical: 16,
  },
  mealsTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  mealItem: {
    paddingVertical: 8,
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
  savedPlanCard: {
    marginBottom: 16,
  },
  savedPlanTitle: {
    fontSize: 18,
  },
  savedPlanDescription: {
    color: '#666',
  },
  savedPlanCalories: {
    fontWeight: 'bold',
    color: '#6A3DE8',
    marginTop: 5,
  },
  savedPlanDate: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
});

export default DietPlanScreen;
