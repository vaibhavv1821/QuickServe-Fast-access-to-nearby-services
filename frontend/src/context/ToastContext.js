import React, { createContext, useState, useCallback } from 'react';
import { COLORS } from '../styles/theme';

export const ToastContext = createContext();

const TYPE_CONFIG = {
  success: { icon: 'ti-circle-check', color: COLORS.success, bg: COLORS.successBg },
  error: { icon: 'ti-alert-circle', color: COLORS.danger, bg: COLORS.dangerBg },
  info: { icon: 'ti-info-circle', color: COLORS.info, bg: COLORS.infoBg }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={styles.container}>
        {toasts.map((toast) => {
          const config = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;
          return (
            <div key={toast.id} style={{ ...styles.toast, backgroundColor: config.bg, color: config.color }}>
              <i className={`ti ${config.icon}`} style={{ fontSize: '18px', flexShrink: 0 }}></i>
              <span style={styles.message}>{toast.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

const styles = {
  container: {
    position: 'fixed', bottom: '24px', right: '24px', display: 'flex',
    flexDirection: 'column', gap: '10px', zIndex: 9999, maxWidth: '340px'
  },
  toast: {
    display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 16px',
    borderRadius: '10px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', fontSize: '13px', fontWeight: '600'
  },
  message: { flex: 1 }
};