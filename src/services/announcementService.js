import api from './api';

const announcementService = {
  getAll: (params) => api.get('/announcements', { params }),
  getById: (id) => api.get(`/announcements/${id}`),
  create: (data) => api.post('/announcements', data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
  getRecent: (limit = 5) => api.get('/announcements/recent', { params: { limit } }),
};

export default announcementService;
