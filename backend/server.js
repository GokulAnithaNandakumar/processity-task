const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');
const connectDB = require('./config/database');
// Import middleware
const { responseTimeMiddleware, auditMiddleware } = require('./middleware/audit');
require('dotenv').config();

// Import routes - Test workflow trigger
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const gdprRoutes = require('./routes/gdpr');
const monitoringRoutes = require('./routes/monitoring');

// Initialize Express app
const app = express();

// Connect to database (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Security middleware
app.use(helmet());

// Response time tracking
app.use(responseTimeMiddleware);

// Audit logging
app.use(auditMiddleware);

// Request tracking for monitoring
app.use(monitoringRoutes.trackRequest);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// CORS
const corsOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://jolly-desert-0d7a9d110.1.azurestaticapps.net',
  process.env.CORS_ORIGIN
].filter(Boolean);

console.log('🔧 CORS Debug Info:');
console.log('- Configured origins:', corsOrigins);
console.log('- CORS_ORIGIN env var:', process.env.CORS_ORIGIN);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- All env vars starting with CORS:', Object.keys(process.env).filter(key => key.includes('CORS')));

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    console.log('🔍 CORS origin check:', origin);
    console.log('🔍 Allowed origins:', corsOrigins);

    if (corsOrigins.includes(origin)) {
      console.log('✅ Origin allowed:', origin);
      return callback(null, true);
    } else {
      console.log('❌ Origin denied:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Add request logging to debug CORS
app.use((req, res, next) => {
  console.log('🌐', req.method, req.path, '- Origin:', req.headers.origin || 'none');
  next();
});

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/gdpr', gdprRoutes);
app.use('/api/monitoring', monitoringRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Task Manager API is running',
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

// Only start the server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
}

module.exports = app;
