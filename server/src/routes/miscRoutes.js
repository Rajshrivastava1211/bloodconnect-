const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const { getMyDonations, updateDonationStatus, getCertificate } = require('../controllers/donationController');
const {
  getStatistics, getPublicStats, getAllUsers, updateUserStatus, getReports,
  getAllFeedback, submitFeedback,
  getFaqs, createFaq, updateFaq, deleteFaq,
  getBloodBanks, createBloodBank, updateBloodBank, deleteBloodBank,
  getMyNotifications, markNotificationRead, markAllNotificationsRead
} = require('../controllers/adminController');
const { getFlaggedScreenings } = require('../controllers/eligibilityController');

const router = express.Router();

// Public Stats
router.get('/stats/public', getPublicStats);

// Donations
router.get('/donations/my', authenticateToken, requireRole('donor'), getMyDonations);
router.patch('/donations/:id/status', authenticateToken, requireRole('organizer', 'admin'), updateDonationStatus);
router.get('/certificates/:code', getCertificate);

// Admin routes
router.get('/admin/statistics', authenticateToken, requireRole('admin', 'organizer'), getStatistics);
router.get('/admin/users', authenticateToken, requireRole('admin'), getAllUsers);
router.patch('/admin/users/:id/status', authenticateToken, requireRole('admin'), updateUserStatus);
router.get('/admin/reports', authenticateToken, requireRole('admin', 'organizer'), getReports);
router.get('/admin/feedback', authenticateToken, requireRole('admin'), getAllFeedback);
router.get('/admin/eligibility', authenticateToken, requireRole('admin', 'organizer'), getFlaggedScreenings);

// Feedback
router.post('/feedback', authenticateToken, requireRole('donor'), submitFeedback);

// FAQs
router.get('/faqs', getFaqs);
router.post('/admin/faqs', authenticateToken, requireRole('admin'), createFaq);
router.put('/admin/faqs/:id', authenticateToken, requireRole('admin'), updateFaq);
router.delete('/admin/faqs/:id', authenticateToken, requireRole('admin'), deleteFaq);

// Blood Banks
router.get('/blood-banks', getBloodBanks);
router.post('/admin/blood-banks', authenticateToken, requireRole('admin'), createBloodBank);
router.put('/admin/blood-banks/:id', authenticateToken, requireRole('admin'), updateBloodBank);
router.delete('/admin/blood-banks/:id', authenticateToken, requireRole('admin'), deleteBloodBank);

// Notifications
router.get('/notifications/my', authenticateToken, getMyNotifications);
router.patch('/notifications/:id/read', authenticateToken, markNotificationRead);
router.patch('/notifications/read-all', authenticateToken, markAllNotificationsRead);

module.exports = router;
