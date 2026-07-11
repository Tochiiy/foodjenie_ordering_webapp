import api from "../../utils/api";
import {
  orderRequest,
  orderSuccess,
  orderFail,
  singleOrderRequest,
  singleOrderSuccess,
  singleOrderFail,
  createOrderRequest,
  createOrderSuccess,
  createOrderFail,
} from "../slices/orderSlice";

export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch(createOrderRequest());
    const { data } = await api.post("/v1/orders", orderData, {
      headers: { "Content-Type": "application/json" },
    });
    dispatch(createOrderSuccess(data.data));
  } catch (error) {
    dispatch(createOrderFail(error.response?.data?.message || error.message));
  }
};

export const getMyOrders = () => async (dispatch) => {
  try {
    dispatch(orderRequest());
    const { data } = await api.get("/v1/orders");
    dispatch(orderSuccess(data.data));
  } catch (error) {
    dispatch(orderFail(error.response?.data?.message || error.message));
  }
};

export const getOrder = (id) => async (dispatch) => {
  try {
    dispatch(singleOrderRequest());
    const { data } = await api.get(`/v1/orders/${id}`);
    dispatch(singleOrderSuccess(data.data));
  } catch (error) {
    dispatch(singleOrderFail(error.response?.data?.message || error.message));
  }
};
