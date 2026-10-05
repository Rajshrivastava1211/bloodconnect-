import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import CampStatusBadge from '../components/CampStatusBadge';
import { FaCampground, FaTrash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const CampManagementPage = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    setLoading(true);
    try {
      const res = await api.get('/camps');
      setCamps(res.camps || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch scheduled camps.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (campId, newStatus) => {
    setError('');
    setSuccess('');
    try {
      await api.put(`/camps/${campId}`, { status: newStatus });
      setSuccess(`Camp status updated successfully.`);
      fetchCamps();
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (campId) => {
    if (!window.confirm('Are you sure you want to cancel this camp and all its slots?')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/camps/${campId}`);
      setSuccess('Camp cancelled successfully.');
      fetchCamps();
    } catch (err) {
      setError(err.message || 'Failed to cancel camp.');
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <FaCampground className="text-red-600" />
            <span>Camp Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review scheduled drives, update status states, and cancel active drives.</p>
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

        {/* Camp ledger */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-medium">Loading camps...</div>
          ) : camps.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No camps scheduled.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase">
                  <tr>
                    <th className="px-6 py-3">Camp details</th>
                    <th className="px-6 py-3">Organizer</th>
                    <th className="px-6 py-3">Venue City</th>
                    <th className="px-6 py-3">Slots filled</th>
                    <th className="px-6 py-3">Camp status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {camps.map(camp => (
                    <tr key={camp.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{camp.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{camp.date} ({camp.start_time} - {camp.end_time})</p>
                      </td>
                      <td className="px-6 py-4 font-semibold">{camp.organizer_name}</td>
                      <td className="px-6 py-4">{camp.venue}, {camp.city}</td>
                      <td className="px-6 py-4">
                        <strong className="text-slate-800">{camp.registered_count || 0}</strong>
                        <span className="text-slate-400"> / {camp.capacity} Donors</span>
                      </td>
                      <td className="px-6 py-4 space-y-1.5">
                        <CampStatusBadge status={camp.status} />
                        {camp.status !== 'cancelled' && (
                          <select
                            value={camp.status}
                            onChange={(e) => handleStatusChange(camp.id, e.target.value)}
                            className="block mt-1 border rounded p-1 text-[10px] font-bold bg-white"
                          >
                            <option value="draft">Draft</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="open">Open</option>
                            <option value="full">Full</option>
                            <option value="completed">Completed</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {camp.status !== 'cancelled' && (
                          <button
                            onClick={() => handleDelete(camp.id)}
                            className="bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-500 border rounded-lg p-1.5 transition-colors inline-flex items-center"
                            title="Cancel Camp"
                          >
                            <FaTrash className="w-3.5 h-3.5" />
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

export default CampManagementPage;
