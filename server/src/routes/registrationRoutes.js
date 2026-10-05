const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  registerForCamp, getMyRegistrations, updateAttendance, cancelRegistration
} = require('../controllers/registrationController');

const router = express.Router();

// Donor: register for a specific camp (POST /api/camps/:id/register handled in app.js via campRouter)
// But we mount registrations separately
router.get('/my', authenticateToken, requireRole('donor'), getMyRegistrations);
router.patch('/:id/attendance', authenticateToken, requireRole('organizer', 'admin'), updateAttendance);
router.delete('/:id', authenticateToken, requireRole('donor'), cancelRegistration);

// This allows POST /api/camps/:id/register to be mounted on campRoutes at app level
router.post('/camps/:campId/register', authenticateToken, requireRole('donor'), (req, res, next) => {
  req.params.id = req.params.campId;
  return registerForCamp(req, res, next);
});

module.exports = { registrationRouter: router, registerForCamp };
