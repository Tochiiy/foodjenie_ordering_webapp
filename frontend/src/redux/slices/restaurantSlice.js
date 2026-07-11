import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  restaurants: [],
  count: 0,
  loading: false,
  error: null,
  showVegOnly: false,
  pureVegRestaurantsCount: 0,
  creating: false,
  createError: null,
  deleting: false,
  deleteError: null,
};

const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    getRestaurantsRequest: (state) => {
      state.loading = true;
    },

    getRestaurantSuccess: (state, action) => {
      state.loading = false;
      state.restaurants = action.payload.restaurants;
      state.count = action.payload.count;
      state.pureVegRestaurantsCount = action.payload.restaurants.filter(
        (r) => r.isVeg
      ).length;
    },

    getRestaurantsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    createRestaurantRequest: (state) => {
      // fix: Restuarant → Restaurant
      state.creating = true;
    },

    createRestaurantSuccess: (state, action) => {
      state.creating = false;
      state.restaurants.push(action.payload);
      state.count += 1;
    },

    createRestaurantFail: (state, action) => {
      state.creating = false;
      state.createError = action.payload;
    },

    deleteRestaurantRequest: (state) => {
      state.deleting = true;
    },

    deleteRestaurantSuccess: (state, action) => {
      state.deleting = false;
      state.restaurants = state.restaurants.filter(
        (restaurant) => restaurant._id !== action.payload,
      );
      state.count -= 1;
    },

    deleteRestaurantFail: (state, action) => {
      state.deleting = false;
      state.deleteError = action.payload;
    },

    sortByRatings: (state) => {
      if (state.restaurants && state.restaurants.length > 0) {
        state.restaurants.sort((a, b) => b.ratings - a.ratings);
      }
    },

    sortByReviews: (state) => {
      if (state.restaurants && state.restaurants.length > 0) {
        state.restaurants.sort((a, b) => b.numOfReviews - a.numOfReviews);
      }
    },

    toggleVegOnly: (state) => {
      state.showVegOnly = !state.showVegOnly;
    },

    clearError: (state) => {
      state.error = null;
      state.createError = null;
      state.deleteError = null;
    },
  },
});

export const {
  getRestaurantsRequest,
  getRestaurantSuccess,
  getRestaurantsFail,
  createRestaurantRequest,
  createRestaurantSuccess,
  createRestaurantFail,
  deleteRestaurantRequest,
  deleteRestaurantSuccess,
  deleteRestaurantFail,
  sortByRatings,
  sortByReviews,
  toggleVegOnly,
  clearError,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
