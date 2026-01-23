const express = require('express');
const router = express.Router();
const {
  createNotification,
  getMyNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllRead
} = require('../controllers/notificationController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected (need login)
router.post('/create', protect, createNotification);
router.get('/my-notifications', protect, getMyNotifications);
router.get('/unread', protect, getUnreadNotifications);
router.get('/unread-count', protect, getUnreadCount);
router.put('/mark-read/:notificationId', protect, markAsRead);
router.put('/mark-all-read', protect, markAllAsRead);
router.delete('/delete/:notificationId', protect, deleteNotification);
router.delete('/delete-all-read', protect, deleteAllRead);

module.exports = router;