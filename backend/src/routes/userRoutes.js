const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deactivateAccount,
  activateAccount
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected (need login)
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateMyProfile);
router.put('/change-password', protect, changePassword);
router.put('/deactivate', protect, deactivateAccount);
router.put('/activate', protect, activateAccount);

module.exports = router;