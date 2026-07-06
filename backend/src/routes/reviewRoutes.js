const express = require('express');
const router = express.Router();
const {
  addReview,
  getMyReviews,
  getProviderReviews,
  getMyReceivedReviews,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

// Protected routes (need login)
router.post('/add', protect, addReview);
router.get('/my-reviews', protect, getMyReviews);
router.get('/received', protect, getMyReceivedReviews);
router.put('/update/:reviewId', protect, updateReview);
router.delete('/delete/:reviewId', protect, deleteReview);

// Public route (anyone can view)
router.get('/provider/:providerId', getProviderReviews);

module.exports = router;