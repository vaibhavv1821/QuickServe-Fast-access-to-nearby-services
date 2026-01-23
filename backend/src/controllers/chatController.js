const Chat = require('../models/Chat');
const Provider = require('../models/Provider');
const User = require('../models/User');

// Create or get existing chat
const createChat = async (req, res) => {
  try {
    const { providerId } = req.body;

    // Verify provider exists
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      userId: req.user._id,
      providerId: providerId
    })
      .populate('userId', 'name email profileImage')
      .populate('providerId');

    if (chat) {
      return res.status(200).json({
        success: true,
        message: 'Chat already exists',
        chat
      });
    }

    // Create new chat
    chat = await Chat.create({
      userId: req.user._id,
      providerId: providerId
    });

    chat = await Chat.findById(chat._id)
      .populate('userId', 'name email profileImage')
      .populate('providerId');

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      chat
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message cannot be empty' });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Determine sender role
    let senderRole = 'user';
    if (req.user.role === 'provider') {
      // Check if this provider owns this chat
      const provider = await Provider.findOne({ userId: req.user._id });
      if (provider && chat.providerId.toString() === provider._id.toString()) {
        senderRole = 'provider';
      }
    } else {
      // Check if this user owns this chat
      if (chat.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You are not part of this chat' });
      }
    }

    // Add message to chat
    chat.messages.push({
      sender: req.user._id,
      senderRole: senderRole,
      message: message.trim(),
      timestamp: new Date(),
      isRead: false
    });

    chat.lastMessage = message.trim();
    chat.lastMessageTime = new Date();

    await chat.save();

    const updatedChat = await Chat.findById(chatId)
      .populate('userId', 'name email profileImage')
      .populate('providerId')
      .populate('messages.sender', 'name email profileImage');

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      chat: updatedChat
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all my chats
const getMyChats = async (req, res) => {
  try {
    let chats;

    if (req.user.role === 'provider') {
      // Get provider's chats
      const provider = await Provider.findOne({ userId: req.user._id });
      if (!provider) {
        return res.status(404).json({ message: 'Provider profile not found' });
      }

      chats = await Chat.find({ providerId: provider._id })
        .populate('userId', 'name email profileImage')
        .populate('providerId')
        .sort({ lastMessageTime: -1 });
    } else {
      // Get user's chats
      chats = await Chat.find({ userId: req.user._id })
        .populate('userId', 'name email profileImage')
        .populate('providerId')
        .sort({ lastMessageTime: -1 });
    }

    res.status(200).json({
      success: true,
      count: chats.length,
      chats
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single chat with all messages
const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate('userId', 'name email profileImage')
      .populate('providerId')
      .populate('messages.sender', 'name email profileImage');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is part of this chat
    const isUser = chat.userId._id.toString() === req.user._id.toString();
    let isProvider = false;

    if (req.user.role === 'provider') {
      const provider = await Provider.findOne({ userId: req.user._id });
      if (provider) {
        isProvider = chat.providerId._id.toString() === provider._id.toString();
      }
    }

    if (!isUser && !isProvider) {
      return res.status(403).json({ message: 'You are not part of this chat' });
    }

    res.status(200).json({
      success: true,
      chat
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark messages as read
const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Mark all unread messages as read
    chat.messages.forEach(msg => {
      if (msg.sender.toString() !== req.user._id.toString() && !msg.isRead) {
        msg.isRead = true;
      }
    });

    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a chat
const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Only user who created the chat can delete it
    if (chat.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own chats' });
    }

    await chat.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createChat,
  sendMessage,
  getMyChats,
  getChatById,
  markMessagesAsRead,
  deleteChat
};