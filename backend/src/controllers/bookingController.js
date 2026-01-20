const Booking = require('../models/Booking');
const Provider = require('../models/Provider');

// Create a new booking
const createBooking = async (req, res) => {
  try {
    // Check if user role is 'user'
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Only users can create bookings' });
    }

    const { providerId, date, time, serviceType, address, price } = req.body;

    // Check if provider exists
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Check if booking already exists for same provider, date, and time
    const existingBooking = await Booking.findOne({
      userId: req.user._id,
      providerId,
      date,
      time
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You already have a booking with this provider at this time' });
    }

    // Create booking
    const booking = await Booking.create({
      userId: req.user._id,
      providerId,
      date,
      time,
      serviceType,
      address,
      price
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my bookings (for users)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('providerId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get bookings for provider
const getProviderBookings = async (req, res) => {
  try {
    // Check if user is a provider
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only providers can access this' });
    }

    // Find provider profile
    const provider = await Provider.findOne({ userId: req.user._id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    // Get all bookings for this provider
    const bookings = await Booking.find({ providerId: provider._id })
      .populate('userId', 'name email phone location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update status
    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated',
      booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only cancel your own bookings' });
    }

    // Update status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus,
  cancelBooking
};