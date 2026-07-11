import api from "../../utils/api";

import {
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
} from "../slices/restaurantSlice";

export const getRestaurants =
  (keyword = "") =>
  async (dispatch) => {
    try {
      dispatch(getRestaurantsRequest());

      const params = new URLSearchParams({ keyword });
      const { data: response } = await api.get(`/v1/eats/stores?${params}`);

      dispatch(
        getRestaurantSuccess({
          restaurants: response.data,
          count: response.count,
        }),
      );
    } catch (error) {
      dispatch(
        getRestaurantsFail(error.response?.data?.message || error.message),
      );
    }
  };

export const createRestaurant = (restaurantData) => async (dispatch) => {
  try {
    dispatch(createRestaurantRequest());

    const { data: response } = await api.post(
      "/v1/eats/stores",
      restaurantData,
    );

    dispatch(createRestaurantSuccess(response.data));
  } catch (error) {
    dispatch(
      createRestaurantFail(error.response?.data?.message || error.message),
    );
  }
};

export const deleteRestaurant = (id) => async (dispatch) => {
  try {
    dispatch(deleteRestaurantRequest());

    await api.delete(`/v1/eats/stores/${id}`);

    dispatch(deleteRestaurantSuccess(id));
  } catch (error) {
    dispatch(
      deleteRestaurantFail(error.response?.data?.message || error.message),
    );
  }
};
