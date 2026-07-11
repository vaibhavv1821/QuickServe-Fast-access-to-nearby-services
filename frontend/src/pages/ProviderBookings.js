import React, { useState, useEffect } from 'react';
import bookingService from '../services/bookingService';
import Layout from '../components/Layout';
import { COLORS, SHADOW } from '../styles/theme';
import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

const STATUS_CONFIG = {
  pending: { color: COLORS.warning, bg: COLORS.warningBg, icon: 'ti-clock' },
  confirmed: { color: COLORS.info, bg: COLORS.infoBg, icon: 'ti-check' },
  completed: { color: COLORS.success, bg: COLORS.successBg, icon: 'ti-circle-check' },
  cancelled: { color: COLORS.danger, bg: COLORS.dangerBg, icon: 'ti-x' }
};

function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useContext(ToastContext);
  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await bookingService.getProviderBookings();
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const msg = newStatus === 'confirmed' ? 'Approve this booking?' : newStatus === 'cancelled' ? 'Reject this booking?' : 'Mark as completed?';
    if (!window.confirm(msg)) return;
    setUpdatingId(bookingId);
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  if (loading) {
    return (
      <Layout>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          Loading bookings...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 style={styles.pageTitle}>Booking requests</h1>
      <p style={styles.pageSubtitle}>Manage service requests from customers</p>

      {error && (
        <div style={styles.errorBox}>
          <i className="ti ti-alert-circle" style={{ fontSize: '16px' }}></i>
          {error}
          <button onClick={loadBookings} style={styles.retryBtn}>Retry</button>
        </div>
      )}

      {!error && bookings.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>
            <i className="ti ti-clipboard-list" style={{ fontSize: '28px', color: COLORS.textMuted }}></i>
          </div>
          <h3 style={styles.emptyTitle}>No booking requests yet</h3>
          <p style={styles.emptyText}>Customers will book your services from search results.</p>
        </div>
      )}

      {!error && bookings.length > 0 && (
        <>
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <div style={styles.statNum}>{bookings.length}</div>
              <div style={styles.statLabel}>Total</div>
            </div>
            <div style={styles.statBox}>
              <div style={{ ...styles.statNum, color: COLORS.warning }}>{bookings.filter(b => b.status === 'pending').length}</div>
              <div style={styles.statLabel}>Pending</div>
            </div>
            <div style={styles.statBox}>
              <div style={{ ...styles.statNum, color: COLORS.info }}>{bookings.filter(b => b.status === 'confirmed').length}</div>
              <div style={styles.statLabel}>Confirmed</div>
            </div>
            <div style={styles.statBox}>
              <div style={{ ...styles.statNum, color: COLORS.success }}>{bookings.filter(b => b.status === 'completed').length}</div>
              <div style={styles.statLabel}>Completed</div>
            </div>
          </div>

          <div style={styles.grid}>
            {bookings.map((booking) => {
              const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
              const isUpdating = updatingId === booking._id;
              return (
                <div key={booking._id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.serviceTitle}>{booking.serviceType}</h3>
                    <span style={{ ...styles.statusBadge, color: status.color, backgroundColor: status.bg }}>
                      <i className={`ti ${status.icon}`} style={{ fontSize: '12px' }}></i>
                      {booking.status}
                    </span>
                  </div>

                  <div style={styles.customerBox}>
                    <div style={styles.avatar}>{booking.userId?.name?.charAt(0) || 'U'}</div>
                    <div>
                      <div style={styles.customerName}>{booking.userId?.name}</div>
                      <div style={styles.customerMeta}>{booking.userId?.phone}</div>
                    </div>
                  </div>

                  <div style={styles.infoRow}>
                    <i className="ti ti-calendar" style={styles.infoIcon}></i>
                    {formatDate(booking.date)} at {booking.time}
                  </div>
                  <div style={styles.infoRow}>
                    <i className="ti ti-currency-rupee" style={styles.infoIcon}></i>
                    ₹{booking.price}
                  </div>
                  <div style={styles.infoRow}>
                    <i className="ti ti-map-pin" style={styles.infoIcon}></i>
                    {booking.address?.street}, {booking.address?.city}
                  </div>

                  {booking.description && (
                    <div style={styles.noteBox}>
                      <i className="ti ti-message-circle" style={{ fontSize: '13px' }}></i>
                      {booking.description}
                    </div>
                  )}

                  <div style={styles.cardFooter}>
                    {booking.status === 'pending' && (
                      <div style={styles.btnRow}>
                        <button onClick={() => handleStatusUpdate(booking._id, 'confirmed')} disabled={isUpdating} style={styles.approveBtn}>
                          <i className="ti ti-check" style={{ fontSize: '14px' }}></i>
                          {isUpdating ? 'Updating...' : 'Approve'}
                        </button>
                        <button onClick={() => handleStatusUpdate(booking._id, 'cancelled')} disabled={isUpdating} style={styles.rejectBtn}>
                          <i className="ti ti-x" style={{ fontSize: '14px' }}></i>
                          Reject
                        </button>
                      </div>
                    )}
                    {booking.status === 'confirmed' && (
                      <button onClick={() => handleStatusUpdate(booking._id, 'completed')} disabled={isUpdating} style={styles.completeBtn}>
                        <i className="ti ti-circle-check" style={{ fontSize: '14px' }}></i>
                        {isUpdating ? 'Updating...' : 'Mark as completed'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </Layout>
  );
}

const styles = {
  pageTitle: { fontSize: '24px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '4px' },
  pageSubtitle: { fontSize: '14px', color: COLORS.textSecondary, marginBottom: '24px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' },
  statBox: { backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '16px', textAlign: 'center' },
  statNum: { fontSize: '24px', fontWeight: '700', color: COLORS.textPrimary },
  statLabel: { fontSize: '12px', color: COLORS.textSecondary, marginTop: '4px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' },
  card: { backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '18px', boxShadow: SHADOW.card },
  cardHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: '14px', paddingBottom: '12px', borderBottom: `1px solid ${COLORS.border}`
  },
  serviceTitle: { fontSize: '16px', fontWeight: '700', color: COLORS.textPrimary, margin: 0 },
  statusBadge: {
    display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px',
    borderRadius: '999px', fontSize: '11px', fontWeight: '700', textTransform: 'capitalize'
  },
  customerBox: {
    display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: COLORS.infoLight || COLORS.infoBg,
    padding: '10px 12px', borderRadius: '10px', marginBottom: '14px'
  },
  avatar: {
    width: '36px', height: '36px', borderRadius: '50%', backgroundColor: COLORS.bgCard,
    color: COLORS.info, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: '700', flexShrink: 0
  },
  customerName: { fontSize: '14px', fontWeight: '700', color: COLORS.textPrimary },
  customerMeta: { fontSize: '12px', color: COLORS.textSecondary },
  infoRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: COLORS.textSecondary, marginBottom: '8px' },
  infoIcon: { fontSize: '14px', color: COLORS.textMuted, width: '16px' },
  noteBox: {
    display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '12px', color: COLORS.textSecondary,
    backgroundColor: COLORS.bgSubtle, padding: '8px 12px', borderRadius: '6px', marginTop: '8px', fontStyle: 'italic'
  },
  cardFooter: { marginTop: '14px', paddingTop: '12px', borderTop: `1px solid ${COLORS.border}` },
  btnRow: { display: 'flex', gap: '8px' },
  approveBtn: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px',
    backgroundColor: COLORS.successBg, color: COLORS.success, border: 'none', borderRadius: '8px',
    fontSize: '13px', fontWeight: '600'
  },
  rejectBtn: {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px',
    backgroundColor: COLORS.dangerBg, color: COLORS.danger, border: 'none', borderRadius: '8px',
    fontSize: '13px', fontWeight: '600'
  },
  completeBtn: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px',
    backgroundColor: COLORS.infoBg, color: COLORS.info, border: 'none', borderRadius: '8px',
    fontSize: '13px', fontWeight: '600'
  },
  emptyState: { textAlign: 'center', padding: '60px 20px', backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px' },
  emptyIcon: {
    width: '56px', height: '56px', borderRadius: '50%', backgroundColor: COLORS.bgSubtle,
    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
  },
  emptyTitle: { fontSize: '18px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '6px' },
  emptyText: { fontSize: '14px', color: COLORS.textSecondary },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: COLORS.dangerBg,
    color: COLORS.danger, padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px'
  },
  retryBtn: { marginLeft: 'auto', background: 'none', border: 'none', color: COLORS.danger, fontWeight: '700', fontSize: '13px', textDecoration: 'underline' },
  loadingBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '60px', fontSize: '14px', color: COLORS.textSecondary },
  spinner: { width: '18px', height: '18px', border: `2px solid ${COLORS.border}`, borderTopColor: COLORS.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }
};

export default ProviderBookings;