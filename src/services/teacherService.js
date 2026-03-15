import api from './api';

const teacherService = {
  getAll: (params) => api.get('/admin/teacher', { params }),
  getById: (id) => api.get(`/admin/teacher/${id}`),
  create: (data) => api.post('/admin/teacher', data),
  update: (id, data) => api.put(`/admin/teacher/${id}`, data),
  delete: (id) => api.delete(`/admin/teacher/${id}`),
};

export default teacherService;
