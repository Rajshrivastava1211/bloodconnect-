
const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const { register, login, getMe, registerOrganizer } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const isDev = process.env.NODE_ENV !== 'production';

const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  max: isDev ? 1000 : parseInt(process.env.AUTH_RATE_LIMIT_MAX || 20),
  message: {
    success: false,
    message: 'Too many login attempts. Please wait a moment.'
  }
});

// =========================
// REGISTRATION VALIDATION
// =========================
const registerValidation = [
  
body('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required.')
  .matches(/^[\p{L}]+(?:\s+[\p{L}]+)*$/u)
  .withMessage('Name must contain letters and spaces only.'),


  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email is required.')
    .normalizeEmail()
    .custom((value) => {
      if (!value.endsWith('@gmail.com')) {
        throw new Error('Only Gmail addresses ending with @gmail.com are allowed.');
      }

      return true;
    }),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters.'),

  body('phone')
    .matches(/^\+91\d{10}$/)
    .withMessage('Phone number must be +91 followed by exactly 10 digits.')
];

// =========================
// LOGIN VALIDATION
// =========================
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Valid email is required.')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required.')
];

// =========================
// VALIDATION HANDLER
// =========================
function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array()
    });
  }

  next();
}

// =========================
// AUTH ROUTES
// =========================
router.post(
  '/register',
  authLimiter,
  registerValidation,
  validate,
  register
);

router.post(
  '/register-organizer',
  authLimiter,
  registerValidation,
  validate,
  registerOrganizer
);

router.post(
  '/login',
  authLimiter,
  loginValidation,
  validate,
  login
);

router.get(
  '/me',
  authenticateToken,
  getMe
);

module.exports = router;
