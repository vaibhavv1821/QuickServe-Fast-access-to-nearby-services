import api from './api';

const chatService = {
  createChat: async (providerId) => {
    const response = await api.post('/api/chat/create', { providerId });
    return response.data;
  },

  getMyChats: async () => {
    const response = await api.get('/api/chat/my-chats');
    return response.data;
  },

  getChatById: async (chatId) => {
    const response = await api.get(`/api/chat/${chatId}`);
    return response.data;
  },

  sendMessage: async (chatId, message) => {
    const response = await api.post(`/api/chat/send/${chatId}`, { message });
    return response.data;
  },

  markAsRead: async (chatId) => {
    const response = await api.put(`/api/chat/mark-read/${chatId}`);
    return response.data;
  }
};

export default chatService;