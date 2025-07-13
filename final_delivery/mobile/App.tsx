import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleLogin = () => {
    if (email && password) {
      setIsLoggedIn(true);
      setCurrentScreen('home');
      Alert.alert('Success', 'Logged in successfully!');
    } else {
      Alert.alert('Error', 'Please enter email and password');
    }
  };

  const handleRegister = () => {
    if (name && email && password) {
      setIsLoggedIn(true);
      setCurrentScreen('home');
      Alert.alert('Success', 'Account created successfully!');
    } else {
      Alert.alert('Error', 'Please fill all fields');
    }
  };

  const LoginScreen = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <View style={styles.logoMain}>
                <View style={styles.logoHands}>
                  <View style={styles.logoDevice}>
                    <View style={styles.logoScreen}>
                      <Text style={styles.logoHeart}>❤️</Text>
                      <Text style={styles.logoPlus}>+</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.logoStethoscope}>
                  <View style={styles.logoTube} />
                  <View style={styles.logoEarpiece} />
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.title}>QureWell</Text>
          <Text style={styles.subtitle}>Your Health Companion</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {isRegisterMode ? 'Create Account' : 'Welcome Back'}
          </Text>

          {isRegisterMode && (
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={name}
              onChangeText={setName}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={isRegisterMode ? handleRegister : handleLogin}>
            <Text style={styles.buttonText}>
              {isRegisterMode ? 'Create Account' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => setIsRegisterMode(!isRegisterMode)}>
            <Text style={styles.linkText}>
              {isRegisterMode
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const HomeScreen = () => (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <View style={styles.logoMain}>
                <View style={styles.logoHands}>
                  <View style={styles.logoDevice}>
                    <View style={styles.logoScreen}>
                      <Text style={styles.logoHeart}>❤️</Text>
                      <Text style={styles.logoPlus}>+</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.logoStethoscope}>
                  <View style={styles.logoTube} />
                  <View style={styles.logoEarpiece} />
                </View>
              </View>
            </View>
          </View>
          <Text style={styles.title}>QureWell</Text>
          <Text style={styles.subtitle}>Health Dashboard</Text>
        </View>

        <View style={styles.dashboard}>
          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => Alert.alert('Feature', 'AI Caretaker coming soon!')}>
            <Text style={styles.featureIcon}>🤖</Text>
            <Text style={styles.featureTitle}>AI Caretaker</Text>
            <Text style={styles.featureDesc}>Voice-enabled health assistant</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => Alert.alert('Feature', 'Medications coming soon!')}>
            <Text style={styles.featureIcon}>💊</Text>
            <Text style={styles.featureTitle}>Medications</Text>
            <Text style={styles.featureDesc}>Track and manage medications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => Alert.alert('Feature', 'Diet Plan coming soon!')}>
            <Text style={styles.featureIcon}>🥗</Text>
            <Text style={styles.featureTitle}>Diet Plan</Text>
            <Text style={styles.featureDesc}>Personalized nutrition plans</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => Alert.alert('Feature', 'Vitals coming soon!')}>
            <Text style={styles.featureIcon}>❤️</Text>
            <Text style={styles.featureTitle}>Vitals</Text>
            <Text style={styles.featureDesc}>Monitor vital signs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => Alert.alert('Feature', 'Progress coming soon!')}>
            <Text style={styles.featureIcon}>📊</Text>
            <Text style={styles.featureTitle}>Progress</Text>
            <Text style={styles.featureDesc}>Track health progress</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            onPress={() => Alert.alert('Feature', 'Reports coming soon!')}>
            <Text style={styles.featureIcon}>📋</Text>
            <Text style={styles.featureTitle}>Reports</Text>
            <Text style={styles.featureDesc}>Health summary reports</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            setIsLoggedIn(false);
            setCurrentScreen('login');
            setEmail('');
            setPassword('');
            setName('');
          }}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      {!isLoggedIn ? <LoginScreen /> : <HomeScreen />}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    color: '#00FFA2',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#888',
    fontSize: 16,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  formTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#333',
    color: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#555',
  },
  button: {
    backgroundColor: '#00FFA2',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 20,
  },
  linkText: {
    color: '#00FFA2',
    fontSize: 16,
  },
  dashboard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  featureCard: {
    backgroundColor: '#333',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#555',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDesc: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Logo Styles
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoHands: {
    width: 100,
    height: 100,
    backgroundColor: '#2D7A7A',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  logoRobot: {
    width: 70,
    height: 70,
    backgroundColor: '#359999',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  logoScreen: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  logoHeart: {
    fontSize: 24,
    color: '#FF6B35',
    position: 'absolute',
  },
  logoPlus: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    position: 'absolute',
    backgroundColor: '#FF6B35',
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: 'center',
    lineHeight: 20,
    top: 5,
    right: 5,
  },
  // New Logo Design Styles
  logoMain: {
    position: 'relative',
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoDevice: {
    width: 70,
    height: 70,
    backgroundColor: '#359999',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  logoStethoscope: {
    position: 'absolute',
    bottom: -20,
    right: 10,
    width: 60,
    height: 60,
  },
  logoTube: {
    position: 'absolute',
    bottom: 15,
    right: 25,
    width: 3,
    height: 30,
    backgroundColor: '#2D7A7A',
    borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },
  logoEarpiece: {
    position: 'absolute',
    bottom: 5,
    right: 15,
    width: 20,
    height: 20,
    backgroundColor: '#2D7A7A',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default App;
