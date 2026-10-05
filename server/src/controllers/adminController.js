const { getDbWrapper } = require('../config/db');

/** GET /api/admin/statistics */
function getStatistics(req, res) {
  const db = getDbWrapper();

  const donors = db.query("SELECT COUNT(*) as count FROM users WHERE role = 'donor' AND is_active = 1")[0].count;
  const organizers = db.query("SELECT COUNT(*) as count FROM users WHERE role = 'organizer' AND is_active = 1")[0].count;
  const activeCamps = db.query("SELECT COUNT(*) as count FROM camps WHERE status IN ('upcoming','open')")[0].count;
  const completedCamps = db.query("SELECT COUNT(*) as count FROM camps WHERE status = 'completed'")[0].count;
  const totalDonations = db.query("SELECT COUNT(*) as count FROM donation_records WHERE status = 'donated'")[0].count;
  const totalRegistrations = db.query("SELECT COUNT(*) as count FROM camp_registrations WHERE status != 'cancelled'")[0].count;

  // Donations by month (last 6 months)
  const donationsByMonth = db.query(`
    SELECT strftime('%Y-%m', dr.created_at) as month, COUNT(*) as count
    FROM donation_records dr
    WHERE dr.status = 'donated' AND dr.created_at >= date('now', '-6 months')
    GROUP BY month ORDER BY month ASC
  `);

  // Blood group distribution
  const bloodGroupDist = db.query(`
    SELECT blood_group, COUNT(*) as count
    FROM donors WHERE blood_group IS NOT NULL
    GROUP BY blood_group ORDER BY count DESC
  `);

  // Camp status breakdown
  const campStatusBreakdown = db.query(`
    SELECT status, COUNT(*) as count FROM camps GROUP BY status
  `);

  // Donor registrations growth (monthly)
  const donorGrowth = db.query(`
    SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as count
    FROM users WHERE role = 'donor' AND created_at >= date('now', '-6 months')
    GROUP BY month ORDER BY month ASC
  `);

  // Recent camps
  const recentCamps = db.query(`
    SELECT c.id, c.name, c.date, c.city, c.status,
           COUNT(cr.id) as registered
    FROM camps c
    LEFT JOIN camp_registrations cr ON cr.camp_id = c.id AND cr.status != 'cancelled'
    GROUP BY c.id
    ORDER BY c.created_at DESC LIMIT 5
  `);

  return res.json({
    success: true,
    stats: {
      donors, organizers, activeCamps, completedCamps,
      totalDonations, totalRegistrations
    },
    charts: {
      donationsByMonth,
      bloodGroupDist,
      campStatusBreakdown,
      donorGrowth
    },
    recentCamps
  });
}

