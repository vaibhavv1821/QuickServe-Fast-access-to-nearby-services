import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import providerService from '../services/providerService';
import reviewService from '../services/reviewService';
import chatService from '../services/chatService';
import Layout from '../components/Layout';
import { COLORS, SHADOW } from '../styles/theme';
import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

function ProviderDetails() {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(ToastContext);

  useEffect(() => { loadData(); }, [providerId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const allProviders = await providerService.getAllProviders();
      const found = (allProviders.providers || []).find(p => p._id === providerId);
      setProvider(found);

      const reviewData = await reviewService.getProviderReviews(providerId);
      setReviews(reviewData.reviews || []);
    } catch (err) {
      // fail silently, empty state will show
    } finally {
      setLoading(false);
    }
  };

  const handleMessage = async () => {
  try {
    const data = await chatService.createChat(providerId);
    navigate(`/chat?chatId=${data.chat._id}`);
  } catch (err) {
    showToast('Failed to start conversation', 'error');
  }
};

  const renderStars = (rating, size = 14) =>
    [...Array(5)].map((_, i) => (
      <i key={i} className="ti ti-star-filled" style={{ fontSize: `${size}px`, color: i < rating ? COLORS.star : COLORS.border }}></i>
    ));

  if (loading) {
    return (
      <Layout>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          Loading provider...
        </div>
      </Layout>
    );
  }

  if (!provider) {
    return (
      <Layout>
        <div style={styles.emptyState}>
          <i className="ti ti-user-off" style={{ fontSize: '28px', color: COLORS.textMuted }}></i>
          <p style={styles.emptyText}>Provider not found</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <button onClick={() => navigate('/search')} style={styles.backLink}>
        <i className="ti ti-arrow-left" style={{ fontSize: '14px' }}></i>
        Back to search
      </button>

      <div style={styles.layout}>
        {/* Left: profile card */}
        <div style={styles.profileCard}>
          <div style={styles.avatarLarge}>{provider.userId?.name?.charAt(0) || 'P'}</div>
          <h1 style={styles.name}>{provider.userId?.name}</h1>
          <div style={styles.serviceTag}>{provider.serviceType}</div>

          <div style={styles.ratingRow}>
            {renderStars(Math.round(provider.rating), 18)}
            <span style={styles.ratingNum}>{provider.rating > 0 ? provider.rating.toFixed(1) : 'New'}</span>
          </div>

          <div style={styles.statRow}>
            <div style={styles.statItem}>
              <i className="ti ti-briefcase" style={{ fontSize: '14px', color: COLORS.textMuted }}></i>
              {provider.experience} yrs experience
            </div>
            <div style={styles.statItem}>
              <i className="ti ti-map-pin" style={{ fontSize: '14px', color: COLORS.textMuted }}></i>
              {provider.userId?.location?.city}, {provider.userId?.location?.state}
            </div>
          </div>

          {provider.bio && (
            <div style={styles.bioBox}>
              <div style={styles.bioLabel}>About</div>
              <p style={styles.bioText}>{provider.bio}</p>
            </div>
          )}

          <div style={styles.priceBox}>
            <span style={styles.priceAmount}>₹{provider.price}</span>
            <span style={styles.priceUnit}>/service</span>
          </div>

          <div style={styles.actionRow}>
            <button onClick={handleMessage} style={styles.messageBtn}>
              <i className="ti ti-message-circle" style={{ fontSize: '14px' }}></i>
              Message
            </button>
            <button onClick={() => navigate(`/book/${provider._id}`, { state: { provider } })} style={styles.bookBtn}>
              Book now
              <i className="ti ti-arrow-right" style={{ fontSize: '14px' }}></i>
            </button>
          </div>
        </div>

        {/* Right: reviews */}
        <div style={styles.reviewsSection}>
          <h2 style={styles.reviewsTitle}>Reviews ({reviews.length})</h2>
          {reviews.length === 0 ? (
            <div style={styles.noReviews}>No reviews yet for this provider.</div>
          ) : (
            <div style={styles.reviewsList}>
              {reviews.map((review) => (
                <div key={review._id} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewerInfo}>
                      <div style={styles.reviewerAvatar}>{review.userId?.name?.charAt(0) || 'A'}</div>
                      <div>
                        <div style={styles.reviewerName}>{review.userId?.name || 'Anonymous'}</div>
                        <div style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>{renderStars(review.rating)}</div>
                  </div>
                  <p style={styles.reviewComment}>{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  backLink: { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', fontSize: '13px', fontWeight: '600', color: COLORS.textSecondary, marginBottom: '16px', padding: 0 },
  layout: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', alignItems: 'start' },
  profileCard: { backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '24px', boxShadow: SHADOW.card, textAlign: 'center', position: 'sticky', top: '80px' },
  avatarLarge: { width: '72px', height: '72px', borderRadius: '50%', backgroundColor: COLORS.primaryLight, color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', margin: '0 auto 14px' },
  name: { fontSize: '18px', fontWeight: '700', color: COLORS.textPrimary, margin: '0 0 6px' },
  serviceTag: { display: 'inline-block', fontSize: '12px', fontWeight: '600', color: COLORS.primary, backgroundColor: COLORS.primaryLight, padding: '4px 12px', borderRadius: '999px', marginBottom: '14px' },
  ratingRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', marginBottom: '18px' },
  ratingNum: { marginLeft: '8px', fontSize: '14px', fontWeight: '700', color: COLORS.textSecondary },
  statRow: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px', textAlign: 'left' },
  statItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: COLORS.textSecondary },
  bioBox: { backgroundColor: COLORS.bgSubtle, borderRadius: '10px', padding: '14px', marginBottom: '18px', textAlign: 'left' },
  bioLabel: { fontSize: '11px', fontWeight: '700', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '6px' },
  bioText: { fontSize: '13px', color: COLORS.textSecondary, lineHeight: '1.6', margin: 0 },
  priceBox: { marginBottom: '18px' },
  priceAmount: { fontSize: '24px', fontWeight: '700', color: COLORS.textPrimary },
  priceUnit: { fontSize: '13px', color: COLORS.textMuted },
  actionRow: { display: 'flex', gap: '8px' },
  messageBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
  bookBtn: { flex: 1.4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', backgroundColor: COLORS.primary, color: COLORS.white, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
  reviewsSection: {},
  reviewsTitle: { fontSize: '16px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '16px' },
  noReviews: { backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '40px', textAlign: 'center', color: COLORS.textMuted, fontSize: '13px' },
  reviewsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  reviewCard: { backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '18px' },
  reviewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
  reviewerInfo: { display: 'flex', alignItems: 'center', gap: '10px' },
  reviewerAvatar: { width: '34px', height: '34px', borderRadius: '50%', backgroundColor: COLORS.bgSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' },
  reviewerName: { fontSize: '13px', fontWeight: '700', color: COLORS.textPrimary },
  reviewDate: { fontSize: '11px', color: COLORS.textMuted },
  reviewComment: { fontSize: '13px', color: COLORS.textSecondary, lineHeight: '1.6', margin: 0, fontStyle: 'italic' },
  emptyState: { textAlign: 'center', padding: '60px 20px' },
  emptyText: { fontSize: '14px', color: COLORS.textSecondary, marginTop: '10px' },
  loadingBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '60px', fontSize: '14px', color: COLORS.textSecondary },
  spinner: { width: '18px', height: '18px', border: `2px solid ${COLORS.border}`, borderTopColor: COLORS.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }
};

export default ProviderDetails;