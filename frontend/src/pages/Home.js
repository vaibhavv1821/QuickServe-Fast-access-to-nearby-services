import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { COLORS, SHADOW } from '../styles/theme';

const SERVICES = [
  { name: 'Electrician', icon: 'ti-bulb', color: COLORS.accent, bg: COLORS.accentLight, count: '240 providers' },
  { name: 'Plumber', icon: 'ti-droplet', color: COLORS.info, bg: COLORS.infoBg, count: '180 providers' },
  { name: 'Cleaning', icon: 'ti-spray', color: '#3C3489', bg: '#EEEDFE', count: '310 providers' },
  { name: 'Carpenter', icon: 'ti-hammer', color: '#72243E', bg: '#FBEAF0', count: '95 providers' },
  { name: 'AC repair', icon: 'ti-air-conditioning', color: COLORS.primary, bg: COLORS.primaryLight, count: '150 providers' }
];

const TOP_PROVIDERS = [
  { initials: 'RS', color: '#712B13', bg: '#FAECE7', name: 'Ramesh Sharma', service: 'Electrician', rating: '4.9', exp: '6 yrs exp', price: '450' },
  { initials: 'AP', color: '#0C447C', bg: '#E6F1FB', name: 'Anita Patil', service: 'Home cleaning', rating: '4.8', exp: '4 yrs exp', price: '600' },
  { initials: 'VK', color: '#3C3489', bg: '#EEEDFE', name: 'Vijay Kumar', service: 'Plumber', rating: '4.7', exp: '8 yrs exp', price: '350' }
];

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>
              <i className="ti ti-bolt" style={{ fontSize: '16px', color: COLORS.white }}></i>
            </div>
            <span style={styles.logoText}>Quickserve</span>
          </div>

          <nav style={styles.navLinks}>
            <span>Services</span>
            <span>How it works</span>
            <span>Become a provider</span>
          </nav>

          <div style={styles.headerActions}>
            <Link to="/login" style={styles.loginLink}>Log in</Link>
            <button onClick={() => navigate('/register')} style={styles.signupBtn}>Sign up</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.badge}>
          <i className="ti ti-map-pin" style={{ fontSize: '12px', marginRight: '4px' }}></i>
          Serving 12 cities across India
        </div>
        <h1 style={styles.heroTitle}>Trusted local help, booked in minutes</h1>
        <p style={styles.heroSubtitle}>
          Verified electricians, plumbers, cleaners and more — rated by your neighbours.
        </p>

        <div style={styles.searchBar} onClick={() => navigate('/register')}>
          <div style={styles.searchField}>
            <i className="ti ti-search" style={styles.searchIcon}></i>
            <span style={styles.searchPlaceholder}>What service do you need?</span>
          </div>
          <div style={styles.searchDivider}></div>
          <div style={styles.searchField}>
            <i className="ti ti-map-pin" style={styles.searchIcon}></i>
            <span style={styles.searchPlaceholder}>Your city</span>
          </div>
          <button style={styles.searchBtn}>Search</button>
        </div>

        <div style={styles.trustRow}>
          <span><i className="ti ti-shield-check" style={{ color: COLORS.primary, marginRight: '5px' }}></i>Verified providers</span>
          <span><i className="ti ti-star" style={{ color: COLORS.star, marginRight: '5px' }}></i>Rated 4.7+ average</span>
          <span><i className="ti ti-headset" style={{ color: COLORS.info, marginRight: '5px' }}></i>In-app chat support</span>
        </div>
      </section>

      {/* Popular services */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Popular services</h2>
        <p style={styles.sectionSubtitle}>Book the help you need most</p>
        <div style={styles.serviceGrid}>
          {SERVICES.map((s) => (
            <div key={s.name} onClick={() => navigate('/register')} style={styles.serviceCard}>
              <div style={{ ...styles.serviceIconBox, backgroundColor: s.bg }}>
                <i className={`ti ${s.icon}`} style={{ fontSize: '22px', color: s.color }}></i>
              </div>
              <div style={styles.serviceName}>{s.name}</div>
              <div style={styles.serviceCount}>{s.count}</div>
            </div>
          ))}
          <div onClick={() => navigate('/register')} style={styles.viewAllCard}>
            <i className="ti ti-dots" style={{ fontSize: '22px', color: COLORS.textMuted, marginBottom: '10px' }}></i>
            <div style={styles.serviceName}>View all</div>
          </div>
        </div>
      </section>

      {/* Top rated */}
      <section style={{ ...styles.section, backgroundColor: COLORS.bgCard }}>
        <h2 style={styles.sectionTitle}>Top rated providers</h2>
        <div style={styles.providerGrid}>
          {TOP_PROVIDERS.map((p) => (
            <div key={p.name} style={styles.providerCard}>
              <div style={styles.providerTop}>
                <div style={{ ...styles.providerAvatar, backgroundColor: p.bg, color: p.color }}>{p.initials}</div>
                <div>
                  <div style={styles.providerName}>{p.name}</div>
                  <div style={styles.providerService}>{p.service}</div>
                </div>
              </div>
              <div style={styles.providerMeta}>
                <i className="ti ti-star" style={{ fontSize: '13px', color: COLORS.star }}></i>
                {p.rating} &middot; {p.exp} &middot; ₹{p.price}/visit
              </div>
              <button onClick={() => navigate('/register')} style={styles.providerBookBtn}>Book now</button>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={styles.howItWorks}>
        <div style={styles.stepItem}>
          <div style={{ ...styles.stepIcon, backgroundColor: COLORS.successBg }}>
            <i className="ti ti-search" style={{ fontSize: '18px', color: COLORS.success }}></i>
          </div>
          <div style={styles.stepTitle}>1. Search</div>
          <div style={styles.stepDesc}>Find a provider by service and city</div>
        </div>
        <div style={styles.stepItem}>
          <div style={{ ...styles.stepIcon, backgroundColor: COLORS.infoBg }}>
            <i className="ti ti-calendar-check" style={{ fontSize: '18px', color: COLORS.info }}></i>
          </div>
          <div style={styles.stepTitle}>2. Book</div>
          <div style={styles.stepDesc}>Pick a date, time and address</div>
        </div>
        <div style={styles.stepItem}>
          <div style={{ ...styles.stepIcon, backgroundColor: COLORS.warningBg }}>
            <i className="ti ti-star" style={{ fontSize: '18px', color: COLORS.warning }}></i>
          </div>
          <div style={styles.stepTitle}>3. Review</div>
          <div style={styles.stepDesc}>Rate your experience after</div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={styles.footerCta}>
        <h2 style={styles.ctaTitle}>Ready to get started?</h2>
        <button onClick={() => navigate('/register')} style={styles.ctaBtn}>
          Create your account
          <i className="ti ti-arrow-right" style={{ fontSize: '16px' }}></i>
        </button>
      </section>
    </div>
  );
}

const styles = {
  page: { backgroundColor: COLORS.bgPage, minHeight: '100vh', fontFamily: "'Inter', sans-serif" },
  header: { backgroundColor: COLORS.bgCard, borderBottom: `1px solid ${COLORS.border}`, position: 'sticky', top: 0, zIndex: 100 },
  headerInner: {
    maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '64px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  },
  logo: { display: 'flex', alignItems: 'center', gap: '8px' },
  logoIcon: { width: '30px', height: '30px', borderRadius: '8px', backgroundColor: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: '18px', fontWeight: '700', color: COLORS.textPrimary },
  navLinks: { display: 'flex', gap: '28px', fontSize: '14px', color: COLORS.textSecondary, fontWeight: '500' },
  headerActions: { display: 'flex', alignItems: 'center', gap: '16px' },
  loginLink: { fontSize: '14px', fontWeight: '500', color: COLORS.textSecondary },
  signupBtn: { backgroundColor: COLORS.primary, color: COLORS.white, border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '14px', fontWeight: '600' },

  hero: { textAlign: 'center', padding: '64px 24px 56px', backgroundColor: COLORS.bgCard, borderBottom: `1px solid ${COLORS.border}` },
  badge: {
    display: 'inline-block', backgroundColor: COLORS.successBg, color: COLORS.success, fontSize: '12px',
    fontWeight: '600', padding: '5px 14px', borderRadius: '999px', marginBottom: '20px'
  },
  heroTitle: { fontSize: '38px', fontWeight: '700', color: COLORS.textPrimary, margin: '0 0 14px', lineHeight: '1.3' },
  heroSubtitle: { fontSize: '16px', color: COLORS.textSecondary, maxWidth: '520px', margin: '0 auto 32px' },
  searchBar: {
    maxWidth: '600px', margin: '0 auto', display: 'flex', gap: '8px', backgroundColor: COLORS.bgPage,
    padding: '8px', borderRadius: '12px', border: `1px solid ${COLORS.border}`, cursor: 'pointer', boxShadow: SHADOW.card
  },
  searchField: { flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px' },
  searchIcon: { fontSize: '18px', color: COLORS.textMuted },
  searchPlaceholder: { fontSize: '14px', color: COLORS.textMuted },
  searchDivider: { width: '1px', backgroundColor: COLORS.border, margin: '6px 0' },
  searchBtn: { backgroundColor: COLORS.primary, color: COLORS.white, border: 'none', padding: '0 28px', borderRadius: '8px', fontSize: '14px', fontWeight: '600' },
  trustRow: { display: 'flex', justifyContent: 'center', gap: '32px', marginTop: '28px', fontSize: '13px', color: COLORS.textSecondary, flexWrap: 'wrap' },

  section: { padding: '48px 24px', maxWidth: '1200px', margin: '0 auto' },
  sectionTitle: { fontSize: '22px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '4px' },
  sectionSubtitle: { fontSize: '14px', color: COLORS.textSecondary, marginBottom: '24px' },
  serviceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' },
  serviceCard: {
    backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px',
    padding: '20px', textAlign: 'center', cursor: 'pointer', boxShadow: SHADOW.card
  },
  serviceIconBox: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  serviceName: { fontSize: '14px', fontWeight: '600', color: COLORS.textPrimary },
  serviceCount: { fontSize: '12px', color: COLORS.textMuted, marginTop: '3px' },
  viewAllCard: {
    border: `1px dashed ${COLORS.borderStrong}`, borderRadius: '14px', padding: '20px', textAlign: 'center',
    cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
  },

  providerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  providerCard: { backgroundColor: COLORS.bgPage, border: `1px solid ${COLORS.border}`, borderRadius: '14px', padding: '18px' },
  providerTop: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  providerAvatar: { width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700' },
  providerName: { fontSize: '14px', fontWeight: '700', color: COLORS.textPrimary },
  providerService: { fontSize: '12px', color: COLORS.textSecondary },
  providerMeta: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: COLORS.textSecondary, marginBottom: '14px' },
  providerBookBtn: { width: '100%', padding: '10px', backgroundColor: COLORS.primary, color: COLORS.white, border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600' },

  howItWorks: {
    display: 'flex', justifyContent: 'center', gap: '64px', padding: '48px 24px',
    maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap'
  },
  stepItem: { textAlign: 'center', maxWidth: '200px' },
  stepIcon: { width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  stepTitle: { fontSize: '15px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '4px' },
  stepDesc: { fontSize: '13px', color: COLORS.textSecondary },

  footerCta: { textAlign: 'center', padding: '56px 24px', backgroundColor: COLORS.primary },
  ctaTitle: { fontSize: '26px', fontWeight: '700', color: COLORS.white, marginBottom: '24px' },
  ctaBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: COLORS.white,
    color: COLORS.primary, border: 'none', padding: '14px 28px', borderRadius: '8px',
    fontSize: '15px', fontWeight: '700'
  }
};

export default Home;