const Review = require('../models/Review');
const Provider = require('../models/Provider');

// Add a review
const addReview = async (req, res) => {
  try {
    // Check if user role is 'user'
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Only users can add reviews' });
    }

    const { providerId, rating, comment } = req.body;

    // Check if provider exists
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // Check if user already reviewed this provider
    const existingReview = await Review.findOne({
      userId: req.user._id,
      providerId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this provider' });
    }

    // Create review
    const review = await Review.create({
      userId: req.user._id,
      providerId,
      rating,
      comment
    });

    // Update provider's rating
    const allReviews = await Review.find({ providerId });
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / allReviews.length;

    provider.rating = avgRating;
    await provider.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get my reviews (reviews I gave)
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .populate('providerId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for a provider
const getProviderReviews = async (req, res) => {
  try {
    const { providerId } = req.params;

    const reviews = await Review.find({ providerId })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews received by provider (for provider dashboard)
const getMyReceivedReviews = async (req, res) => {
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

    // Get all reviews for this provider
    const reviews = await Review.find({ providerId: provider._id })
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating: provider.rating,
      reviews
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own reviews' });
    }

    // Update review
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await review.save();

    // Recalculate provider rating
    const allReviews = await Review.find({ providerId: review.providerId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / allReviews.length;

    await Provider.findByIdAndUpdate(review.providerId, { rating: avgRating });

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    const providerId = review.providerId;
    await review.deleteOne();

    // Recalculate provider rating
    const allReviews = await Review.find({ providerId });
    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / allReviews.length;
      await Provider.findByIdAndUpdate(providerId, { rating: avgRating });
    } else {
      await Provider.findByIdAndUpdate(providerId, { rating: 0 });
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  getMyReviews,
  getProviderReviews,
  getMyReceivedReviews,
  updateReview,
  deleteReview
};