const Provider = require('../models/Provider');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { createNotificationHelper } = require('./notificationController');

// Get all providers
const getAllProviders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = {};
    if (search) {
      filter.$or = [
        { serviceType: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }
    if (req.query.approved !== undefined) filter.approved = req.query.approved === 'true';

    const [providers, total] = await Promise.all([
      Provider.find(filter).populate('userId', 'name email phone location').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Provider.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: providers.length,
      total,
      page,
      pages: Math.ceil(total / limit),
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const [users, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [bookings, total] = await Promise.all([
      Booking.find(filter).populate('userId', 'name email phone').populate('providerId').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Booking.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      page,
      pages: Math.ceil(total / limit),
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

// Toggle user active status
const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { isActive: req.body.isActive },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, message: `User ${req.body.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ success: true, message: 'User deleted successfully' });
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
  getDashboardStats,
  updateUserStatus,
  deleteUser
};