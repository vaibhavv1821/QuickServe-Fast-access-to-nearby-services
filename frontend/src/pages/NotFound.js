import React from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../styles/theme';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.wrap}>
      <div style={styles.iconBox}>
        <i className="ti ti-map-pin-off" style={{ fontSize: '32px', color: COLORS.textMuted }}></i>
      </div>
      <h1 style={styles.title}>Page not found</h1>
      <p style={styles.text}>The page you're looking for doesn't exist or has moved.</p>
      <button onClick={() => navigate('/')} style={styles.btn}>
        <i className="ti ti-home" style={{ fontSize: '14px' }}></i>
        Back to home
      </button>
    </div>
  );
}

const styles = {
  wrap: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bgPage, textAlign: 'center', padding: '24px' },
  iconBox: { width: '64px', height: '64px', borderRadius: '50%', backgroundColor: COLORS.bgSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' },
  title: { fontSize: '22px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '8px' },
  text: { fontSize: '14px', color: COLORS.textSecondary, marginBottom: '24px' },
  btn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: COLORS.primary, color: COLORS.white, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }
};

export default NotFound;