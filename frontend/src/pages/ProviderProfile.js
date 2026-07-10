import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import providerService from '../services/providerService';
import Layout from '../components/Layout';
import { COLORS, SHADOW } from '../styles/theme';

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Surat', 'Kanpur'];
const STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'];
const SERVICE_TYPES = ['Electrician', 'Plumber', 'Carpenter', 'Tutor', 'Painter', 'Cleaner', 'AC Repair', 'Appliance Repair', 'Pest Control', 'Gardener', 'Other'];

function ProviderProfile() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    serviceType: '', experience: '', price: '', bio: '', city: '', state: ''
  });

  useEffect(() => {
    if (user?.role !== 'provider') {
      alert('Only providers can access this page');
      navigate('/dashboard');
      return;
    }
    loadProfile();
    // eslint-disable-next-line
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await providerService.getMyProfile();
      setProfile(data.provider);
      setFormData({
        serviceType: data.provider.serviceType || '',
        experience: data.provider.experience || '',
        price: data.provider.price || '',
        bio: data.provider.bio || '',
        city: user?.location?.city || '',
        state: user?.location?.state || ''
      });
      setIsEditing(false);
    } catch (err) {
      if (err.response?.status === 404) {
        setProfile(null);
        setIsEditing(true);
        setFormData(prev => ({ ...prev, city: user?.location?.city || '', state: user?.location?.state || '' }));
      } else {
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      const profileData = {
        serviceType: formData.serviceType,
        experience: Number(formData.experience),
        price: Number(formData.price),
        bio: formData.bio
      };
      const data = profile
        ? await providerService.updateProfile(profileData)
        : await providerService.createProfile(profileData);

      await providerService.updateUserLocation({ city: formData.city, state: formData.state });

      setProfile(data.provider);
      setIsEditing(false);
      setSuccess(profile ? 'Profile updated' : 'Profile created — waiting for admin approval');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        serviceType: profile.serviceType || '', experience: profile.experience || '',
        price: profile.price || '', bio: profile.bio || '',
        city: user?.location?.city || '', state: user?.location?.state || ''
      });
      setIsEditing(false);
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          Loading profile...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 style={styles.pageTitle}>{profile ? 'My provider profile' : 'Create your profile'}</h1>
      <p style={styles.pageSubtitle}>
        {profile ? 'Manage your service listing' : 'Set up your listing so customers can find you'}
      </p>

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

      {profile && !isEditing && (
        <div style={styles.card}>
          <div style={{ ...styles.statusBanner, backgroundColor: profile.approved ? COLORS.successBg : COLORS.warningBg }}>
            <i className={`ti ${profile.approved ? 'ti-shield-check' : 'ti-clock'}`}
               style={{ fontSize: '24px', color: profile.approved ? COLORS.success : COLORS.warning }}></i>
            <div>
              <div style={{ ...styles.statusTitle, color: profile.approved ? COLORS.success : COLORS.warning }}>
                {profile.approved ? 'Profile approved' : 'Pending approval'}
              </div>
              <div style={styles.statusText}>
                {profile.approved ? 'Your profile is live and visible to customers' : 'An admin is reviewing your application'}
              </div>
            </div>
          </div>

          <div style={styles.detailGrid}>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}><i className="ti ti-tools" style={{ fontSize: '14px' }}></i> Service</div>
              <div style={styles.detailValue}>{profile.serviceType}</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}><i className="ti ti-briefcase" style={{ fontSize: '14px' }}></i> Experience</div>
              <div style={styles.detailValue}>{profile.experience} years</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}><i className="ti ti-currency-rupee" style={{ fontSize: '14px' }}></i> Price</div>
              <div style={styles.detailValue}>₹{profile.price}/service</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}><i className="ti ti-star" style={{ fontSize: '14px' }}></i> Rating</div>
              <div style={styles.detailValue}>{profile.rating > 0 ? profile.rating.toFixed(1) : 'No ratings yet'}</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}><i className="ti ti-map-pin" style={{ fontSize: '14px' }}></i> City</div>
              <div style={styles.detailValue}>{user?.location?.city || 'Not set'}</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}><i className="ti ti-map" style={{ fontSize: '14px' }}></i> State</div>
              <div style={styles.detailValue}>{user?.location?.state || 'Not set'}</div>
            </div>
          </div>

          {profile.bio && (
            <div style={styles.bioBox}>
              <div style={styles.bioLabel}>About</div>
              <p style={styles.bioText}>{profile.bio}</p>
            </div>
          )}

          <button onClick={() => setIsEditing(true)} style={styles.editBtn}>
            <i className="ti ti-edit" style={{ fontSize: '14px' }}></i>
            Edit profile
          </button>
        </div>
      )}

      {isEditing && (
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Service type</label>
              <select name="serviceType" value={formData.serviceType} onChange={handleChange} required style={styles.input}>
                <option value="">Select a service</option>
                {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Experience (years)</label>
                <input type="number" name="experience" value={formData.experience} onChange={handleChange} required min="0" max="50" style={styles.input} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Price per service (₹)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" style={styles.input} />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>About you (bio)</label>
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" maxLength="500" style={styles.textarea} placeholder="Tell customers about your experience..." />
              <small style={styles.charCount}>{formData.bio.length}/500</small>
            </div>

            <div style={styles.locationSection}>
              <div style={styles.locationLabel}>
                <i className="ti ti-map-pin" style={{ fontSize: '14px' }}></i>
                Service location
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
            </div>

            <div style={styles.btnRow}>
              <button type="submit" disabled={saving} style={styles.saveBtn}>
                {saving ? 'Saving...' : profile ? 'Update profile' : 'Create profile'}
              </button>
              <button type="button" onClick={handleCancel} style={styles.cancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
}

const styles = {
  pageTitle: { fontSize: '24px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '4px' },
  pageSubtitle: { fontSize: '14px', color: COLORS.textSecondary, marginBottom: '24px' },
  card: { backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '24px', boxShadow: SHADOW.card, maxWidth: '700px' },
  statusBanner: { display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', borderRadius: '10px', marginBottom: '20px' },
  statusTitle: { fontSize: '15px', fontWeight: '700', marginBottom: '2px' },
  statusText: { fontSize: '13px', color: COLORS.textSecondary },
  detailGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' },
  detailItem: { backgroundColor: COLORS.bgSubtle, borderRadius: '10px', padding: '12px' },
  detailLabel: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: COLORS.textSecondary, marginBottom: '4px' },
  detailValue: { fontSize: '15px', fontWeight: '700', color: COLORS.textPrimary },
  bioBox: { backgroundColor: COLORS.bgSubtle, borderRadius: '10px', padding: '14px', marginBottom: '20px' },
  bioLabel: { fontSize: '12px', fontWeight: '600', color: COLORS.textMuted, marginBottom: '6px', textTransform: 'uppercase' },
  bioText: { fontSize: '14px', color: COLORS.textSecondary, lineHeight: '1.6', margin: 0 },
  editBtn: {
    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
    padding: '13px', backgroundColor: COLORS.primary, color: COLORS.white, border: 'none',
    borderRadius: '8px', fontSize: '14px', fontWeight: '600'
  },
  formGroup: { marginBottom: '18px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: COLORS.textPrimary, marginBottom: '6px' },
  input: { width: '100%', padding: '11px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: COLORS.bgCard },
  textarea: { width: '100%', padding: '11px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' },
  charCount: { display: 'block', marginTop: '4px', color: COLORS.textMuted, fontSize: '12px' },
  locationSection: { backgroundColor: COLORS.bgSubtle, borderRadius: '10px', padding: '16px', marginBottom: '20px' },
  locationLabel: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '14px' },
  btnRow: { display: 'flex', gap: '10px' },
  saveBtn: { flex: 1, padding: '13px', backgroundColor: COLORS.primary, color: COLORS.white, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' },
  cancelBtn: { flex: 1, padding: '13px', backgroundColor: COLORS.bgSubtle, color: COLORS.textSecondary, border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600' },
  successBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: COLORS.successBg, color: COLORS.success, padding: '12px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', marginBottom: '20px' },
  errorBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: COLORS.dangerBg, color: COLORS.danger, padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' },
  loadingBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '60px', fontSize: '14px', color: COLORS.textSecondary },
  spinner: { width: '18px', height: '18px', border: `2px solid ${COLORS.border}`, borderTopColor: COLORS.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }
};

export default ProviderProfile;