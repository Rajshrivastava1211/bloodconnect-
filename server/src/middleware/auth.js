const jwt = require('jsonwebtoken');
const { getDbWrapper } = require('../config/db');

/**
 * Verify JWT and attach user to request.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token required.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }

    const db = getDbWrapper();
    const users = db.query('SELECT id, name, email, role, is_active FROM users WHERE id = ?', [decoded.id]);

    if (!users.length || !users[0].is_active) {
      return res.status(403).json({ success: false, message: 'User account not found or deactivated.' });
    }

    req.user = users[0];
    next();
  });
}

/**
 * Require one or more specific roles.
 * Usage: requireRole('admin') or requireRole('organizer', 'admin')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}.`
      });
    }
    next();
  };
}

module.exports = { authenticateToken, requireRole };
