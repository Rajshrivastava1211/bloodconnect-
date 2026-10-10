import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHeartbeat, FaSearch, FaUserPlus, FaCheckCircle, FaHospital, 
  FaQuestionCircle, FaAward, FaShieldAlt, FaUtensils, FaHandsHelping, FaArrowRight,
  FaPlusCircle, FaCampground, FaTachometerAlt
} from 'react-icons/fa';
import api from '../services/api';
import CampCard from '../components/CampCard';

const Home = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    donors: 0,
    organizers: 0,
    activeCamps: 0,
    totalDonations: 0
  });
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch public stats and open camps
    Promise.all([
      api.get('/stats/public').catch(() => ({ stats: null })),
      api.get('/camps').catch(() => ({ camps: [] }))
    ]).then(([statsRes, campsRes]) => {
      if (statsRes && statsRes.stats) {
        setStats(statsRes.stats);
      }
      if (campsRes && campsRes.camps) {
        setCamps(campsRes.camps.slice(0, 3));
      }
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section */}
      <div className="bg-gradient-to-r from-red-800 via-red-600 to-red-500 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 z-10">
            <span className="inline-flex items-center space-x-2 bg-red-900/50 backdrop-blur-sm border border-red-400/30 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-red-100">
              <FaHeartbeat className="animate-pulse text-red-300" />
              <span>Blood Donation Camp Portal</span>
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Donate Blood.<br />
              Save Lives.
            </h1>
            <p className="text-lg text-red-100 leading-relaxed max-w-xl">
              BloodConnect connects voluntary blood donors, donation camp organizers, and hospitals across cities. Register for upcoming camps, complete preliminary pre-screening online, and track your donation impact.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              {user?.role === 'organizer' ? (
                <>
                  <Link
                    to="/organizer/create-camp"
                    className="bg-white text-red-700 hover:bg-red-50 font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center space-x-2"
                  >
                    <FaPlusCircle className="w-4 h-4 text-red-600" />
                    <span>+ Organize a Donation Camp</span>
                  </Link>
                  <Link
                    to="/organizer/manage-camps"
                    className="bg-red-950/40 hover:bg-red-950/60 border border-red-300/40 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center space-x-2"
                  >
                    <FaCampground className="w-4 h-4" />
                    <span>Manage My Camps</span>
                  </Link>
                  <Link
                    to="/organizer/dashboard"
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm px-4 py-3.5 rounded-xl transition-all flex items-center space-x-2"
                  >
                    <FaTachometerAlt className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </>
              ) : user?.role === 'admin' ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="bg-white text-red-700 hover:bg-red-50 font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center space-x-2"
                  >
                    <FaTachometerAlt className="w-4 h-4 text-red-600" />
                    <span>Admin Console</span>
                  </Link>
                  <Link
                    to="/camps"
                    className="bg-red-950/40 hover:bg-red-950/60 border border-red-300/40 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center space-x-2"
                  >
                    <FaSearch className="w-4 h-4" />
                    <span>Browse All Camps</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/camps"
                    className="bg-white text-red-700 hover:bg-red-50 font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center space-x-2"
                  >
                    <FaSearch />
                    <span>Find a Donation Camp</span>
                  </Link>
                  {user ? (
                    <Link
                      to="/donor/dashboard"
                      className="bg-red-950/40 hover:bg-red-950/60 border border-red-300/40 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center space-x-2"
                    >
                      <FaTachometerAlt />
                      <span>My Donor Dashboard</span>
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      className="bg-red-950/40 hover:bg-red-950/60 border border-red-300/40 text-white font-bold text-sm px-6 py-3.5 rounded-xl transition-all flex items-center space-x-2"
                    >
                      <FaUserPlus />
                      <span>Become a Donor</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="hidden lg:flex justify-center relative">
            <div className="w-80 h-80 bg-red-900/30 rounded-full border border-red-300/20 flex items-center justify-center backdrop-blur-sm relative">
              <div className="w-60 h-60 bg-red-600/20 rounded-full animate-ping absolute"></div>
              <FaHeartbeat className="w-40 h-40 text-red-100 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Statistics Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 z-20 relative">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="p-2">
              <p className="text-4xl font-black text-red-600">{stats.donors}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Registered Donors</p>
            </div>
            <div className="p-2 pt-4 md:pt-2">
              <p className="text-4xl font-black text-red-600">{stats.activeCamps}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Active Camps</p>
            </div>
            <div className="p-2 pt-4 md:pt-2">
              <p className="text-4xl font-black text-red-600">{stats.totalDonations}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Successful Donations</p>
            </div>
            <div className="p-2 pt-4 md:pt-2">
              <p className="text-4xl font-black text-red-600">{stats.organizers}</p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Camp Organizers</p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. How BloodConnect Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">How BloodConnect Works</h2>
          <p className="text-sm text-slate-600">A seamless 4-step process designed for safety and efficiency.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg">1</div>
            <h3 className="font-bold text-slate-800 text-base">Register & Search</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Create a donor account and discover blood donation camps in your city.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg">2</div>
            <h3 className="font-bold text-slate-800 text-base">Pre-Screen Online</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Complete our 6-step online eligibility wizard before heading to the venue.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg">3</div>
            <h3 className="font-bold text-slate-800 text-base">Donate at Camp</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Undergo final medical screening by qualified staff and give blood safely.</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 relative">
            <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-lg">4</div>
            <h3 className="font-bold text-slate-800 text-base">Get Certificate</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Receive a digital certificate of appreciation and track your donation history.</p>
          </div>
        </div>
      </div>

      {/* 4. Upcoming Camps Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Donation Camps</h2>
            <p className="text-sm text-slate-600 mt-1">Register now for upcoming blood drives near you.</p>
          </div>
          <Link to="/camps" className="text-red-600 hover:text-red-700 font-bold text-sm flex items-center space-x-1">
            <span>View All Camps</span>
            <FaArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {camps.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
            <p className="text-sm font-medium">No open camps listed right now.</p>
            <Link to="/camps" className="text-xs text-red-600 underline font-semibold mt-1 inline-block">Browse all camps</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {camps.map(camp => (
              <CampCard key={camp.id} camp={camp} />
            ))}
          </div>
        )}
      </div>

      {/* 5. Blood Group Compatibility Reference */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-4">
          <h2 className="text-3xl font-extrabold text-slate-900">Why Donate Blood?</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Blood cannot be manufactured synthetically; it can only come as a gift from generous volunteer donors. Every two seconds, someone in India needs blood due to surgeries, trauma, cancer treatment, or chronic blood disorders.
          </p>
          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3">
              <FaCheckCircle className="text-red-600 w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Save Up to 3 Lives</h4>
                <p className="text-xs text-slate-500">One whole blood donation can be separated into red cells, platelets, and plasma to help multiple patients.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaCheckCircle className="text-red-600 w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Free Mini Health Checkup</h4>
                <p className="text-xs text-slate-500">Every donation includes a check of pulse, blood pressure, temperature, and hemoglobin levels.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <FaCheckCircle className="text-red-600 w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Stimulate Blood Cell Production</h4>
                <p className="text-xs text-slate-500">Donating stimulates bone marrow to produce fresh, new blood cells.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center space-x-2">
            <FaAward className="text-red-600" />
            <span>Blood Type Compatibility Chart</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="px-3 py-2">Blood Type</th>
                  <th className="px-3 py-2">Can Donate To</th>
                  <th className="px-3 py-2">Can Receive From</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr><td className="px-3 py-2 font-bold text-red-600">O-</td><td className="px-3 py-2">Everyone (Universal)</td><td className="px-3 py-2">O-</td></tr>
                <tr><td className="px-3 py-2 font-bold text-red-600">O+</td><td className="px-3 py-2">O+, A+, B+, AB+</td><td className="px-3 py-2">O+, O-</td></tr>
                <tr><td className="px-3 py-2 font-bold text-red-600">A+</td><td className="px-3 py-2">A+, AB+</td><td className="px-3 py-2">A+, A-, O+, O-</td></tr>
                <tr><td className="px-3 py-2 font-bold text-red-600">B+</td><td className="px-3 py-2">B+, AB+</td><td className="px-3 py-2">B+, B-, O+, O-</td></tr>
                <tr><td className="px-3 py-2 font-bold text-red-600">AB+</td><td className="px-3 py-2">AB+ Only</td><td className="px-3 py-2">Everyone (Universal Recipient)</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 6. Donation Preparation Tips */}
      <div className="bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-extrabold text-slate-900">Donation Day Tips</h2>
            <p className="text-xs text-slate-600 mt-1">Simple precautions for a smooth and comfortable donation experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
              <FaUtensils className="text-emerald-600 w-5 h-5" />
              <h4 className="font-bold text-slate-800 text-sm">Eat Healthy</h4>
              <p className="text-xs text-slate-500">Eat a low-fat, iron-rich meal 2-3 hours before donating. Avoid fatty foods or donating on an empty stomach.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
              <FaShieldAlt className="text-blue-600 w-5 h-5" />
              <h4 className="font-bold text-slate-800 text-sm">Stay Hydrated</h4>
              <p className="text-xs text-slate-500">Drink an extra 500ml of water or fruit juice before your appointment to keep fluid levels stable.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-2">
              <FaHandsHelping className="text-purple-600 w-5 h-5" />
              <h4 className="font-bold text-slate-800 text-sm">Rest & Relax</h4>
              <p className="text-xs text-slate-500">Get 7-8 hours of sleep the night before. Rest for 10-15 minutes at the camp after donating while enjoying snacks.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Final Call to Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-600 rounded-2xl text-white p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-extrabold">Ready to Make a Difference?</h3>
            <p className="text-red-100 text-sm">Register today as a donor or find a blood donation camp in your city.</p>
          </div>
          <div className="flex space-x-3 shrink-0">
            <Link to="/register" className="bg-white text-red-700 hover:bg-red-50 font-bold text-sm px-6 py-3 rounded-xl shadow transition-colors">Register as Donor</Link>
            <Link to="/camps" className="bg-red-800 hover:bg-red-900 text-white font-bold text-sm px-6 py-3 rounded-xl border border-red-400 transition-colors">Find Camp</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
