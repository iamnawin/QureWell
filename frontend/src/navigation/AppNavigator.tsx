import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import AIGrannyScreen from '../screens/AIGrannyScreen';
import MedicationsScreen from '../screens/MedicationsScreen';
import DietPlanScreen from '../screens/DietPlanScreen';
import VitalsScreen from '../screens/VitalsScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ReportsScreen from '../screens/ReportsScreen';
import HealthRecordsScreen from '../screens/HealthRecordsScreen';
import AddHealthRecordScreen from '../screens/AddHealthRecordScreen';
import HealthRecordDetailScreen from '../screens/HealthRecordDetailScreen';
import ShareHealthRecordScreen from '../screens/ShareHealthRecordScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const AuthStack = createStackNavigator();
const HomeStack = createStackNavigator();
const AIGrannyStack = createStackNavigator();
const MedicationsStack = createStackNavigator();
const DietPlanStack = createStackNavigator();
const VitalsStack = createStackNavigator();
const ProgressStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const NotificationsStack = createStackNavigator();
const ReportsStack = createStackNavigator();
const HealthRecordsStack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
};

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="HomeMain" 
        component={HomeScreen} 
        options={{ title: 'Home' }}
      />
    </HomeStack.Navigator>
  );
};

const AIGrannyStackNavigator = () => {
  return (
    <AIGrannyStack.Navigator>
      <AIGrannyStack.Screen 
        name="AIGrannyMain" 
        component={AIGrannyScreen} 
        options={{ title: 'AI Granny' }}
      />
    </AIGrannyStack.Navigator>
  );
};

const MedicationsStackNavigator = () => {
  return (
    <MedicationsStack.Navigator>
      <MedicationsStack.Screen 
        name="MedicationsMain" 
        component={MedicationsScreen} 
        options={{ title: 'Medications' }}
      />
    </MedicationsStack.Navigator>
  );
};

const DietPlanStackNavigator = () => {
  return (
    <DietPlanStack.Navigator>
      <DietPlanStack.Screen 
        name="DietPlanMain" 
        component={DietPlanScreen} 
        options={{ title: 'Diet Plan' }}
      />
    </DietPlanStack.Navigator>
  );
};

const VitalsStackNavigator = () => {
  return (
    <VitalsStack.Navigator>
      <VitalsStack.Screen 
        name="VitalsMain" 
        component={VitalsScreen} 
        options={{ title: 'Vitals' }}
      />
    </VitalsStack.Navigator>
  );
};

const ProgressStackNavigator = () => {
  return (
    <ProgressStack.Navigator>
      <ProgressStack.Screen 
        name="ProgressMain" 
        component={ProgressScreen} 
        options={{ title: 'Progress' }}
      />
    </ProgressStack.Navigator>
  );
};

const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="ProfileMain" 
        component={ProfileScreen} 
        options={{ title: 'Profile' }}
      />
    </ProfileStack.Navigator>
  );
};

const NotificationsStackNavigator = () => {
  return (
    <NotificationsStack.Navigator>
      <NotificationsStack.Screen 
        name="NotificationsMain" 
        component={NotificationsScreen} 
        options={{ title: 'Notifications' }}
      />
    </NotificationsStack.Navigator>
  );
};

const ReportsStackNavigator = () => {
  return (
    <ReportsStack.Navigator>
      <ReportsStack.Screen 
        name="ReportsMain" 
        component={ReportsScreen} 
        options={{ title: 'Reports' }}
      />
    </ReportsStack.Navigator>
  );
};

const HealthRecordsStackNavigator = () => {
  return (
    <HealthRecordsStack.Navigator>
      <HealthRecordsStack.Screen 
        name="HealthRecordsMain" 
        component={HealthRecordsScreen} 
        options={{ title: 'Health Records' }}
      />
      <HealthRecordsStack.Screen 
        name="AddHealthRecord" 
        component={AddHealthRecordScreen} 
        options={{ title: 'Add Health Record' }}
      />
      <HealthRecordsStack.Screen 
        name="HealthRecordDetail" 
        component={HealthRecordDetailScreen} 
        options={{ title: 'Record Details' }}
      />
      <HealthRecordsStack.Screen 
        name="ShareHealthRecord" 
        component={ShareHealthRecordScreen} 
        options={{ title: 'Share Record' }}
      />
    </HealthRecordsStack.Navigator>
  );
};

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AIGranny') {
            iconName = focused ? 'human-female-girl' : 'human-female-girl';
          } else if (route.name === 'Medications') {
            iconName = focused ? 'pill' : 'pill';
          } else if (route.name === 'DietPlan') {
            iconName = focused ? 'food-apple' : 'food-apple-outline';
          } else if (route.name === 'HealthRecords') {
            iconName = focused ? 'file-document' : 'file-document-outline';
          } else if (route.name === 'More') {
            iconName = focused ? 'dots-horizontal-circle' : 'dots-horizontal-circle-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: '#6200ee',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="AIGranny" component={AIGrannyStackNavigator} options={{ title: 'AI Granny' }} />
      <Tab.Screen name="Medications" component={MedicationsStackNavigator} />
      <Tab.Screen name="DietPlan" component={DietPlanStackNavigator} options={{ title: 'Diet Plan' }} />
      <Tab.Screen name="HealthRecords" component={HealthRecordsStackNavigator} options={{ title: 'Records' }} />
      <Tab.Screen name="More" component={MoreStackNavigator} />
    </Tab.Navigator>
  );
};

const MoreStack = createStackNavigator();

const MoreStackNavigator = () => {
  return (
    <MoreStack.Navigator>
      <MoreStack.Screen name="MoreOptions" component={MoreOptionsScreen} options={{ title: 'More' }} />
      <MoreStack.Screen name="Vitals" component={VitalsStackNavigator} options={{ headerShown: false }} />
      <MoreStack.Screen name="Progress" component={ProgressStackNavigator} options={{ headerShown: false }} />
      <MoreStack.Screen name="Profile" component={ProfileStackNavigator} options={{ headerShown: false }} />
      <MoreStack.Screen name="Notifications" component={NotificationsStackNavigator} options={{ headerShown: false }} />
      <MoreStack.Screen name="Reports" component={ReportsStackNavigator} options={{ headerShown: false }} />
    </MoreStack.Navigator>
  );
};

const MoreOptionsScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TouchableOpacity 
        style={styles.moreOption}
        onPress={() => navigation.navigate('Vitals')}
      >
        <Icon name="heart-pulse" size={24} color="#6200ee" />
        <Text style={styles.moreOptionText}>Vitals</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.moreOption}
        onPress={() => navigation.navigate('Progress')}
      >
        <Icon name="chart-line" size={24} color="#6200ee" />
        <Text style={styles.moreOptionText}>Progress</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.moreOption}
        onPress={() => navigation.navigate('Profile')}
      >
        <Icon name="account" size={24} color="#6200ee" />
        <Text style={styles.moreOptionText}>Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.moreOption}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Icon name="bell" size={24} color="#6200ee" />
        <Text style={styles.moreOptionText}>Notifications</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.moreOption}
        onPress={() => navigation.navigate('Reports')}
      >
        <Icon name="file-chart" size={24} color="#6200ee" />
        <Text style={styles.moreOptionText}>Reports</Text>
      </TouchableOpacity>
    </View>
  );
};

const AppNavigator = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <Stack.Screen name="Main" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
};

const styles = {
  moreOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  moreOptionText: {
    marginLeft: 16,
    fontSize: 16,
  },
};

export default AppNavigator;
