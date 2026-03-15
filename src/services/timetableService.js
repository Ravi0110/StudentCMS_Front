import api from './api';

const timetableService = {
  getAll: (params) => api.get('/timetable', { params }),
  getById: (id) => api.get(`/timetable/${id}`),
  create: (data) => api.post('/timetable', data),
  update: (id, data) => api.put(`/timetable/${id}`, data),
  delete: (id) => api.delete(`/timetable/${id}`),
  getByClass: (classId) => api.get(`/timetable/class/${classId}`),
  getByTeacher: (teacherId) => api.get(`/timetable/teacher/${teacherId}`),
  getWeekly: (classId) => api.get(`/timetable/weekly/${classId}`),
};

export default timetableService;
