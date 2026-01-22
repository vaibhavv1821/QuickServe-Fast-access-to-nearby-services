const Service = require('../models/Service');

// Create a new service category (Admin only)
const createService = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    // Check if service already exists
    const existingService = await Service.findOne({ name });
    if (existingService) {
      return res.status(400).json({ message: 'Service category already exists' });
    }

    const service = await Service.create({
      name,
      description,
      icon
    });

    res.status(201).json({
      success: true,
      message: 'Service category created successfully',
      service
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all service categories (Public)
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all services including inactive (Admin only)
const getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single service by ID
const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      service
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update service category (Admin only)
const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { name, description, icon, isActive } = req.body;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Update fields if provided
    if (name) service.name = name;
    if (description) service.description = description;
    if (icon) service.icon = icon;
    if (typeof isActive !== 'undefined') service.isActive = isActive;

    await service.save();

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete service category (Admin only)
const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle service active status (Admin only)
const toggleServiceStatus = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Toggle the status
    service.isActive = !service.isActive;
    await service.save();

    res.status(200).json({
      success: true,
      message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`,
      service
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createService,
  getAllServices,
  getAllServicesAdmin,
  getServiceById,
  updateService,
  deleteService,
  toggleServiceStatus
};