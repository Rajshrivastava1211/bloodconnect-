/**
 * Eligibility Screening Service
 *
 * Implements a transparent flagging-based scoring function.
 * Certain answers set a `requires_review` flag.
 * The outcome is classified as:
 *   - 'preliminary_passed': no flags raised
 *   - 'medical_review_required': one or more flags raised
 *
 * IMPORTANT DISCLAIMER: This is a preliminary screening only.
 * Final eligibility will be determined by qualified medical staff
 * according to applicable blood-bank guidelines.
 */

// Eligibility rules — each defines what answer raises a flag
const SCREENING_RULES = [
  {
    field: 'age_18_to_65',
    flagWhen: false,
    flag: 'age_out_of_range',
    message: 'Age must be between 18 and 65 years.'
  },
  {
    field: 'weight_above_50',
    flagWhen: false,
    flag: 'insufficient_weight',
    message: 'Weight must be at least 50 kg.'
  },
  {
    field: 'feeling_well',
    flagWhen: false,
    flag: 'not_feeling_well',
    message: 'Donor reported not feeling well today.'
  },
  {
    field: 'donated_last_3_months',
    flagWhen: true,
    flag: 'recent_donation',
    message: 'Donated blood within the last 3 months — minimum interval is 90 days.'
  },
  {
    field: 'chronic_illness',
    flagWhen: true,
    flag: 'chronic_illness',
    message: 'Reported chronic illness requires medical review.'
  },
  {
    field: 'recent_medication',
    flagWhen: true,
    flag: 'recent_medication',
    message: 'Recent medication use requires medical staff review.'
  },
  {
    field: 'recent_surgery',
    flagWhen: true,
    flag: 'recent_surgery',
    message: 'Recent surgery (within 6 months) requires medical review.'
  },
  {
    field: 'recent_travel',
    flagWhen: true,
    flag: 'recent_travel',
    message: 'Recent travel to high-risk regions requires medical staff assessment.'
  },
  {
    field: 'pregnant_or_nursing',
    flagWhen: true,
    flag: 'pregnant_or_nursing',
    message: 'Pregnant or nursing donors are temporarily deferred.'
  }
];

/**
 * Evaluate questionnaire answers and return outcome + flags.
 * @param {Object} answers - key-value pairs from the questionnaire
 * @returns {{ outcome: string, flags: string[], flagMessages: string[] }}
 */
function evaluateEligibility(answers) {
  const flags = [];
  const flagMessages = [];

  for (const rule of SCREENING_RULES) {
    const answer = answers[rule.field];
    // Convert to boolean
    const boolAnswer = answer === true || answer === 'true' || answer === 1;

    if (boolAnswer === rule.flagWhen) {
      flags.push(rule.flag);
      flagMessages.push(rule.message);
    }
  }

  const outcome = flags.length === 0 ? 'preliminary_passed' : 'medical_review_required';

  return { outcome, flags, flagMessages };
}

/**
 * Validate that all required questionnaire fields are present.
 * @param {Object} answers
 * @returns {{ valid: boolean, missing: string[] }}
 */
function validateAnswers(answers) {
  const required = [
    'age_18_to_65', 'weight_above_50', 'feeling_well',
    'donated_last_3_months', 'chronic_illness', 'recent_medication',
    'recent_surgery', 'recent_travel', 'pregnant_or_nursing', 'declaration'
  ];

  const missing = required.filter(field => answers[field] === undefined || answers[field] === null);
  return { valid: missing.length === 0, missing };
}

module.exports = { evaluateEligibility, validateAnswers };
