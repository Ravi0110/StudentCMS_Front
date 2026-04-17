import api from './api';

const schoolService = {
  getAll: (params) => api.get('/admin/organization', { params }),
  getById: (id) => api.get(`/admin/organization/${id}`),
  create: (data) => api.post('/admin/organization', data),
  updateStatus: (id, status) => api.put(`/admin/organization/${id}`, { is_active: status }),
  getStats: () => api.get('/admin/super-admin/stats'),
};

export default schoolService;
