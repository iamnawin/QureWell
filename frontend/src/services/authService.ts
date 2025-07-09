import { loginStart, loginSuccess, loginFailure, logout, registerStart, registerSuccess, registerFailure } from '../redux/slices/authSlice';
import { AppThunk } from '../redux/store'; // Assuming AppThunk is defined in your store file
import auth from '@react-native-firebase/auth'; // React Native Firebase Auth
import axios from 'axios'; // Assuming axios is used for backend API calls

// Replace with your backend API URL
const BACKEND_API_URL = 'http://localhost:5000/api';

// Async Thunk for User Login
export const login = (email, password): AppThunk => async dispatch => {
  dispatch(loginStart());
  try {
    // 1. Sign in with Firebase Auth
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // 2. Get Firebase ID Token
    const idToken = await user.getIdToken();

    // 3. Call backend endpoint to create/update user in MongoDB
    const backendResponse = await axios.post(
      `${BACKEND_API_URL}/users/create-from-firebase`,
      { /* You can send additional profile data here if needed */ },
      {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      }
    );

    // Assuming your backend returns the necessary token and userId upon success
    const { token, userId } = backendResponse.data;

    // 4. Dispatch success action with data from backend response
    dispatch(loginSuccess({ token, userId }));

    // You might want to store the token and userId in AsyncStorage here if not handled by Redux Persist

  } catch (error) {
    console.error('Login Error:', error);
    // Dispatch failure action with error message
    dispatch(loginFailure(error.message || 'Login failed'));
  }
};

// Async Thunk for User Registration
export const register = (name, email, password): AppThunk => async dispatch => {
  dispatch(registerStart());
  try {
    // 1. Create user with Firebase Auth
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Note: Firebase Auth does not store display name directly during email/password creation.
    // The 'name' will be sent to the backend to be stored in MongoDB.

    // 2. Get Firebase ID Token
    const idToken = await user.getIdToken();

    // 3. Call backend endpoint to create/update user in MongoDB
     const backendResponse = await axios.post(
      `${BACKEND_API_URL}/users/create-from-firebase`,
      { name, email, /* Add other initial profile data if available */ }, // Send name and email to backend
      {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      }
    );

    // Assuming your backend returns the necessary token and userId upon success (optional for register)
    const { token, userId } = backendResponse.data; // Your backend's create-from-firebase might return this

    // 4. Dispatch success action
    dispatch(registerSuccess()); // Or dispatch loginSuccess if you want to auto-login after register

     // If you auto-login, dispatch loginSuccess with token and userId from backendResponse.data
    // dispatch(loginSuccess({ token, userId }));

  } catch (error) {
    console.error('Registration Error:', error);
    // Dispatch failure action with error message
    dispatch(registerFailure(error.message || 'Registration failed'));
  }
};

// You can add other auth related thunks here (e.g., forgot password, logout, etc.)

// Example of a logout thunk (client-side Firebase sign out)
export const logoutUser = (): AppThunk => async dispatch => {
  try {
    await auth().signOut();
    // You might also call a backend logout endpoint here if needed
    // await axios.post(`${BACKEND_API_URL}/auth/logout`); // If you have a server-side logout
    dispatch(logout()); // Dispatch the logout action from the slice
  } catch (error) {
    console.error('Logout Error:', error);
    // Handle logout error if necessary
  }
}; 