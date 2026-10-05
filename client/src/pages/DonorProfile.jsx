import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaUser, FaSave, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const DonorProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    blood_group: 'O+',
    dob: '',
    gender: 'male',
    city: '',
    address: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/donors/profile')
      .then(res => {
        if (res.profile) {
          setProfile({
            name: res.profile.name || '',
            email: res.profile.email || '',
            phone: res.profile.phone || '',
            blood_group: res.profile.blood_group || 'O+',
            dob: res.profile.dob || '',
            gender: res.profile.gender || 'male',
            city: res.profile.city || '',
            address: res.profile.address || ''
          });
        }
      })
      .catch(err => setError(err.message || 'Failed to load profile.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      await api.put('/donors/profile', profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 font-medium">Loading Profile...</div>;
  }

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="donor" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-xs text-slate-500 mt-1">Manage your personal demographics and contact information.</p>
        </div>

        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded text-sm text-emerald-800 flex items-center space-x-2">
            <FaCheckCircle className="text-emerald-600 w-5 h-5 shrink-0" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700 flex items-center space-x-2">
            <FaExclamationCircle className="text-red-500 w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Email Address (Read-only)</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full mt-1 border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Blood Group</label>
                <select
                  name="blood_group"
                  value={profile.blood_group}
                  onChange={handleChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm bg-white"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  required
                  value={profile.dob}
                  onChange={handleChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Gender</label>
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm bg-white"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={profile.city}
                  onChange={handleChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Address</label>
              <textarea
                name="address"
                required
                rows="3"
                value={profile.address}
                onChange={handleChange}
                className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
              />
            </div>

            <div className="flex justify-end border-t pt-4">
              <button
                type="submit"
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition-colors flex items-center space-x-1.5 disabled:opacity-50"
              >
                <FaSave />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default DonorProfile;
