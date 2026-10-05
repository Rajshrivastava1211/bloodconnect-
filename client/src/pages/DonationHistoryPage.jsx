import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaHistory, FaAward, FaFileInvoice, FaHeartbeat } from 'react-icons/fa';

const DonationHistoryPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/donations/my')
      .then(res => setDonations(res.donations || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-slate-500 font-medium">Loading history...</div>;
  }

  const successfulDonations = donations.filter(d => d.status === 'donated');

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="donor" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Donation History</h1>
          <p className="text-xs text-slate-500 mt-1">Review all your previous successful blood donation records and view certificates.</p>
        </div>

        {/* Hero badge */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-2xl p-6 text-white flex justify-between items-center shadow">
          <div className="space-y-1">
            <h3 className="text-lg font-bold">Total Lives Touched</h3>
            <p className="text-xs text-red-100">Every donation helps save up to three lives. Thank you for your support!</p>
          </div>
          <div className="flex items-center space-x-2 shrink-0">
            <span className="text-3xl font-black">{successfulDonations.length}</span>
            <FaAward className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        {/* Donations listing */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {donations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No donation records logged yet. After you attend a camp and donate, organizers will record it here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase">
                  <tr>
                    <th className="px-6 py-3">Donation Date</th>
                    <th className="px-6 py-3">Camp details</th>
                    <th className="px-6 py-3 text-center">Volume Collected</th>
                    <th className="px-6 py-3">Donation Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donations.map(don => (
                    <tr key={don.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-800">{don.camp_date}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{don.camp_name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{don.venue}, {don.city}</p>
                      </td>
                      <td className="px-6 py-4 text-center font-bold">{don.units_donated} Unit(s)</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          don.status === 'donated' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {don.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {don.status === 'donated' && don.certificate_code ? (
                          <Link
                            to={`/certificates/${don.certificate_code}`}
                            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm inline-flex items-center space-x-1.5 transition-colors"
                          >
                            <FaFileInvoice className="w-3.5 h-3.5" />
                            <span>Certificate</span>
                          </Link>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
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

export default DonationHistoryPage;
