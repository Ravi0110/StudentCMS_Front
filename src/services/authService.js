import api from './api';

const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  loginAdmin: (credentials) => api.post('/admin/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  getAccessibleMenus: () => api.get('/module/accessible'),
};

export default authService;
