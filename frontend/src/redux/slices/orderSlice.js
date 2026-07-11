import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  order: null,
  loading: false,
  error: null,
  creating: false,
  createError: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    orderRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    orderSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    orderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    singleOrderRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    singleOrderSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    singleOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createOrderRequest: (state) => {
      state.creating = true;
      state.createError = null;
    },
    createOrderSuccess: (state, action) => {
      state.creating = false;
      state.order = action.payload;
    },
    createOrderFail: (state, action) => {
      state.creating = false;
      state.createError = action.payload;
    },
    clearOrderError: (state) => {
      state.error = null;
      state.createError = null;
    },
  },
});

export const {
  orderRequest,
  orderSuccess,
  orderFail,
  singleOrderRequest,
  singleOrderSuccess,
  singleOrderFail,
  createOrderRequest,
  createOrderSuccess,
  createOrderFail,
  clearOrderError,
} = orderSlice.actions;
export default orderSlice.reducer;
