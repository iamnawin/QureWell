import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface VitalReading {
  id: string;
  type: 'blood_pressure' | 'heart_rate' | 'blood_sugar' | 'weight' | 'temperature' | 'oxygen';
  value: string | number;
  unit: string;
  timestamp: string;
  notes?: string;
}

interface VitalsState {
  readings: VitalReading[];
  loading: boolean;
  error: string | null;
}

const initialState: VitalsState = {
  readings: [],
  loading: false,
  error: null,
};

const vitalsSlice = createSlice({
  name: 'vitals',
  initialState,
  reducers: {
    fetchVitalsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchVitalsSuccess: (state, action: PayloadAction<VitalReading[]>) => {
      state.readings = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchVitalsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addVitalReadingStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addVitalReadingSuccess: (state, action: PayloadAction<VitalReading>) => {
      state.readings.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    addVitalReadingFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateVitalReadingStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateVitalReadingSuccess: (state, action: PayloadAction<VitalReading>) => {
      const index = state.readings.findIndex(reading => reading.id === action.payload.id);
      if (index !== -1) {
        state.readings[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    updateVitalReadingFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteVitalReadingStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteVitalReadingSuccess: (state, action: PayloadAction<string>) => {
      state.readings = state.readings.filter(reading => reading.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    deleteVitalReadingFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchVitalsStart,
  fetchVitalsSuccess,
  fetchVitalsFailure,
  addVitalReadingStart,
  addVitalReadingSuccess,
  addVitalReadingFailure,
  updateVitalReadingStart,
  updateVitalReadingSuccess,
  updateVitalReadingFailure,
  deleteVitalReadingStart,
  deleteVitalReadingSuccess,
  deleteVitalReadingFailure,
} = vitalsSlice.actions;

export default vitalsSlice.reducer;
