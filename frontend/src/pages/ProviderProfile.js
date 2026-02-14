import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import providerService from '../services/providerService';

// List of cities
const CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Surat',
  'Kanpur'
];

// List of states
const STATES = [
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Telangana',
  'Tamil Nadu',
  'West Bengal',
  'Gujarat',
  'Rajasthan',
  'Uttar Pradesh'
];

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
    serviceType: '',
    experience: '',
    price: '',
    bio: '',
    city: '',
    state: ''
  });

  // Check if user is provider
  useEffect(() => {
    if (user?.role !== 'provider') {
      alert('Only providers can access this page');
      navigate('/dashboard');
      return;
    }
    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await providerService.getMyProfile();
      console.log('Profile loaded:', data);
      
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
      console.error('Error loading profile:', err);
      
      // If profile doesn't exist (404), show create form
      if (err.response?.status === 404) {
        setProfile(null);
        setIsEditing(true);
        // Pre-fill city/state from user account
        setFormData(prev => ({
          ...prev,
          city: user?.location?.city || '',
          state: user?.location?.state || ''
        }));
      } else {
        setError(err.response?.data?.message || 'Failed to load profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Step 1: Update provider profile
      const profileData = {
        serviceType: formData.serviceType,
        experience: Number(formData.experience),
        price: Number(formData.price),
        bio: formData.bio
      };

      let data;
      if (profile) {
        // Update existing profile
        data = await providerService.updateProfile(profileData);
      } else {
        // Create new profile
        data = await providerService.createProfile(profileData);
      }

      // Step 2: Update user location (city/state)
      await providerService.updateUserLocation({
        city: formData.city,
        state: formData.state
      });

      setProfile(data.provider);
      setIsEditing(false);
      setSuccess(profile 
        ? 'Profile updated successfully!' 
        : 'Profile created successfully! Waiting for admin approval.'
      );

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      // Restore original data
      setFormData({
        serviceType: profile.serviceType || '',
        experience: profile.experience || '',
        price: profile.price || '',
        bio: profile.bio || '',
        city: user?.location?.city || '',
        state: user?.location?.state || ''
      });
      setIsEditing(false);
    } else {
      // Go back if no profile exists
      navigate('/dashboard');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <h3>Loading profile...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1>{profile ? 'My Provider Profile' : 'Create Provider Profile'}</h1>
          <p style={styles.subtitle}>
            {profile ? 'Manage your service provider information' : 'Set up your provider profile'}
          </p>
        </div>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Dashboard
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div style={styles.success}>
          ✓ {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* Profile View Mode */}
      {profile && !isEditing && (
        <div style={styles.profileCard}>
          {/* Approval Status Banner */}
          <div style={{
            ...styles.statusBanner,
            backgroundColor: profile.approved ? '#d4edda' : '#fff3cd'
          }}>
            <span style={styles.statusIcon}>
              {profile.approved ? '✅' : '⏳'}
            </span>
            <div>
              <div style={styles.statusTitle}>
                {profile.approved ? 'Profile Approved' : 'Pending Approval'}
              </div>
              <div style={styles.statusText}>
                {profile.approved 
                  ? 'Your profile is live and visible to customers'
                  : 'Your profile is under admin review'}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div style={styles.profileSection}>
            <h3 style={styles.sectionTitle}>Service Information</h3>
            
            <div style={styles.infoRow}>
              <span style={styles.label}>Service Type:</span>
              <span style={styles.value}>{profile.serviceType}</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.label}>Experience:</span>
              <span style={styles.value}>{profile.experience} years</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.label}>Price:</span>
              <span style={styles.value}>₹{profile.price}/service</span>
            </div>

            <div style={styles.infoRow}>
              <span style={styles.label}>Rating:</span>
              <span style={styles.value}>
                ⭐ {profile.rating > 0 ? profile.rating.toFixed(1) : 'No ratings yet'}
              </span>
            </div>

            {profile.bio && (
              <div style={styles.bioSection}>
                <span style={styles.label}>About Me:</span>
                <p style={styles.bioText}>{profile.bio}</p>
              </div>
            )}
          </div>

          {/* Location */}
          <div style={styles.profileSection}>
            <h3 style={styles.sectionTitle}>Service Location</h3>
            <div style={styles.infoRow}>
              <span style={styles.label}>City:</span>
              <span style={styles.value}>{user?.location?.city || 'Not set'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>State:</span>
              <span style={styles.value}>{user?.location?.state || 'Not set'}</span>
            </div>
            <div style={styles.locationNote}>
              💡 Your service location helps customers find you in search results
            </div>
          </div>

          {/* Edit Button */}
          <button onClick={() => setIsEditing(true)} style={styles.editBtn}>
            ✏️ Edit Profile
          </button>
        </div>
      )}

      {/* Profile Edit/Create Form */}
      {isEditing && (
        <div style={styles.formCard}>
          <h3>{profile ? 'Edit Profile' : 'Create Your Profile'}</h3>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Service Information Section */}
            <div style={styles.formSection}>
              <h4 style={styles.formSectionTitle}>Service Information</h4>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Service Type *</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  style={styles.input}
                >
                  <option value="">Select a service</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Tutor">Tutor</option>
                  <option value="Painter">Painter</option>
                  <option value="Cleaner">Cleaner</option>
                  <option value="AC Repair">AC Repair</option>
                  <option value="Appliance Repair">Appliance Repair</option>
                  <option value="Pest Control">Pest Control</option>
                  <option value="Gardener">Gardener</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Experience (years) *</label>
                  <input
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    required
                    min="0"
                    max="50"
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Price per Service (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>About Me (Bio)</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell customers about your experience and expertise..."
                  rows="4"
                  maxLength="500"
                  style={styles.textarea}
                />
                <small style={styles.charCount}>
                  {formData.bio.length}/500 characters
                </small>
              </div>
            </div>

            {/* Location Section */}
            <div style={styles.formSection}>
              <h4 style={styles.formSectionTitle}>📍 Service Location</h4>
              <p style={styles.locationHint}>
                This helps customers find you when searching by city
              </p>
              
              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>City *</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  >
                    <option value="">Select your city</option>
                    {CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>State *</label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    style={styles.input}
                  >
                    <option value="">Select your state</option>
                    {STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div style={styles.buttonGroup}>
              <button
                type="submit"
                disabled={saving}
                style={styles.saveBtn}
              >
                {saving ? 'Saving...' : profile ? '✓ Update Profile' : '✓ Create Profile'}
              </button>

              <button
                type="button"
                onClick={handleCancel}
                style={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '900px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  subtitle: {
    margin: '5px 0 0 0',
    color: '#666',
    fontSize: '14px'
  },
  backBtn: {
    padding: '10px 25px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  loadingCard: {
    backgroundColor: 'white',
    padding: '80px 40px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginTop: '50px'
  },
  spinner: {
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #c3e6cb',
    fontWeight: 'bold'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb'
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  statusBanner: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    borderBottom: '2px solid #e9ecef'
  },
  statusIcon: {
    fontSize: '32px'
  },
  statusTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '5px'
  },
  statusText: {
    fontSize: '14px',
    color: '#666'
  },
  profileSection: {
    padding: '25px',
    borderBottom: '1px solid #e9ecef'
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: '20px',
    color: '#333',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  label: {
    fontWeight: 'bold',
    color: '#555'
  },
  value: {
    color: '#333'
  },
  bioSection: {
    marginTop: '15px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px'
  },
  bioText: {
    margin: '10px 0 0 0',
    lineHeight: '1.6',
    color: '#666'
  },
  locationNote: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: '#e7f3ff',
    borderRadius: '4px',
    fontSize: '14px',
    color: '#004085'
  },
  editBtn: {
    width: '100%',
    padding: '15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  formCard: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  form: {
    marginTop: '20px'
  },
  formSection: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e9ecef'
  },
  formSectionTitle: {
    marginTop: 0,
    marginBottom: '15px',
    color: '#333',
    fontSize: '16px'
  },
  locationHint: {
    margin: '0 0 15px 0',
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  formLabel: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  charCount: {
    display: 'block',
    marginTop: '5px',
    color: '#999',
    fontSize: '12px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '25px'
  },
  saveBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px'
  }
};

export default ProviderProfile;
