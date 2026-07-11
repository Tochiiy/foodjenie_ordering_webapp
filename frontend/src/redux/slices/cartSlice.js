import { createSlice } from "@reduxjs/toolkit";

const loadPendingCart = () => {
  try {
    const stored = localStorage.getItem("pendingOrder");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed._expiry && Date.now() < parsed._expiry && parsed.cartItem?.length) {
        return {
          cartItem: parsed.cartItem,
          resturant: parsed.resturant,
          deliveryInfo: parsed.deliveryInfo,
        };
      }
      localStorage.removeItem("pendingOrder");
    }

    // sessionStorage fallback — survives cross-origin round-trip, no expiry
    const items = sessionStorage.getItem("orderCartItems");
    if (items) {
      const cartItem = JSON.parse(items);
      if (cartItem?.length) {
        return {
          cartItem,
          resturant: JSON.parse(sessionStorage.getItem("orderRestaurant") || "{}"),
          deliveryInfo: JSON.parse(sessionStorage.getItem("orderDeliveryInfo") || "null"),
        };
      }
    }
  } catch (_) {}
  return null;
};

const pending = loadPendingCart();

const initialState = {
  cartItem: pending?.cartItem || [],
  loading: false,
  resturant: pending?.resturant || {},
  deliveryInfo: pending?.deliveryInfo || {
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
