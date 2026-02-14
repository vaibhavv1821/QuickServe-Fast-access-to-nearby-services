import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SearchProviders from './pages/SearchProviders';
import BookService from './pages/BookService';
import MyBookings from './pages/MyBookings';
import ProviderBookings from './pages/ProviderBookings';
import AddReview from './pages/AddReview';
import ProviderReviews from './pages/ProviderReviews';
import ProviderProfile from './pages/ProviderProfile';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/search"
              element={
                <ProtectedRoute>
                  <SearchProviders />
                </ProtectedRoute>
              }
            />

            <Route
              path="/book/:providerId"
              element={
                <ProtectedRoute>
                  <BookService />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/provider-bookings"
              element={
                <ProtectedRoute>
                  <ProviderBookings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-review/:providerId"
              element={
                <ProtectedRoute>
                  <AddReview />
                </ProtectedRoute>
              }
            />

            <Route
              path="/provider-reviews"
              element={
                <ProtectedRoute>
                  <ProviderReviews />
                </ProtectedRoute>
              }
            />

            <Route
              path="/provider-profile"
              element={
                <ProtectedRoute>
                  <ProviderProfile />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;