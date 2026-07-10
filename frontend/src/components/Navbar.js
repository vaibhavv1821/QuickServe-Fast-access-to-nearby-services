import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SHADOW } from '../styles/theme';
import NotificationBell from './NotificationBell';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        {/* Logo */}
        <div style={styles.logo} onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
          <div style={styles.logoIcon}>
            <i className="ti ti-bolt" style={{ fontSize: '18px', color: COLORS.white }}></i>
          </div>
          <span style={styles.logoText}>Quickserve</span>
        </div>

        {/* Right side */}
        {isAuthenticated ? (
          <div style={styles.rightSection}>
            <button
  onClick={() => navigate('/search')}
  style={styles.navLink}
>
  <i className="ti ti-search" style={{ fontSize: '16px' }}></i>
  Find services
</button>

<NotificationBell />

<div style={styles.divider}></div>

            <div style={styles.userMenu} onClick={() => setMenuOpen(!menuOpen)}>
              <div style={styles.avatar}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span style={styles.userName}>{user?.name?.split(' ')[0]}</span>
              <i className="ti ti-chevron-down" style={{ fontSize: '14px', color: COLORS.textMuted }}></i>

              {menuOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <div style={styles.dropdownName}>{user?.name}</div>
                    <div style={styles.dropdownRole}>{user?.role}</div>
                  </div>
                  <div style={styles.dropdownDivider}></div>
                  <button style={styles.dropdownItem} onClick={() => navigate('/dashboard')}>
                    <i className="ti ti-layout-dashboard" style={{ fontSize: '16px' }}></i>
                    Dashboard
                  </button>
                  <button style={styles.dropdownItem} onClick={handleLogout}>
                    <i className="ti ti-logout" style={{ fontSize: '16px' }}></i>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={styles.rightSection}>
            <Link to="/login" style={styles.loginLink}>Log in</Link>
            <button onClick={() => navigate('/register')} style={styles.signupBtn}>
              Sign up
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: COLORS.bgCard,
    borderBottom: `1px solid ${COLORS.border}`,
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
  },
  logoIcon: {
    width: '30px',
    height: '30px',
    borderRadius: '8px',
    backgroundColor: COLORS.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    fontWeight: '500',
    color: COLORS.textSecondary,
    padding: '8px 12px',
    borderRadius: '8px'
  },
  divider: {
    width: '1px',
    height: '24px',
    backgroundColor: COLORS.border
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    position: 'relative',
    padding: '6px 10px',
    borderRadius: '8px'
  },
  avatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700'
  },
  userName: {
    fontSize: '14px',
    fontWeight: '500',
    color: COLORS.textPrimary
  },
  dropdown: {
    position: 'absolute',
    top: '48px',
    right: 0,
    backgroundColor: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '10px',
    boxShadow: SHADOW.hover,
    minWidth: '200px',
    padding: '8px',
    zIndex: 200
  },
  dropdownHeader: {
    padding: '8px 12px'
  },
  dropdownName: {
    fontSize: '14px',
    fontWeight: '600',
    color: COLORS.textPrimary
  },
  dropdownRole: {
    fontSize: '12px',
    color: COLORS.textMuted,
    textTransform: 'capitalize'
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: COLORS.border,
    margin: '4px 0'
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    background: 'none',
    border: 'none',
    fontSize: '14px',
    color: COLORS.textPrimary,
    padding: '10px 12px',
    borderRadius: '6px',
    textAlign: 'left'
  },
  loginLink: {
    fontSize: '14px',
    fontWeight: '500',
    color: COLORS.textSecondary
  },
  signupBtn: {
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: 'none',
    padding: '9px 18px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600'
  }
};

export default Navbar;