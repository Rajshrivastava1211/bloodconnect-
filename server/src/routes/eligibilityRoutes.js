const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { submitScreening, getMyScreenings, getFlaggedScreenings } = require('../controllers/eligibilityController');

const router = express.Router();

router.post('/', authenticateToken, requireRole('donor'), submitScreening);
router.get('/my', authenticateToken, requireRole('donor'), getMyScreenings);
router.get('/flagged', authenticateToken, requireRole('admin', 'organizer'), getFlaggedScreenings);

module.exports = router;
