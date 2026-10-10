
const { getDbWrapper } = require('../config/db');

/** GET /api/donors/profile */
function getProfile(req, res) {
  try {
    const db = getDbWrapper();

    const rows = db.query(
      `SELECT
         u.id, u.name, u.email, u.role, u.created_at,
         d.dob, d.gender, d.blood_group, d.city, d.address, d.phone
       FROM users u
       LEFT JOIN donors d ON d.user_id = u.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found.',
      });
    }

    return res.json({
      success: true,
      profile: rows[0],
    });
  } catch (err) {
    console.error('[Donor] getProfile error:', err);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile.',
    });
  }
}

/** PUT /api/donors/profile */
async function updateProfile(req, res) {
  try {
    const db = getDbWrapper();
    const userId = req.user.id;

    const {
      name,
      phone,
      blood_group,
      dob,
      gender,
      city,
      address,
    } = req.body;

    // Validate name when supplied.
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Name cannot be empty.',
        });
      }

      db.run(
        `UPDATE users
         SET name = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [name.trim(), userId]
      );
    }

    // Validate phone when supplied.
    if (phone !== undefined && phone !== null && phone !== '') {
      if (
        typeof phone !== 'string' ||
        !/^\+91\d{10}$/.test(phone)
      ) {
        return res.status(400).json({
          success: false,
          message: 'Phone number must be +91 followed by exactly 10 digits.',
        });
      }
    }

    // Validate blood group when supplied.
    const validBloodGroups = [
      'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
    ];

    if (
      blood_group !== undefined &&
      blood_group !== null &&
      blood_group !== '' &&
      !validBloodGroups.includes(blood_group)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid blood group.',
      });
    }

    // Validate gender when supplied.
    if (
      gender !== undefined &&
      gender !== null &&
      gender !== '' &&
      !['Male', 'Female', 'Other'].includes(gender)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid gender.',
      });
    }

    // Read existing donor details to preserve omitted fields.
    const existingRows = db.query(
      `SELECT phone, blood_group, dob, gender, city, address
       FROM donors
       WHERE user_id = ?`,
      [userId]
    );

    const existing = existingRows[0] || {};

    const updated = {
      phone: phone !== undefined
        ? (phone || null)
        : (existing.phone ?? null),

      blood_group: blood_group !== undefined
        ? (blood_group || null)
        : (existing.blood_group ?? null),

      dob: dob !== undefined
        ? (dob || null)
        : (existing.dob ?? null),

      gender: gender !== undefined
        ? (gender || null)
        : (existing.gender ?? null),

      city: city !== undefined
        ? (city || null)
        : (existing.city ?? null),

      address: address !== undefined
        ? (address || null)
        : (existing.address ?? null),
    };

    if (existingRows.length) {
      db.run(
        `UPDATE donors
         SET phone = ?, blood_group = ?, dob = ?,
             gender = ?, city = ?, address = ?
         WHERE user_id = ?`,
        [
          updated.phone,
          updated.blood_group,
          updated.dob,
          updated.gender,
          updated.city,
          updated.address,
          userId,
        ]
      );
    } else {
      // Create the donor record if it does not exist.
      db.run(
        `INSERT INTO donors
         (user_id, phone, blood_group, dob, gender, city, address)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          updated.phone,
          updated.blood_group,
          updated.dob,
          updated.gender,
          updated.city,
          updated.address,
        ]
      );
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully.',
    });
  } catch (err) {
    console.error('[Donor] updateProfile error:', err);

    return res.status(500).json({
      success: false,
      message: 'Failed to update profile.',
    });
  }
}

/** GET /api/donors/history */
function getDonorHistory(req, res) {
  try {
    const db = getDbWrapper();

    const rows = db.query(
      `SELECT
         cr.id,
         cr.registration_code,
         cr.status AS reg_status,
         cr.attendance,
         cr.created_at,
         c.name AS camp_name,
         c.date AS camp_date,
         c.venue,
         c.city,
         dr.status AS donation_status,
         dr.units_donated,
         cert.certificate_code,
         cert.issued_at
       FROM camp_registrations cr
       JOIN camps c ON c.id = cr.camp_id
       LEFT JOIN donation_records dr
         ON dr.registration_id = cr.id
       LEFT JOIN certificates cert
         ON cert.donation_record_id = dr.id
       WHERE cr.donor_id = ?
       ORDER BY cr.created_at DESC`,
      [req.user.id]
    );

    return res.json({
      success: true,
      history: rows,
    });
  } catch (err) {
    console.error('[Donor] getDonorHistory error:', err);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch donation history.',
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getDonorHistory,
};
