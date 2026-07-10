import api from './api';

const providerService = {
  createProfile: async (profileData) => {
    const response = await api.post('/api/provider/create', profileData);
    return response.data;
  },

  getMyProfile: async () => {
    const response = await api.get('/api/provider/me');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/api/provider/update', profileData);
    return response.data;
  },

  updateUserLocation: async (locationData) => {
    const response = await api.put('/api/user/profile', { location: locationData });
    return response.data;
  },

  getAllProviders: async () => {
    const response = await api.get('/api/provider/all');
    return response.data;
  }
};

export default providerService;