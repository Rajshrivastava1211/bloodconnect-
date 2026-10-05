import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaCalendarPlus, FaSave, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const CreateCampPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    start_time: '09:00',
    end_time: '17:00',
    venue: '',
    address: '',
    city: 'Mumbai',
    capacity: 50,
    status: 'upcoming'
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      await api.post('/camps', formData);
      setSuccess(true);
      setTimeout(() => navigate('/organizer/manage-camps'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to create donation camp.');
      setSaving(false);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="organizer" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <FaCalendarPlus className="text-red-600" />
            <span>Schedule New Camp</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Fill in the camp details to list a donation drive publicly.</p>
        </div>

        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded text-sm text-emerald-800 flex items-center space-x-2">
            <FaCheckCircle className="text-emerald-600 w-5 h-5 shrink-0" />
            <span>Donation camp scheduled! Redirecting...</span>
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
                <label className="block text-xs font-semibold text-slate-700 uppercase">Camp Title</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai Monsoon Drive 2026"
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Donation Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Start Time</label>
                <input
                  type="text"
                  name="start_time"
                  required
                  value={formData.start_time}
                  onChange={handleChange}
                  placeholder="e.g. 09:00"
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">End Time</label>
                <input
                  type="text"
                  name="end_time"
                  required
                  value={formData.end_time}
                  onChange={handleChange}
                  placeholder="e.g. 17:00"
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Venue Hall/Ground</label>
                <input
                  type="text"
                  name="venue"
                  required
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g. St. Xavier's Assembly Hall"
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">City</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm bg-white"
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Target Capacity (Donors)</label>
                <input
                  type="number"
                  name="capacity"
                  required
                  min="10"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Initial Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm bg-white"
                >
                  <option value="draft">Draft</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="open">Open (Accepting Registrations)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Address details</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address road, landmarks"
                className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase">Description & Health Notes</label>
              <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Any special guidelines for donors..."
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
                <span>{saving ? 'Scheduling...' : 'Schedule Camp'}</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateCampPage;
