const express = require('express');
const router = express.Router();
const {
  createProviderProfile,
  getMyProfile,
  updateProviderProfile,
  getAllProviders,
  getProviderById
} = require('../controllers/providerController');
const { protect } = require('../middlewares/authMiddleware');

// Public route (anyone can view)
router.get('/all', getAllProviders);
router.get('/details/:providerId', getProviderById);

// Protected routes (need login)
router.post('/create', protect, createProviderProfile);
router.get('/me', protect, getMyProfile);
router.put('/update', protect, updateProviderProfile);

module.exports = router;