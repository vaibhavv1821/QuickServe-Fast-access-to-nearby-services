import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SHADOW } from '../styles/theme';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
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

          <h1 style={styles.brandHeadline}>Trusted local help, booked in minutes</h1>
          <p style={styles.brandSub}>
            Verified electricians, plumbers, cleaners and more — rated by your neighbours.
          </p>

          <div style={styles.trustRow}>
            <div style={styles.trustItem}>
              <i className="ti ti-shield-check" style={{ fontSize: '18px', color: COLORS.primary }}></i>
              <span>Verified providers</span>
            </div>
            <div style={styles.trustItem}>
              <i className="ti ti-star" style={{ fontSize: '18px', color: COLORS.star }}></i>
              <span>Rated 4.7+ average</span>
            </div>
            <div style={styles.trustItem}>
              <i className="ti ti-headset" style={{ fontSize: '18px', color: COLORS.info }}></i>
              <span>In-app chat support</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={styles.formPanel}>
        <div style={styles.formCard}>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Log in to book or manage your services</p>

          {error && (
            <div style={styles.errorBox}>
              <i className="ti ti-alert-circle" style={{ fontSize: '16px' }}></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputWrap}>
                <i className="ti ti-mail" style={styles.inputIcon}></i>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrap}>
                <i className="ti ti-lock" style={styles.inputIcon}></i>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Logging in...' : 'Log in'}
              {!loading && <i className="ti ti-arrow-right" style={{ fontSize: '16px' }}></i>}
            </button>
          </form>

          <p style={styles.footerText}>
            Don't have an account? <Link to="/register" style={styles.link}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif"
  },
  brandPanel: {
    flex: 1,
    backgroundColor: COLORS.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    color: COLORS.white
  },
  brandContent: {
    maxWidth: '440px'
  },
  logoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '48px'
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: COLORS.white
  },
  brandHeadline: {
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: '1.3',
    marginBottom: '16px'
  },
  brandSub: {
    fontSize: '15px',
    color: 'rgba(255,255,255,0.85)',
    lineHeight: '1.6',
    marginBottom: '40px'
  },
  trustRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  trustItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.9)'
  },
  formPanel: {
    flex: 1,
    backgroundColor: COLORS.bgPage,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px'
  },
  formCard: {
    width: '100%',
    maxWidth: '380px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: '6px'
  },
  subtitle: {
    fontSize: '14px',
    color: COLORS.textSecondary,
    marginBottom: '28px'
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: COLORS.dangerBg,
    color: COLORS.danger,
    padding: '12px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    marginBottom: '18px'
  },
  formGroup: {
    marginBottom: '18px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: '6px'
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '14px',
    fontSize: '16px',
    color: COLORS.textMuted
  },
  input: {
    width: '100%',
    padding: '12px 14px 12px 40px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  submitBtn: {
    width: '100%',
    padding: '13px',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '6px'
  },
  footerText: {
    textAlign: 'center',
    fontSize: '14px',
    color: COLORS.textSecondary,
    marginTop: '24px'
  },
  link: {
    color: COLORS.primary,
    fontWeight: '600'
  }
};

export default Login;