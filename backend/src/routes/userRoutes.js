const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deactivateAccount,
  activateAccount,
  uploadProfileImage
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { profileUpload, handleUploadError } = require('../middlewares/uploadMiddleware');

// All routes are protected (need login)
router.get('/profile', protect, getMyProfile);
router.put('/profile', protect, updateMyProfile);
router.put('/change-password', protect, changePassword);
router.put('/deactivate', protect, deactivateAccount);
router.put('/activate', protect, activateAccount);
router.put('/upload-image', protect, profileUpload.single('image'), handleUploadError, uploadProfileImage);

module.exports = router;