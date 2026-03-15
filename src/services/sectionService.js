import api from './api';

const sectionService = {
  getAll: (params) => api.get('/admin/section', { params }),
  getById: (id) => api.get(`/admin/section/${id}`),
  create: (data) => api.post('/admin/section', data),
  update: (id, data) => api.put(`/admin/section/${id}`, data),
  delete: (id) => api.delete(`/admin/section/${id}`),
};

export default sectionService;
