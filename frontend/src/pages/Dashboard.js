import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import { COLORS, SHADOW } from '../styles/theme';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const userCards = [
    { icon: 'ti-search', title: 'Find a service', desc: 'Search verified providers near you', path: '/search', color: COLORS.primary, bg: COLORS.primaryLight },
    { icon: 'ti-calendar-event', title: 'My bookings', desc: 'Track your service requests', path: '/my-bookings', color: COLORS.info, bg: COLORS.infoBg }
  ];

  const providerCards = [
    { icon: 'ti-id', title: 'My profile', desc: 'Manage your service listing', path: '/provider-profile', color: COLORS.primary, bg: COLORS.primaryLight },
    { icon: 'ti-clipboard-list', title: 'Booking requests', desc: 'Approve, reject or complete jobs', path: '/provider-bookings', color: COLORS.info, bg: COLORS.infoBg },
    { icon: 'ti-star', title: 'My reviews', desc: 'See what customers are saying', path: '/provider-reviews', color: COLORS.warning, bg: COLORS.warningBg }
  ];

  const adminCards = [
    { icon: 'ti-shield-check', title: 'Manage providers', desc: 'Approve or reject applications', path: '/admin/dashboard', color: COLORS.primary, bg: COLORS.primaryLight },
    { icon: 'ti-users', title: 'All users', desc: 'View registered customers & providers', path: '/admin/dashboard', color: COLORS.info, bg: COLORS.infoBg }
];
  const cards = user?.role === 'provider' ? providerCards : user?.role === 'admin' ? adminCards : userCards;

  return (
    <Layout>
      {/* Greeting header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.greeting}>{greeting}, {user?.name?.split(' ')[0]}</h1>
          <p style={styles.subtext}>
            {user?.role === 'provider'
              ? 'Here\'s what\'s happening with your services today.'
              : user?.role === 'admin'
              ? 'Manage the Quickserve platform.'
              : 'Find trusted help for whatever you need.'}
          </p>
        </div>
        <div style={styles.roleBadge}>
          <i className="ti ti-user-circle" style={{ fontSize: '14px' }}></i>
          {user?.role}
        </div>
      </div>

      {/* Quick stat strip */}
      <div style={styles.statStrip}>
        <div style={styles.statItem}>
          <i className="ti ti-map-pin" style={{ fontSize: '16px', color: COLORS.textMuted }}></i>
          <span>{user?.location?.city || 'Location not set'}</span>
        </div>
        <div style={styles.statDivider}></div>
        <div style={styles.statItem}>
          <i className="ti ti-mail" style={{ fontSize: '16px', color: COLORS.textMuted }}></i>
          <span>{user?.email}</span>
        </div>
        <div style={styles.statDivider}></div>
        <div style={styles.statItem}>
          <i className="ti ti-phone" style={{ fontSize: '16px', color: COLORS.textMuted }}></i>
          <span>{user?.phone}</span>
        </div>
      </div>

      {/* Action cards */}
      <h2 style={styles.sectionTitle}>Quick actions</h2>
      <div style={styles.grid}>
        {cards.map((card) => (
          <div key={card.path} onClick={() => navigate(card.path)} style={styles.card}>
            <div style={{ ...styles.cardIcon, backgroundColor: card.bg }}>
              <i className={`ti ${card.icon}`} style={{ fontSize: '22px', color: card.color }}></i>
            </div>
            <div style={styles.cardText}>
              <div style={styles.cardTitle}>{card.title}</div>
              <div style={styles.cardDesc}>{card.desc}</div>
            </div>
            <i className="ti ti-chevron-right" style={{ fontSize: '18px', color: COLORS.textMuted }}></i>
          </div>
        ))}
      </div>
    </Layout>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px'
  },
  greeting: {
    fontSize: '26px',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: '6px'
  },
  subtext: {
    fontSize: '14px',
    color: COLORS.textSecondary
  },
  roleBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    padding: '6px 14px',
    borderRadius: '999px',
    fontSize: '12px',
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'capitalize'
  },
  statStrip: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '10px',
    padding: '14px 20px',
    marginBottom: '32px',
    flexWrap: 'wrap'
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: COLORS.textSecondary
  },
  statDivider: {
    width: '1px',
    height: '16px',
    backgroundColor: COLORS.border
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: '16px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px'
  },
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    boxShadow: SHADOW.card
  },
  cardIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  cardText: {
    flex: 1
  },
  cardTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: '2px'
  },
  cardDesc: {
    fontSize: '13px',
    color: COLORS.textSecondary
  }
};

export default Dashboard;