import api from './api';

const classService = {
  getAll: (params) => api.get('/admin/class', { params }),
  getById: (id) => api.get(`/admin/class/${id}`),
  create: (data) => api.post('/admin/class', data),
  update: (id, data) => api.put(`/admin/class/${id}`, data),
  delete: (id) => api.delete(`/admin/class/${id}`),
};

export default classService;
