require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const authRoutes = require('../routes/authRoutes');
const userRoutes = require('../routes/userRoutes');
const medicationRoutes = require('../routes/medicationRoutes');
const dietPlanRoutes = require('../routes/dietPlanRoutes');
const vitalsRoutes = require('../routes/vitalsRoutes');
const progressRoutes = require('../routes/progressRoutes');
const notificationRoutes = require('../routes/notificationRoutes');
const voiceRoutes = require('../routes/voiceRoutes');

// Import middleware
const { authenticateJWT } = require('../middleware/authMiddleware');

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateJWT, userRoutes);
app.use('/api/medications', authenticateJWT, medicationRoutes);
app.use('/api/diet-plans', authenticateJWT, dietPlanRoutes);
app.use('/api/vitals', authenticateJWT, vitalsRoutes);
app.use('/api/progress', authenticateJWT, progressRoutes);
app.use('/api/notifications', authenticateJWT, notificationRoutes);
app.use('/api/voice', authenticateJWT, voiceRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
