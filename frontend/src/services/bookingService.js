import api from './api';

const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/api/booking/create', bookingData);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/api/booking/my-bookings');
    return response.data;
  },

  getProviderBookings: async () => {
    const response = await api.get('/api/booking/provider-bookings');
    return response.data;
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await api.put(`/api/booking/update-status/${bookingId}`, { status });
    return response.data;
  },

  cancelBooking: async (bookingId) => {
    const response = await api.put(`/api/booking/cancel/${bookingId}`);
    return response.data;
  }
};

export default bookingService;