const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDbWrapper } = require('../config/db');

/**
 * POST /api/auth/register
 * Public — donor self-registration only
 */
async function register(req, res) {
  try {
    const { name, email, password, phone, blood_group, dob, gender, city, address } = req.body;

    const db = getDbWrapper();

    // Check existing user
    const existing = db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || 10));

    // Insert user
    const result = db.run(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), password_hash, 'donor']
    );
    const userId = result.lastInsertRowid;

    // Insert donor profile
    db.run(
      'INSERT INTO donors (user_id, phone, blood_group, dob, gender, city, address) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, phone || null, blood_group || null, dob || null, gender || null, city || null, address || null]
    );

    // Notify
    db.run(
      'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
      [userId, 'Welcome to BloodConnect! Complete your profile and find a donation camp near you.', 'welcome']
    );

    const token = jwt.sign({ id: userId, role: 'donor' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    const user = db.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId])[0];

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. Welcome to BloodConnect!',
      token,
      user
    });
  } catch (err) {
    console.error('[Auth] Register error:', err);
    return res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const db = getDbWrapper();
    const users = db.query(
      'SELECT id, name, email, role, password_hash, is_active FROM users WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (!users.length) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact support.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    return res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('[Auth] Login error:', err);
    return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
}

/**
 * GET /api/auth/me
 */
function getMe(req, res) {
  const db = getDbWrapper();
  const user = db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
  if (!user.length) return res.status(404).json({ success: false, message: 'User not found.' });
  return res.json({ success: true, user: user[0] });
}

/**
 * POST /api/auth/register-organizer
 * Public — camp organizer self-registration
 */
async function registerOrganizer(req, res) {
  try {
    const { name, email, password, phone, organization, city } = req.body;
    const db = getDbWrapper();

    const existing = db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const password_hash = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS || 10));

    const result = db.run(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), password_hash, 'organizer']
    );
    const userId = result.lastInsertRowid;

    db.run(
      'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
      [userId, `Welcome to BloodConnect, ${name.trim()}! You can now create and manage blood donation camps.`, 'welcome']
    );

    const token = jwt.sign({ id: userId, role: 'organizer' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    const user = db.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId])[0];

    return res.status(201).json({
      success: true,
      message: 'Organizer account created successfully. Welcome to BloodConnect!',
      token,
      user
    });
  } catch (err) {
    console.error('[Auth] RegisterOrganizer error:', err);
    return res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
}

module.exports = { register, login, getMe, registerOrganizer };
