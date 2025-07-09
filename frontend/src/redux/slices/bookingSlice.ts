import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../store';
import api from '../../utils/api';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience: number;
}

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  location: string;
  notes: string;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
}

interface BookingState {
  doctors: Doctor[];
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  doctors: [],
  appointments: [],
  loading: false,
  error: null
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    fetchDoctorsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDoctorsSuccess(state, action: PayloadAction<Doctor[]>) {
      state.doctors = action.payload;
      state.loading = false;
    },
    fetchDoctorsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchAppointmentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAppointmentsSuccess(state, action: PayloadAction<Appointment[]>) {
      state.appointments = action.payload;
      state.loading = false;
    },
    fetchAppointmentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    bookAppointmentStart(state) {
      state.loading = true;
      state.error = null;
    },
    bookAppointmentSuccess(state, action: PayloadAction<Appointment>) {
      state.appointments.push(action.payload);
      state.loading = false;
    },
    bookAppointmentFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    cancelAppointmentStart(state) {
      state.loading = true;
      state.error = null;
    },
    cancelAppointmentSuccess(state, action: PayloadAction<string>) {
      const index = state.appointments.findIndex(appointment => appointment.id === action.payload);
      if (index !== -1) {
        state.appointments[index].status = 'cancelled';
      }
      state.loading = false;
    },
    cancelAppointmentFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const {
  fetchDoctorsStart,
  fetchDoctorsSuccess,
  fetchDoctorsFailure,
  fetchAppointmentsStart,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
  bookAppointmentStart,
  bookAppointmentSuccess,
  bookAppointmentFailure,
  cancelAppointmentStart,
  cancelAppointmentSuccess,
  cancelAppointmentFailure
} = bookingSlice.actions;

export const fetchDoctors = (): AppThunk => async dispatch => {
  try {
    dispatch(fetchDoctorsStart());
    const response = await api.get('/api/doctors');
    dispatch(fetchDoctorsSuccess(response.data));
  } catch (error) {
    dispatch(fetchDoctorsFailure(error.message));
  }
};

export const fetchAppointments = (): AppThunk => async dispatch => {
  try {
    dispatch(fetchAppointmentsStart());
    const response = await api.get('/api/appointments');
    dispatch(fetchAppointmentsSuccess(response.data));
  } catch (error) {
    dispatch(fetchAppointmentsFailure(error.message));
  }
};

export const bookAppointment = (appointmentData: Partial<Appointment>): AppThunk => async dispatch => {
  try {
    dispatch(bookAppointmentStart());
    const response = await api.post('/api/appointments', appointmentData);
    dispatch(bookAppointmentSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(bookAppointmentFailure(error.message));
    throw error;
  }
};

export const cancelAppointment = (appointmentId: string): AppThunk => async dispatch => {
  try {
    dispatch(cancelAppointmentStart());
    await api.put(`/api/appointments/${appointmentId}/cancel`);
    dispatch(cancelAppointmentSuccess(appointmentId));
  } catch (error) {
    dispatch(cancelAppointmentFailure(error.message));
  }
};

export default bookingSlice.reducer;
