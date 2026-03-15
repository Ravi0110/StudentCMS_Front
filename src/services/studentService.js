import api from './api';

const studentService = {
  getAll: (params) => api.get('/admin/student', { params }),
  getById: (id) => api.get(`/admin/student/${id}`),
  create: (data) => api.post('/admin/student', data),
  update: (id, data) => api.put(`/admin/student/${id}`, data),
  delete: (id) => api.delete(`/admin/student/${id}`),
  bulkUpload: (data) => api.post('/admin/student/bulk-upload', data),
};

export default studentService;
