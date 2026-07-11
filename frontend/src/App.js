import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './context/ToastContext';
import ProviderDetails from './pages/ProviderDetails';
// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import NotFound from './pages/NotFound';


// User pages
import Dashboard from './pages/Dashboard';
import SearchProviders from './pages/SearchProviders';
import BookService from './pages/BookService';
import MyBookings from './pages/MyBookings';
import AddReview from './pages/AddReview';
import AdminDashboard from './pages/AdminDashboard';
// Provider pages
import ProviderProfile from './pages/ProviderProfile';
import ProviderBookings from './pages/ProviderBookings';
import ProviderReviews from './pages/ProviderReviews';

function App() {
  return (
    <Router>
  <AuthProvider>
    <ToastProvider>
    <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/provider/:providerId" element={<ProtectedRoute><ProviderDetails /></ProtectedRoute>} />
          {/* Protected - shared */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><SearchProviders /></ProtectedRoute>} />
          <Route path="/book/:providerId" element={<ProtectedRoute><BookService /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          <Route path="/add-review/:providerId" element={<ProtectedRoute><AddReview /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />

          {/* Protected - provider only */}
          <Route path="/provider-profile" element={<ProtectedRoute><ProviderProfile /></ProtectedRoute>} />
          <Route path="/provider-bookings" element={<ProtectedRoute><ProviderBookings /></ProtectedRoute>} />
          <Route path="/provider-reviews" element={<ProtectedRoute><ProviderReviews /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
    </ToastProvider>
  </AuthProvider>
</Router>
  );
}

export default App;