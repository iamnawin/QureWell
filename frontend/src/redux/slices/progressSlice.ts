import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProgressEntry {
  id: string;
  type: 'weight' | 'exercise' | 'diet' | 'medication' | 'other';
  value: string | number;
  unit?: string;
  timestamp: string;
  notes?: string;
}

interface ProgressState {
  entries: ProgressEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  entries: [],
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    fetchProgressStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchProgressSuccess: (state, action: PayloadAction<ProgressEntry[]>) => {
      state.entries = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchProgressFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addProgressEntryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addProgressEntrySuccess: (state, action: PayloadAction<ProgressEntry>) => {
      state.entries.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    addProgressEntryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateProgressEntryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateProgressEntrySuccess: (state, action: PayloadAction<ProgressEntry>) => {
      const index = state.entries.findIndex(entry => entry.id === action.payload.id);
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    updateProgressEntryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteProgressEntryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteProgressEntrySuccess: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter(entry => entry.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    deleteProgressEntryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchProgressStart,
  fetchProgressSuccess,
  fetchProgressFailure,
  addProgressEntryStart,
  addProgressEntrySuccess,
  addProgressEntryFailure,
  updateProgressEntryStart,
  updateProgressEntrySuccess,
  updateProgressEntryFailure,
  deleteProgressEntryStart,
  deleteProgressEntrySuccess,
  deleteProgressEntryFailure,
} = progressSlice.actions;

export default progressSlice.reducer;
