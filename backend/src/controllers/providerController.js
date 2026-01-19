const Provider = require('../models/Provider');

// Create provider profile
const createProviderProfile = async (req, res) => {
  try {
    // Check if user role is provider
    if (req.user.role !== 'provider') {
      return res.status(403).json({ message: 'Only users with provider role can create profile' });
    }

    // Check if provider profile already exists
    const existingProvider = await Provider.findOne({ userId: req.user._id });
    if (existingProvider) {
      return res.status(400).json({ message: 'Provider profile already exists' });
    }

    const { serviceType, experience, price, bio } = req.body;

    // Create provider profile
    const provider = await Provider.create({
      userId: req.user._id,
      serviceType,
      experience,
      price,
      bio
    });

    res.status(201).json({
      success: true,
      message: 'Provider profile created successfully',
      provider
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my provider profile
const getMyProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id }).populate('userId', 'name email phone location');

    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    res.status(200).json({
      success: true,
      provider
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update provider profile
const updateProviderProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ userId: req.user._id });

    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    const { serviceType, experience, price, bio } = req.body;

    // Update fields
    if (serviceType) provider.serviceType = serviceType;
    if (experience) provider.experience = experience;
    if (price) provider.price = price;
    if (bio) provider.bio = bio;

    await provider.save();

    res.status(200).json({
      success: true,
      message: 'Provider profile updated successfully',
      provider
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all providers (for searching)
const getAllProviders = async (req, res) => {
  try {
    const providers = await Provider.find({ approved: true }).populate('userId', 'name email phone location');

    res.status(200).json({
      success: true,
      count: providers.length,
      providers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProviderProfile,
  getMyProfile,
  updateProviderProfile,
  getAllProviders
};