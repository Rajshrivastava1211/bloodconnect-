import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaCampground, FaFileInvoice, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await api.get('/registrations/my');
      setRegistrations(res.registrations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (regId) => {
    if (!window.confirm('Are you sure you want to cancel this camp registration?')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/registrations/${regId}`);
      setSuccess('Camp registration cancelled successfully.');
      fetchRegistrations();
    } catch (err) {
      setError(err.message || 'Failed to cancel registration.');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 font-medium">Loading registrations...</div>;
  }

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="donor" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Camp Registrations</h1>
          <p className="text-xs text-slate-500 mt-1">Review scheduled drives, verify pre-screening outcomes, and manage active registrations.</p>
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

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {registrations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No registrations found. <Link to="/camps" className="text-red-600 underline font-bold">Register for upcoming camps</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase">
                  <tr>
                    <th className="px-6 py-3">Camp details</th>
                    <th className="px-6 py-3">Registration Code</th>
                    <th className="px-6 py-3">Pre-screening</th>
                    <th className="px-6 py-3">Registration Status</th>
                    <th className="px-6 py-3">Donation outcome</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registrations.map(reg => (
                    <tr key={reg.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{reg.camp_name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{reg.camp_date} | {reg.venue}, {reg.city}</p>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-700">{reg.registration_code}</td>
                      <td className="px-6 py-4">
                        {reg.screening_outcome ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            reg.screening_outcome === 'preliminary_passed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {reg.screening_outcome === 'preliminary_passed' ? 'Passed' : 'Needs Review'}
                          </span>
                        ) : (
                          <Link to="/donor/eligibility-wizard" className="bg-red-50 text-red-700 px-2 py-1 rounded font-bold hover:bg-red-100 border border-red-200">Complete Pre-screening</Link>
                        )}
                      </td>
                      <td className="px-6 py-4 capitalize font-semibold">{reg.status}</td>
                      <td className="px-6 py-4">
                        {reg.donation_status ? (
                          <span className={`capitalize font-bold ${reg.donation_status === 'donated' ? 'text-emerald-700' : 'text-red-700'}`}>
                            {reg.donation_status}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">TBD at camp</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {reg.donation_status === 'donated' && reg.certificate_code ? (
                          <Link
                            to={`/certificates/${reg.certificate_code}`}
                            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm inline-flex items-center space-x-1 transition-colors"
                          >
                            <FaFileInvoice className="w-3 h-3" />
                            <span>Certificate</span>
                          </Link>
                        ) : reg.status === 'registered' && !['ongoing', 'completed', 'cancelled'].includes(reg.camp_status) ? (
                          <button
                            onClick={() => handleCancel(reg.id)}
                            className="bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-550 border rounded-lg px-2.5 py-1.5 transition-colors inline-flex items-center space-x-1"
                            title="Cancel Registration"
                          >
                            <FaTimes className="w-3 h-3" />
                            <span>Cancel</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic">No action</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyRegistrations;
