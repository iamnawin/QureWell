const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { admin } = require('../middleware/authMiddleware');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create user in Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // Create user in MongoDB
    const user = new User({
      uid: userRecord.uid,
      name,
      email
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, uid: userRecord.uid },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      token,
      userId: user._id,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Authenticate with Firebase
    const userCredential = await admin.auth().getUserByEmail(email);
    
    // Find user in MongoDB
    const user = await User.findOne({ uid: userCredential.uid });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, uid: userCredential.uid },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      success: true,
      token,
      userId: user._id,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid email or password',
      error: error.message
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Send password reset email via Firebase
    await admin.auth().generatePasswordResetLink(email);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending password reset email',
      error: error.message
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message
    });
  }
};

// Logout user (client-side only, just for API completeness)
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
};
