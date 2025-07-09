const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    match: [
      /^\+?[1-9]\d{1,14}$/,
      'Please add a valid phone number with country code'
    ]
  },
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer not to say']
  },
  height: {
    value: Number,
    unit: {
      type: String,
      enum: ['cm', 'ft'],
      default: 'cm'
    }
  },
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ['kg', 'lb'],
      default: 'kg'
    }
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown']
  },
  allergies: [String],
  chronicConditions: [String],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  caregiver: {
    name: String,
    relationship: String,
    phone: String,
    email: String
  },
  profileImage: {
    type: String
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  notificationPreferences: {
    medicationReminders: {
      type: Boolean,
      default: true
    },
    appointmentReminders: {
      type: Boolean,
      default: true
    },
    dietReminders: {
      type: Boolean,
      default: true
    },
    vitalsReminders: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: true
    },
    whatsappNotifications: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: false
    },
    smsNotifications: {
      type: Boolean,
      default: false
    },
    caregiverNotifications: {
      type: Boolean,
      default: false
    }
  },
  deviceTokens: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
