import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaHeartbeat, FaCalendarAlt, FaClipboardList, FaFileInvoice, FaBell, FaInfoCircle, FaHourglassHalf, FaAward } from 'react-icons/fa';
import StatCard from '../components/StatCard';
import Sidebar from '../components/Sidebar';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [regRes, notifRes] = await Promise.all([
        api.get('/registrations/my'),
        api.get('/notifications/my')
      ]);
      setRegistrations(regRes.registrations || []);
      setNotifications(notifRes.notifications || []);
    } catch (err) {
      console.error('Failed to load donor dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getNextDonationMessage = () => {
    // Basic calculation if they have a last donation date
    const lastDonation = registrations.find(r => r.donation_status === 'donated');
    if (!lastDonation) return 'You are currently eligible to donate blood.';
    
    const lastDate = new Date(lastDonation.camp_date);
    const nextEligibleDate = new Date(lastDate.getTime() + 90 * 24 * 60 * 60 * 1000); // +90 days
    const today = new Date();

    if (today >= nextEligibleDate) {
      return 'You are currently eligible to donate blood. Find a camp and register!';
    } else {
      const diffTime = Math.abs(nextEligibleDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `Next eligible date: ${nextEligibleDate.toISOString().split('T')[0]} (in ${diffDays} days).`;
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 font-medium">Loading Dashboard...</div>;
  }

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="donor" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Donor Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your registrations, view screening outcomes, and track donation certificates.</p>
        </div>

        {/* Next Donation Info */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-950 flex items-center space-x-3 shadow-sm">
          <FaInfoCircle className="w-5 h-5 text-red-600 shrink-0" />
          <div className="space-y-0.5">
            <p className="font-bold">Voluntary Deferral Tracker</p>
            <p>{getNextDonationMessage()}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard title="My Blood Group" value={user.blood_group || 'O+'} icon={FaHeartbeat} color="red" />
          <StatCard title="Total Registrations" value={registrations.length} icon={FaCalendarAlt} color="blue" />
          <StatCard title="Successful Donations" value={registrations.filter(r => r.donation_status === 'donated').length} icon={FaAward} color="emerald" />
          <StatCard title="Pending Screening" value={registrations.filter(r => !r.screening_outcome).length} icon={FaHourglassHalf} color="amber" />
        </div>

        {/* Content split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main registrations table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm lg:col-span-2 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                <FaClipboardList className="text-red-500" />
                <span>My Active Camp Registrations</span>
              </h3>
              <Link to="/camps" className="text-xs text-red-600 hover:underline font-bold">Register for new camp &rarr;</Link>
            </div>

            {registrations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                You haven't registered for any donation drives yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left text-slate-600">
                  <thead className="bg-slate-50 text-slate-700 uppercase">
                    <tr>
                      <th className="px-6 py-3">Camp details</th>
                      <th className="px-6 py-3">Pre-screening</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registrations.slice(0, 5).map(reg => (
                      <tr key={reg.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{reg.camp_name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{reg.camp_date} | {reg.venue}</p>
                        </td>
                        <td className="px-6 py-4">
                          {reg.screening_outcome ? (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              reg.screening_outcome === 'preliminary_passed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {reg.screening_outcome === 'preliminary_passed' ? 'Passed' : 'Needs Review'}
                            </span>
                          ) : (
                            <Link to="/donor/eligibility-wizard" className="text-red-600 font-bold hover:underline">Complete Pre-screening</Link>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="capitalize font-semibold">{reg.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {reg.donation_status === 'donated' && reg.certificate_code ? (
                            <Link
                              to={`/certificates/${reg.certificate_code}`}
                              className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm flex items-center justify-center space-x-1.5 transition-colors"
                            >
                              <FaFileInvoice className="w-3 h-3" />
                              <span>Certificate</span>
                            </Link>
                          ) : (
                            <span className="text-slate-400 italic">No certificate</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quick Notifications sidebar */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2 border-b pb-3 border-slate-100">
              <FaBell className="text-red-500" />
              <span>Recent Notifications</span>
            </h3>

            {notifications.length === 0 ? (
              <div className="text-slate-400 text-xs py-4 text-center">No notifications yet.</div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {notifications.slice(0, 4).map(notif => (
                  <div key={notif.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] leading-relaxed text-slate-600">
                    <p>{notif.message}</p>
                    <p className="text-[9px] text-slate-400 mt-1 font-mono">{new Date(notif.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DonorDashboard;
