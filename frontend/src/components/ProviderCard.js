import React from 'react';
import { useNavigate } from 'react-router-dom';

function ProviderCard({ provider }) {
  const navigate = useNavigate();

  const handleBookNow = () => {
    // Pass provider data to booking page
    navigate(`/book/${provider._id}`, {
      state: { provider }
    });
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.name}>{provider.userId?.name || 'Unknown'}</h3>
        <div style={styles.rating}>
          ⭐ {provider.rating > 0 ? provider.rating.toFixed(1) : 'New'}
        </div>
      </div>

      <div style={styles.details}>
        <p><strong>Service:</strong> {provider.serviceType}</p>
        <p><strong>Experience:</strong> {provider.experience} years</p>
        <p><strong>Price:</strong> ₹{provider.price}/service</p>
        <p><strong>Location:</strong> {provider.userId?.location?.city}, {provider.userId?.location?.state}</p>
        <p><strong>Phone:</strong> {provider.userId?.phone}</p>
        {provider.bio && <p style={styles.bio}>{provider.bio}</p>}
      </div>

      <div style={styles.footer}>
        <button
          onClick={handleBookNow}
          style={styles.bookBtn}
        >
          📅 Book Now
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '2px solid #f0f0f0',
    paddingBottom: '10px'
  },
  name: {
    margin: 0,
    color: '#333'
  },
  rating: {
    backgroundColor: '#ffc107',
    padding: '5px 10px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontSize: '14px'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  bio: {
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    fontStyle: 'italic',
    color: '#666'
  },
  footer: {
    marginTop: '10px'
  },
  bookBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background-color 0.2s'
  }
};

export default ProviderCard;