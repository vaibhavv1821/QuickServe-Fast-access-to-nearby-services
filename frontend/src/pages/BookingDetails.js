import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import Layout from '../components/Layout';
import { COLORS, SHADOW } from '../styles/theme';

const STATUS_CONFIG = {
  pending: { color: COLORS.warning, bg: COLORS.warningBg, icon: 'ti-clock' },
  confirmed: { color: COLORS.info, bg: COLORS.infoBg, icon: 'ti-check' },
  completed: { color: COLORS.success, bg: COLORS.successBg, icon: 'ti-circle-check' },
  cancelled: { color: COLORS.danger, bg: COLORS.dangerBg, icon: 'ti-x' }
};

function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await bookingService.getMyBookings();
        const found = (data.bookings || []).find(b => b._id === bookingId);
        setBooking(found);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [bookingId]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  if (loading) {
    return (
      <Layout>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          Loading booking...
        </div>
      </Layout>
    );
  }

  if (!booking) {
    return (
      <Layout>
        <div style={styles.emptyState}>
          <i className="ti ti-calendar-off" style={{ fontSize: '28px', color: COLORS.textMuted }}></i>
          <p style={styles.emptyText}>Booking not found</p>
        </div>
      </Layout>
    );
  }

  const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;

  return (
    <Layout>
      <button onClick={() => navigate('/my-bookings')} style={styles.backLink}>
        <i className="ti ti-arrow-left" style={{ fontSize: '14px' }}></i>
        Back to bookings
      </button>

      <div style={styles.card}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>{booking.serviceType}</h1>
            <p style={styles.subtitle}>Booking #{booking._id?.slice(-8)}</p>
          </div>
          <span style={{ ...styles.statusBadge, color: status.color, backgroundColor: status.bg }}>
            <i className={`ti ${status.icon}`} style={{ fontSize: '13px' }}></i>
            {booking.status}
          </span>
        </div>

        <div style={styles.detailGrid}>
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}><i className="ti ti-calendar" style={{ fontSize: '14px' }}></i> Date</div>
            <div style={styles.detailValue}>{formatDate(booking.date)}</div>
          </div>
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}><i className="ti ti-clock" style={{ fontSize: '14px' }}></i> Time</div>
            <div style={styles.detailValue}>{booking.time}</div>
          </div>
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}><i className="ti ti-currency-rupee" style={{ fontSize: '14px' }}></i> Price</div>
            <div style={styles.detailValue}>₹{booking.price}</div>
          </div>
          <div style={styles.detailItem}>
            <div style={styles.detailLabel}><i className="ti ti-calendar-plus" style={{ fontSize: '14px' }}></i> Booked on</div>
            <div style={styles.detailValue}>{formatDate(booking.createdAt)}</div>
          </div>
        </div>

        <div style={styles.addressBox}>
          <div style={styles.detailLabel}><i className="ti ti-map-pin" style={{ fontSize: '14px' }}></i> Service address</div>
          <p style={styles.addressText}>
            {booking.address?.street}<br />
            {booking.address?.city}, {booking.address?.state}
          </p>
        </div>

        {booking.description && (
          <div style={styles.noteBox}>
            <div style={styles.detailLabel}><i className="ti ti-note" style={{ fontSize: '14px' }}></i> Notes</div>
            <p style={styles.noteText}>{booking.description}</p>
          </div>
        )}

        {booking.status === 'completed' && (
          <button
            onClick={() => navigate(`/add-review/${booking.providerId}`, { state: { booking, providerId: booking.providerId } })}
            style={styles.reviewBtn}
          >
            <i className="ti ti-star" style={{ fontSize: '14px' }}></i>
            Add a review
          </button>
        )}
      </div>
    </Layout>
  );
}

const styles = {
  backLink: { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', fontSize: '13px', fontWeight: '600', color: COLORS.textSecondary, marginBottom: '16px', padding: 0 },
  card: { backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '28px', boxShadow: SHADOW.card, maxWidth: '640px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingBottom: '20px', borderBottom: `1px solid ${COLORS.border}` },
  title: { fontSize: '20px', fontWeight: '700', color: COLORS.textPrimary, margin: '0 0 4px' },
  subtitle: { fontSize: '12px', color: COLORS.textMuted, margin: 0 },
  statusBadge: { display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize' },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' },
  detailItem: { backgroundColor: COLORS.bgSubtle, borderRadius: '10px', padding: '14px' },
  detailLabel: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: COLORS.textSecondary, marginBottom: '6px' },
  detailValue: { fontSize: '15px', fontWeight: '700', color: COLORS.textPrimary },
  addressBox: { backgroundColor: COLORS.bgSubtle, borderRadius: '10px', padding: '14px', marginBottom: '16px' },
  addressText: { fontSize: '14px', color: COLORS.textSecondary, lineHeight: '1.6', margin: '6px 0 0' },
  noteBox: { backgroundColor: COLORS.warningBg, borderRadius: '10px', padding: '14px', marginBottom: '20px' },
  noteText: { fontSize: '13px', color: COLORS.textSecondary, lineHeight: '1.6', margin: '6px 0 0', fontStyle: 'italic' },
  reviewBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', backgroundColor: COLORS.primary, color: COLORS.white, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' },
  emptyState: { textAlign: 'center', padding: '60px 20px' },
  emptyText: { fontSize: '14px', color: COLORS.textSecondary, marginTop: '10px' },
  loadingBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '60px', fontSize: '14px', color: COLORS.textSecondary },
  spinner: { width: '18px', height: '18px', border: `2px solid ${COLORS.border}`, borderTopColor: COLORS.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }
};

export default BookingDetails;