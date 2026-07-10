import api from './api';

const adminService = {
  getStats: async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
  },

  getAllProviders: async () => {
    const response = await api.get('/api/admin/providers');
    return response.data;
  },

  getPendingProviders: async () => {
    const response = await api.get('/api/admin/providers/pending');
    return response.data;
  },

  approveProvider: async (providerId) => {
    const response = await api.put(`/api/admin/providers/approve/${providerId}`);
    return response.data;
  },

  rejectProvider: async (providerId) => {
    const response = await api.put(`/api/admin/providers/reject/${providerId}`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
  },

  getAllBookings: async () => {
    const response = await api.get('/api/admin/bookings');
    return response.data;
  }
};

export default adminService;