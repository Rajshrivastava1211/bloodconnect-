import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaClipboardCheck, FaShieldAlt, FaArrowRight, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const EligibilityWizard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReg, setSelectedReg] = useState('');
  
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    age_18_to_65: true,
    weight_above_50: true,
    feeling_well: true,
    donated_last_3_months: false,
    chronic_illness: false,
    recent_medication: false,
    recent_surgery: false,
    recent_travel: false,
    pregnant_or_nursing: false,
    declaration: false
  });

  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch pending registrations
    api.get('/registrations/my')
      .then(res => {
        // filter those without screening outcome and registered
        const pending = (res.registrations || []).filter(r => !r.screening_outcome && r.status === 'registered');
        setRegistrations(pending);
        if (pending.length > 0) {
          setSelectedReg(pending[0].id);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckboxChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.checked });
  };

  const handleNext = () => {
    let regIdToUse = selectedReg;
    if (step === 1 && !regIdToUse) {
      if (registrations.length > 0) {
        regIdToUse = registrations[0].id;
        setSelectedReg(regIdToUse);
      } else {
        setError('Please register for a camp before proceeding with the pre-screening.');
        return;
      }
    }
    setError('');
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setError('');
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!answers.declaration) {
      setError('You must read and accept the declaration to submit.');
      return;
    }

    const regIdToUse = selectedReg || (registrations.length > 0 ? registrations[0].id : null);
    if (!regIdToUse) {
      setError('No valid camp registration selected.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const res = await api.post('/eligibility', {
        registration_id: regIdToUse,
        answers: answers
      });
      setOutcome(res);
      setStep(7); // Show success/outcome step
    } catch (err) {
      setError(err.message || 'Failed to submit pre-screening.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 font-medium">Loading Pre-screening Wizard...</div>;
  }

  const stepTitles = [
    'Select Camp Registration',
    'Basic Physical Parameters',
    'Recent Donation Interval',
    'Chronic Illnesses & Health History',
    'Recent Medications & Procedures',
    'Donor Declaration',
    'Screening Results'
  ];

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="donor" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-3xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <FaClipboardCheck className="text-red-600" />
            <span>Eligibility Pre-Screening Wizard</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Complete this 6-step questionnaire to evaluate your preliminary donation eligibility.</p>
        </div>

        {/* Disclaimer banner */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl text-amber-950 flex items-start space-x-3 text-xs shadow-sm">
          <FaShieldAlt className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900">Medical Screening Disclaimer</p>
            <p className="mt-0.5 leading-relaxed">Pre-screening only: This questionnaire provides a preliminary indication and does not replace professional medical screening. Final eligibility will be determined by qualified medical staff according to applicable blood-bank guidelines.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg text-xs text-red-700 flex items-center space-x-2">
            <FaExclamationTriangle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
          {step < 7 && (
            <div className="space-y-2 border-b pb-4">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
                <span className="text-red-600 font-bold uppercase tracking-wider">Step {step} of 6: {stepTitles[step - 1]}</span>
                <span className="text-slate-400 font-mono">{Math.round((step / 6) * 100)}% Complete</span>
              </div>
              <div className="flex space-x-1.5 pt-1">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                      i <= step ? 'bg-red-600' : 'bg-slate-200'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: Select Registration */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Select Camp Registration</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Choose which scheduled camp registration you are submitting this eligibility screening for.</p>
              </div>
              
              {registrations.length === 0 ? (
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center space-y-3">
                  <p className="font-medium text-slate-700">You have no active camp registrations awaiting eligibility pre-screening.</p>
                  <p>Please browse upcoming donation drives and register for a slot first.</p>
                  <Link
                    to="/camps"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg shadow-sm transition-colors text-xs"
                  >
                    Find a Camp & Register
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Select Camp Slot</label>
                  <select
                    value={selectedReg}
                    onChange={(e) => setSelectedReg(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    {registrations.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.camp_name} — {r.camp_date} ({r.venue || r.city})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {registrations.length > 0 && (
                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <span>Continue to Step 2</span>
                    <FaArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Basic Physical Requirements */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Basic Physical Parameters</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Please verify these basic physical requirements regarding your age, weight, and general health status today.</p>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-red-50/30 cursor-pointer transition-colors text-xs text-slate-700">
                  <input
                    type="checkbox"
                    name="age_18_to_65"
                    checked={answers.age_18_to_65}
                    onChange={handleCheckboxChange}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="font-medium">I am between 18 and 65 years of age.</span>
                </label>

                <label className="flex items-center space-x-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-red-50/30 cursor-pointer transition-colors text-xs text-slate-700">
                  <input
                    type="checkbox"
                    name="weight_above_50"
                    checked={answers.weight_above_50}
                    onChange={handleCheckboxChange}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="font-medium">I weigh at least 50 kg (110 lbs).</span>
                </label>

                <label className="flex items-center space-x-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-red-50/30 cursor-pointer transition-colors text-xs text-slate-700">
                  <input
                    type="checkbox"
                    name="feeling_well"
                    checked={answers.feeling_well}
                    onChange={handleCheckboxChange}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="font-medium">I feel well, active, and healthy today.</span>
                </label>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-1.5 border border-slate-300 transition-colors cursor-pointer"
                >
                  <FaArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <FaArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Donation Frequency */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Recent Donation Frequency</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Ensure an adequate time gap has passed since your previous whole blood donation (minimum 90 days).</p>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-red-50/30 cursor-pointer transition-colors text-xs text-slate-700">
                  <input
                    type="checkbox"
                    name="donated_last_3_months"
                    checked={answers.donated_last_3_months}
                    onChange={handleCheckboxChange}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="font-medium">I have donated blood within the past 3 months (90 days).</span>
                </label>
                <p className="text-[11px] text-slate-400 italic pl-1">Leave unchecked if you haven't donated in the past 90 days.</p>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-1.5 border border-slate-300 transition-colors cursor-pointer"
                >
                  <FaArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <FaArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Medical Conditions */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Chronic Illnesses & Medical History</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Report any history of critical medical conditions that require specialized medical assessment.</p>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-red-50/30 cursor-pointer transition-colors text-xs text-slate-700">
                  <input
                    type="checkbox"
                    name="chronic_illness"
                    checked={answers.chronic_illness}
                    onChange={handleCheckboxChange}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="font-medium">I have a history of chronic medical conditions (e.g., Heart disease, HIV/AIDS, Hepatitis B/C, Cancer, or Insulin-dependent Diabetes).</span>
                </label>
                <p className="text-[11px] text-slate-400 italic pl-1">Leave unchecked if you do not have any chronic medical conditions.</p>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-1.5 border border-slate-300 transition-colors cursor-pointer"
                >
                  <FaArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <FaArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Recent Procedures */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Recent Procedures, Medications & Travel</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Check any statements that apply to you over the recent months:</p>
              </div>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-red-50/30 cursor-pointer transition-colors text-xs text-slate-700">
                  <input
                    type="checkbox"
                    name="recent_medication"
                    checked={answers.recent_medication}
                    onChange={handleCheckboxChange}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="font-medium">I am currently taking antibiotics, aspirin, or prescription blood thinners.</span>
                </label>

                <label className="flex items-center space-x-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-red-50/30 cursor-pointer transition-colors text-xs text-slate-700">
                  <input
                    type="checkbox"
                    name="recent_surgery"
                    checked={answers.recent_surgery}
                    onChange={handleCheckboxChange}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="font-medium">I have had surgery, a major dental procedure, tattoo, or body piercing in the last 6 months.</span>
                </label>

                <label className="flex items-center space-x-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-red-50/30 cursor-pointer transition-colors text-xs text-slate-700">
                  <input
                    type="checkbox"
                    name="recent_travel"
                    checked={answers.recent_travel}
                    onChange={handleCheckboxChange}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="font-medium">I have traveled to a malaria-endemic region in the past 12 months.</span>
                </label>

                <label className="flex items-center space-x-3 p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-red-50/30 cursor-pointer transition-colors text-xs text-slate-700">
                  <input
                    type="checkbox"
                    name="pregnant_or_nursing"
                    checked={answers.pregnant_or_nursing}
                    onChange={handleCheckboxChange}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                  />
                  <span className="font-medium">I am currently pregnant or nursing (if applicable).</span>
                </label>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-1.5 border border-slate-300 transition-colors cursor-pointer"
                >
                  <FaArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <FaArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Declaration */}
          {step === 6 && (
            <div className="space-y-5">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Donor Declaration</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">Please read the confirmation statement below and accept before submitting your pre-screening questionnaire.</p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-600">
                I hereby declare that all responses provided in this pre-screening questionnaire are true and complete to the best of my knowledge. I understand that this online screening does not confirm final medical eligibility, and I will cooperate with the medical staff for physical screening and vitals checks at the camp venue.
              </div>

              <label className="flex items-center space-x-3 p-3.5 rounded-lg border border-red-200 bg-red-50/40 cursor-pointer text-xs text-slate-800 font-semibold">
                <input
                  type="checkbox"
                  name="declaration"
                  checked={answers.declaration}
                  onChange={handleCheckboxChange}
                  className="rounded text-red-600 focus:ring-red-500 h-4 w-4 cursor-pointer"
                />
                <span>I have read, understood, and accept the declaration statement.</span>
              </label>

              <div className="flex justify-between pt-4 border-t">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-5 py-2.5 rounded-lg flex items-center space-x-1.5 border border-slate-300 transition-colors cursor-pointer"
                >
                  <FaArrowLeft className="w-3 h-3" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !answers.declaration}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>{submitting ? 'Evaluating...' : 'Submit Pre-screening'}</span>
                  <FaCheckCircle className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: Outcome / Result page */}
          {step === 7 && outcome && (
            <div className="space-y-6 text-center py-4">
              {outcome.outcome === 'preliminary_passed' ? (
                <div className="space-y-3">
                  <div className="inline-flex p-4 bg-emerald-100 text-emerald-600 rounded-full shadow-sm">
                    <FaCheckCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-800">Pre-Screening Passed!</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    You have successfully passed the preliminary pre-screening check. Please proceed to the camp venue on the scheduled date for physical screening (BP, hemoglobin, vitals).
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="inline-flex p-4 bg-amber-100 text-amber-600 rounded-full shadow-sm">
                    <FaExclamationTriangle className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-800">Medical Review Required</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Some responses require further assessment by medical professionals. Please inform the camp's medical staff when you arrive for a review.
                  </p>
                  
                  {outcome.flagMessages && outcome.flagMessages.length > 0 && (
                    <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 p-4 rounded-xl text-left text-xs text-slate-700 space-y-2">
                      <p className="font-bold text-slate-800">Flagged Conditions:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        {outcome.flagMessages.map((msg, i) => (
                          <li key={i}>{msg}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t pt-4 flex justify-center gap-3">
                <Link
                  to="/donor/dashboard"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-sm transition-colors inline-block"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/donor/registrations"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-6 py-2.5 rounded-lg border border-slate-300 transition-colors inline-block"
                >
                  View My Registrations
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EligibilityWizard;
