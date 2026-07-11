import axios from 'axios';
import qs from 'qs';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
    baseURL: API_BASE ? `${API_BASE}/api` : '/api',
    withCredentials: true,
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
})

// Auth
export const signup = data => api.post('/v1/users/signup', data);
export const login = data => api.post('/v1/users/login', data);

// Restaurants
export const getRestaurants = params => api.get('/v1/eats/stores', { params });
export const createRestaurant = data => api.post('/v1/eats/stores', data);

// Menus
export const getMenus = storeId => api.get(`/v1/eats/stores/${storeId}/menus`);
export const createMenu = (storeId, data) => api.post(`/v1/eats/stores/${storeId}/menus`, data);
export const addItemToMenu = (storeId, menuId, data) => api.patch(`/v1/eats/stores/${storeId}/menus/${menuId}/addItem`, data);

// Payment
export const processPayment = data => api.post('/v1/payment/process', data);
export const getStripeApiKey = () => api.get('/v1/payment/stripeapikey');

// Cart
export const addToCart = data => api.post('/v1/cart', data);
export const getCart = () => api.get('/v1/cart');
export const updateCartItemQuantity = (foodItemId, data) => api.put(`/v1/cart/item/${foodItemId}`, data);
export const removeFromCart = foodItemId => api.delete(`/v1/cart/item/${foodItemId}`);
export const clearCart = restaurantId => api.delete(`/v1/cart/clear/${restaurantId}`);

export default api;
