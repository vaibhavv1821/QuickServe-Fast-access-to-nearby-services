// Central design tokens for Quickserve
// Import this in any component: import { COLORS, RADIUS, SHADOW } from '../styles/theme';

export const COLORS = {
  // Brand
  primary: '#0F6E56',        // deep teal - main brand color
  primaryLight: '#E1F5EE',   // light teal bg
  primaryHover: '#085041',

  accent: '#D85A30',         // coral - secondary/CTA accent
  accentLight: '#FAECE7',

  // Neutrals
  textPrimary: '#1A1A1A',
  textSecondary: '#5F5E5A',
  textMuted: '#888780',
  border: '#E5E3DC',
  borderStrong: '#D3D1C7',

  // Surfaces
  bgPage: '#FAF9F6',
  bgCard: '#FFFFFF',
  bgSubtle: '#F1EFE8',

  // Status
  success: '#3B6D11',
  successBg: '#EAF3DE',
  warning: '#854F0B',
  warningBg: '#FAEEDA',
  danger: '#A32D2D',
  dangerBg: '#FCEBEB',
  info: '#185FA5',
  infoBg: '#E6F1FB',

  // Rating star
  star: '#EF9F27',

  white: '#FFFFFF'
};

export const RADIUS = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  pill: '999px'
};

export const SHADOW = {
  card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
  hover: '0 4px 12px rgba(0,0,0,0.08)',
  none: 'none'
};

export const SPACING = {
  xs: '8px',
  sm: '12px',
  md: '20px',
  lg: '32px',
  xl: '48px'
};

export const FONT = {
  family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
};