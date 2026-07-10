import React, { useState, useEffect } from 'react';
import reviewService from '../services/reviewService';
import Layout from '../components/Layout';
import { COLORS, SHADOW } from '../styles/theme';

function ProviderReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => { loadReviews(); }, []);

  const loadReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await reviewService.getMyReceivedReviews();
      setReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const renderStars = (rating, size = 14) =>
    [...Array(5)].map((_, i) => (
      <i key={i} className="ti ti-star-filled" style={{ fontSize: `${size}px`, color: i < rating ? COLORS.star : COLORS.border }}></i>
    ));

  if (loading) {
    return (
      <Layout>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          Loading reviews...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 style={styles.pageTitle}>My reviews</h1>
      <p style={styles.pageSubtitle}>Customer feedback and ratings</p>

      {error && (
        <div style={styles.errorBox}>
          <i className="ti ti-alert-circle" style={{ fontSize: '16px' }}></i>
          {error}
        </div>
      )}

      {!error && reviews.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <i className="ti ti-star" style={{ fontSize: '28px', color: COLORS.textMuted }}></i>
          </div>
          <h3 style={styles.emptyTitle}>No reviews yet</h3>
          <p style={styles.emptyText}>Complete bookings to start receiving customer feedback.</p>
        </div>
      )}

      {!error && reviews.length > 0 && (
        <>
          <div style={styles.summaryCard}>
            <div style={styles.summaryLeft}>
              <div style={styles.avgNum}>{averageRating.toFixed(1)}</div>
              <div style={styles.starsRow}>{renderStars(Math.round(averageRating), 18)}</div>
              <div style={styles.reviewCount}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</div>
            </div>
            <div style={styles.summaryRight}>
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(r => r.rating === star).length;
                const pct = (count / reviews.length) * 100;
                return (
                  <div key={star} style={styles.barRow}>
                    <span style={styles.barLabel}>{star} <i className="ti ti-star-filled" style={{ fontSize: '11px', color: COLORS.star }}></i></span>
                    <div style={styles.barTrack}>
                      <div style={{ ...styles.barFill, width: `${pct}%` }}></div>
                    </div>
                    <span style={styles.barCount}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <h2 style={styles.sectionTitle}>All reviews</h2>
          <div style={styles.reviewsList}>
            {reviews.map((review) => (
              <div key={review._id} style={styles.reviewCard}>
                <div style={styles.reviewHeader}>
                  <div style={styles.customerInfo}>
                    <div style={styles.avatar}>{review.userId?.name?.charAt(0) || 'A'}</div>
                    <div>
                      <div style={styles.customerName}>{review.userId?.name || 'Anonymous'}</div>
                      <div style={styles.reviewDate}>{formatDate(review.createdAt)}</div>
                    </div>
                  </div>
                  <div style={styles.starsRow}>{renderStars(review.rating)}</div>
                </div>
                <p style={styles.comment}>{review.comment}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  );
}

const styles = {
  pageTitle: { fontSize: '24px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '4px' },
  pageSubtitle: { fontSize: '14px', color: COLORS.textSecondary, marginBottom: '24px' },
  summaryCard: {
    display: 'flex', gap: '32px', backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
    borderRadius: '14px', padding: '24px', boxShadow: SHADOW.card, marginBottom: '28px'
  },
  summaryLeft: { flex: '0 0 160px', textAlign: 'center', borderRight: `1px solid ${COLORS.border}`, paddingRight: '32px' },
  avgNum: { fontSize: '48px', fontWeight: '700', color: COLORS.textPrimary, lineHeight: 1 },
  starsRow: { display: 'flex', gap: '2px', justifyContent: 'center', margin: '10px 0' },
  reviewCount: { fontSize: '13px', color: COLORS.textSecondary },
  summaryRight: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' },
  barRow: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' },
  barLabel: { width: '36px', color: COLORS.textSecondary, display: 'flex', alignItems: 'center', gap: '2px' },
  barTrack: { flex: 1, height: '8px', backgroundColor: COLORS.bgSubtle, borderRadius: '4px', overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: COLORS.star, borderRadius: '4px' },
  barCount: { width: '20px', textAlign: 'right', color: COLORS.textMuted, fontSize: '12px' },
  sectionTitle: { fontSize: '16px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '14px' },
  reviewsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  reviewCard: { backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '18px' },
  reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  customerInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%', backgroundColor: COLORS.primaryLight,
    color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: '700'
  },
  customerName: { fontSize: '14px', fontWeight: '700', color: COLORS.textPrimary },
  reviewDate: { fontSize: '12px', color: COLORS.textMuted },
  comment: { fontSize: '14px', color: COLORS.textSecondary, lineHeight: '1.6', margin: 0, fontStyle: 'italic' },
  emptyState: { textAlign: 'center', padding: '60px 20px', backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px' },
  emptyIcon: { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: COLORS.bgSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  emptyTitle: { fontSize: '18px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '6px' },
  emptyText: { fontSize: '14px', color: COLORS.textSecondary },
  errorBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: COLORS.dangerBg, color: COLORS.danger, padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' },
  loadingBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '60px', fontSize: '14px', color: COLORS.textSecondary },
  spinner: { width: '18px', height: '18px', border: `2px solid ${COLORS.border}`, borderTopColor: COLORS.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }
};

export default ProviderReviews;