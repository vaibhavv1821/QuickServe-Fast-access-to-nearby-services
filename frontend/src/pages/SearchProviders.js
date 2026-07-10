import React, { useState, useEffect } from 'react';
import searchService from '../services/searchService';
import ProviderCard from '../components/ProviderCard';
import Layout from '../components/Layout';
import { COLORS, SHADOW } from '../styles/theme';

const SERVICE_TYPES = ['Electrician', 'Plumber', 'Carpenter', 'Cleaner', 'Painter', 'AC Repair', 'Pest Control', 'Gardener'];

function SearchProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    serviceType: '', city: '', state: '', minPrice: '', maxPrice: '', minRating: ''
  });

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
        setError('No providers found. Try adjusting your filters.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search providers');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFilters({ serviceType: '', city: '', state: '', minPrice: '', maxPrice: '', minRating: '' });
    loadTopRated();
  };

  const selectCategory = (type) => {
    const newFilters = { ...filters, serviceType: filters.serviceType === type ? '' : type };
    setFilters(newFilters);
  };

  return (
    <Layout>
      <h1 style={styles.pageTitle}>Find a service provider</h1>
      <p style={styles.pageSubtitle}>Search verified professionals in your city</p>

      {/* Search bar */}
      <div style={styles.searchBar}>
        <div style={styles.searchField}>
          <i className="ti ti-search" style={styles.searchIcon}></i>
          <input
            type="text"
            name="serviceType"
            placeholder="What service do you need?"
            value={filters.serviceType}
            onChange={handleChange}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.searchDivider}></div>
        <div style={styles.searchField}>
          <i className="ti ti-map-pin" style={styles.searchIcon}></i>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={filters.city}
            onChange={handleChange}
            style={styles.searchInput}
          />
        </div>
        <button onClick={handleSearch} style={styles.searchBtn}>Search</button>
      </div>

      {/* Category quick filters */}
      <div style={styles.categoryRow}>
        {SERVICE_TYPES.map((type) => (
          <div
            key={type}
            onClick={() => selectCategory(type)}
            style={{
              ...styles.categoryChip,
              ...(filters.serviceType === type ? styles.categoryChipActive : {})
            }}
          >
            {type}
          </div>
        ))}
        <button onClick={() => setShowFilters(!showFilters)} style={styles.moreFiltersBtn}>
          <i className="ti ti-adjustments-horizontal" style={{ fontSize: '14px' }}></i>
          More filters
        </button>
      </div>

      {/* Advanced filters (collapsible) */}
      {showFilters && (
        <div style={styles.advancedPanel}>
          <div style={styles.advancedGrid}>
            <div>
              <label style={styles.filterLabel}>State</label>
              <input type="text" name="state" value={filters.state} onChange={handleChange} style={styles.filterInput} placeholder="State" />
            </div>
            <div>
              <label style={styles.filterLabel}>Min price (₹)</label>
              <input type="number" name="minPrice" value={filters.minPrice} onChange={handleChange} style={styles.filterInput} placeholder="0" />
            </div>
            <div>
              <label style={styles.filterLabel}>Max price (₹)</label>
              <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleChange} style={styles.filterInput} placeholder="1000" />
            </div>
            <div>
              <label style={styles.filterLabel}>Min rating</label>
              <select name="minRating" value={filters.minRating} onChange={handleChange} style={styles.filterInput}>
                <option value="">Any</option>
                <option value="4">4+ stars</option>
                <option value="4.5">4.5+ stars</option>
              </select>
            </div>
          </div>
          <button onClick={handleReset} style={styles.resetBtn}>
            <i className="ti ti-refresh" style={{ fontSize: '14px' }}></i>
            Reset all filters
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          <i className="ti ti-info-circle" style={{ fontSize: '16px' }}></i>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          Searching providers...
        </div>
      )}

      {/* Results count */}
      {!loading && providers.length > 0 && (
        <div style={styles.resultsCount}>
          {providers.length} provider{providers.length !== 1 ? 's' : ''} found
        </div>
      )}

      {/* Grid */}
      <div style={styles.grid}>
        {!loading && providers.length === 0 && !error && (
          <div style={styles.emptyState}>No providers available right now.</div>
        )}
        {providers.map((provider) => (
          <ProviderCard key={provider._id} provider={provider} />
        ))}
      </div>
    </Layout>
  );
}

const styles = {
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: '4px'
  },
  pageSubtitle: {
    fontSize: '14px',
    color: COLORS.textSecondary,
    marginBottom: '24px'
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    padding: '6px',
    boxShadow: SHADOW.card,
    marginBottom: '16px'
  },
  searchField: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px'
  },
  searchIcon: {
    fontSize: '18px',
    color: COLORS.textMuted
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    width: '100%',
    backgroundColor: 'transparent'
  },
  searchDivider: {
    width: '1px',
    height: '28px',
    backgroundColor: COLORS.border
  },
  searchBtn: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: 'none',
    padding: '12px 28px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600'
  },
  categoryRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '20px'
  },
  categoryChip: {
    padding: '8px 16px',
    borderRadius: '999px',
    border: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.bgCard,
    fontSize: '13px',
    fontWeight: '500',
    color: COLORS.textSecondary,
    cursor: 'pointer'
  },
  categoryChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
    color: COLORS.primary,
    fontWeight: '600'
  },
  moreFiltersBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    color: COLORS.primary,
    padding: '8px 4px',
    marginLeft: 'auto'
  },
  advancedPanel: {
    backgroundColor: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px'
  },
  advancedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '14px',
    marginBottom: '14px'
  },
  filterLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: '6px'
  },
  filterInput: {
    width: '100%',
    padding: '9px 12px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    fontSize: '13px',
    boxSizing: 'border-box'
  },
  resetBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    fontSize: '13px',
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: COLORS.warningBg,
    color: COLORS.warning,
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '20px'
  },
  loadingBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '40px',
    fontSize: '14px',
    color: COLORS.textSecondary
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: `2px solid ${COLORS.border}`,
    borderTopColor: COLORS.primary,
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  resultsCount: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    marginBottom: '14px',
    fontWeight: '600'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '16px'
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    color: COLORS.textMuted,
    fontSize: '14px'
  }
};

export default SearchProviders;