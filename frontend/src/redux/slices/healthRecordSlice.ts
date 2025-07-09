import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HealthRecord {
  id: string;
  title: string;
  description: string;
  recordType: 'lab_result' | 'prescription' | 'imaging' | 'vaccination' | 'discharge_summary' | 'doctor_note' | 'insurance' | 'other';
  fileUrl: string;
  fileType: string;
  fileSize: number;
  originalFilename: string;
  tags: string[];
  metadata: {
    doctor: string;
    hospital: string;
    date: string;
    additionalInfo: any;
  };
  isShared: boolean;
  sharedWith: string[];
  createdAt: string;
  updatedAt: string;
}

interface HealthRecordState {
  records: HealthRecord[];
  sharedRecords: HealthRecord[];
  currentRecord: HealthRecord | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
}

const initialState: HealthRecordState = {
  records: [],
  sharedRecords: [],
  currentRecord: null,
  loading: false,
  error: null,
  uploadProgress: 0
};

const healthRecordSlice = createSlice({
  name: 'healthRecords',
  initialState,
  reducers: {
    fetchRecordsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRecordsSuccess: (state, action: PayloadAction<HealthRecord[]>) => {
      state.records = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchRecordsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchSharedRecordsSuccess: (state, action: PayloadAction<HealthRecord[]>) => {
      state.sharedRecords = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchRecordByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchRecordByIdSuccess: (state, action: PayloadAction<HealthRecord>) => {
      state.currentRecord = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchRecordByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    uploadRecordStart: (state) => {
      state.loading = true;
      state.error = null;
      state.uploadProgress = 0;
    },
    uploadRecordProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    uploadRecordSuccess: (state, action: PayloadAction<HealthRecord>) => {
      state.records.unshift(action.payload);
      state.loading = false;
      state.error = null;
      state.uploadProgress = 100;
    },
    uploadRecordFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.uploadProgress = 0;
    },
    updateRecordStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateRecordSuccess: (state, action: PayloadAction<HealthRecord>) => {
      const index = state.records.findIndex(record => record.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
      if (state.currentRecord && state.currentRecord.id === action.payload.id) {
        state.currentRecord = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    updateRecordFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteRecordStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteRecordSuccess: (state, action: PayloadAction<string>) => {
      state.records = state.records.filter(record => record.id !== action.payload);
      if (state.currentRecord && state.currentRecord.id === action.payload) {
        state.currentRecord = null;
      }
      state.loading = false;
      state.error = null;
    },
    deleteRecordFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    shareRecordStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    shareRecordSuccess: (state, action: PayloadAction<HealthRecord>) => {
      const index = state.records.findIndex(record => record.id === action.payload.id);
      if (index !== -1) {
        state.records[index] = action.payload;
      }
      if (state.currentRecord && state.currentRecord.id === action.payload.id) {
        state.currentRecord = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    shareRecordFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearHealthRecordErrors: (state) => {
      state.error = null;
    },
    resetUploadProgress: (state) => {
      state.uploadProgress = 0;
    }
  },
});

export const {
  fetchRecordsStart,
  fetchRecordsSuccess,
  fetchRecordsFailure,
  fetchSharedRecordsSuccess,
  fetchRecordByIdStart,
  fetchRecordByIdSuccess,
  fetchRecordByIdFailure,
  uploadRecordStart,
  uploadRecordProgress,
  uploadRecordSuccess,
  uploadRecordFailure,
  updateRecordStart,
  updateRecordSuccess,
  updateRecordFailure,
  deleteRecordStart,
  deleteRecordSuccess,
  deleteRecordFailure,
  shareRecordStart,
  shareRecordSuccess,
  shareRecordFailure,
  clearHealthRecordErrors,
  resetUploadProgress
} = healthRecordSlice.actions;

export default healthRecordSlice.reducer;
