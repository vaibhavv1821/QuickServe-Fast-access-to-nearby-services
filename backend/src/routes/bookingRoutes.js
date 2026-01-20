const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected (need login)
router.post('/create', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/provider-bookings', protect, getProviderBookings);
router.put('/update-status/:bookingId', protect, updateBookingStatus);
router.put('/cancel/:bookingId', protect, cancelBooking);

module.exports = router;