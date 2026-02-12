import api from './api';

const searchService = {
  // Search providers with filters
  searchProviders: async (filters) => {
    const params = {};
    
    if (filters.serviceType) params.serviceType = filters.serviceType;
    if (filters.city) params.city = filters.city;
    if (filters.state) params.state = filters.state;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.minRating) params.minRating = filters.minRating;

    const response = await api.get('/api/search/providers', { params });
    return response.data;
  },

  // Get providers by service type
  getProvidersByService: async (serviceType) => {
    const response = await api.get(`/api/search/service/${serviceType}`);
    return response.data;
  },

  // Get providers by location
  getProvidersByLocation: async (city) => {
    const response = await api.get(`/api/search/location/${city}`);
    return response.data;
  },

  // Get top-rated providers
  getTopRatedProviders: async (limit = 10) => {
    const response = await api.get(`/api/search/top-rated?limit=${limit}`);
    return response.data;
  }
};

export default searchService;