const { getDbWrapper } = require('../config/db');
const { evaluateEligibility, validateAnswers } = require('../services/eligibilityService');

const DISCLAIMER = 'Pre-screening only: This questionnaire provides a preliminary indication and does not replace professional medical screening. Final eligibility will be determined by qualified medical staff according to applicable blood-bank guidelines.';

/** POST /api/eligibility */
function submitScreening(req, res) {
  try {
    const db = getDbWrapper();
    const { registration_id, answers } = req.body;

    // Verify registration belongs to this donor
    const regs = db.query(
      'SELECT cr.*, c.status as camp_status FROM camp_registrations cr JOIN camps c ON c.id = cr.camp_id WHERE cr.id = ? AND cr.donor_id = ?',
      [registration_id, req.user.id]
    );
    if (!regs.length) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }
    if (regs[0].camp_status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Camp has been cancelled.' });
    }

    // Check if already screened
    const existing = db.query('SELECT id, outcome FROM eligibility_screenings WHERE registration_id = ?', [registration_id]);
    if (existing.length) {
      return res.status(400).json({
        success: false,
        message: 'You have already completed pre-screening for this registration.',
        outcome: existing[0].outcome
      });
    }

    // Validate answers
    const { valid, missing } = validateAnswers(answers);
    if (!valid) {
      return res.status(400).json({
        success: false,
        message: `Missing questionnaire fields: ${missing.join(', ')}.`
      });
    }

    if (!answers.declaration) {
      return res.status(400).json({ success: false, message: 'You must accept the declaration to proceed.' });
    }

    // Evaluate
    const { outcome, flags, flagMessages } = evaluateEligibility(answers);

    db.run(
      'INSERT INTO eligibility_screenings (registration_id, answers_json, outcome, flags_json) VALUES (?, ?, ?, ?)',
      [registration_id, JSON.stringify(answers), outcome, JSON.stringify(flags)]
    );

    // Notification to donor
    const notifMsg = outcome === 'preliminary_passed'
      ? 'Pre-screening complete. You may proceed to final medical screening at the camp.'
      : 'Your pre-screening requires medical review. Please inform camp staff on arrival.';
    db.run('INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)', [req.user.id, notifMsg, 'screening']);

    return res.status(201).json({
      success: true,
      outcome,
      flags,
      flagMessages: outcome === 'medical_review_required' ? flagMessages : [],
      disclaimer: DISCLAIMER,
      message: outcome === 'preliminary_passed'
        ? 'Pre-screening complete — proceed to final medical screening at the camp.'
        : 'Pre-screening flagged for medical review. Please inform camp staff when you arrive.'
    });
  } catch (err) {
    console.error('[Eligibility] submitScreening error:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit screening.' });
  }
}

/** GET /api/eligibility/my */
function getMyScreenings(req, res) {
  const db = getDbWrapper();
  const rows = db.query(`
    SELECT es.id, es.outcome, es.flags_json, es.created_at,
           cr.registration_code, c.name as camp_name, c.date as camp_date
    FROM eligibility_screenings es
    JOIN camp_registrations cr ON cr.id = es.registration_id
    JOIN camps c ON c.id = cr.camp_id
    WHERE cr.donor_id = ?
    ORDER BY es.created_at DESC
  `, [req.user.id]);

  return res.json({ success: true, screenings: rows, disclaimer: DISCLAIMER });
}

/** GET /api/admin/eligibility — flagged screenings */
function getFlaggedScreenings(req, res) {
  const db = getDbWrapper();
  const rows = db.query(`
    SELECT es.id, es.outcome, es.flags_json, es.answers_json, es.created_at,
           cr.registration_code, cr.id as registration_id,
           u.name as donor_name, u.email as donor_email,
           c.name as camp_name, c.date as camp_date
    FROM eligibility_screenings es
    JOIN camp_registrations cr ON cr.id = es.registration_id
    JOIN users u ON u.id = cr.donor_id
    JOIN camps c ON c.id = cr.camp_id
    WHERE es.outcome = 'medical_review_required'
    ORDER BY es.created_at DESC
  `, []);

  return res.json({ success: true, screenings: rows, disclaimer: DISCLAIMER });
}

module.exports = { submitScreening, getMyScreenings, getFlaggedScreenings };
