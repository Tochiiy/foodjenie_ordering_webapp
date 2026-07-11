import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  isAuthenticated: false,
  error: null,
    isUpdated: false,
  Message: null,
  success: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userRequest: (state) => {
      state.loading = true;
      state.isAuthenticated = false;
      state.error = null;
    },
    userSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    userFail: (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
      state.user = null;
    },
    logoutSuccess: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    },
    logoutFail: (state, action) => {
      state.error = action.payload;
    },

    updateRequest: (state) => {
      state.loading = true;
    },
    updateSuccess: (state, action) => {
      state.loading = false;
      state.isUpdated = action.payload;
    },
    updateFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateReset: (state) => {
      state.isUpdated = false;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  userRequest,
  userSuccess,
  userFail,
  logoutSuccess,
  logoutFail,
  updateRequest,
  updateSuccess,
  updateFail,
  updateReset,
  clearError,
} = userSlice.actions;
export default userSlice.reducer;
