import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLORS, SHADOW } from '../styles/theme';
import chatService from '../services/chatService';
import { ToastContext } from '../context/ToastContext';

const CATEGORY_ICONS = {
  Electrician: { icon: 'ti-bulb', color: COLORS.accent, bg: COLORS.accentLight },
  Plumber: { icon: 'ti-droplet', color: COLORS.info, bg: COLORS.infoBg },
  Cleaner: { icon: 'ti-spray', color: '#3C3489', bg: '#EEEDFE' },
  Carpenter: { icon: 'ti-hammer', color: '#72243E', bg: '#FBEAF0' },
  'AC Repair': { icon: 'ti-air-conditioning', color: COLORS.primary, bg: COLORS.primaryLight },
  Painter: { icon: 'ti-brush', color: COLORS.warning, bg: COLORS.warningBg },
  default: { icon: 'ti-tools', color: COLORS.textSecondary, bg: COLORS.bgSubtle }
};

function ProviderCard({ provider }) {
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);
  const category = CATEGORY_ICONS[provider.serviceType] || CATEGORY_ICONS.default;

  const handleBookNow = () => {
    navigate(`/book/${provider._id}`, { state: { provider } });
  };

  const handleMessage = async (e) => {
    e.stopPropagation();
    try {
      const data = await chatService.createChat(provider._id);
      navigate(`/chat?chatId=${data.chat._id}`);
    } catch (err) {
      showToast('Failed to start conversation', 'error');
    }
  };

  const handleNameClick = (e) => {
    e.stopPropagation();
    navigate(`/provider/${provider._id}`);
  };

  return (
    <div style={styles.card}>
      <div style={styles.topRow}>
        <div style={{ ...styles.iconBox, backgroundColor: category.bg }}>
          <i className={`ti ${category.icon}`} style={{ fontSize: '22px', color: category.color }}></i>
        </div>
        <div style={styles.ratingPill}>
          <i className="ti ti-star" style={{ fontSize: '13px', color: COLORS.star }}></i>
          {provider.rating > 0 ? provider.rating.toFixed(1) : 'New'}
        </div>
      </div>

      <div style={styles.nameRow}>
        <h3 onClick={handleNameClick} style={styles.nameClickable}>
          {provider.userId?.name || 'Unknown'}
        </h3>
        <span style={styles.serviceType}>{provider.serviceType}</span>
      </div>

      <div style={styles.metaRow}>
        <div style={styles.metaItem}>
          <i className="ti ti-briefcase" style={{ fontSize: '14px', color: COLORS.textMuted }}></i>
          {provider.experience} yrs exp
        </div>
        <div style={styles.metaItem}>
          <i className="ti ti-map-pin" style={{ fontSize: '14px', color: COLORS.textMuted }}></i>
          {provider.userId?.location?.city || 'N/A'}
        </div>
      </div>

      {provider.bio && <p style={styles.bio}>{provider.bio}</p>}

      <div style={styles.footer}>
        <div style={styles.price}>
          <span style={styles.priceAmount}>₹{provider.price}</span>
          <span style={styles.priceUnit}>/service</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleMessage} style={styles.messageBtn}>
            <i className="ti ti-message-circle" style={{ fontSize: '14px' }}></i>
          </button>
          <button onClick={handleBookNow} style={styles.bookBtn}>
            Book now
            <i className="ti ti-arrow-right" style={{ fontSize: '14px' }}></i>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: COLORS.bgCard,
    border: `1px solid ${COLORS.border}`,
    borderRadius: '14px',
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: SHADOW.card
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  iconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ratingPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: COLORS.warningBg,
    color: COLORS.warning,
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '700'
  },
  nameRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  nameClickable: {
    fontSize: '16px',
    fontWeight: '700',
    color: COLORS.textPrimary,
    margin: 0,
    cursor: 'pointer'
  },
  serviceType: {
    fontSize: '13px',
    color: COLORS.textSecondary
  },
  metaRow: {
    display: 'flex',
    gap: '16px'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '13px',
    color: COLORS.textSecondary
  },
  bio: {
    fontSize: '13px',
    color: COLORS.textSecondary,
    backgroundColor: COLORS.bgSubtle,
    padding: '10px 12px',
    borderRadius: '8px',
    margin: 0,
    lineHeight: '1.5'
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
    paddingTop: '12px',
    borderTop: `1px solid ${COLORS.border}`
  },
  price: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '3px'
  },
  priceAmount: {
    fontSize: '18px',
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  priceUnit: {
    fontSize: '12px',
    color: COLORS.textMuted
  },
  bookBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    border: 'none',
    padding: '9px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600'
  },
  messageBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bgSubtle,
    color: COLORS.textSecondary,
    border: 'none',
    width: '38px',
    borderRadius: '8px'
  }
};

export default ProviderCard;