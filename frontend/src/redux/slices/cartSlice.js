import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItem: [],
  loading: false,
  resturant: {},
  deliveryInfo: {
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  },
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    cartRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    cartSuccess: (state, action) => {
      state.loading = false;
      state.cartItem = action.payload.foodItems || [];
      state.resturant = action.payload.restaurant || {};
    },
    cartFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateCartSuccess: (state, action) => {
      state.loading = false;
      state.cartItem = action.payload.foodItems || [];
      state.resturant = action.payload.restaurant || {};
    },
    removeCartSuccess: (state, action) => {
      state.loading = false;
      state.cartItem = action.payload.foodItems || [];
      state.resturant = action.payload.restaurant || {};
    },
    clearCartState: (state) => {
      state.cartItem = [];
      state.resturant = {};
      state.loading = false;
      state.error = null;
    },
    saveDeliveryInfo: (state, action) => {
      state.deliveryInfo = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  cartRequest,
  cartSuccess,
  cartFail,
  updateCartSuccess,
  removeCartSuccess,
  saveDeliveryInfo,
  clearCartState,
  clearError,
} = cartSlice.actions;
export default cartSlice.reducer;
