const Provider = require('../models/Provider');
const User = require('../models/User');

// Search providers by service type and location
const searchProviders = async (req, res) => {
  try {
    const { serviceType, city, state, minPrice, maxPrice, minRating } = req.query;

    // Build search query
    let query = { approved: true }; // Only show approved providers

    // Search by service type
    if (serviceType) {
      query.serviceType = { $regex: serviceType, $options: 'i' }; // Case-insensitive
    }

    // Search by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search by minimum rating
    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    // Find providers matching the query
    let providers = await Provider.find(query)
      .populate('userId', 'name email phone location profileImage')
      .sort({ rating: -1 }); // Sort by highest rating first

    // Filter by location if provided
    if (city || state) {
      providers = providers.filter(provider => {
        const userLocation = provider.userId.location;
        
        if (city && state) {
          return userLocation.city.toLowerCase() === city.toLowerCase() && 
                 userLocation.state.toLowerCase() === state.toLowerCase();
        } else if (city) {
          return userLocation.city.toLowerCase() === city.toLowerCase();
        } else if (state) {
          return userLocation.state.toLowerCase() === state.toLowerCase();
        }
        return true;
      });
    }

    res.status(200).json({
      success: true,
      count: providers.length,
      providers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get providers by service type only
const getProvidersByService = async (req, res) => {
  try {
    const { serviceType } = req.params;

    const providers = await Provider.find({
      serviceType: { $regex: serviceType, $options: 'i' },
      approved: true
    })
      .populate('userId', 'name email phone location profileImage')
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: providers.length,
      providers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get providers by location (city)
const getProvidersByLocation = async (req, res) => {
  try {
    const { city } = req.params;

    // Get all approved providers
    const providers = await Provider.find({ approved: true })
      .populate('userId', 'name email phone location profileImage')
      .sort({ rating: -1 });

    // Filter by city
    const filteredProviders = providers.filter(provider => 
      provider.userId.location.city.toLowerCase() === city.toLowerCase()
    );

    res.status(200).json({
      success: true,
      count: filteredProviders.length,
      providers: filteredProviders
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get top-rated providers
const getTopRatedProviders = async (req, res) => {
  try {
    const limit = req.query.limit || 10;

    const providers = await Provider.find({ approved: true })
      .populate('userId', 'name email phone location profileImage')
      .sort({ rating: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: providers.length,
      providers
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get nearby providers (by state)
const getNearbyProviders = async (req, res) => {
  try {
    const { state } = req.params;

    const providers = await Provider.find({ approved: true })
      .populate('userId', 'name email phone location profileImage')
      .sort({ rating: -1 });

    const filteredProviders = providers.filter(provider => 
      provider.userId.location.state.toLowerCase() === state.toLowerCase()
    );

    res.status(200).json({
      success: true,
      count: filteredProviders.length,
      providers: filteredProviders
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  searchProviders,
  getProvidersByService,
  getProvidersByLocation,
  getTopRatedProviders,
  getNearbyProviders
};