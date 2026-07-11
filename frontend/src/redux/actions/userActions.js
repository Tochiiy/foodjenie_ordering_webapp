import api from "../../utils/api";
import {
  userRequest,
  userSuccess,
  userFail,
  logoutSuccess,
  updateRequest,
  updateSuccess,
  updateFail,
} from "../slices/userSlice";

export const loginUser = (email, password) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const { data } = await api.post("/v1/users/login", { email, password }, {
      headers: { "Content-Type": "application/json" },
    });
    dispatch(userSuccess(data.data.user));
  } catch (error) {
    dispatch(userFail(error.response?.data?.message || error.message));
  }
};

export const registerUser = ({ name, email, password, passwordConfirm, phoneNumber }) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const { data } = await api.post("/v1/users/signup", { name, email, password, passwordConfirm, phoneNumber }, {
      headers: { "Content-Type": "application/json" },
    });
    dispatch(userSuccess(data.data.user));
  } catch (error) {
    dispatch(userFail(error.response?.data?.message || error.message));
  }
};

export const loadUser = () => async (dispatch) => {
  try {
    dispatch(userRequest());
    const { data } = await api.get("/v1/users/me");
    dispatch(userSuccess(data.data.user));
  } catch (error) {
    dispatch(userFail(error.response?.data?.message || error.message));
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    await api.post("/v1/users/logout");
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutSuccess());
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateRequest());
    const { data } = await api.put("/v1/users/me", userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(updateSuccess(true));
    dispatch(userSuccess(data.data.user));
  } catch (error) {
    dispatch(updateFail(error.response?.data?.message || error.message));
  }
};
