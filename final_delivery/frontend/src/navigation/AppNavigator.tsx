import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import DashboardScreen from '../screens/DashboardScreen';
import DietPlanScreen from '../screens/DietPlanScreen';
import MedicationsScreen from '../screens/MedicationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProgressScreen from '../screens/ProgressScreen';
import VitalsScreen from '../screens/VitalsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import AICaretakerScreen from '../screens/AICaretakerScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'view-dashboard' : 'view-dashboard-outline';
          } else if (route.name === 'Medications') {
            iconName = focused ? 'pill' : 'pill';
          } else if (route.name === 'Diet') {
            iconName = focused ? 'food-apple' : 'food-apple-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'chart-line' : 'chart-line';
          } else if (route.name === 'AI') {
            iconName = focused ? 'robot' : 'robot-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6A3DE8',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Medications" component={MedicationsScreen} />
      <Tab.Screen name="Diet" component={DietPlanScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="AI" component={AICaretakerScreen} />
    </Tab.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6A3DE8',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        drawerActiveTintColor: '#6A3DE8',
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={TabNavigator} 
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="home" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="account" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Vitals" 
        component={VitalsScreen} 
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="heart-pulse" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="bell" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Reports" 
        component={ReportsScreen} 
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="file-chart" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const AppNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={DrawerNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
