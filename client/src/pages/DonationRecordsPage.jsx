import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaHistory, FaFileInvoice, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const DonationRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      // Fetch detailed reports containing donation outcomes
      const res = await api.get('/admin/statistics');
      const recs = res.recentDonations || [];
      
      // If empty, let's create a backup fetch from camps registrants
      if (recs.length === 0) {
        const campsRes = await api.get('/camps');
        const camps = campsRes.camps || [];
        const donationLogs = [];
        for (const camp of camps) {
          const campRegs = await api.get(`/camps/${camp.id}/registrations`).catch(() => ({ registrations: [] }));
          (campRegs.registrations || []).forEach(r => {
            if (r.donation_status) {
              donationLogs.push({
                id: r.id,
                donorName: r.donor_name,
                bloodGroup: r.blood_group,
                campName: camp.name,
                donationDate: camp.date,
                units: r.units_donated || 1.0,
                status: r.donation_status,
                certificateCode: r.certificate_code
              });
            }
          });
        }
        setRecords(donationLogs);
      } else {
        setRecords(recs);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch donation records.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <FaHistory className="text-red-600" />
            <span>Donation Records</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Verify donation outcomes, collected blood volumes, and active certificates.</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg text-xs text-red-700 flex items-center space-x-2">
            <FaExclamationCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-medium">Loading donation records...</div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No donation records registered.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-3">Donor Name</th>
                    <th className="px-6 py-3">Blood Group</th>
                    <th className="px-6 py-3">Camp Drive</th>
                    <th className="px-6 py-3 text-center">Units Donated</th>
                    <th className="px-6 py-3">Donation Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {records.map(rec => (
                    <tr key={rec.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-800">{rec.donorName}</td>
                      <td className="px-6 py-4 font-extrabold text-red-600">{rec.bloodGroup}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold">{rec.campName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{rec.donationDate || rec.camp_date}</p>
                      </td>
                      <td className="px-6 py-4 text-center font-bold">{rec.units || rec.units_donated} Unit(s)</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 font-bold rounded-full ${
                          (rec.status || 'donated') === 'donated' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-300'
                        }`}>
                          {rec.status || 'donated'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {(rec.certificateCode || rec.certificate_code) ? (
                          <Link
                            to={`/certificates/${rec.certificateCode || rec.certificate_code}`}
                            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm inline-flex items-center space-x-1.5 transition-colors"
                          >
                            <FaFileInvoice className="w-3 h-3" />
                            <span>Certificate</span>
                          </Link>
                        ) : (
                          <span className="text-slate-400 italic">No Certificate</span>
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

export default DonationRecordsPage;
