const Provider = require('../models/Provider');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { createNotificationHelper } = require('./notificationController');

// Get all providers
const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find()
      .populate('userId', 'name email phone location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: providers.length,
      providers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get pending providers (waiting for approval)
const getPendingProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ approved: false })
      .populate('userId', 'name email phone location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: providers.length,
      providers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get approved providers
const getApprovedProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ approved: true })
      .populate('userId', 'name email phone location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: providers.length,
      providers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve a provider
const approveProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Set approved to true
    provider.approved = true;
    await provider.save();

    res.status(200).json({
      success: true,
      message: 'Provider approved successfully',
      provider
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject a provider
const rejectProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Set approved to false
    provider.approved = false;
    await provider.save();

    res.status(200).json({
      success: true,
      message: 'Provider rejected',
      provider
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
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

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProviders = await Provider.countDocuments();
    const approvedProviders = await Provider.countDocuments({ approved: true });
    const pendingProviders = await Provider.countDocuments({ approved: false });
    const totalBookings = await Booking.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProviders,
        approvedProviders,
        pendingProviders,
        totalBookings
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProviders,
  getPendingProviders,
  getApprovedProviders,
  approveProvider,
  rejectProvider,
  getAllUsers,
  getAllBookings,
  getDashboardStats
};