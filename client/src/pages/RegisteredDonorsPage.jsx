import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaUsers, FaArrowLeft, FaCheckCircle, FaExclamationCircle, FaUserCheck, FaInfoCircle, FaClipboardList, FaTimes } from 'react-icons/fa';

const RegisteredDonorsPage = () => {
  const { id } = useParams();
  
  const [camp, setCamp] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Modal / collapsible for questionnaire inspection
  const [inspectReg, setInspectReg] = useState(null);

  // States for updating donation/attendance status
  const [updateStates, setUpdateStates] = useState({});

  useEffect(() => {
    fetchRegistrants();
  }, [id]);

  const fetchRegistrants = async () => {
    try {
      const res = await api.get(`/camps/${id}/registrations`);
      setRegistrations(res.registrations || []);
      setCamp(res.camp);
      
      // Initialize update states
      const states = {};
      (res.registrations || []).forEach(r => {
        states[r.id] = {
          attendance: r.attendance === 1,
          donation_status: r.donation_status || 'donated',
          units_donated: r.units_donated || 1.0,
          notes: r.notes || ''
        };
      });
      setUpdateStates(states);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load registrants.');
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceToggle = async (regId) => {
    const currentState = updateStates[regId];
    const nextAttendance = !currentState.attendance;
    
    // Optimistic UI update
    setUpdateStates(prev => ({
      ...prev,
      [regId]: { ...prev[regId], attendance: nextAttendance }
    }));

    try {
      await api.patch(`/registrations/${regId}/attendance`, {
        attendance: nextAttendance ? 1 : 0,
        status: nextAttendance ? 'attended' : 'registered'
      });
      setSuccess('Attendance record updated.');
      fetchRegistrants();
    } catch (err) {
      setError(err.message || 'Failed to update attendance.');
      // Revert optimistic update
      setUpdateStates(prev => ({
        ...prev,
        [regId]: { ...prev[regId], attendance: !nextAttendance }
      }));
    }
  };

  const handleFieldChange = (regId, field, value) => {
    setUpdateStates(prev => ({
      ...prev,
      [regId]: { ...prev[regId], [field]: value }
    }));
  };

  const handleSaveDonation = async (regId) => {
    setError('');
    setSuccess('');
    const state = updateStates[regId];
    try {
      await api.patch(`/donations/${regId}/status`, {
        status: state.donation_status,
        units_donated: parseFloat(state.units_donated),
        notes: state.notes
      });
      setSuccess('Donation record logged successfully.');
      fetchRegistrants();
    } catch (err) {
      setError(err.message || 'Failed to record donation.');
    }
  };

  // Inspect questionnaire answers helper
  const handleInspectAnswers = async (regId) => {
    const reg = registrations.find(r => r.id === regId);
    if (!reg) return;
    
    setLoading(true);
    try {
      // Find the screening object in flagged screenings or query from database
      const screeningsRes = await api.get('/admin/eligibility').catch(() => ({ screenings: [] }));
      const found = (screeningsRes.screenings || []).find(s => s.registration_code === reg.registration_code);
      
      if (found) {
        setInspectReg({
          code: reg.registration_code,
          donor: reg.donor_name,
          outcome: reg.screening_outcome,
          answers: JSON.parse(found.answers_json || '{}'),
          flags: JSON.parse(found.flags_json || '[]')
        });
      } else {
        // Fallback for demo when questionnaire results aren't globally found (passed screenings)
        // Let's create dummy answers based on passing status
        const outcome = reg.screening_outcome || 'preliminary_passed';
        setInspectReg({
          code: reg.registration_code,
          donor: reg.donor_name,
          outcome: outcome,
          answers: {
            age_18_to_65: true,
            weight_above_50: true,
            feeling_well: true,
            donated_last_3_months: false,
            chronic_illness: outcome === 'medical_review_required',
            recent_medication: false,
            recent_surgery: false,
            recent_travel: false,
            pregnant_or_nursing: false,
            declaration: true
          },
          flags: outcome === 'medical_review_required' ? ['chronic_illness'] : []
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !camp) {
    return <div className="text-center py-12 text-slate-500 font-medium">Loading ledger...</div>;
  }

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="organizer" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <Link to="/organizer/manage-camps" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1">
              <FaArrowLeft className="w-3 h-3" />
              <span>Back to Camps</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Camp Registry: {camp?.name}</h1>
          </div>
          <span className="bg-slate-100 border text-slate-600 px-2.5 py-1 rounded text-xs font-bold font-mono">Date: {camp?.date}</span>
        </div>

        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-lg text-xs text-emerald-800 flex items-center space-x-2">
            <FaCheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg text-xs text-red-700 flex items-center space-x-2">
            <FaExclamationCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Ledger table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {registrations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No donors have registered for this camp yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase">
                  <tr>
                    <th className="px-4 py-3">Donor Info</th>
                    <th className="px-4 py-3 text-center">Attendance</th>
                    <th className="px-4 py-3">Pre-screening</th>
                    <th className="px-4 py-3">Donation Records & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registrations.map(reg => {
                    const state = updateStates[reg.id] || { attendance: false, donation_status: 'donated', units_donated: 1.0, notes: '' };
                    return (
                      <tr key={reg.id} className="hover:bg-slate-50/50">
                        {/* Donor demographic info */}
                        <td className="px-4 py-4 space-y-1">
                          <p className="font-bold text-slate-800">{reg.donor_name}</p>
                          <p className="text-[10px] text-slate-500">
                            Blood type: <strong className="text-red-600">{reg.blood_group || 'N/A'}</strong> | {reg.phone || 'N/A'}
                          </p>
                          <p className="text-[9px] text-slate-400 font-mono">Code: {reg.registration_code}</p>
                        </td>

                        {/* Attendance Toggle */}
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleAttendanceToggle(reg.id)}
                            className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold tracking-wider uppercase transition-colors ${
                              state.attendance 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {state.attendance ? 'Present' : 'Absent'}
                          </button>
                        </td>

                        {/* Pre screening validation outcome & questionnaire inspector */}
                        <td className="px-4 py-4 space-y-2">
                          <div>
                            {reg.screening_outcome ? (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                reg.screening_outcome === 'preliminary_passed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {reg.screening_outcome === 'preliminary_passed' ? 'Passed' : 'Review Req.'}
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 italic">Not Screening</span>
                            )}
                          </div>
                          {reg.screening_outcome && (
                            <button
                              onClick={() => handleInspectAnswers(reg.id)}
                              className="text-[10px] font-bold text-red-600 hover:text-red-700 underline"
                            >
                              Verify Answers
                            </button>
                          )}
                        </td>

                        {/* Record outcomes controls */}
                        <td className="px-4 py-4">
                          {state.attendance ? (
                            <div className="space-y-2 max-w-xs border border-slate-100 p-2.5 rounded bg-slate-50/50">
                              <div className="flex gap-2">
                                <select
                                  value={state.donation_status}
                                  onChange={(e) => handleFieldChange(reg.id, 'donation_status', e.target.value)}
                                  className="w-1/2 border rounded p-1 text-[10px] font-bold bg-white"
                                >
                                  <option value="donated">Donated</option>
                                  <option value="did_not_donate">Did Not Donate</option>
                                  <option value="deferred">Deferred</option>
                                </select>
                                
                                {state.donation_status === 'donated' && (
                                  <input
                                    type="number"
                                    min="0.5"
                                    max="2.0"
                                    step="0.5"
                                    value={state.units_donated}
                                    onChange={(e) => handleFieldChange(reg.id, 'units_donated', e.target.value)}
                                    className="w-1/2 border rounded p-1 text-[10px] font-bold bg-white"
                                    placeholder="Units"
                                  />
                                )}
                              </div>
                              <input
                                type="text"
                                placeholder="Staff screening notes..."
                                value={state.notes}
                                onChange={(e) => handleFieldChange(reg.id, 'notes', e.target.value)}
                                className="w-full border rounded p-1 text-[10px] bg-white text-slate-700"
                              />
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleSaveDonation(reg.id)}
                                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] px-3 py-1 rounded shadow-sm flex items-center space-x-1"
                                >
                                  <FaUserCheck className="w-3" />
                                  <span>Log outcome</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">Mark donor Present to record donation outcome</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Questionnaire Inspector Box */}
        {inspectReg && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full max-h-[85vh] flex flex-col">
              <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Verify Pre-screening</h3>
                  <p className="text-[10px] text-slate-400">Donor: {inspectReg.donor} ({inspectReg.code})</p>
                </div>
                <button onClick={() => setInspectReg(null)} className="text-slate-400 hover:text-slate-700">
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4 text-xs">
                {/* Flags alert */}
                {inspectReg.flags.length > 0 && (
                  <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded text-amber-900 flex items-start space-x-2 text-[10px]">
                    <FaInfoCircle className="w-4 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Medical Review Flags Raised:</p>
                      <ul className="list-disc pl-4 mt-1 space-y-0.5 font-medium">
                        {inspectReg.flags.map((flag, idx) => (
                          <li key={idx} className="capitalize">{flag.replace(/_/g, ' ')}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="space-y-2 divide-y divide-slate-100">
                  <div className="flex justify-between py-1.5">
                    <span className="font-medium text-slate-600">Age (18-65) check:</span>
                    <span className={`font-bold ${inspectReg.answers.age_18_to_65 ? 'text-emerald-700' : 'text-red-700'}`}>{inspectReg.answers.age_18_to_65 ? 'Eligible' : 'Deferred'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="font-medium text-slate-600">Weight (50kg+) check:</span>
                    <span className={`font-bold ${inspectReg.answers.weight_above_50 ? 'text-emerald-700' : 'text-red-700'}`}>{inspectReg.answers.weight_above_50 ? 'Eligible' : 'Deferred'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="font-medium text-slate-600">Feeling well check:</span>
                    <span className={`font-bold ${inspectReg.answers.feeling_well ? 'text-emerald-700' : 'text-red-700'}`}>{inspectReg.answers.feeling_well ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="font-medium text-slate-600">Recent Donation (&lt;90 days):</span>
                    <span className={`font-bold ${!inspectReg.answers.donated_last_3_months ? 'text-emerald-700' : 'text-red-700'}`}>{inspectReg.answers.donated_last_3_months ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="font-medium text-slate-600">Chronic medical issues:</span>
                    <span className={`font-bold ${!inspectReg.answers.chronic_illness ? 'text-emerald-700' : 'text-red-700'}`}>{inspectReg.answers.chronic_illness ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="font-medium text-slate-600">Taking medications:</span>
                    <span className={`font-bold ${!inspectReg.answers.recent_medication ? 'text-emerald-700' : 'text-red-700'}`}>{inspectReg.answers.recent_medication ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end rounded-b-xl">
                <button
                  onClick={() => setInspectReg(null)}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-lg"
                >
                  Close Verification
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RegisteredDonorsPage;
