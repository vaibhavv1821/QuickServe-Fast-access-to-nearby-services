import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import bookingService from '../services/bookingService';

function BookService() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const provider = location.state?.provider;

  const [formData, setFormData] = useState({
    date: '',
    time: '',
    serviceType: provider?.serviceType || '',
    description: '',
    address: {
      street: '',
      city: '',
      state: ''
    },
    price: provider?.price || ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'street' || name === 'city' || name === 'state') {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create booking data
      const bookingData = {
        providerId,
        date: formData.date,
        time: formData.time,
        serviceType: formData.serviceType,
        description: formData.description,
        address: formData.address,
        price: Number(formData.price)
      };

      await bookingService.createBooking(bookingData);
      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);

    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
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
          <h2>Booking Created Successfully!</h2>
          <p>Your booking request has been sent to the provider.</p>
          <p>Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Book Service</h2>
        <button onClick={() => navigate('/search')} style={styles.backBtn}>
          ← Back to Search
        </button>
      </div>

      {/* Provider Info Card */}
      {provider && (
        <div style={styles.providerCard}>
          <h3>Provider Details</h3>
          <p><strong>Name:</strong> {provider.userId?.name}</p>
          <p><strong>Service:</strong> {provider.serviceType}</p>
          <p><strong>Experience:</strong> {provider.experience} years</p>
          <p><strong>Price:</strong> ₹{provider.price}/service</p>
          <p><strong>Rating:</strong> ⭐ {provider.rating > 0 ? provider.rating.toFixed(1) : 'New'}</p>
        </div>
      )}

      {/* Booking Form */}
      <div style={styles.formCard}>
        <h3>Booking Details</h3>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Service Type *</label>
              <input
                type="text"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Time *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Street Address *</label>
            <input
              type="text"
              name="street"
              value={formData.address.street}
              onChange={handleChange}
              placeholder="Enter your street address"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>City *</label>
              <input
                type="text"
                name="city"
                value={formData.address.city}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>State *</label>
              <input
                type="text"
                name="state"
                value={formData.address.state}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description / Special Instructions (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add any special requirements or instructions..."
              rows="4"
              style={styles.textarea}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="submit"
              disabled={loading}
              style={styles.submitBtn}
            >
              {loading ? 'Creating Booking...' : '✓ Confirm Booking'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/search')}
              style={styles.cancelBtn}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
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
  providerCard: {
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
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '15px'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '25px'
  },
  submitBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
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

export default BookService;