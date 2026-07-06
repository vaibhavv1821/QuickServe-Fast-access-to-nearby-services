import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function SearchProviders() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    serviceType: '',
    city: ''
  });

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (filters.serviceType) params.serviceType = filters.serviceType;
      if (filters.city) params.city = filters.city;

      const response = await api.get('/api/search/providers', { params });
      setProviders(response.data.providers || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search providers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Search Service Providers</h2>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          Back to Dashboard
        </button>
      </div>

      <div style={styles.searchCard}>
        <div style={styles.searchForm}>
          <input
            type="text"
            name="serviceType"
            placeholder="Service Type (e.g., Electrician)"
            value={filters.serviceType}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleChange}
            style={styles.input}
          />

          <button onClick={handleSearch} style={styles.searchBtn}>
            Search
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {loading && <p>Searching...</p>}

      <div style={styles.grid}>
        {providers.length === 0 && !loading && (
          <p>No providers found. Try different filters.</p>
        )}

        {providers.map((provider) => (
          <div key={provider._id} style={styles.card}>
            <h3>{provider.userId?.name}</h3>
            <p><strong>Service:</strong> {provider.serviceType}</p>
            <p><strong>Experience:</strong> {provider.experience} years</p>
            <p><strong>Price:</strong> ₹{provider.price}/hr</p>
            <p><strong>Rating:</strong> ⭐ {provider.rating || 'N/A'}</p>
            <p><strong>Location:</strong> {provider.userId?.location?.city}</p>
            
            <button
              onClick={() => navigate(`/booking/${provider._id}`)}
              style={styles.bookBtn}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  backBtn: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  searchCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  searchForm: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  input: {
    flex: 1,
    minWidth: '200px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  searchBtn: {
    padding: '10px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  bookBtn: {
    width: '100%',
    marginTop: '10px',
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px'
  }
};

export default SearchProviders;