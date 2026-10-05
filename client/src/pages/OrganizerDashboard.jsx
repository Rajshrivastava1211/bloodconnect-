import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { FaPlusCircle, FaCampground, FaAward, FaUsers, FaHeartbeat, FaArrowRight, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import StatCard from '../components/StatCard';
import Sidebar from '../components/Sidebar';
import CampStatusBadge from '../components/CampStatusBadge';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    campsCount: 0,
    registeredDonors: 0,
    donatedUnits: 0,
  });
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizerStats();
  }, []);

  const fetchOrganizerStats = async () => {
    try {
      const [campsRes, globalStats] = await Promise.all([
        api.get('/camps'),
        api.get('/admin/statistics').catch(() => ({ stats: null }))
      ]);

      const ownedCamps = (campsRes.camps || []).filter(c => c.organizer_id === user.id);
      setCamps(ownedCamps);
      
      const totalRegsCount = ownedCamps.reduce((acc, c) => acc + (c.registered_count || 0), 0);
      
      setStats({
        campsCount: ownedCamps.length,
        registeredDonors: totalRegsCount,
        donatedUnits: globalStats.stats ? globalStats.stats.totalDonations : 0
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 font-medium">Loading Dashboard...</div>;
  }

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="organizer" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Mobile Navigation Bar (Visible only when sidebar is hidden) */}
        <div className="flex md:hidden space-x-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <Link to="/organizer/dashboard" className="bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-lg shrink-0">
            Dashboard
          </Link>
          <Link to="/organizer/create-camp" className="bg-white hover:bg-slate-100 text-red-600 font-bold text-xs px-4 py-2 rounded-lg border border-red-200 shrink-0 flex items-center space-x-1">
            <FaPlusCircle className="w-3 h-3" />
            <span>+ Schedule Camp</span>
          </Link>
          <Link to="/organizer/manage-camps" className="bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs px-4 py-2 rounded-lg border border-slate-300 shrink-0">
            Manage My Camps
          </Link>
        </div>

        {/* Dashboard Header with Prominent Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-100 text-red-700">
                Organizer Portal
              </span>
              <span className="text-xs text-slate-400">• Welcome, {user.name}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Organizer Dashboard</h1>
            <p className="text-xs text-slate-500">
              Schedule blood donation drives, audit donor registries, track attendance, and log collected blood units.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <Link 
              to="/organizer/create-camp" 
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
            >
              <FaPlusCircle className="w-4 h-4" />
              <span>+ Organize / Schedule Camp</span>
            </Link>
            <Link 
              to="/organizer/manage-camps" 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-300 transition-colors flex items-center space-x-1.5"
            >
              <FaCampground className="w-4 h-4 text-slate-500" />
              <span>My Camps</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="My Organized Camps" value={stats.campsCount} icon={FaCampground} color="blue" />
          <StatCard title="Donors Registered" value={stats.registeredDonors} icon={FaUsers} color="red" />
          <StatCard title="Donated Units Collected" value={stats.donatedUnits} icon={FaAward} color="emerald" />
        </div>

        {/* Quick Action Panels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-red-50 to-white rounded-2xl border-2 border-red-200 p-6 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-600 text-white rounded-xl shadow-sm">
                <FaPlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Schedule a New Donation Camp</h3>
                <p className="text-xs text-slate-500">Open a new donation drive for donor registrations</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Define the date, start/end hours, venue hall, city location, and expected donor capacity. Once created, donors can view the drive and register online.
            </p>
            <Link 
              to="/organizer/create-camp" 
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all"
            >
              <span>Launch Camp Creation Form</span>
              <FaArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:shadow-md transition-all">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-slate-800 text-white rounded-xl shadow-sm">
                <FaCampground className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Manage Scheduled Drives</h3>
                <p className="text-xs text-slate-500">Attendance, pre-screening review & certificates</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review registered donors for each camp, inspect answers flagged during online pre-screening, mark attendance present/absent, and record blood units donated.
            </p>
            <Link 
              to="/organizer/manage-camps" 
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md transition-all"
            >
              <span>Manage Camps & Registrations</span>
              <FaArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* My Camps Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <FaCampground className="text-red-500" />
              <span>My Donation Drives ({camps.length})</span>
            </h3>
            <Link to="/organizer/create-camp" className="text-xs text-red-600 hover:underline font-bold flex items-center space-x-1">
              <FaPlusCircle className="w-3 h-3" />
              <span>Schedule another camp</span>
            </Link>
          </div>

          {camps.length === 0 ? (
            <div className="p-10 text-center space-y-3">
              <p className="text-slate-500 text-sm font-medium">You haven't scheduled any donation camps yet.</p>
              <Link
                to="/organizer/create-camp"
                className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                + Schedule Your First Camp
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase">
                  <tr>
                    <th className="px-6 py-3">Camp Title</th>
                    <th className="px-6 py-3">Date & Time</th>
                    <th className="px-6 py-3">Venue & City</th>
                    <th className="px-6 py-3">Registrations</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {camps.map(camp => (
                    <tr key={camp.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-800">{camp.name}</td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-700 flex items-center space-x-1">
                          <FaCalendarAlt className="w-3 h-3 text-slate-400" />
                          <span>{camp.date}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{camp.start_time} - {camp.end_time}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center space-x-1 text-slate-700">
                          <FaMapMarkerAlt className="w-3 h-3 text-red-500 shrink-0" />
                          <span>{camp.venue}, {camp.city}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <strong className="text-slate-800 font-bold">{camp.registered_count || 0}</strong>
                        <span className="text-slate-400"> / {camp.capacity} Donors</span>
                      </td>
                      <td className="px-6 py-4">
                        <CampStatusBadge status={camp.status} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          to={`/organizer/camp/${camp.id}/registrations`}
                          className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm inline-flex items-center space-x-1 transition-colors"
                        >
                          <FaUsers className="w-3 h-3" />
                          <span>Donor Ledger</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Guide Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2 border-b pb-2 border-slate-100">
            <FaHeartbeat className="text-red-500 animate-pulse" />
            <span>Blood Drive Operational Guidelines</span>
          </h3>
          <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
            <p>1. <strong>Schedule Ahead</strong>: Publish drives at least 2 weeks in advance so donors have sufficient time to register and prepare.</p>
            <p>2. <strong>Audit Pre-Screening</strong>: Access the <strong>Donor Ledger</strong> to inspect each registrant's online questionnaire answers before drawing blood.</p>
            <p>3. <strong>Record Outcomes</strong>: Mark attendance and record the units collected. Recording a status of <strong>Donated</strong> automatically generates digital appreciation certificates for the donor.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizerDashboard;
