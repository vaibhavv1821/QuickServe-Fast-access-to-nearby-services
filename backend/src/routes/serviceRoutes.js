const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  getAllServicesAdmin,
  getServiceById,
  updateService,
  deleteService,
  toggleServiceStatus
} = require('../controllers/serviceController');
const { protect } = require('../middlewares/authMiddleware');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Public routes (anyone can access)
router.get('/', getAllServices);
router.get('/:serviceId', getServiceById);

// Admin only routes
router.post('/create', protect, isAdmin, createService);
router.get('/admin/all', protect, isAdmin, getAllServicesAdmin);
router.put('/update/:serviceId', protect, isAdmin, updateService);
router.delete('/delete/:serviceId', protect, isAdmin, deleteService);
router.put('/toggle/:serviceId', protect, isAdmin, toggleServiceStatus);

module.exports = router;