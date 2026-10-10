
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FaHeartbeat,
  FaCalendarAlt,
  FaClipboardList,
  FaFileInvoice,
  FaBell,
  FaInfoCircle,
  FaHourglassHalf,
  FaAward
} from 'react-icons/fa';
import StatCard from '../components/StatCard';
import Sidebar from '../components/Sidebar';

const DonorDashboard = () => {
  const { user } = useAuth();

  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [bloodGroup, setBloodGroup] = useState(
    user?.blood_group || null
  );

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const requests = await Promise.allSettled([
        api.get('/registrations/my'),
        api.get('/notifications/my'),
        api.get('/donors/profile')
      ]);

      // Registrations
      if (requests[0].status === 'fulfilled') {
        const response = requests[0].value;
        setRegistrations(response.registrations || []);
      } else {
        console.error(
          'Failed to load registrations:',
          requests[0].reason
        );
      }

      // Notifications
      if (requests[1].status === 'fulfilled') {
        const response = requests[1].value;
        setNotifications(response.notifications || []);
      } else {
        console.error(
          'Failed to load notifications:',
          requests[1].reason
        );
      }

      // Blood group from the donor's saved profile
      if (requests[2].status === 'fulfilled') {
        const response = requests[2].value;
        const profile = response.profile;

        if (profile?.blood_group) {
          setBloodGroup(profile.blood_group);
        }
      } else {
        console.error(
          'Failed to load donor profile:',
          requests[2].reason
        );

        // Fall back to the authenticated user's blood group
        if (user?.blood_group) {
          setBloodGroup(user.blood_group);
        }
      }
    } catch (err) {
      console.error('Failed to load donor dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getNextDonationMessage = () => {
    const lastDonation = registrations.find(
      registration => registration.donation_status === 'donated'
    );

    if (!lastDonation) {
      return 'You are currently eligible to donate blood.';
    }

    const lastDate = new Date(lastDonation.camp_date);

    if (Number.isNaN(lastDate.getTime())) {
      return 'Check your donation history for your next eligible date.';
    }

    const nextEligibleDate = new Date(
      lastDate.getTime() + 90 * 24 * 60 * 60 * 1000
    );

    const today = new Date();

    if (today >= nextEligibleDate) {
      return 'You are currently eligible to donate blood. Find a camp and register!';
    }

    const diffTime = nextEligibleDate.getTime() - today.getTime();
    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );

    return `Next eligible date: ${nextEligibleDate.toISOString().split('T')[0]} (in ${diffDays} days).`;
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-500 font-medium">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="donor" />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Dashboard title */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Donor Dashboard
          </h1>

          <p className="text-xs text-slate-500 mt-1">
            Manage your registrations, view screening outcomes, and track donation certificates.
          </p>
        </div>

        {/* Donation eligibility information */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-950 flex items-center space-x-3 shadow-sm">
          <FaInfoCircle className="w-5 h-5 text-red-600 shrink-0" />

          <div className="space-y-0.5">
            <p className="font-bold">Voluntary Deferral Tracker</p>
            <p>{getNextDonationMessage()}</p>
          </div>
        </div>

        {/* Dashboard statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="My Blood Group"
            value={bloodGroup || 'Not set'}
            icon={FaHeartbeat}
            color="red"
          />

          <StatCard
            title="Total Registrations"
            value={registrations.length}
            icon={FaCalendarAlt}
            color="blue"
          />

          <StatCard
            title="Successful Donations"
            value={
              registrations.filter(
                registration => registration.donation_status === 'donated'
              ).length
            }
            icon={FaAward}
            color="emerald"
          />

          <StatCard
            title="Pending Screening"
            value={
              registrations.filter(
                registration => !registration.screening_outcome
              ).length
            }
            icon={FaHourglassHalf}
            color="amber"
          />
        </div>

        {/* Registrations and notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Camp registrations */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm lg:col-span-2 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
                <FaClipboardList className="text-red-500" />
                <span>My Active Camp Registrations</span>
              </h3>

              <Link
                to="/camps"
                className="text-xs text-red-600 hover:underline font-bold"
              >
                Register for new camp &rarr;
              </Link>
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
                    {registrations.slice(0, 5).map(registration => (
                      <tr
                        key={registration.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">
                            {registration.camp_name}
                          </p>

                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {registration.camp_date} | {registration.venue}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          {registration.screening_outcome ? (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                registration.screening_outcome === 'preliminary_passed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {registration.screening_outcome === 'preliminary_passed'
                                ? 'Passed'
                                : 'Needs Review'}
                            </span>
                          ) : (
                            <Link
                              to="/donor/eligibility-wizard"
                              className="text-red-600 font-bold hover:underline"
                            >
                              Complete Pre-screening
                            </Link>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="capitalize font-semibold">
                            {registration.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          {registration.donation_status === 'donated' &&
                          registration.certificate_code ? (
                            <Link
                              to={`/certificates/${registration.certificate_code}`}
                              className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm inline-flex items-center justify-center space-x-1.5 transition-colors"
                            >
                              <FaFileInvoice className="w-3 h-3" />
                              <span>Certificate</span>
                            </Link>
                          ) : (
                            <span className="text-slate-400 italic">
                              No certificate
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent notifications */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2 border-b pb-3 border-slate-100">
              <FaBell className="text-red-500" />
              <span>Recent Notifications</span>
            </h3>

            {notifications.length === 0 ? (
              <div className="text-slate-400 text-xs py-4 text-center">
                No notifications yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {notifications.slice(0, 4).map(notification => (
                  <div
                    key={notification.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] leading-relaxed text-slate-600"
                  >
                    <p>{notification.message}</p>

                    <p className="text-[9px] text-slate-400 mt-1 font-mono">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
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
