import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import searchService from '../services/searchService';
import ProviderCard from '../components/ProviderCard';

function SearchProviders() {
  const navigate = useNavigate();
  
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    serviceType: '',
    city: '',
    state: '',
    minPrice: '',
    maxPrice: '',
    minRating: ''
  });

  // Load top-rated providers on mount
  useEffect(() => {
    loadTopRated();
  }, []);

  const loadTopRated = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await searchService.getTopRatedProviders(20);
      setProviders(data.providers || []);
    } catch (err) {
      setError('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await searchService.searchProviders(filters);
      setProviders(data.providers || []);
      
      if (data.providers.length === 0) {
        setError('No providers found with these filters. Try adjusting your search.');
      }
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

  const handleReset = () => {
    setFilters({
      serviceType: '',
      city: '',
      state: '',
      minPrice: '',
      maxPrice: '',
      minRating: ''
    });
    loadTopRated();
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>Find Service Providers</h1>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Search Card */}
      <div style={styles.searchCard}>
        <h3>Search Filters</h3>
        
        {/* Basic Filters */}
        <div style={styles.basicFilters}>
          <input
            type="text"
            name="serviceType"
            placeholder="Service Type (e.g., Electrician, Plumber)"
            value={filters.serviceType}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="text"
            name="city"
            placeholder="City (e.g., Mumbai, Delhi)"
            value={filters.city}
            onChange={handleChange}
            style={styles.input}
          />

          <button onClick={handleSearch} style={styles.searchBtn}>
            🔍 Search
          </button>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={styles.toggleBtn}
        >
          {showFilters ? '▲ Hide' : '▼ Show'} Advanced Filters
        </button>

        {/* Advanced Filters */}
        {showFilters && (
          <div style={styles.advancedFilters}>
            <input
              type="text"
              name="state"
              placeholder="State"
              value={filters.state}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="number"
              name="minPrice"
              placeholder="Min Price (₹)"
              value={filters.minPrice}
              onChange={handleChange}
              style={styles.input}
            />

            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price (₹)"
              value={filters.maxPrice}
              onChange={handleChange}
              style={styles.input}
            />

            <select
              name="minRating"
              value={filters.minRating}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="5">5 Stars Only</option>
            </select>
          </div>
        )}

        <button onClick={handleReset} style={styles.resetBtn}>
          🔄 Reset Filters
        </button>
      </div>

      {/* Error Message */}
      {error && <div style={styles.error}>{error}</div>}

      {/* Loading State */}
      {loading && (
        <div style={styles.loading}>
          <p>Searching for providers...</p>
        </div>
      )}

      {/* Results Header */}
      {!loading && providers.length > 0 && (
        <div style={styles.resultsHeader}>
          <h3>Found {providers.length} provider{providers.length !== 1 ? 's' : ''}</h3>
        </div>
      )}

      {/* Provider Grid */}
      <div style={styles.grid}>
        {!loading && providers.length === 0 && (
          <div style={styles.noResults}>
            <p>No providers found. Try different search criteria.</p>
          </div>
        )}

        {providers.map((provider) => (
          <ProviderCard key={provider._id} provider={provider} />
        ))}
      </div>
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
  searchCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  basicFilters: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr auto',
    gap: '10px',
    marginTop: '15px',
    marginBottom: '15px'
  },
  advancedFilters: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '10px',
    marginTop: '15px',
    marginBottom: '15px'
  },
  input: {
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100%'
  },
  searchBtn: {
    padding: '12px 30px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    whiteSpace: 'nowrap'
  },
  toggleBtn: {
    padding: '8px 16px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginBottom: '10px'
  },
  resetBtn: {
    padding: '10px 20px',
    backgroundColor: '#ffc107',
    color: '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  resultsHeader: {
    backgroundColor: 'white',
    padding: '15px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  noResults: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: 'white',
    borderRadius: '8px',
    color: '#666'
  }
};

export default SearchProviders;