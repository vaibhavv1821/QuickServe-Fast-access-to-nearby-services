import api from './api';

const reviewService = {
  addReview: async (reviewData) => {
    const response = await api.post('/api/review/add', reviewData);
    return response.data;
  },

  getMyReviews: async () => {
    const response = await api.get('/api/review/my-reviews');
    return response.data;
  },

  getProviderReviews: async (providerId) => {
    const response = await api.get(`/api/review/provider/${providerId}`);
    return response.data;
  },

  getMyReceivedReviews: async () => {
    const response = await api.get('/api/review/received');
    return response.data;
  }
};

export default reviewService;