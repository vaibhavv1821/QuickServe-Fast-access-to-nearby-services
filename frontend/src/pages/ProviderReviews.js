import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import reviewService from '../services/reviewService';

function ProviderReviews() {
  const navigate = useNavigate();
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await reviewService.getMyReceivedReviews();
      console.log('Reviews loaded:', data);
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
    } catch (err) {
      console.error('Error loading reviews:', err);
      setError(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        style={{
          color: index < rating ? '#ffc107' : '#ddd',
          fontSize: '20px'
        }}
      >
        ★
      </span>
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <h3>Loading reviews...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1>My Reviews</h1>
          <p style={styles.subtitle}>Customer feedback and ratings</p>
        </div>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Dashboard
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.error}>
          <p>{error}</p>
          <button onClick={loadReviews} style={styles.retryBtn}>
            Try Again
          </button>
        </div>
      )}

      {/* Average Rating Card */}
      {!error && reviews.length > 0 && (
        <div style={styles.ratingCard}>
          <div style={styles.ratingLeft}>
            <div style={styles.avgRating}>{averageRating.toFixed(1)}</div>
            <div style={styles.stars}>{renderStars(Math.round(averageRating))}</div>
            <div style={styles.reviewCount}>
              Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div style={styles.ratingRight}>
            <div style={styles.ratingBar}>
              <span>5 ★</span>
              <div style={styles.barContainer}>
                <div style={{
                  ...styles.bar,
                  width: `${(reviews.filter(r => r.rating === 5).length / reviews.length) * 100}%`
                }}></div>
              </div>
              <span>{reviews.filter(r => r.rating === 5).length}</span>
            </div>
            <div style={styles.ratingBar}>
              <span>4 ★</span>
              <div style={styles.barContainer}>
                <div style={{
                  ...styles.bar,
                  width: `${(reviews.filter(r => r.rating === 4).length / reviews.length) * 100}%`
                }}></div>
              </div>
              <span>{reviews.filter(r => r.rating === 4).length}</span>
            </div>
            <div style={styles.ratingBar}>
              <span>3 ★</span>
              <div style={styles.barContainer}>
                <div style={{
                  ...styles.bar,
                  width: `${(reviews.filter(r => r.rating === 3).length / reviews.length) * 100}%`
                }}></div>
              </div>
              <span>{reviews.filter(r => r.rating === 3).length}</span>
            </div>
            <div style={styles.ratingBar}>
              <span>2 ★</span>
              <div style={styles.barContainer}>
                <div style={{
                  ...styles.bar,
                  width: `${(reviews.filter(r => r.rating === 2).length / reviews.length) * 100}%`
                }}></div>
              </div>
              <span>{reviews.filter(r => r.rating === 2).length}</span>
            </div>
            <div style={styles.ratingBar}>
              <span>1 ★</span>
              <div style={styles.barContainer}>
                <div style={{
                  ...styles.bar,
                  width: `${(reviews.filter(r => r.rating === 1).length / reviews.length) * 100}%`
                }}></div>
              </div>
              <span>{reviews.filter(r => r.rating === 1).length}</span>
            </div>
          </div>
        </div>
      )}

      {/* No Reviews */}
      {!error && reviews.length === 0 && (
        <div style={styles.noReviews}>
          <div style={styles.emptyIcon}>⭐</div>
          <h2>No reviews yet</h2>
          <p>You haven't received any reviews yet.</p>
          <p>Complete bookings to receive customer feedback!</p>
        </div>
      )}

      {/* Reviews List */}
      {!error && reviews.length > 0 && (
        <div style={styles.reviewsList}>
          <h3 style={styles.listTitle}>All Reviews ({reviews.length})</h3>
          
          {reviews.map((review) => (
            <div key={review._id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <div>
                  <div style={styles.customerName}>
                    {review.userId?.name || 'Anonymous'}
                  </div>
                  <div style={styles.reviewDate}>
                    {formatDate(review.createdAt)}
                  </div>
                </div>
                <div style={styles.ratingBadge}>
                  {renderStars(review.rating)}
                  <span style={styles.ratingNumber}>{review.rating}/5</span>
                </div>
              </div>
              
              <div style={styles.reviewComment}>
                "{review.comment}"
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  subtitle: {
    margin: '5px 0 0 0',
    color: '#666',
    fontSize: '14px'
  },
  backBtn: {
    padding: '10px 25px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  loadingCard: {
    backgroundColor: 'white',
    padding: '80px 40px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginTop: '50px'
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    textAlign: 'center'
  },
  retryBtn: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  ratingCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '25px',
    display: 'flex',
    gap: '40px'
  },
  ratingLeft: {
    flex: '0 0 200px',
    textAlign: 'center',
    borderRight: '2px solid #f0f0f0',
    paddingRight: '30px'
  },
  avgRating: {
    fontSize: '64px',
    fontWeight: 'bold',
    color: '#ffc107',
    lineHeight: '1'
  },
  stars: {
    marginTop: '10px'
  },
  reviewCount: {
    marginTop: '10px',
    color: '#666',
    fontSize: '14px'
  },
  ratingRight: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  ratingBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px'
  },
  barContainer: {
    flex: 1,
    height: '8px',
    backgroundColor: '#e9ecef',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  bar: {
    height: '100%',
    backgroundColor: '#ffc107',
    transition: 'width 0.3s'
  },
  noReviews: {
    backgroundColor: 'white',
    padding: '80px 40px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  reviewsList: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  listTitle: {
    marginTop: 0,
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '2px solid #f0f0f0'
  },
  reviewCard: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginBottom: '15px',
    border: '1px solid #e9ecef'
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px'
  },
  customerName: {
    fontWeight: 'bold',
    fontSize: '16px',
    color: '#333'
  },
  reviewDate: {
    fontSize: '13px',
    color: '#999',
    marginTop: '3px'
  },
  ratingBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  ratingNumber: {
    fontWeight: 'bold',
    color: '#666'
  },
  reviewComment: {
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#555',
    fontStyle: 'italic'
  }
};

export default ProviderReviews;