import api from './api';

const attendanceService = {
  getAll: (params) => api.get('/attendance', { params }),
  getById: (id) => api.get(`/attendance/${id}`),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`),
  getByDate: (date) => api.get('/attendance/date', { params: { date } }),
  getByStudent: (studentId) => api.get(`/attendance/student/${studentId}`),
  getByClass: (classId, date) => api.get(`/attendance/class/${classId}`, { params: { date } }),
  getTodaySummary: () => api.get('/attendance/today-summary'),
  markBulk: (data) => api.post('/attendance/bulk', data),
};

export default attendanceService;
