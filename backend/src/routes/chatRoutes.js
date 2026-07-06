const express = require('express');
const router = express.Router();
const {
  createChat,
  sendMessage,
  getMyChats,
  getChatById,
  markMessagesAsRead,
  deleteChat
} = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected (need login)
router.post('/create', protect, createChat);
router.post('/send/:chatId', protect, sendMessage);
router.get('/my-chats', protect, getMyChats);
router.get('/:chatId', protect, getChatById);
router.put('/mark-read/:chatId', protect, markMessagesAsRead);
router.delete('/delete/:chatId', protect, deleteChat);

module.exports = router;