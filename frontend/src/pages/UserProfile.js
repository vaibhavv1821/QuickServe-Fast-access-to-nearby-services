import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import userService from '../services/userService';
import Layout from '../components/Layout';
import { COLORS, SHADOW } from '../styles/theme';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];
const STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'];

function UserProfile() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || '', phone: user?.phone || '',
    city: user?.location?.city || '', state: user?.location?.state || ''
  });
  const [pwData, setPwData] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handlePwChange = (e) => setPwData({ ...pwData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setSaving(true);
    try {
      await userService.updateProfile({
        name: formData.name, phone: formData.phone,
        location: { city: formData.city, state: formData.state }
      });
      setSuccess('Profile updated. Refresh to see changes everywhere.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setChangingPw(true);
    try {
      await userService.changePassword(pwData);
      setSuccess('Password changed successfully');
      setPwData({ currentPassword: '', newPassword: '' });
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <Layout>
      <h1 style={styles.pageTitle}>Account settings</h1>
      <p style={styles.pageSubtitle}>Manage your personal information</p>

      {success && (
        <div style={styles.successBox}>
          <i className="ti ti-circle-check" style={{ fontSize: '16px' }}></i>
          {success}
        </div>
      )}
      {error && (
        <div style={styles.errorBox}>
          <i className="ti ti-alert-circle" style={{ fontSize: '16px' }}></i>
          {error}
        </div>
      )}

      <div style={styles.grid}>
        {/* Profile info */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Personal information</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required pattern="[0-9]{10}" style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input type="email" value={user?.email || ''} disabled style={{ ...styles.input, backgroundColor: COLORS.bgSubtle, color: COLORS.textMuted }} />
              <small style={styles.hint}>Email cannot be changed</small>
            </div>
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>City</label>
                <select name="city" value={formData.city} onChange={handleChange} required style={styles.input}>
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>State</label>
                <select name="state" value={formData.state} onChange={handleChange} required style={styles.input}>
                  <option value="">Select state</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={saving} style={styles.saveBtn}>
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Change password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Current password</label>
              <input type="password" name="currentPassword" value={pwData.currentPassword} onChange={handlePwChange} required style={styles.input} />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>New password</label>
              <input type="password" name="newPassword" value={pwData.newPassword} onChange={handlePwChange} required minLength="6" style={styles.input} />
            </div>
            <button type="submit" disabled={changingPw} style={styles.saveBtn}>
              {changingPw ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  pageTitle: { fontSize: '24px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '4px' },
  pageSubtitle: { fontSize: '14px', color: COLORS.textSecondary, marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' },
  card: { backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '24px', boxShadow: SHADOW.card },
  cardTitle: { fontSize: '16px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '18px' },
  formGroup: { marginBottom: '16px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: COLORS.bgCard },
  hint: { display: 'block', marginTop: '4px', fontSize: '11px', color: COLORS.textMuted },
  saveBtn: { width: '100%', padding: '12px', backgroundColor: COLORS.primary, color: COLORS.white, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', marginTop: '4px' },
  successBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: COLORS.successBg, color: COLORS.success, padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', marginBottom: '20px' },
  errorBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: COLORS.dangerBg, color: COLORS.danger, padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }
};

export default UserProfile;