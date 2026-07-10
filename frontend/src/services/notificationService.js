import api from './api';

const notificationService = {
  getMyNotifications: async () => {
    const response = await api.get('/api/notification/my-notifications');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/api/notification/unread-count');
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/api/notification/mark-read/${notificationId}`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/api/notification/mark-all-read');
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/api/notification/delete/${notificationId}`);
    return response.data;
  }
};

export default notificationService;