const { v4: uuidv4 } = require('uuid');
const { getDbWrapper } = require('../config/db');

/** GET /api/donations/my */
function getMyDonations(req, res) {
  const db = getDbWrapper();
  const rows = db.query(`
    SELECT dr.id, dr.status, dr.units_donated, dr.notes, dr.created_at,
           cr.registration_code, c.name as camp_name, c.date as camp_date, c.venue, c.city,
           cert.certificate_code, cert.issued_at as certificate_issued_at
    FROM donation_records dr
    JOIN camp_registrations cr ON cr.id = dr.registration_id
    JOIN camps c ON c.id = cr.camp_id
    LEFT JOIN certificates cert ON cert.donation_record_id = dr.id
    WHERE cr.donor_id = ?
    ORDER BY dr.created_at DESC
  `, [req.user.id]);

  return res.json({ success: true, donations: rows });
}

/** PATCH /api/donations/:id/status — organizer/admin update */
function updateDonationStatus(req, res) {
  try {
    const db = getDbWrapper();
    const { status, units_donated, notes } = req.body;
    const regId = req.params.id; // registration_id

    const regs = db.query(
      'SELECT cr.*, c.organizer_id FROM camp_registrations cr JOIN camps c ON c.id = cr.camp_id WHERE cr.id = ?',
      [regId]
    );
    if (!regs.length) return res.status(404).json({ success: false, message: 'Registration not found.' });

    if (req.user.role === 'organizer' && regs[0].organizer_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Upsert donation record
    const existing = db.query('SELECT id FROM donation_records WHERE registration_id = ?', [regId]);
    let donationId;

    if (existing.length) {
      db.run(
        'UPDATE donation_records SET status = ?, units_donated = ?, notes = ?, recorded_by = ?, updated_at = CURRENT_TIMESTAMP WHERE registration_id = ?',
        [status, units_donated || 1.0, notes || null, req.user.id, regId]
      );
      donationId = existing[0].id;
    } else {
      const result = db.run(
        'INSERT INTO donation_records (registration_id, status, units_donated, notes, recorded_by) VALUES (?, ?, ?, ?, ?)',
        [regId, status, units_donated || 1.0, notes || null, req.user.id]
      );
      donationId = result.lastInsertRowid;
    }

    // Auto-generate certificate if status is 'donated'
    let certificate = null;
    if (status === 'donated') {
      const existingCert = db.query('SELECT * FROM certificates WHERE donation_record_id = ?', [donationId]);
      if (!existingCert.length) {
        const certCode = `CERT-BC-${Date.now()}-${uuidv4().split('-')[0].toUpperCase()}`;
        db.run('INSERT INTO certificates (donation_record_id, certificate_code) VALUES (?, ?)', [donationId, certCode]);
        certificate = certCode;

        // Notify donor
        const donorId = regs[0].donor_id;
        db.run(
          'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
          [donorId, `Congratulations! Your donation certificate has been generated. Code: ${certCode}`, 'certificate']
        );
      } else {
        certificate = existingCert[0].certificate_code;
      }
    }

    return res.json({
      success: true,
      message: 'Donation status updated.',
      ...(certificate && { certificate_code: certificate })
    });
  } catch (err) {
    console.error('[Donation] updateDonationStatus error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update donation status.' });
  }
}

/** GET /api/certificates/:code */
function getCertificate(req, res) {
  const db = getDbWrapper();
  const rows = db.query(`
    SELECT cert.certificate_code, cert.issued_at,
           u.name as donor_name,
           d.blood_group,
           c.name as camp_name, c.date as camp_date, c.venue, c.city,
           dr.units_donated
    FROM certificates cert
    JOIN donation_records dr ON dr.id = cert.donation_record_id
    JOIN camp_registrations cr ON cr.id = dr.registration_id
    JOIN users u ON u.id = cr.donor_id
    LEFT JOIN donors d ON d.user_id = u.id
    JOIN camps c ON c.id = cr.camp_id
    WHERE cert.certificate_code = ?
  `, [req.params.code]);

  if (!rows.length) return res.status(404).json({ success: false, message: 'Certificate not found.' });

  return res.json({
    success: true,
    certificate: {
      ...rows[0],
      disclaimer: 'This is a BloodConnect donation acknowledgment certificate. It is not an official medical or legal document.'
    }
  });
}

module.exports = { getMyDonations, updateDonationStatus, getCertificate };
