import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'medication' | 'appointment' | 'diet' | 'vitals' | 'system' | 'other';
  timestamp: string;
  read: boolean;
  actionRequired: boolean;
  actionUrl?: string;
}

interface NotificationSettings {
  medicationReminders: boolean;
  appointmentReminders: boolean;
  dietReminders: boolean;
  vitalsReminders: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  caregiverNotifications: boolean;
}

interface NotificationState {
  notifications: Notification[];
  settings: NotificationSettings;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  settings: {
    medicationReminders: true,
    appointmentReminders: true,
    dietReminders: true,
    vitalsReminders: true,
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: false,
    caregiverNotifications: false,
  },
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    fetchNotificationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchNotificationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    deleteNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    updateNotificationSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const {
  fetchNotificationsStart,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  updateNotificationSettings,
} = notificationSlice.actions;

export default notificationSlice.reducer;
