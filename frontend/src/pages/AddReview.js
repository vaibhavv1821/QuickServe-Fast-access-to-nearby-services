import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import reviewService from '../services/reviewService';
import Layout from '../components/Layout';
import { COLORS, SHADOW } from '../styles/theme';

function AddReview() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;

  const [formData, setFormData] = useState({ rating: 5, comment: '' });
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await reviewService.addReview({
        providerId, bookingId: booking?._id,
        rating: Number(formData.rating), comment: formData.comment
      });
      setSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div style={styles.successWrap}>
          <div style={styles.successIcon}>
            <i className="ti ti-check" style={{ fontSize: '32px', color: COLORS.white }}></i>
          </div>
          <h2 style={styles.successTitle}>Thanks for your feedback</h2>
          <p style={styles.successText}>Redirecting to your bookings...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <button onClick={() => navigate('/my-bookings')} style={styles.backLink}>
        <i className="ti ti-arrow-left" style={{ fontSize: '14px' }}></i>
        Back to bookings
      </button>

      <h1 style={styles.pageTitle}>Rate your experience</h1>

      <div style={styles.card}>
        {booking && (
          <div style={styles.bookingBox}>
            <i className="ti ti-clipboard-check" style={{ fontSize: '16px', color: COLORS.textSecondary }}></i>
            <span>{booking.serviceType} &middot; {new Date(booking.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            <i className="ti ti-alert-circle" style={{ fontSize: '16px' }}></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>How was the service?</label>
            <div style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className="ti ti-star-filled"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  style={{
                    fontSize: '36px',
                    color: star <= (hoverRating || formData.rating) ? COLORS.star : COLORS.border,
                    cursor: 'pointer',
                    transition: 'color 0.1s'
                  }}
                ></i>
              ))}
              <span style={styles.ratingLabel}>{formData.rating}/5</span>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Your review</label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
              minLength="10"
              maxLength="500"
              rows="5"
              placeholder="Share details about the quality, punctuality, and professionalism..."
              style={styles.textarea}
            />
            <small style={styles.charCount}>{formData.comment.length}/500 &middot; minimum 10 characters</small>
          </div>

          <div style={styles.btnRow}>
            <button type="submit" disabled={loading || formData.comment.length < 10} style={styles.submitBtn}>
              {loading ? 'Submitting...' : 'Submit review'}
            </button>
            <button type="button" onClick={() => navigate('/my-bookings')} style={styles.cancelBtn}>Cancel</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

const styles = {
  backLink: { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', fontSize: '13px', fontWeight: '600', color: COLORS.textSecondary, marginBottom: '16px', padding: 0 },
  pageTitle: { fontSize: '22px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '20px' },
  card: { backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '24px', boxShadow: SHADOW.card, maxWidth: '560px' },
  bookingBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: COLORS.infoBg, color: COLORS.info, padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', marginBottom: '20px' },
  formGroup: { marginBottom: '22px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '10px' },
  starRow: { display: 'flex', alignItems: 'center', gap: '4px' },
  ratingLabel: { marginLeft: '12px', fontSize: '15px', fontWeight: '700', color: COLORS.textSecondary },
  textarea: { width: '100%', padding: '12px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.6' },
  charCount: { display: 'block', marginTop: '6px', color: COLORS.textMuted, fontSize: '12px' },
  btnRow: { display: 'flex', gap: '10px' },
  submitBtn: { flex: 1, padding: '13px', backgroundColor: COLORS.primary, color: COLORS.white, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' },
  cancelBtn: { flex: 1, padding: '13px', backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' },
  errorBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: COLORS.dangerBg, color: COLORS.danger, padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '18px' },
  successWrap: { textAlign: 'center', padding: '80px 20px', backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px', maxWidth: '440px', margin: '40px auto' },
  successIcon: { width: '64px', height: '64px', borderRadius: '50%', backgroundColor: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' },
  successTitle: { fontSize: '20px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '8px' },
  successText: { fontSize: '14px', color: COLORS.textSecondary }
};

export default AddReview;
