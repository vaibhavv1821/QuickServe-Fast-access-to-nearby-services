import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import bookingService from '../services/bookingService';
import Layout from '../components/Layout';
import { COLORS, SHADOW } from '../styles/theme';

function BookService() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;

  const [formData, setFormData] = useState({
    date: '', time: '', serviceType: provider?.serviceType || '', description: '',
    address: { street: '', city: '', state: '' }, price: provider?.price || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'street' || name === 'city' || name === 'state') {
      setFormData({ ...formData, address: { ...formData.address, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await bookingService.createBooking({
        providerId, date: formData.date, time: formData.time, serviceType: formData.serviceType,
        description: formData.description, address: formData.address, price: Number(formData.price)
      });
      setSuccess(true);
      setTimeout(() => navigate('/my-bookings'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
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
          <h2 style={styles.successTitle}>Booking request sent</h2>
          <p style={styles.successText}>The provider will confirm shortly. Redirecting to your bookings...</p>
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

      <h1 style={styles.pageTitle}>Confirm your booking</h1>

      <div style={styles.layout}>
        {/* Left: form */}
        <div style={styles.formCard}>
          {error && (
            <div style={styles.errorBox}>
              <i className="ti ti-alert-circle" style={{ fontSize: '16px' }}></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Service type</label>
                <input type="text" name="serviceType" value={formData.serviceType} onChange={handleChange} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Price (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" style={styles.input} />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]} style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required style={styles.input} />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Street address</label>
              <input type="text" name="street" value={formData.address.street} onChange={handleChange} required style={styles.input} placeholder="House no, street name" />
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>City</label>
                <input type="text" name="city" value={formData.address.city} onChange={handleChange} required style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>State</label>
                <input type="text" name="state" value={formData.address.state} onChange={handleChange} required style={styles.input} />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Additional notes (optional)</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows="3" style={styles.textarea} placeholder="Any special instructions for the provider..." />
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Sending request...' : 'Confirm booking'}
              {!loading && <i className="ti ti-check" style={{ fontSize: '16px' }}></i>}
            </button>
          </form>
        </div>

        {/* Right: provider summary */}
        {provider && (
          <div style={styles.summaryCard}>
            <div style={styles.summaryLabel}>Booking with</div>
            <div style={styles.providerRow}>
              <div style={styles.avatar}>{provider.userId?.name?.charAt(0) || 'P'}</div>
              <div>
                <div style={styles.providerName}>{provider.userId?.name}</div>
                <div style={styles.providerService}>{provider.serviceType}</div>
              </div>
            </div>
            <div style={styles.summaryDivider}></div>
            <div style={styles.summaryRow}>
              <span><i className="ti ti-star" style={{ fontSize: '14px', color: COLORS.star }}></i> Rating</span>
              <span style={styles.summaryValue}>{provider.rating > 0 ? provider.rating.toFixed(1) : 'New'}</span>
            </div>
            <div style={styles.summaryRow}>
              <span><i className="ti ti-briefcase" style={{ fontSize: '14px' }}></i> Experience</span>
              <span style={styles.summaryValue}>{provider.experience} yrs</span>
            </div>
            <div style={styles.summaryRow}>
              <span><i className="ti ti-currency-rupee" style={{ fontSize: '14px' }}></i> Base price</span>
              <span style={styles.summaryValue}>₹{provider.price}</span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  backLink: {
    display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none',
    fontSize: '13px', fontWeight: '600', color: COLORS.textSecondary, marginBottom: '16px', padding: 0
  },
  pageTitle: { fontSize: '22px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '20px' },
  layout: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', alignItems: 'start' },
  formCard: {
    backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px',
    padding: '24px', boxShadow: SHADOW.card
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '6px' },
  input: {
    width: '100%', padding: '11px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px',
    fontSize: '14px', boxSizing: 'border-box'
  },
  textarea: {
    width: '100%', padding: '11px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px',
    fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box'
  },
  submitBtn: {
    width: '100%', padding: '13px', backgroundColor: COLORS.primary, color: COLORS.white, border: 'none',
    borderRadius: '8px', fontSize: '15px', fontWeight: '600', display: 'flex', alignItems: 'center',
    justifyContent: 'center', gap: '8px', marginTop: '4px'
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: COLORS.dangerBg, color: COLORS.danger,
    padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '18px'
  },
  summaryCard: {
    backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px',
    padding: '20px', position: 'sticky', top: '80px'
  },
  summaryLabel: { fontSize: '12px', fontWeight: '600', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: '12px' },
  providerRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  avatar: {
    width: '44px', height: '44px', borderRadius: '50%', backgroundColor: COLORS.primaryLight,
    color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '16px', fontWeight: '700'
  },
  providerName: { fontSize: '15px', fontWeight: '700', color: COLORS.textPrimary },
  providerService: { fontSize: '13px', color: COLORS.textSecondary },
  summaryDivider: { height: '1px', backgroundColor: COLORS.border, margin: '14px 0' },
  summaryRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px',
    color: COLORS.textSecondary, marginBottom: '10px'
  },
  summaryValue: { fontWeight: '600', color: COLORS.textPrimary },
  successWrap: {
    textAlign: 'center', padding: '80px 20px', backgroundColor: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`, borderRadius: '14px', maxWidth: '440px', margin: '40px auto'
  },
  successIcon: {
    width: '64px', height: '64px', borderRadius: '50%', backgroundColor: COLORS.primary,
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px'
  },
  successTitle: { fontSize: '20px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '8px' },
  successText: { fontSize: '14px', color: COLORS.textSecondary }
};

export default BookService;