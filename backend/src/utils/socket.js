const { Server } = require('socket.io');

const onlineUsers = new Map();

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('[Socket] Connected:', socket.id);

    socket.on('join', (userId) => {
      if (userId) {
        socket.join(userId);
        onlineUsers.set(userId, socket.id);
        io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      }
    });

    socket.on('joinChat', (chatId) => {
      socket.join(`chat_${chatId}`);
    });

    socket.on('leaveChat', (chatId) => {
      socket.leave(`chat_${chatId}`);
    });

    socket.on('typing', ({ chatId, userId }) => {
      socket.to(`chat_${chatId}`).emit('typing', { chatId, userId });
    });

    socket.on('stopTyping', ({ chatId, userId }) => {
      socket.to(`chat_${chatId}`).emit('stopTyping', { chatId, userId });
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit('onlineUsers', Array.from(onlineUsers.keys()));
      console.log('[Socket] Disconnected:', socket.id);
    });
  });

  return io;
};

module.exports = { initSocket };
