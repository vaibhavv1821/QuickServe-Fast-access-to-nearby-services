require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const providerRoutes = require('./src/routes/providerRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/admin', adminRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});