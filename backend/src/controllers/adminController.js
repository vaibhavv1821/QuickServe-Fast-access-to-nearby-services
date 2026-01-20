const Provider = require('../models/Provider');
const User = require('../models/User');

// Get all providers (pending, approved, rejected)
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

// Get pending providers (not approved yet)
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

// Approve a provider
const approveProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

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

module.exports = {
  getAllProviders,
  getPendingProviders,
  approveProvider,
  rejectProvider,
  getAllUsers
};