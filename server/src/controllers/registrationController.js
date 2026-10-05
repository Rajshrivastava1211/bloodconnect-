const { v4: uuidv4 } = require('uuid');
const { getDbWrapper } = require('../config/db');
const { evaluateEligibility, validateAnswers } = require('../services/eligibilityService');

/** POST /api/camps/:id/register */
function registerForCamp(req, res) {
  try {
    const db = getDbWrapper();
    const campId = parseInt(req.params.id);
    const donorId = req.user.id;

    // Verify camp exists and is open
    const camps = db.query('SELECT * FROM camps WHERE id = ?', [campId]);
    if (!camps.length) return res.status(404).json({ success: false, message: 'Camp not found.' });
    const camp = camps[0];

    if (!['upcoming', 'open'].includes(camp.status)) {
      return res.status(400).json({
        success: false,
        message: `Camp registration is not available. Camp status: "${camp.status}".`
      });
    }

    // Check capacity
    const count = db.query(
      "SELECT COUNT(*) as c FROM camp_registrations WHERE camp_id = ? AND status != 'cancelled'",
      [campId]
    );
    if (count[0].c >= camp.capacity) {
      db.run('UPDATE camps SET status = ? WHERE id = ?', ['full', campId]);
      return res.status(400).json({ success: false, message: 'Camp registration is full.' });
    }

    // Check duplicate registration
    const existing = db.query(
      "SELECT id FROM camp_registrations WHERE donor_id = ? AND camp_id = ? AND status != 'cancelled'",
      [donorId, campId]
    );
    if (existing.length) {
      return res.status(400).json({ success: false, message: 'You are already registered for this camp.' });
    }

    // Generate unique registration code
    const code = `BC-${camp.date.replace(/-/g, '')}-${uuidv4().split('-')[0].toUpperCase()}`;

    const result = db.run(
      'INSERT INTO camp_registrations (donor_id, camp_id, registration_code, status) VALUES (?, ?, ?, ?)',
      [donorId, campId, code, 'registered']
    );

    // Flip to full if now at capacity
    const newCount = db.query(
      "SELECT COUNT(*) as c FROM camp_registrations WHERE camp_id = ? AND status != 'cancelled'",
      [campId]
    );
    if (newCount[0].c >= camp.capacity) {
      db.run('UPDATE camps SET status = ? WHERE id = ?', ['full', campId]);
    }

    // Notification
    db.run(
      'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
      [donorId, `Successfully registered for "${camp.name}" on ${camp.date}. Your code: ${code}`, 'registration']
    );

    return res.status(201).json({
      success: true,
      message: 'Camp registered successfully! Please complete the eligibility pre-screening.',
      registration: {
        id: result.lastInsertRowid,
        registration_code: code,
        camp_name: camp.name,
        camp_date: camp.date,
        status: 'registered'
      }
    });
  } catch (err) {
    console.error('[Registration] registerForCamp error:', err);
    return res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
}

/** GET /api/registrations/my */
function getMyRegistrations(req, res) {
  const db = getDbWrapper();
  const rows = db.query(`
    SELECT cr.id, cr.registration_code, cr.status, cr.attendance, cr.created_at,
           c.id as camp_id, c.name as camp_name, c.date as camp_date, c.venue, c.city, c.status as camp_status,
           es.outcome as screening_outcome,
           dr.status as donation_status,
           cert.certificate_code
    FROM camp_registrations cr
    JOIN camps c ON c.id = cr.camp_id
    LEFT JOIN eligibility_screenings es ON es.registration_id = cr.id
    LEFT JOIN donation_records dr ON dr.registration_id = cr.id
    LEFT JOIN certificates cert ON cert.donation_record_id = dr.id
    WHERE cr.donor_id = ?
    ORDER BY cr.created_at DESC
  `, [req.user.id]);

  return res.json({ success: true, registrations: rows });
}

/** PATCH /api/registrations/:id/attendance — organizer/admin */
function updateAttendance(req, res) {
  const db = getDbWrapper();
  const { status, attendance } = req.body;

  const reg = db.query('SELECT cr.*, c.organizer_id FROM camp_registrations cr JOIN camps c ON c.id = cr.camp_id WHERE cr.id = ?', [req.params.id]);
  if (!reg.length) return res.status(404).json({ success: false, message: 'Registration not found.' });

  if (req.user.role === 'organizer' && reg[0].organizer_id !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  db.run(
    'UPDATE camp_registrations SET status = COALESCE(?, status), attendance = COALESCE(?, attendance), updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status || null, attendance !== undefined ? (attendance ? 1 : 0) : null, req.params.id]
  );

  return res.json({ success: true, message: 'Attendance updated.' });
}

/** DELETE /api/registrations/:id — donor cancels own registration */
function cancelRegistration(req, res) {
  const db = getDbWrapper();
  const reg = db.query('SELECT cr.*, c.status as camp_status FROM camp_registrations cr JOIN camps c ON c.id = cr.camp_id WHERE cr.id = ? AND cr.donor_id = ?', [req.params.id, req.user.id]);

  if (!reg.length) return res.status(404).json({ success: false, message: 'Registration not found.' });

  if (['completed', 'ongoing'].includes(reg[0].camp_status)) {
    return res.status(400).json({ success: false, message: 'Cannot cancel registration for a completed or ongoing camp.' });
  }

  db.run("UPDATE camp_registrations SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [req.params.id]);
  return res.json({ success: true, message: 'Registration cancelled successfully.' });
}

module.exports = { registerForCamp, getMyRegistrations, updateAttendance, cancelRegistration };
