import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import reviewService from '../services/reviewService';

function AddReview() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const [formData, setFormData] = useState({
    rating: 5,
    comment: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const reviewData = {
        providerId,
        bookingId: booking._id,
        rating: Number(formData.rating),
        comment: formData.comment
      };

      await reviewService.addReview(reviewData);
      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);

    } catch (err) {
      console.error('Error submitting review:', err);
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✅</div>
          <h2>Review Submitted Successfully!</h2>
          <p>Thank you for your feedback.</p>
          <p>Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Add Review & Rating</h2>
        <button onClick={() => navigate('/my-bookings')} style={styles.backBtn}>
          ← Back to Bookings
        </button>
      </div>

      {/* Booking Info */}
      {booking && (
        <div style={styles.bookingCard}>
          <h3>Booking Details</h3>
          <p><strong>Service:</strong> {booking.serviceType}</p>
          <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
          <p><strong>Price:</strong> ₹{booking.price}</p>
        </div>
      )}

      {/* Review Form */}
      <div style={styles.formCard}>
        <h3>Share Your Experience</h3>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Rating */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Rating *</label>
            <div style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  style={{
                    ...styles.star,
                    color: star <= formData.rating ? '#ffc107' : '#ddd'
                  }}
                >
                  ★
                </span>
              ))}
              <span style={styles.ratingText}>
                {formData.rating} out of 5 stars
              </span>
            </div>
          </div>

          {/* Comment */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Your Review *</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              required
              minLength="10"
              maxLength="500"
              placeholder="Share your experience with this service provider... (minimum 10 characters)"
              rows="6"
              style={styles.textarea}
            />
            <small style={styles.charCount}>
              {formData.comment.length}/500 characters
            </small>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || formData.comment.length < 10}
            style={styles.submitBtn}
          >
            {loading ? 'Submitting...' : '✓ Submit Review'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/my-bookings')}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '700px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  backBtn: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  bookingCard: {
    backgroundColor: '#e7f3ff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '2px solid #007bff'
  },
  formCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  form: {
    marginTop: '20px'
  },
  formGroup: {
    marginBottom: '25px'
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '16px'
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    padding: '10px 0'
  },
  star: {
    fontSize: '40px',
    cursor: 'pointer',
    transition: 'color 0.2s',
    userSelect: 'none'
  },
  ratingText: {
    marginLeft: '15px',
    fontSize: '16px',
    color: '#666',
    fontWeight: 'bold'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
    lineHeight: '1.6'
  },
  charCount: {
    display: 'block',
    marginTop: '5px',
    color: '#999',
    fontSize: '12px'
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '10px'
  },
  cancelBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '10px'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  successCard: {
    backgroundColor: 'white',
    padding: '60px 40px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
    marginTop: '100px'
  },
  successIcon: {
    fontSize: '80px',
    marginBottom: '20px'
  }
};

export default AddReview;