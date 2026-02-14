import api from './api';

const reviewService = {
  // Add review
  addReview: async (reviewData) => {
    const response = await api.post('/api/review/add', reviewData);
    return response.data;
  },

  // Get my reviews (reviews I gave)
  getMyReviews: async () => {
    const response = await api.get('/api/review/my-reviews');
    return response.data;
  },

  // Get reviews for a provider (public)
  getProviderReviews: async (providerId) => {
    const response = await api.get(`/api/review/provider/${providerId}`);
    return response.data;
  },

  // Get reviews received by provider (for provider dashboard)
  getMyReceivedReviews: async () => {
    const response = await api.get('/api/review/received');
    return response.data;
  }
};

export default reviewService;