import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Quickserve Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <div style={styles.welcomeCard}>
        <h2>Welcome, {user?.name}!</h2>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
        <p>Location: {user?.location?.city}, {user?.location?.state}</p>
      </div>

      <div style={styles.grid}>
        {user?.role === 'user' && (
          <>
            <div style={styles.card} onClick={() => navigate('/search')}>
              <h3>🔍 Search Providers</h3>
              <p>Find local service providers</p>
            </div>
            
            <div style={styles.card} onClick={() => navigate('/my-bookings')}>
              <h3>📅 My Bookings</h3>
              <p>View your bookings</p>
            </div>
          </>
        )}

        {user?.role === 'provider' && (
          <>
            <div style={styles.card} onClick={() => navigate('/provider-profile')}>
              <h3>👤 My Profile</h3>
              <p>Manage your profile</p>
            </div>
            
            <div style={styles.card} onClick={() => navigate('/provider-bookings')}>
              <h3>📋 My Bookings</h3>
              <p>View assigned bookings</p>
            </div>
          </>
        )}

        {user?.role === 'admin' && (
          <>
            <div style={styles.card} onClick={() => navigate('/admin/providers')}>
              <h3>✅ Approve Providers</h3>
              <p>Manage provider approvals</p>
            </div>
            
            <div style={styles.card} onClick={() => navigate('/admin/users')}>
              <h3>👥 All Users</h3>
              <p>View all users</p>
            </div>
          </>
        )}
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
    marginBottom: '30px'
  },
  logoutBtn: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  welcomeCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    textAlign: 'center'
  }
};

export default Dashboard;