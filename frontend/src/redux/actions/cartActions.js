import api from "../../utils/api";
import {
  cartRequest,
  cartSuccess,
  cartFail,
  updateCartSuccess,
  removeCartSuccess,
  clearCartState,
} from "../slices/cartSlice";

export const addToCart = ({ foodItemId, quantity, restaurantId }) => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await api.post("/v1/cart", { foodItemId, quantity, restaurantId }, {
      headers: { "Content-Type": "application/json" },
    });
    dispatch(cartSuccess(data.data));
  } catch (error) {
    dispatch(cartFail(error.response?.data?.message || error.message));
  }
};

export const getCart = (restaurantId) => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await api.get("/v1/cart", {
      params: { restaurantId },
    });
    dispatch(cartSuccess(data.data));
  } catch (error) {
    dispatch(cartFail(error.response?.data?.message || error.message));
  }
};

export const updateCartItemQuantity = (foodItemId, quantity) => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await api.put(`/v1/cart/item/${foodItemId}`, { quantity }, {
      headers: { "Content-Type": "application/json" },
    });
    dispatch(updateCartSuccess(data.data));
  } catch (error) {
    dispatch(cartFail(error.response?.data?.message || error.message));
  }
};

export const removeFromCart = (foodItemId) => async (dispatch) => {
  try {
    dispatch(cartRequest());
    const { data } = await api.delete(`/v1/cart/item/${foodItemId}`);
    dispatch(removeCartSuccess(data.data));
  } catch (error) {
    dispatch(cartFail(error.response?.data?.message || error.message));
  }
};

export const clearCart = (restaurantId) => async (dispatch) => {
  try {
    dispatch(cartRequest());
    await api.delete(`/v1/cart/clear/${restaurantId}`);
    dispatch(clearCartState());
  } catch (error) {
    dispatch(cartFail(error.response?.data?.message || error.message));
  }
};
