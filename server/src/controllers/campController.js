const { getDbWrapper } = require('../config/db');

/** GET /api/camps — list with filters: city, status, date */
function getCamps(req, res) {
  const db = getDbWrapper();
  const { city, status, date, search } = req.query;

  let sql = `
    SELECT c.*, u.name as organizer_name,
           (SELECT COUNT(*) FROM camp_registrations WHERE camp_id = c.id AND status != 'cancelled') as registered_count
    FROM camps c
    JOIN users u ON u.id = c.organizer_id
    WHERE 1=1
  `;
  const params = [];

  if (city) { sql += ' AND LOWER(c.city) = LOWER(?)'; params.push(city); }
  if (status) { sql += ' AND c.status = ?'; params.push(status); }
  if (date) { sql += ' AND c.date = ?'; params.push(date); }
  if (search) {
    sql += ' AND (LOWER(c.name) LIKE LOWER(?) OR LOWER(c.venue) LIKE LOWER(?))';
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY c.date ASC';
  const camps = db.query(sql, params);
  return res.json({ success: true, camps });
}

/** GET /api/camps/:id */
function getCampById(req, res) {
  const db = getDbWrapper();
  const camps = db.query(`
    SELECT c.*, u.name as organizer_name, u.email as organizer_email,
           (SELECT COUNT(*) FROM camp_registrations WHERE camp_id = c.id AND status != 'cancelled') as registered_count
    FROM camps c
    JOIN users u ON u.id = c.organizer_id
    WHERE c.id = ?
  `, [req.params.id]);

  if (!camps.length) return res.status(404).json({ success: false, message: 'Camp not found.' });
  return res.json({ success: true, camp: camps[0] });
}

/** POST /api/camps */
function createCamp(req, res) {
  try {
    const db = getDbWrapper();
    const { name, description, date, start_time, end_time, venue, address, city, capacity, status, image_url } = req.body;

    const result = db.run(`
      INSERT INTO camps (organizer_id, name, description, date, start_time, end_time, venue, address, city, capacity, status, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [req.user.id, name, description || null, date, start_time, end_time, venue, address || null, city, capacity || 50, status || 'upcoming', image_url || null]);

    const camp = db.query('SELECT * FROM camps WHERE id = ?', [result.lastInsertRowid])[0];
    return res.status(201).json({ success: true, message: 'Camp created successfully.', camp });
  } catch (err) {
    console.error('[Camp] createCamp error:', err);
    return res.status(500).json({ success: false, message: 'Failed to create camp.' });
  }
}

/** PUT /api/camps/:id */
function updateCamp(req, res) {
  const db = getDbWrapper();
  const camp = db.query('SELECT * FROM camps WHERE id = ?', [req.params.id]);
  if (!camp.length) return res.status(404).json({ success: false, message: 'Camp not found.' });

  // Organizers can only update their own camps
  if (req.user.role === 'organizer' && camp[0].organizer_id !== req.user.id) {
    return res.status(403).json({ success: false, message: 'You can only update your own camps.' });
  }

  const { name, description, date, start_time, end_time, venue, address, city, capacity, status, image_url } = req.body;

  db.run(`
    UPDATE camps SET
      name = COALESCE(?, name), description = COALESCE(?, description),
      date = COALESCE(?, date), start_time = COALESCE(?, start_time),
      end_time = COALESCE(?, end_time), venue = COALESCE(?, venue),
      address = COALESCE(?, address), city = COALESCE(?, city),
      capacity = COALESCE(?, capacity), status = COALESCE(?, status),
      image_url = COALESCE(?, image_url), updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [name, description, date, start_time, end_time, venue, address, city, capacity, status, image_url, req.params.id]);

  return res.json({ success: true, message: 'Camp updated successfully.' });
}

/** DELETE /api/camps/:id — soft cancel */
function deleteCamp(req, res) {
  const db = getDbWrapper();
  const camp = db.query('SELECT * FROM camps WHERE id = ?', [req.params.id]);
  if (!camp.length) return res.status(404).json({ success: false, message: 'Camp not found.' });

  if (req.user.role === 'organizer' && camp[0].organizer_id !== req.user.id) {
    return res.status(403).json({ success: false, message: 'You can only cancel your own camps.' });
  }

  db.run('UPDATE camps SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['cancelled', req.params.id]);
  // Soft-cancel registrations
  db.run("UPDATE camp_registrations SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE camp_id = ?", [req.params.id]);

  return res.json({ success: true, message: 'Camp cancelled successfully. All registrations have been cancelled.' });
}

/** GET /api/camps/:id/registrations — organizer/admin view */
function getCampRegistrations(req, res) {
  const db = getDbWrapper();
  const camp = db.query('SELECT * FROM camps WHERE id = ?', [req.params.id]);
  if (!camp.length) return res.status(404).json({ success: false, message: 'Camp not found.' });

  if (req.user.role === 'organizer' && camp[0].organizer_id !== req.user.id) {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  const rows = db.query(`
    SELECT cr.id, cr.registration_code, cr.status, cr.attendance, cr.created_at,
           u.id as donor_id, u.name as donor_name, u.email as donor_email,
           d.blood_group, d.phone,
           es.outcome as screening_outcome,
           dr.status as donation_status
    FROM camp_registrations cr
    JOIN users u ON u.id = cr.donor_id
    LEFT JOIN donors d ON d.user_id = u.id
    LEFT JOIN eligibility_screenings es ON es.registration_id = cr.id
    LEFT JOIN donation_records dr ON dr.registration_id = cr.id
    WHERE cr.camp_id = ?
    ORDER BY cr.created_at ASC
  `, [req.params.id]);

  return res.json({ success: true, registrations: rows, camp: camp[0] });
}

module.exports = { getCamps, getCampById, createCamp, updateCamp, deleteCamp, getCampRegistrations };
