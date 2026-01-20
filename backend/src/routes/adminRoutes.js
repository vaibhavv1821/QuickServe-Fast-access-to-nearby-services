const express = require('express');
const router = express.Router();
const {
  getAllProviders,
  getPendingProviders,
  approveProvider,
  rejectProvider,
  getAllUsers
} = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// All routes are protected and admin-only
router.get('/providers', protect, isAdmin, getAllProviders);
router.get('/providers/pending', protect, isAdmin, getPendingProviders);
router.put('/providers/approve/:providerId', protect, isAdmin, approveProvider);
router.put('/providers/reject/:providerId', protect, isAdmin, rejectProvider);
router.get('/users', protect, isAdmin, getAllUsers);

module.exports = router;