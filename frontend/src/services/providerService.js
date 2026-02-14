import api from './api';

const providerService = {
  // Create provider profile
  createProfile: async (profileData) => {
    const response = await api.post('/api/provider/create', profileData);
    return response.data;
  },

  // Get my provider profile
  getMyProfile: async () => {
    const response = await api.get('/api/provider/me');
    return response.data;
  },

  // Update provider profile
  updateProfile: async (profileData) => {
    const response = await api.put('/api/provider/update', profileData);
    return response.data;
  },

  // Update user location (for city/state)
  updateUserLocation: async (locationData) => {
    const response = await api.put('/api/user/profile', {
      location: locationData
    });
    return response.data;
  },

  // Get all providers (public)
  getAllProviders: async () => {
    const response = await api.get('/api/provider/all');
    return response.data;
  }
};

export default providerService;