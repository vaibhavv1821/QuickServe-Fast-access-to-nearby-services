import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';

function ProviderBookings() {
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  // Load bookings when component mounts
  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await bookingService.getProviderBookings();
      console.log('Provider bookings loaded:', data);
      setBookings(data.bookings || []);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError(err.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const confirmMessage = newStatus === 'confirmed' 
      ? 'Are you sure you want to approve this booking?'
      : 'Are you sure you want to reject this booking?';

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setUpdatingId(bookingId);

    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ));

      alert(`Booking ${newStatus} successfully!`);
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update booking status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ffc107',
      confirmed: '#28a745',
      completed: '#007bff',
      cancelled: '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <h3>Loading bookings...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1>My Bookings</h1>
          <p style={styles.subtitle}>Manage your service requests</p>
        </div>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Dashboard
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={styles.error}>
          <p>{error}</p>
          <button onClick={loadBookings} style={styles.retryBtn}>
            Try Again
          </button>
        </div>
      )}

      {/* No Bookings */}
      {!error && bookings.length === 0 && (
        <div style={styles.noBookings}>
          <div style={styles.emptyIcon}>📋</div>
          <h2>No bookings yet</h2>
          <p>You don't have any service requests yet.</p>
          <p>Customers will book your services from the search page.</p>
        </div>
      )}

      {/* Stats Bar */}
      {!error && bookings.length > 0 && (
        <div style={styles.statsBar}>
          <div style={styles.stat}>
            <span style={styles.statNumber}>{bookings.length}</span>
            <span style={styles.statLabel}>Total Requests</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNumber}>
              {bookings.filter(b => b.status === 'pending').length}
            </span>
            <span style={styles.statLabel}>Pending</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNumber}>
              {bookings.filter(b => b.status === 'confirmed').length}
            </span>
            <span style={styles.statLabel}>Confirmed</span>
          </div>
          <div style={styles.stat}>
            <span style={styles.statNumber}>
              {bookings.filter(b => b.status === 'completed').length}
            </span>
            <span style={styles.statLabel}>Completed</span>
          </div>
        </div>
      )}

      {/* Bookings Grid */}
      {!error && bookings.length > 0 && (
        <div style={styles.grid}>
          {bookings.map((booking) => (
            <div key={booking._id} style={styles.card}>
              {/* Card Header */}
              <div style={styles.cardHeader}>
                <h3 style={styles.serviceTitle}>{booking.serviceType}</h3>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(booking.status),
                  }}
                >
                  {booking.status.toUpperCase()}
                </span>
              </div>

              {/* Customer Info */}
              <div style={styles.customerSection}>
                <h4 style={styles.sectionTitle}>Customer Details</h4>
                <div style={styles.infoRow}>
                  <span style={styles.label}>👤 Name:</span>
                  <span style={styles.value}>{booking.userId?.name}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>📧 Email:</span>
                  <span style={styles.value}>{booking.userId?.email}</span>
                </div>
                <div style={styles.infoRow}>
                  <span style={styles.label}>📱 Phone:</span>
                  <span style={styles.value}>{booking.userId?.phone}</span>
                </div>
              </div>

              {/* Service Details */}
              <div style={styles.cardBody}>
                <h4 style={styles.sectionTitle}>Service Details</h4>
                
                <div style={styles.infoRow}>
                  <span style={styles.label}>📅 Date:</span>
                  <span style={styles.value}>{formatDate(booking.date)}</span>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.label}>🕐 Time:</span>
                  <span style={styles.value}>{booking.time}</span>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.label}>💰 Price:</span>
                  <span style={styles.value}>₹{booking.price}</span>
                </div>

                <div style={styles.addressSection}>
                  <span style={styles.label}>📍 Service Location:</span>
                  <p style={styles.addressText}>
                    {booking.address?.street}<br />
                    {booking.address?.city}, {booking.address?.state}
                  </p>
                </div>

                {booking.description && (
                  <div style={styles.descriptionSection}>
                    <span style={styles.label}>📝 Customer Message:</span>
                    <p style={styles.descriptionText}>{booking.description}</p>
                  </div>
                )}

                <div style={styles.bookingMeta}>
                  <small>Requested on: {formatDate(booking.createdAt)}</small>
                </div>
              </div>

              {/* Action Buttons */}
              {booking.status === 'pending' && (
                <div style={styles.cardFooter}>
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                    disabled={updatingId === booking._id}
                    style={styles.approveBtn}
                  >
                    {updatingId === booking._id ? 'Updating...' : '✓ Approve'}
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                    disabled={updatingId === booking._id}
                    style={styles.rejectBtn}
                  >
                    {updatingId === booking._id ? 'Updating...' : '✗ Reject'}
                  </button>
                </div>
              )}

              {booking.status === 'confirmed' && (
                <div style={styles.cardFooter}>
                  <button
                    onClick={() => handleStatusUpdate(booking._id, 'completed')}
                    disabled={updatingId === booking._id}
                    style={styles.completeBtn}
                  >
                    {updatingId === booking._id ? 'Updating...' : '✓ Mark as Completed'}
                  </button>
                </div>
              )}

              {(booking.status === 'completed' || booking.status === 'cancelled') && (
                <div style={styles.cardFooter}>
                  <div style={styles.finalStatus}>
                    {booking.status === 'completed' ? '✅ Service Completed' : '❌ Booking Rejected'}
                  </div>
                </div>
              )}
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
    maxWidth: '1400px',
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
    fontWeight: 'bold',
    fontSize: '14px'
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
    border: '1px solid #f5c6cb',
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
  noBookings: {
    backgroundColor: 'white',
    padding: '80px 40px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginTop: '50px'
  },
  emptyIcon: {
    fontSize: '80px',
    marginBottom: '20px'
  },
  statsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '15px',
    marginBottom: '25px'
  },
  stat: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  statNumber: {
    display: 'block',
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: '5px'
  },
  statLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#666'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '2px solid #f0f0f0',
    backgroundColor: '#fafafa'
  },
  serviceTitle: {
    margin: 0,
    color: '#333',
    fontSize: '20px'
  },
  statusBadge: {
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  customerSection: {
    padding: '20px',
    backgroundColor: '#e7f3ff',
    borderBottom: '1px solid #bee5eb'
  },
  sectionTitle: {
    margin: '0 0 12px 0',
    fontSize: '16px',
    color: '#555',
    fontWeight: 'bold'
  },
  cardBody: {
    padding: '20px',
    flex: 1
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    paddingBottom: '8px',
    borderBottom: '1px solid #f0f0f0'
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
    fontSize: '14px'
  },
  value: {
    color: '#333',
    fontSize: '14px'
  },
  addressSection: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    borderLeft: '3px solid #007bff'
  },
  addressText: {
    margin: '8px 0 0 0',
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.6'
  },
  descriptionSection: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#fff3cd',
    borderRadius: '4px',
    borderLeft: '3px solid #ffc107'
  },
  descriptionText: {
    margin: '8px 0 0 0',
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.6',
    fontStyle: 'italic'
  },
  bookingMeta: {
    marginTop: '15px',
    paddingTop: '12px',
    borderTop: '1px solid #e9ecef',
    color: '#999',
    fontSize: '13px'
  },
  cardFooter: {
    padding: '15px 20px',
    backgroundColor: '#fafafa',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    gap: '10px'
  },
  approveBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  rejectBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  completeBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  finalStatus: {
    width: '100%',
    padding: '12px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#666'
  }
};

export default ProviderBookings;