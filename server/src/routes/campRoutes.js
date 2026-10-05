const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  getCamps, getCampById, createCamp, updateCamp, deleteCamp, getCampRegistrations
} = require('../controllers/campController');

const router = express.Router();

// Public
router.get('/', getCamps);
router.get('/:id', getCampById);

// Donor registration handled in registrationRoutes
// Organizer/Admin
router.post('/', authenticateToken, requireRole('organizer', 'admin'), createCamp);
router.put('/:id', authenticateToken, requireRole('organizer', 'admin'), updateCamp);
router.delete('/:id', authenticateToken, requireRole('organizer', 'admin'), deleteCamp);
router.get('/:id/registrations', authenticateToken, requireRole('organizer', 'admin'), getCampRegistrations);

module.exports = router;
