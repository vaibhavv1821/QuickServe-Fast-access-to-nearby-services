import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import adminService from '../services/adminService';
import Layout from '../components/Layout';
import { COLORS, SHADOW } from '../styles/theme';

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [tab, setTab] = useState('pending');
  const [stats, setStats] = useState(null);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actioningId, setActioningId] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') {
      alert('Only admins can access this page');
      navigate('/dashboard');
      return;
    }
    loadAll();
    // eslint-disable-next-line
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, providersData, usersData] = await Promise.all([
        adminService.getStats(),
        adminService.getAllProviders(),
        adminService.getAllUsers()
      ]);
      setStats(statsData.stats || statsData);
      setProviders(providersData.providers || []);
      setUsers(usersData.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (providerId) => {
    setActioningId(providerId);
    try {
      await adminService.approveProvider(providerId);
      setProviders(providers.map(p => p._id === providerId ? { ...p, approved: true } : p));
    } catch (err) {
      alert('Failed to approve provider');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (providerId) => {
    if (!window.confirm('Reject this provider application?')) return;
    setActioningId(providerId);
    try {
      await adminService.rejectProvider(providerId);
      setProviders(providers.map(p => p._id === providerId ? { ...p, approved: false } : p));
    } catch (err) {
      alert('Failed to reject provider');
    } finally {
      setActioningId(null);
    }
  };

  const pendingProviders = providers.filter(p => !p.approved);
  const approvedProviders = providers.filter(p => p.approved);

  if (loading) {
    return (
      <Layout>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          Loading admin dashboard...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 style={styles.pageTitle}>Admin dashboard</h1>
      <p style={styles.pageSubtitle}>Manage providers, users, and platform activity</p>

      {error && (
        <div style={styles.errorBox}>
          <i className="ti ti-alert-circle" style={{ fontSize: '16px' }}></i>
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: COLORS.primaryLight }}>
            <i className="ti ti-users" style={{ fontSize: '20px', color: COLORS.primary }}></i>
          </div>
          <div>
            <div style={styles.statNum}>{stats?.totalUsers ?? users.length}</div>
            <div style={styles.statLabel}>Total users</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: COLORS.infoBg }}>
            <i className="ti ti-tools" style={{ fontSize: '20px', color: COLORS.info }}></i>
          </div>
          <div>
            <div style={styles.statNum}>{stats?.totalProviders ?? providers.length}</div>
            <div style={styles.statLabel}>Total providers</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: COLORS.warningBg }}>
            <i className="ti ti-clock" style={{ fontSize: '20px', color: COLORS.warning }}></i>
          </div>
          <div>
            <div style={styles.statNum}>{pendingProviders.length}</div>
            <div style={styles.statLabel}>Pending approval</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, backgroundColor: COLORS.successBg }}>
            <i className="ti ti-calendar-event" style={{ fontSize: '20px', color: COLORS.success }}></i>
          </div>
          <div>
            <div style={styles.statNum}>{stats?.totalBookings ?? '—'}</div>
            <div style={styles.statLabel}>Total bookings</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabRow}>
        <button onClick={() => setTab('pending')} style={{ ...styles.tab, ...(tab === 'pending' ? styles.tabActive : {}) }}>
          Pending providers ({pendingProviders.length})
        </button>
        <button onClick={() => setTab('approved')} style={{ ...styles.tab, ...(tab === 'approved' ? styles.tabActive : {}) }}>
          Approved providers ({approvedProviders.length})
        </button>
        <button onClick={() => setTab('users')} style={{ ...styles.tab, ...(tab === 'users' ? styles.tabActive : {}) }}>
          All users ({users.length})
        </button>
      </div>

      {/* Pending providers */}
      {tab === 'pending' && (
        pendingProviders.length === 0 ? (
          <div style={styles.emptyState}>
            <i className="ti ti-shield-check" style={{ fontSize: '28px', color: COLORS.textMuted }}></i>
            <p style={styles.emptyText}>No pending applications right now.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {pendingProviders.map((p) => (
              <div key={p._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.avatar}>{p.userId?.name?.charAt(0) || 'P'}</div>
                  <div>
                    <div style={styles.name}>{p.userId?.name}</div>
                    <div style={styles.meta}>{p.userId?.email}</div>
                  </div>
                </div>
                <div style={styles.infoRow}><i className="ti ti-tools" style={styles.infoIcon}></i>{p.serviceType}</div>
                <div style={styles.infoRow}><i className="ti ti-briefcase" style={styles.infoIcon}></i>{p.experience} yrs experience</div>
                <div style={styles.infoRow}><i className="ti ti-currency-rupee" style={styles.infoIcon}></i>₹{p.price}/service</div>
                <div style={styles.infoRow}><i className="ti ti-map-pin" style={styles.infoIcon}></i>{p.userId?.location?.city}, {p.userId?.location?.state}</div>
                {p.bio && <div style={styles.bioBox}>{p.bio}</div>}
                <div style={styles.btnRow}>
                  <button onClick={() => handleApprove(p._id)} disabled={actioningId === p._id} style={styles.approveBtn}>
                    <i className="ti ti-check" style={{ fontSize: '14px' }}></i>
                    {actioningId === p._id ? 'Updating...' : 'Approve'}
                  </button>
                  <button onClick={() => handleReject(p._id)} disabled={actioningId === p._id} style={styles.rejectBtn}>
                    <i className="ti ti-x" style={{ fontSize: '14px' }}></i>
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Approved providers */}
      {tab === 'approved' && (
        approvedProviders.length === 0 ? (
          <div style={styles.emptyState}>
            <i className="ti ti-tools" style={{ fontSize: '28px', color: COLORS.textMuted }}></i>
            <p style={styles.emptyText}>No approved providers yet.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {approvedProviders.map((p) => (
              <div key={p._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.avatar}>{p.userId?.name?.charAt(0) || 'P'}</div>
                  <div>
                    <div style={styles.name}>{p.userId?.name}</div>
                    <div style={styles.meta}>{p.serviceType}</div>
                  </div>
                  <span style={styles.approvedBadge}>
                    <i className="ti ti-shield-check" style={{ fontSize: '12px' }}></i> Approved
                  </span>
                </div>
                <div style={styles.infoRow}><i className="ti ti-star" style={styles.infoIcon}></i>{p.rating > 0 ? p.rating.toFixed(1) : 'No ratings'}</div>
                <div style={styles.infoRow}><i className="ti ti-map-pin" style={styles.infoIcon}></i>{p.userId?.location?.city}</div>
                <button onClick={() => handleReject(p._id)} style={styles.revokeBtn}>
                  Revoke approval
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* All users */}
      {tab === 'users' && (
        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>City</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={styles.tr}>
                  <td style={styles.td}>
                    <div style={styles.userCell}>
                      <div style={styles.smallAvatar}>{u.name?.charAt(0)}</div>
                      {u.name}
                    </div>
                  </td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.roleBadge, ...(u.role === 'admin' ? styles.roleAdmin : u.role === 'provider' ? styles.roleProvider : styles.roleUser) }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={styles.td}>{u.location?.city || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}

const styles = {
  pageTitle: { fontSize: '24px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '4px' },
  pageSubtitle: { fontSize: '14px', color: COLORS.textSecondary, marginBottom: '24px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '28px' },
  statCard: {
    display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`, borderRadius: '12px', padding: '18px', boxShadow: SHADOW.card
  },
  statIcon: { width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  statNum: { fontSize: '22px', fontWeight: '700', color: COLORS.textPrimary },
  statLabel: { fontSize: '12px', color: COLORS.textSecondary },
  tabRow: { display: 'flex', gap: '4px', backgroundColor: COLORS.bgSubtle, padding: '4px', borderRadius: '10px', marginBottom: '20px', width: 'fit-content' },
  tab: { padding: '9px 16px', background: 'none', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: COLORS.textSecondary },
  tabActive: { backgroundColor: COLORS.bgCard, color: COLORS.textPrimary, boxShadow: SHADOW.card },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' },
  card: { backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '18px', boxShadow: SHADOW.card },
  cardTop: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', position: 'relative' },
  avatar: {
    width: '40px', height: '40px', borderRadius: '50%', backgroundColor: COLORS.primaryLight,
    color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: '700', flexShrink: 0
  },
  name: { fontSize: '14px', fontWeight: '700', color: COLORS.textPrimary },
  meta: { fontSize: '12px', color: COLORS.textSecondary },
  infoRow: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: COLORS.textSecondary, marginBottom: '8px' },
  infoIcon: { fontSize: '14px', color: COLORS.textMuted, width: '16px' },
  bioBox: { fontSize: '12px', color: COLORS.textSecondary, backgroundColor: COLORS.bgSubtle, padding: '8px 12px', borderRadius: '6px', marginTop: '8px', fontStyle: 'italic' },
  btnRow: { display: 'flex', gap: '8px', marginTop: '14px' },
  approveBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', backgroundColor: COLORS.successBg, color: COLORS.success, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
  rejectBtn: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', backgroundColor: COLORS.dangerBg, color: COLORS.danger, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
  revokeBtn: { width: '100%', padding: '10px', marginTop: '10px', backgroundColor: COLORS.dangerBg, color: COLORS.danger, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },
  approvedBadge: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '700', color: COLORS.success, backgroundColor: COLORS.successBg, padding: '4px 10px', borderRadius: '999px' },
  emptyState: { textAlign: 'center', padding: '60px 20px', backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px' },
  emptyText: { fontSize: '14px', color: COLORS.textSecondary, marginTop: '10px' },
  tableCard: { backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px', overflow: 'hidden', boxShadow: SHADOW.card },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', fontSize: '12px', fontWeight: '700', color: COLORS.textSecondary, padding: '14px 20px', backgroundColor: COLORS.bgSubtle, textTransform: 'uppercase' },
  tr: { borderTop: `1px solid ${COLORS.border}` },
  td: { padding: '14px 20px', fontSize: '13px', color: COLORS.textPrimary },
  userCell: { display: 'flex', alignItems: 'center', gap: '10px' },
  smallAvatar: { width: '28px', height: '28px', borderRadius: '50%', backgroundColor: COLORS.bgSubtle, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' },
  roleBadge: { fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '999px', textTransform: 'capitalize' },
  roleAdmin: { backgroundColor: COLORS.dangerBg, color: COLORS.danger },
  roleProvider: { backgroundColor: COLORS.infoBg, color: COLORS.info },
  roleUser: { backgroundColor: COLORS.successBg, color: COLORS.success },
  errorBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: COLORS.dangerBg, color: COLORS.danger, padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' },
  loadingBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '60px', fontSize: '14px', color: COLORS.textSecondary },
  spinner: { width: '18px', height: '18px', border: `2px solid ${COLORS.border}`, borderTopColor: COLORS.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }
};

export default AdminDashboard;