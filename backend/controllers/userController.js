const User = require('../models/userModel');
const { admin } = require('../middleware/authMiddleware'); // Import admin for potential future use if needed

// Get user profile
exports.getUserProfile = async (req, res) => {
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
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user profile',
      error: error.message
    });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, photoUrl, emergencyContact, schedule } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (photoUrl) updateData.photoUrl = photoUrl;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;
    if (schedule) updateData.schedule = schedule;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message
    });
  }
};

// Delete user account
exports.deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user from Firebase
    await admin.auth().deleteUser(user.uid);
    
    // Delete user from MongoDB
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    console.error('Delete user account error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user account',
      error: error.message
    });
  }
};

// Create or update user in MongoDB from Firebase Auth
exports.createOrUpdateUserFromFirebase = async (req, res) => {
  try {
    // req.user contains the decoded Firebase ID token payload
    const { uid, email, name, picture } = req.user; // Assuming these fields are in the ID token payload

    // Find user by Firebase UID
    let user = await User.findOne({ uid: uid });

    if (user) {
      // User found, update their information if necessary
      // You can add more fields to update here based on your needs
      user.email = email || user.email; // Update email if provided
      // Update first name and last name if 'name' is available and user model has separate fields
      if (name) {
        const nameParts = name.split(' ');
        user.firstName = nameParts[0];
        if (nameParts.length > 1) {
          user.lastName = nameParts.slice(1).join(' ');
        }
      }
       user.profileImage = picture || user.profileImage;

      await user.save();
      res.status(200).json({
        success: true,
        data: user,
        message: 'User profile updated from Firebase'
      });
    } else {
      // User not found, create a new one
      // Initialize with basic info from Firebase Auth
      const nameParts = name ? name.split(' ') : [];
      user = new User({
        uid: uid,
        email: email,
        firstName: nameParts.length > 0 ? nameParts[0] : '',
        lastName: nameParts.length > 1 ? nameParts.slice(1).join(' ') : '',
        profileImage: picture,
        // You can initialize other default fields here if needed
        notificationPreferences: { // Set default notification preferences
          medicationReminders: true,
          appointmentReminders: true,
          dietReminders: true,
          vitalsReminders: true,
          pushNotifications: true,
          whatsappNotifications: false,
          emailNotifications: false,
          smsNotifications: false,
          caregiverNotifications: false
        }
      });

      await user.save();
      res.status(201).json({
        success: true,
        data: user,
        message: 'New user created from Firebase'
      });
    }
  } catch (error) {
    console.error('Error creating/updating user from Firebase:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing user from Firebase',
      error: error.message
    });
  }
};
