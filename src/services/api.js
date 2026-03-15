import axios from 'axios';
import config from '../config';

// ─── Axios Instance ─────────────────────────────────────────────
const api = axios.create({
  baseURL: config.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ────────────────────────────────────────
api.interceptors.request.use(
  (reqConfig) => {
    const token = localStorage.getItem(config.TOKEN_KEY);
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    return reqConfig;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ───────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Token expired or invalid — clear auth & redirect
      localStorage.removeItem(config.TOKEN_KEY);
      localStorage.removeItem(config.REFRESH_TOKEN_KEY);
      localStorage.removeItem(config.USER_KEY);
      window.location.href = '/login';
    }

    if (status === 403) {
      console.error('Access denied — insufficient permissions.');
    }

    if (status === 500) {
      console.error('Internal server error.');
    }

    return Promise.reject(error);
  }
);

export default api;
