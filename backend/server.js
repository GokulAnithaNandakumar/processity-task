const express = require('express');
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

// Security middleware with relaxed CSP for development
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''],
      scriptSrc: ['\'self\'', '\'unsafe-inline\'', '\'unsafe-eval\'', 'https://js.monitor.azure.com', 'https://vercel.live', 'https://*.vercel.app'],
      styleSrc: ['\'self\'', '\'unsafe-inline\'', 'https://fonts.googleapis.com'],
      fontSrc: ['\'self\'', 'https://fonts.gstatic.com'],
      imgSrc: ['\'self\'', 'data:', 'https:', 'blob:'],
      frameSrc: ['\'self\'', 'https://vercel.live', 'https://*.vercel.app'],
      connectSrc: ['\'self\'', 'https://*.azurewebsites.net', 'https://*.azure.com', 'https://*.applicationinsights.azure.com', 'https://*.vercel.app', 'https://vercel.live', 'https://events.launchdarkly.com'],
      objectSrc: ['\'none\''],
      baseUri: ['\'self\''],
      formAction: ['\'self\''],
      upgradeInsecureRequests: [],
    },
  },
  frameOptions: false, // Let it be handled by meta tag
}));

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

// Manual CORS configuration (removed express cors middleware)
const corsOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'https://task-manager-three-pi-63.vercel.app',
  'https://jolly-desert-0d7a9d110.1.azurestaticapps.net',
  'https://vercel.live', // For Vercel preview features
  process.env.CORS_ORIGIN,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

console.log('🔧 CORS Debug Info:');
console.log('- Configured origins:', corsOrigins);
console.log('- CORS_ORIGIN env var:', process.env.CORS_ORIGIN);
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- All env vars starting with CORS:', Object.keys(process.env).filter(key => key.includes('CORS')));

// Add request logging to debug CORS
app.use((req, res, next) => {
  console.log('🌐', req.method, req.path, '- Origin:', req.headers.origin || 'none');

  // Manual CORS headers as backup
  const origin = req.headers.origin;
  if (corsOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    console.log('🔧 Manual CORS headers set for origin:', origin);
  }

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
// Handle preflight OPTIONS requests explicitly
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  console.log('🔧 OPTIONS request from origin:', origin);

  if (corsOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).send();
    console.log('✅ OPTIONS response sent for origin:', origin);
  } else {
    res.status(403).send('Origin not allowed');
    console.log('❌ OPTIONS denied for origin:', origin);
  }
});

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
