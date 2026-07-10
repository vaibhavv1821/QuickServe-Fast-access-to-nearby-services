import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../services/notificationService';
import { COLORS, SHADOW } from '../styles/theme';

const TYPE_ICON = {
  booking: { icon: 'ti-calendar-event', color: COLORS.info, bg: COLORS.infoBg },
  message: { icon: 'ti-message-circle', color: COLORS.primary, bg: COLORS.primaryLight },
  review: { icon: 'ti-star', color: COLORS.warning, bg: COLORS.warningBg },
  approval: { icon: 'ti-shield-check', color: COLORS.success, bg: COLORS.successBg },
  general: { icon: 'ti-bell', color: COLORS.textSecondary, bg: COLORS.bgSubtle }
};

function NotificationBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const data = await notificationService.getUnreadCount();
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      // silent fail - not critical
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications((data.notifications || []).slice(0, 8));
    } catch (err) {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) loadNotifications();
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      try {
        await notificationService.markAsRead(notif._id);
        setNotifications(notifications.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
        setUnreadCount(Math.max(0, unreadCount - 1));
      } catch (err) {}
    }
    setOpen(false);
    if (notif.referenceModel === 'Booking') navigate('/my-bookings');
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {}
  };

  const timeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div style={styles.wrapper} ref={dropdownRef}>
      <button onClick={handleToggle} style={styles.bellBtn}>
        <i className="ti ti-bell" style={{ fontSize: '20px', color: COLORS.textSecondary }}></i>
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <span style={styles.dropdownTitle}>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} style={styles.markAllBtn}>Mark all read</button>
            )}
          </div>

          <div style={styles.list}>
            {loading && (
              <div style={styles.stateBox}>Loading...</div>
            )}

            {!loading && notifications.length === 0 && (
              <div style={styles.stateBox}>
                <i className="ti ti-bell-off" style={{ fontSize: '24px', color: COLORS.textMuted }}></i>
                <p style={styles.emptyText}>No notifications yet</p>
              </div>
            )}

            {!loading && notifications.map((notif) => {
              const config = TYPE_ICON[notif.type] || TYPE_ICON.general;
              return (
                <div
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  style={{ ...styles.item, backgroundColor: notif.isRead ? 'transparent' : COLORS.primaryLight }}
                >
                  <div style={{ ...styles.itemIcon, backgroundColor: config.bg }}>
                    <i className={`ti ${config.icon}`} style={{ fontSize: '16px', color: config.color }}></i>
                  </div>
                  <div style={styles.itemContent}>
                    <div style={styles.itemTitle}>{notif.title}</div>
                    <div style={styles.itemMessage}>{notif.message}</div>
                    <div style={styles.itemTime}>{timeAgo(notif.createdAt)}</div>
                  </div>
                  {!notif.isRead && <div style={styles.unreadDot}></div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrapper: { position: 'relative' },
  bellBtn: {
    position: 'relative', background: 'none', border: 'none', width: '36px', height: '36px',
    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  badge: {
    position: 'absolute', top: '2px', right: '2px', backgroundColor: COLORS.danger, color: COLORS.white,
    fontSize: '10px', fontWeight: '700', minWidth: '16px', height: '16px', borderRadius: '999px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px'
  },
  dropdown: {
    position: 'absolute', top: '46px', right: 0, width: '360px', maxHeight: '440px',
    backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '12px',
    boxShadow: SHADOW.hover, zIndex: 300, display: 'flex', flexDirection: 'column', overflow: 'hidden'
  },
  dropdownHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 16px', borderBottom: `1px solid ${COLORS.border}`
  },
  dropdownTitle: { fontSize: '14px', fontWeight: '700', color: COLORS.textPrimary },
  markAllBtn: { background: 'none', border: 'none', fontSize: '12px', fontWeight: '600', color: COLORS.primary },
  list: { overflowY: 'auto', maxHeight: '380px' },
  stateBox: { padding: '40px 20px', textAlign: 'center', color: COLORS.textMuted, fontSize: '13px' },
  emptyText: { marginTop: '8px' },
  item: {
    display: 'flex', gap: '12px', padding: '14px 16px', borderBottom: `1px solid ${COLORS.border}`,
    cursor: 'pointer', position: 'relative'
  },
  itemIcon: {
    width: '36px', height: '36px', borderRadius: '10px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  itemContent: { flex: 1, minWidth: 0 },
  itemTitle: { fontSize: '13px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '2px' },
  itemMessage: { fontSize: '12px', color: COLORS.textSecondary, lineHeight: '1.4', marginBottom: '4px' },
  itemTime: { fontSize: '11px', color: COLORS.textMuted },
  unreadDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS.primary, flexShrink: 0, marginTop: '4px' }
};

export default NotificationBell;