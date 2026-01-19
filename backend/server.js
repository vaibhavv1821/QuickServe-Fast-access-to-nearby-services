require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const providerRoutes = require('./src/routes/providerRoutes'); // ADD THIS

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/provider', providerRoutes); // ADD THIS

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API is running...' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});