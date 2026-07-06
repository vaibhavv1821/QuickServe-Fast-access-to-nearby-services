// User Roles
const USER_ROLES = {
  USER: 'user',
  PROVIDER: 'provider',
  ADMIN: 'admin'
};

// Booking Status
const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Service Types
const SERVICE_TYPES = [
  'Electrician',
  'Plumber',
  'Carpenter',
  'Tutor',
  'Painter',
  'Cleaner',
  'AC Repair',
  'Appliance Repair',
  'Pest Control',
  'Gardener',
  'Other'
];

// Provider Approval Status
const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

module.exports = {
  USER_ROLES,
  BOOKING_STATUS,
  SERVICE_TYPES,
  APPROVAL_STATUS
};