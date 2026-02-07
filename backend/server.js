require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const providerRoutes = require('./src/routes/providerRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const searchRoutes = require('./src/routes/searchRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());


// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notification', notificationRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({
    message: 'Quickserve API is running',
    version: '1.0.0',
    status: 'active'
  });
});

// Start server only if not in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export app for testing
module.exports = app;
