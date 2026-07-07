import React from 'react';
import Navbar from './Navbar';
import { COLORS } from '../styles/theme';

function Layout({ children }) {
  return (
    <div style={styles.page}>
      <Navbar />
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: COLORS.bgPage
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px'
  }
};

export default Layout;