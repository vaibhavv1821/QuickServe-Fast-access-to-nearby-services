import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../styles/theme';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];
const STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'];

function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'user',
    location: { city: '', state: '' }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'city' || name === 'state') {
      setFormData({ ...formData, location: { ...formData.location, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Left branding panel */}
      <div style={styles.brandPanel}>
        <div style={styles.brandContent}>
          <div style={styles.logoRow}>
            <div style={styles.logoIcon}>
              <i className="ti ti-bolt" style={{ fontSize: '20px', color: COLORS.white }}></i>
            </div>
            <span style={styles.logoText}>Quickserve</span>
          </div>
          <h1 style={styles.brandHeadline}>Join thousands finding trusted help nearby</h1>
          <p style={styles.brandSub}>
            Whether you need a service or want to offer one — set up your account in under a minute.
          </p>
          <div style={styles.stepList}>
            <div style={styles.stepItem}>
              <div style={styles.stepNum}>1</div>
              <span>Create your account</span>
            </div>
            <div style={styles.stepItem}>
              <div style={styles.stepNum}>2</div>
              <span>Search or list your services</span>
            </div>
            <div style={styles.stepItem}>
              <div style={styles.stepNum}>3</div>
              <span>Book, chat and get rated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={styles.formPanel}>
        <div style={styles.formCard}>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Start using Quickserve today</p>

          {error && (
            <div style={styles.errorBox}>
              <i className="ti ti-alert-circle" style={{ fontSize: '16px' }}></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role selector */}
            <div style={styles.roleSelector}>
              <div
                onClick={() => setFormData({ ...formData, role: 'user' })}
                style={{ ...styles.roleCard, ...(formData.role === 'user' ? styles.roleCardActive : {}) }}
              >
                <i className="ti ti-user" style={{ fontSize: '18px' }}></i>
                <span>I need a service</span>
              </div>
              <div
                onClick={() => setFormData({ ...formData, role: 'provider' })}
                style={{ ...styles.roleCard, ...(formData.role === 'provider' ? styles.roleCardActive : {}) }}
              >
                <i className="ti ti-tools" style={{ fontSize: '18px' }}></i>
                <span>I provide a service</span>
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} placeholder="Your name" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required pattern="[0-9]{10}" style={styles.input} placeholder="10-digit number" />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} placeholder="you@example.com" />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" style={styles.input} placeholder="At least 6 characters" />
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>City</label>
                <select name="city" value={formData.location.city} onChange={handleChange} required style={styles.input}>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>State</label>
                <select name="state" value={formData.location.state} onChange={handleChange} required style={styles.input}>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Creating account...' : 'Create account'}
              {!loading && <i className="ti ti-arrow-right" style={{ fontSize: '16px' }}></i>}
            </button>
          </form>

          <p style={styles.footerText}>
            Already have an account? <Link to="/login" style={styles.link}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { display: 'flex', minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  brandPanel: {
    flex: 1, backgroundColor: COLORS.primary, display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: '48px', color: COLORS.white
  },
  brandContent: { maxWidth: '440px' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '48px' },
  logoIcon: {
    width: '36px', height: '36px', borderRadius: '10px',
    backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex',
    alignItems: 'center', justifyContent: 'center'
  },
  logoText: { fontSize: '20px', fontWeight: '700', color: COLORS.white },
  brandHeadline: { fontSize: '30px', fontWeight: '700', lineHeight: '1.3', marginBottom: '16px' },
  brandSub: { fontSize: '15px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', marginBottom: '40px' },
  stepList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  stepItem: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'rgba(255,255,255,0.9)' },
  stepNum: {
    width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0
  },
  formPanel: {
    flex: 1.2, backgroundColor: COLORS.bgPage, display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: '24px'
  },
  formCard: { width: '100%', maxWidth: '420px' },
  title: { fontSize: '24px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '6px' },
  subtitle: { fontSize: '14px', color: COLORS.textSecondary, marginBottom: '24px' },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: COLORS.dangerBg,
    color: COLORS.danger, padding: '12px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '18px'
  },
  roleSelector: { display: 'flex', gap: '10px', marginBottom: '20px' },
  roleCard: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
    padding: '14px', border: `1px solid ${COLORS.border}`, borderRadius: '10px',
    cursor: 'pointer', fontSize: '13px', fontWeight: '500', color: COLORS.textSecondary,
    backgroundColor: COLORS.bgCard
  },
  roleCardActive: {
    borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight, color: COLORS.primary
  },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  formGroup: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '6px' },
  input: {
    width: '100%', padding: '12px 14px', border: `1px solid ${COLORS.border}`,
    borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
    backgroundColor: COLORS.bgCard
  },
  submitBtn: {
    width: '100%', padding: '13px', backgroundColor: COLORS.primary, color: COLORS.white,
    border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px'
  },
  footerText: { textAlign: 'center', fontSize: '14px', color: COLORS.textSecondary, marginTop: '20px' },
  link: { color: COLORS.primary, fontWeight: '600' }
};

export default Register;