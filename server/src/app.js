require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { registerForCamp } = require('./controllers/registrationController');
const { authenticateToken, requireRole } = require('./middleware/auth');

const app = express();

// Security & request middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Global rate limiter
const isDev = process.env.NODE_ENV !== 'production';
app.use(rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  max: isDev ? 10000 : parseInt(process.env.RATE_LIMIT_MAX || 100),
  message: { success: false, message: 'Too many requests. Please slow down.' }
}));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/camps', require('./routes/campRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes').registrationRouter);
app.use('/api/eligibility', require('./routes/eligibilityRoutes'));
app.use('/api', require('./routes/miscRoutes'));

// Camp-scoped registration: POST /api/camps/:id/register
app.post('/api/camps/:id/register', authenticateToken, requireRole('donor'), registerForCamp);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'BloodConnect API is running.', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[App] Unhandled error:', err);
  res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
});

module.exports = app;
