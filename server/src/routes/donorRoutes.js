const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { getProfile, updateProfile, getDonorHistory } = require('../controllers/donorController');

const router = express.Router();

router.use(authenticateToken, requireRole('donor'));
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/history', getDonorHistory);

module.exports = router;
