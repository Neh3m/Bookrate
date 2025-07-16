console.log('➡️  server.js starting...');

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();
console.log('✅ .env loaded');

const startServer = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB Connected');

    const app = express();

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    const authRoutes = require('./routes/auth');
    app.use('/api/auth', authRoutes);

    const bookRoutes = require('./routes/books');
    app.use('/api/books', bookRoutes);

    const testRoutes = require('./routes/test');  // ✅ test route added properly
    app.use('/api/test', testRoutes);

    app.get('/', (req, res) => res.send('📚 BookRate API is running'));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Server start failed:', err.message);
  }
};

startServer();
