import api from './api';

const parentService = {
  /**
   * Search for parents (users with role=customer)
   * GET /users/search?query=
   */
  searchUsers: async (query) => {
    const { data } = await api.get('/users/search', { params: { q: query, role: 'customer' } });
    // Payload from backend is in { payload: { result: [...] } }
    return data.payload.result;
  },

  /**
   * Create new parent
   * POST /users
   */
  createUser: async (userData) => {
    const { data } = await api.post('/users', { ...userData, role: 'customer' });
    return data.payload.result;
  },

  /**
   * Link parent to student
   * POST /parent-student
   */
  linkParentStudent: async (linkData) => {
    const { data } = await api.post('/parent-student', linkData);
    return data.payload.result;
  },

  /**
   * Get children linked to a parent
   * GET /parent-student/:parentId
   */
  getParentChildren: async (parentId) => {
    const { data } = await api.get(`/parent-student/${parentId}`);
    return data.payload.result;
  },

  /**
   * Unlink parent from student
   */
  unlinkParentStudent: async (parentId, studentId) => {
    const { data } = await api.delete(`/parent-student/${parentId}/${studentId}`);
    return data;
  },

  /**
   * Get all parents (shortcut for admin list)
   */
  getAll: async (params) => {
    const { data } = await api.get('/users', { params });
    return data.payload;
  }
};

export default parentService;
