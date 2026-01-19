const express = require('express');
const router = express.Router();
const {
  createProviderProfile,
  getMyProfile,
  updateProviderProfile,
  getAllProviders
} = require('../controllers/providerController');
const { protect } = require('../middlewares/authMiddleware');

// Protected routes (need login)
router.post('/create', protect, createProviderProfile);
router.get('/me', protect, getMyProfile);
router.put('/update', protect, updateProviderProfile);

// Public route (anyone can view)
router.get('/all', getAllProviders);

module.exports = router;