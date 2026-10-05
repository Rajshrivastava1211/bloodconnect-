import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaClipboardList, FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const RegistrationManagementPage = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports'); // reports endpoint returns detailed camp registrations metadata
      // Wait, let's look at the database to see registrations
      // Let's create a custom select query on registrations via backend admin stats endpoint
      // Or pull from reports
      const statsRes = await api.get('/admin/statistics');
      const campsRes = await api.get('/camps');
      
      // Let's pull all registrations from active camps
      const allRegs = [];
      const camps = campsRes.camps || [];
      for (const camp of camps) {
        const campRegs = await api.get(`/camps/${camp.id}/registrations`).catch(() => ({ registrations: [] }));
        (campRegs.registrations || []).forEach(r => {
          allRegs.push({
            ...r,
            camp_name: camp.name,
            camp_date: camp.date,
            camp_id: camp.id
          });
        });
      }
      setRegistrations(allRegs);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch registrations.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (regId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;
    setError('');
    setSuccess('');
    try {
      await api.patch(`/registrations/${regId}/attendance`, { status: 'cancelled' });
      setSuccess('Registration cancelled successfully.');
      fetchRegistrations();
    } catch (err) {
      setError(err.message || 'Failed to cancel registration.');
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <FaClipboardList className="text-red-600" />
            <span>Registration Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review registrations, audit pre-screening outcomes, and cancel slots.</p>
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
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-medium">Loading registrations...</div>
          ) : registrations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No registrations active.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase">
                  <tr>
                    <th className="px-6 py-3">Donor Info</th>
                    <th className="px-6 py-3">Camp Name</th>
                    <th className="px-6 py-3">Reg Code</th>
                    <th className="px-6 py-3">Screening</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registrations.map(reg => (
                    <tr key={reg.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{reg.donor_name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{reg.donor_email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{reg.camp_name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{reg.camp_date}</p>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold">{reg.registration_code}</td>
                      <td className="px-6 py-4">
                        {reg.screening_outcome ? (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            reg.screening_outcome === 'preliminary_passed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {reg.screening_outcome === 'preliminary_passed' ? 'Passed' : 'Review'}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 capitalize font-semibold">{reg.status}</td>
                      <td className="px-6 py-4 text-right">
                        {reg.status === 'registered' && (
                          <button
                            onClick={() => handleCancelRegistration(reg.id)}
                            className="bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-500 border rounded-lg p-1.5 transition-colors inline-flex items-center"
                            title="Cancel Registration"
                          >
                            <FaTimes className="w-3.5 h-3.5" />
                          </button>
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

export default RegistrationManagementPage;
