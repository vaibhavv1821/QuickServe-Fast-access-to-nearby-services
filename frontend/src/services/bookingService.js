import api from './api';

const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/api/booking/create', bookingData);
    return response.data;
  },

  // Get my bookings (for users)
  getMyBookings: async () => {
    const response = await api.get('/api/booking/my-bookings');
    return response.data;
  },

  // Get provider bookings (for providers)
  getProviderBookings: async () => {
    const response = await api.get('/api/booking/provider-bookings');
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (bookingId, status) => {
    const response = await api.put(`/api/booking/update-status/${bookingId}`, { status });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (bookingId) => {
    const response = await api.put(`/api/booking/cancel/${bookingId}`);
    return response.data;
  }
};

export default bookingService;