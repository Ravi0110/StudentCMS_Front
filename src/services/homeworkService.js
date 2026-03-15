import api from './api';

const homeworkService = {
  getAll: (params) => api.get('/homework', { params }),
  getById: (id) => api.get(`/homework/${id}`),
  create: (data) => api.post('/homework', data),
  update: (id, data) => api.put(`/homework/${id}`, data),
  delete: (id) => api.delete(`/homework/${id}`),
  getByClass: (classId) => api.get(`/homework/class/${classId}`),
  getByTeacher: (teacherId) => api.get(`/homework/teacher/${teacherId}`),
  submitHomework: (id, formData) =>
    api.post(`/homework/${id}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default homeworkService;