/** GET /api/admin/users */
function getAllUsers(req, res) {
  const db = getDbWrapper();
  const { role, search } = req.query;

  let sql = `
    SELECT u.id, u.name, u.email, u.role, u.is_active, u.created_at,
           d.blood_group, d.city as donor_city, d.phone as donor_phone,
           o.organization_name, o.city as org_city
    FROM users u
    LEFT JOIN donors d ON d.user_id = u.id
    LEFT JOIN organizers o ON o.user_id = u.id
    WHERE 1=1
  `;
  const params = [];

  if (role) { sql += ' AND u.role = ?'; params.push(role); }
  if (search) {
    sql += ' AND (LOWER(u.name) LIKE LOWER(?) OR LOWER(u.email) LIKE LOWER(?))';
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY u.created_at DESC';
  const users = db.query(sql, params);
  return res.json({ success: true, users });
}

/** PATCH /api/admin/users/:id/status — activate/deactivate */
function updateUserStatus(req, res) {
  const db = getDbWrapper();
  const { is_active } = req.body;

  if (parseInt(req.params.id) === req.user.id) {
    return res.status(400).json({ success: false, message: 'Cannot change your own account status.' });
  }

  db.run('UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [is_active ? 1 : 0, req.params.id]);
  return res.json({ success: true, message: `User ${is_active ? 'activated' : 'deactivated'} successfully.` });
}

/** GET /api/admin/reports */
function getReports(req, res) {
  const db = getDbWrapper();

  const campReports = db.query(`
    SELECT c.id, c.name, c.date, c.city, c.capacity, c.status,
           u.name as organizer_name,
           COUNT(DISTINCT cr.id) as total_registrations,
           COUNT(DISTINCT CASE WHEN cr.attendance = 1 THEN cr.id END) as attended,
           COUNT(DISTINCT CASE WHEN dr.status = 'donated' THEN dr.id END) as donated
    FROM camps c
    JOIN users u ON u.id = c.organizer_id
    LEFT JOIN camp_registrations cr ON cr.camp_id = c.id AND cr.status != 'cancelled'
    LEFT JOIN donation_records dr ON dr.registration_id = cr.id
    GROUP BY c.id
    ORDER BY c.date DESC
  `);

  return res.json({ success: true, campReports });
}

/** GET /api/admin/feedback */
function getAllFeedback(req, res) {
  const db = getDbWrapper();
  const rows = db.query(`
    SELECT f.id, f.rating, f.comments, f.created_at,
           u.name as donor_name, c.name as camp_name, c.date as camp_date
    FROM feedback f
    JOIN users u ON u.id = f.donor_id
    JOIN camps c ON c.id = f.camp_id
    ORDER BY f.created_at DESC
  `);

  const avgRating = db.query('SELECT AVG(rating) as avg FROM feedback')[0].avg;
  return res.json({ success: true, feedback: rows, averageRating: avgRating ? parseFloat(avgRating).toFixed(1) : null });
}

/** POST /api/feedback */
function submitFeedback(req, res) {
  const db = getDbWrapper();
  const { camp_id, rating, comments } = req.body;

  const existing = db.query('SELECT id FROM feedback WHERE donor_id = ? AND camp_id = ?', [req.user.id, camp_id]);
  if (existing.length) {
    return res.status(400).json({ success: false, message: 'You have already submitted feedback for this camp.' });
  }

  db.run('INSERT INTO feedback (donor_id, camp_id, rating, comments) VALUES (?, ?, ?, ?)',
    [req.user.id, camp_id, rating, comments || null]);

  return res.status(201).json({ success: true, message: 'Thank you for your feedback!' });
}

/** GET/POST/PUT/DELETE /api/faqs and /api/admin/faqs */
function getFaqs(req, res) {
  const db = getDbWrapper();
  const faqs = db.query('SELECT * FROM faqs WHERE is_active = 1 ORDER BY display_order ASC, id ASC');
  return res.json({ success: true, faqs });
}

function createFaq(req, res) {
  const db = getDbWrapper();
  const { question, answer, category, display_order } = req.body;
  db.run('INSERT INTO faqs (question, answer, category, display_order) VALUES (?, ?, ?, ?)',
    [question, answer, category || 'General', display_order || 0]);
  return res.status(201).json({ success: true, message: 'FAQ created.' });
}

function updateFaq(req, res) {
  const db = getDbWrapper();
  const { question, answer, category, display_order, is_active } = req.body;
  db.run(
    'UPDATE faqs SET question = COALESCE(?, question), answer = COALESCE(?, answer), category = COALESCE(?, category), display_order = COALESCE(?, display_order), is_active = COALESCE(?, is_active) WHERE id = ?',
    [question, answer, category, display_order, is_active !== undefined ? (is_active ? 1 : 0) : null, req.params.id]
  );
  return res.json({ success: true, message: 'FAQ updated.' });
}

function deleteFaq(req, res) {
  const db = getDbWrapper();
  db.run('UPDATE faqs SET is_active = 0 WHERE id = ?', [req.params.id]);
  return res.json({ success: true, message: 'FAQ removed.' });
}

/** GET /api/blood-banks */
function getBloodBanks(req, res) {
  const db = getDbWrapper();
  const { city } = req.query;
  let sql = 'SELECT * FROM blood_banks WHERE 1=1';
  const params = [];
  if (city) { sql += ' AND LOWER(city) = LOWER(?)'; params.push(city); }
  sql += ' ORDER BY city, name';
  const banks = db.query(sql, params);
  return res.json({ success: true, bloodBanks: banks, demoDataNotice: 'All listed blood banks are sample/demo data. Not live inventory.' });
}

function createBloodBank(req, res) {
  const db = getDbWrapper();
  const { name, city, area, contact, email, address, services } = req.body;
  db.run('INSERT INTO blood_banks (name, city, area, contact, email, address, services, is_demo_data) VALUES (?, ?, ?, ?, ?, ?, ?, 1)',
    [name, city, area || null, contact || null, email || null, address || null, services || null]);
  return res.status(201).json({ success: true, message: 'Blood bank added.' });
}

function updateBloodBank(req, res) {
  const db = getDbWrapper();
  const { name, city, area, contact, email, address, services } = req.body;
  db.run('UPDATE blood_banks SET name = COALESCE(?, name), city = COALESCE(?, city), area = COALESCE(?, area), contact = COALESCE(?, contact), email = COALESCE(?, email), address = COALESCE(?, address), services = COALESCE(?, services) WHERE id = ?',
    [name, city, area, contact, email, address, services, req.params.id]);
  return res.json({ success: true, message: 'Blood bank updated.' });
}

function deleteBloodBank(req, res) {
  const db = getDbWrapper();
  db.run('DELETE FROM blood_banks WHERE id = ?', [req.params.id]);
  return res.json({ success: true, message: 'Blood bank removed.' });
}

/** GET /api/notifications/my */
function getMyNotifications(req, res) {
  const db = getDbWrapper();
  const rows = db.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50', [req.user.id]);
  return res.json({ success: true, notifications: rows });
}

function markNotificationRead(req, res) {
  const db = getDbWrapper();
  db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  return res.json({ success: true });
}

function markAllNotificationsRead(req, res) {
  const db = getDbWrapper();
  db.run('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
  return res.json({ success: true });
}

/** GET /api/stats/public */
function getPublicStats(req, res) {
  const db = getDbWrapper();
  const donors = db.query("SELECT COUNT(*) as count FROM users WHERE role = 'donor' AND is_active = 1")[0].count;
  const organizers = db.query("SELECT COUNT(*) as count FROM users WHERE role = 'organizer' AND is_active = 1")[0].count;
  const activeCamps = db.query("SELECT COUNT(*) as count FROM camps WHERE status IN ('upcoming','open')")[0].count;
  const totalDonations = db.query("SELECT COUNT(*) as count FROM donation_records WHERE status = 'donated'")[0].count;

  return res.json({
    success: true,
    stats: { donors, organizers, activeCamps, totalDonations }
  });
}

module.exports = {
  getStatistics, getPublicStats, getAllUsers, updateUserStatus, getReports,
  getAllFeedback, submitFeedback,
  getFaqs, createFaq, updateFaq, deleteFaq,
  getBloodBanks, createBloodBank, updateBloodBank, deleteBloodBank,
  getMyNotifications, markNotificationRead, markAllNotificationsRead
};
