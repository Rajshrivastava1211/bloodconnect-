import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FaHeartbeat, FaUser, FaEnvelope, FaLock, FaPhone,
  FaCalendarAlt, FaCity, FaMapMarkerAlt, FaBuilding, FaTint
} from 'react-icons/fa';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('donor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [donorData, setDonorData] = useState({
    name: '', email: '', password: '', phone: '',
    blood_group: 'O+', dob: '', gender: 'male', city: '', address: ''
  });

  const [organizerData, setOrganizerData] = useState({
    name: '', email: '', password: '', phone: '', organization: '', city: ''
  });

  const handleDonorChange = (e) => setDonorData({ ...donorData, [e.target.name]: e.target.value });
  const handleOrganizerChange = (e) => setOrganizerData({ ...organizerData, [e.target.name]: e.target.value });

  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (donorData.dob) {
      const birthDate = new Date(donorData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      if (age < 18 || age > 65) { setError('Donor age must be between 18 and 65 years.'); return; }
    }
    setLoading(true);
    try {
      await register(donorData);
      navigate('/donor/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizerSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (organizerData.password.length < 6) {
    setError('Password must be at least 6 characters.');
    return;
  }

  setLoading(true);

  try {
    const res = await api.post('/auth/register-organizer', organizerData);

    // api.js already returns response.data
    if (res.token) {
      localStorage.setItem('token', res.token);

      if (res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
      }

      navigate('/organizer/dashboard');
    } else {
      setError(res.message || 'Registration failed.');
    }
  } catch (err) {
    setError(err.message || 'Registration failed.');
  } finally {
    setLoading(false);
  }
};

  const inputClass = (color = 'red') =>
    `w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-${color}-400 outline-none`;

  return (
    <div className="min-h-[calc(100vh-4rem-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-2xl w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-red-600 rounded-xl text-white shadow">
            <FaHeartbeat className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Create Your Account</h2>
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-red-600 hover:underline">Log In</Link>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl overflow-hidden border border-slate-200">
          <button type="button" onClick={() => { setActiveTab('donor'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${
              activeTab === 'donor' ? 'bg-red-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}>
            <FaTint className="w-4 h-4" /> Register as Donor
          </button>
          <button type="button" onClick={() => { setActiveTab('organizer'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${
              activeTab === 'organizer' ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}>
            <FaBuilding className="w-4 h-4" /> Register as Organizer
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg text-xs text-red-700">{error}</div>
        )}

        {/* DONOR FORM */}
        {activeTab === 'donor' && (
          <form onSubmit={handleDonorSubmit} className="space-y-4">
            <p className="text-xs text-slate-500 bg-red-50 border border-red-100 rounded-lg p-3">
              🩸 <strong>Donor Registration:</strong> Find camps, track donations, and earn certificates.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Full Name</label>
                <div className="relative mt-1">
                  <FaUser className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                  <input type="text" name="name" required value={donorData.name} onChange={handleDonorChange}
                    placeholder="John Doe" className={inputClass('red')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Email Address</label>
                <div className="relative mt-1">
                  <FaEnvelope className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                  <input type="email" name="email" required value={donorData.email} onChange={handleDonorChange}
                    placeholder="john@example.com" className={inputClass('red')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Password</label>
                <div className="relative mt-1">
                  <FaLock className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                  <input type="password" name="password" required value={donorData.password} onChange={handleDonorChange}
                    placeholder="Min 6 characters" className={inputClass('red')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Phone Number</label>
                <div className="relative mt-1">
                  <FaPhone className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                  <input type="text" name="phone" required value={donorData.phone} onChange={handleDonorChange}
                    placeholder="9876543210" className={inputClass('red')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Date of Birth</label>
                <div className="relative mt-1">
                  <FaCalendarAlt className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                  <input type="date" name="dob" required value={donorData.dob} onChange={handleDonorChange}
                    className={inputClass('red')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Blood Group</label>
                <select name="blood_group" value={donorData.blood_group} onChange={handleDonorChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-red-400 outline-none">
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Gender</label>
                <select name="gender" value={donorData.gender} onChange={handleDonorChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-red-400 outline-none">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">City</label>
                <div className="relative mt-1">
                  <FaCity className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                  <input type="text" name="city" required value={donorData.city} onChange={handleDonorChange}
                    placeholder="e.g. Mumbai" className={inputClass('red')} />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Address</label>
              <div className="relative mt-1">
                <FaMapMarkerAlt className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                <textarea name="address" required value={donorData.address} onChange={handleDonorChange}
                  placeholder="Full address details" rows={2}
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-400 outline-none" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 rounded-lg shadow-md transition-colors disabled:opacity-50">
              {loading ? 'Registering...' : '🩸 Register as Donor'}
            </button>
          </form>
        )}

        {/* ORGANIZER FORM */}
        {activeTab === 'organizer' && (
          <form onSubmit={handleOrganizerSubmit} className="space-y-4">
            <p className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-lg p-3">
              🏥 <strong>Organizer Registration:</strong> Create and manage blood donation camps, track donations, and coordinate volunteers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Full Name</label>
                <div className="relative mt-1">
                  <FaUser className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                  <input type="text" name="name" required value={organizerData.name} onChange={handleOrganizerChange}
                    placeholder="Your Name" className={inputClass('blue')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Email Address</label>
                <div className="relative mt-1">
                  <FaEnvelope className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                  <input type="email" name="email" required value={organizerData.email} onChange={handleOrganizerChange}
                    placeholder="you@organization.com" className={inputClass('blue')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Password</label>
                <div className="relative mt-1">
                  <FaLock className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                  <input type="password" name="password" required value={organizerData.password} onChange={handleOrganizerChange}
                    placeholder="Min 6 characters" className={inputClass('blue')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Phone Number</label>
                <div className="relative mt-1">
                  <FaPhone className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                  <input type="text" name="phone" value={organizerData.phone} onChange={handleOrganizerChange}
                    placeholder="9876543210" className={inputClass('blue')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Organization / Hospital Name</label>
                <div className="relative mt-1">
                  <FaBuilding className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                  <input type="text" name="organization" value={organizerData.organization} onChange={handleOrganizerChange}
                    placeholder="e.g. City Hospital, Red Cross" className={inputClass('blue')} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">City</label>
                <div className="relative mt-1">
                  <FaCity className="absolute left-3 top-3 text-slate-400 w-3.5 h-3.5" />
                  <input type="text" name="city" value={organizerData.city} onChange={handleOrganizerChange}
                    placeholder="e.g. Delhi" className={inputClass('blue')} />
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-lg shadow-md transition-colors disabled:opacity-50">
              {loading ? 'Registering...' : '🏥 Register as Organizer'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default RegisterPage;
