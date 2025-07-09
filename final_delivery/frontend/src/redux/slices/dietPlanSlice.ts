import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DietPlan {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  meals: {
    id: string;
    name: string;
    time: string;
    foods: {
      name: string;
      quantity: string;
      calories: number;
    }[];
  }[];
  totalCalories: number;
  restrictions?: string[];
  notes?: string;
}

interface DietPlanState {
  dietPlans: DietPlan[];
  currentPlan: DietPlan | null;
  loading: boolean;
  error: string | null;
}

const initialState: DietPlanState = {
  dietPlans: [],
  currentPlan: null,
  loading: false,
  error: null,
};

const dietPlanSlice = createSlice({
  name: 'dietPlans',
  initialState,
  reducers: {
    fetchDietPlansStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDietPlansSuccess: (state, action: PayloadAction<DietPlan[]>) => {
      state.dietPlans = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchDietPlansFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentDietPlan: (state, action: PayloadAction<DietPlan>) => {
      state.currentPlan = action.payload;
    },
    createDietPlanStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createDietPlanSuccess: (state, action: PayloadAction<DietPlan>) => {
      state.dietPlans.push(action.payload);
      state.currentPlan = action.payload;
      state.loading = false;
      state.error = null;
    },
    createDietPlanFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateDietPlanStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateDietPlanSuccess: (state, action: PayloadAction<DietPlan>) => {
      const index = state.dietPlans.findIndex(plan => plan.id === action.payload.id);
      if (index !== -1) {
        state.dietPlans[index] = action.payload;
        if (state.currentPlan && state.currentPlan.id === action.payload.id) {
          state.currentPlan = action.payload;
        }
      }
      state.loading = false;
      state.error = null;
    },
    updateDietPlanFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteDietPlanStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteDietPlanSuccess: (state, action: PayloadAction<string>) => {
      state.dietPlans = state.dietPlans.filter(plan => plan.id !== action.payload);
      if (state.currentPlan && state.currentPlan.id === action.payload) {
        state.currentPlan = null;
      }
      state.loading = false;
      state.error = null;
    },
    deleteDietPlanFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDietPlansStart,
  fetchDietPlansSuccess,
  fetchDietPlansFailure,
  setCurrentDietPlan,
  createDietPlanStart,
  createDietPlanSuccess,
  createDietPlanFailure,
  updateDietPlanStart,
  updateDietPlanSuccess,
  updateDietPlanFailure,
  deleteDietPlanStart,
  deleteDietPlanSuccess,
  deleteDietPlanFailure,
} = dietPlanSlice.actions;

export default dietPlanSlice.reducer;
