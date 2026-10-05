const { getDbWrapper } = require('../config/db');

/** GET /api/donors/profile */
function getProfile(req, res) {
  const db = getDbWrapper();
  const rows = db.query(`
    SELECT u.id, u.name, u.email, u.role, u.created_at,
           d.dob, d.gender, d.blood_group, d.city, d.address, d.phone
    FROM users u
    LEFT JOIN donors d ON d.user_id = u.id
    WHERE u.id = ?
  `, [req.user.id]);

  if (!rows.length) return res.status(404).json({ success: false, message: 'Profile not found.' });
  return res.json({ success: true, profile: rows[0] });
}

/** PUT /api/donors/profile */
async function updateProfile(req, res) {
  try {
    const db = getDbWrapper();
    const { name, phone, blood_group, dob, gender, city, address } = req.body;

    if (name) {
      db.run('UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [name.trim(), req.user.id]);
    }

    db.run(`
      UPDATE donors SET
        phone = ?, blood_group = ?, dob = ?, gender = ?, city = ?, address = ?
      WHERE user_id = ?
    `, [phone || null, blood_group || null, dob || null, gender || null, city || null, address || null, req.user.id]);

    return res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('[Donor] updateProfile error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
}

/** GET /api/donors/history — donation history with registration + camp info */
function getDonorHistory(req, res) {
  const db = getDbWrapper();
  const rows = db.query(`
    SELECT cr.id, cr.registration_code, cr.status as reg_status, cr.attendance, cr.created_at,
           c.name as camp_name, c.date as camp_date, c.venue, c.city,
           dr.status as donation_status, dr.units_donated,
           cert.certificate_code, cert.issued_at
    FROM camp_registrations cr
    JOIN camps c ON c.id = cr.camp_id
    LEFT JOIN donation_records dr ON dr.registration_id = cr.id
    LEFT JOIN certificates cert ON cert.donation_record_id = dr.id
    WHERE cr.donor_id = ?
    ORDER BY cr.created_at DESC
  `, [req.user.id]);

  return res.json({ success: true, history: rows });
}

module.exports = { getProfile, updateProfile, getDonorHistory };
