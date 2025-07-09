import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  reminderEnabled: boolean;
}

interface MedicationState {
  medications: Medication[];
  loading: boolean;
  error: string | null;
}

const initialState: MedicationState = {
  medications: [],
  loading: false,
  error: null,
};

const medicationSlice = createSlice({
  name: 'medications',
  initialState,
  reducers: {
    fetchMedicationsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMedicationsSuccess: (state, action: PayloadAction<Medication[]>) => {
      state.medications = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchMedicationsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addMedicationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addMedicationSuccess: (state, action: PayloadAction<Medication>) => {
      state.medications.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    addMedicationFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateMedicationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateMedicationSuccess: (state, action: PayloadAction<Medication>) => {
      const index = state.medications.findIndex(med => med.id === action.payload.id);
      if (index !== -1) {
        state.medications[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    updateMedicationFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteMedicationStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteMedicationSuccess: (state, action: PayloadAction<string>) => {
      state.medications = state.medications.filter(med => med.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    deleteMedicationFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchMedicationsStart,
  fetchMedicationsSuccess,
  fetchMedicationsFailure,
  addMedicationStart,
  addMedicationSuccess,
  addMedicationFailure,
  updateMedicationStart,
  updateMedicationSuccess,
  updateMedicationFailure,
  deleteMedicationStart,
  deleteMedicationSuccess,
  deleteMedicationFailure,
} = medicationSlice.actions;

export default medicationSlice.reducer;
