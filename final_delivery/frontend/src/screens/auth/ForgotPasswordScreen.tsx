import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleResetPassword = () => {
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (isValid) {
      // In a real app, dispatch an action to send reset email
      // dispatch(resetPasswordStart({ email }));
      setIsSubmitted(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>allforyourhealth</Text>
          <Text style={styles.tagline}>Reset your password</Text>
        </View>

        <View style={styles.formContainer}>
          {!isSubmitted ? (
            <>
              <Text style={styles.instructions}>
                Enter your email address and we'll send you instructions to reset your password.
              </Text>

              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!emailError}
              />
              {emailError ? <HelperText type="error">{emailError}</HelperText> : null}

              {error ? <HelperText type="error">{error}</HelperText> : null}

              <Button
                mode="contained"
                onPress={handleResetPassword}
                style={styles.button}
                loading={loading}
                disabled={loading}
              >
                Send Reset Instructions
              </Button>
            </>
          ) : (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>
                If an account exists with the email {email}, you will receive password reset instructions.
              </Text>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Login')}
                style={styles.button}
              >
                Back to Login
              </Button>
            </View>
          )}

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.textButton}
          >
            Back to Login
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#6A3DE8',
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  formContainer: {
    width: '100%',
  },
  instructions: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#6A3DE8',
  },
  textButton: {
    marginTop: 20,
  },
  successContainer: {
    alignItems: 'center',
  },
  successText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
});

export default ForgotPasswordScreen;
