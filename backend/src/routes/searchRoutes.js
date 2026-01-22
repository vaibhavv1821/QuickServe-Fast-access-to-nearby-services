const express = require('express');
const router = express.Router();
const {
  searchProviders,
  getProvidersByService,
  getProvidersByLocation,
  getTopRatedProviders,
  getNearbyProviders
} = require('../controllers/searchController');
const { protect } = require('../middlewares/authMiddleware');

// All routes are protected (need login)
router.get('/providers', protect, searchProviders);
router.get('/service/:serviceType', protect, getProvidersByService);
router.get('/location/:city', protect, getProvidersByLocation);
router.get('/top-rated', protect, getTopRatedProviders);
router.get('/nearby/:state', protect, getNearbyProviders);

module.exports = router;