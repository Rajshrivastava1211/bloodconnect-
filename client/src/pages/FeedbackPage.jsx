import React, { useState, useEffect } from 'react';
import { FaStar, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const FeedbackPage = () => {
  const { user } = useAuth();
  const [camps, setCamps] = useState([]);
  const [campId, setCampId] = useState('');
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role === 'donor') {
      api.get('/registrations/my')
        .then(res => setCamps(res.registrations || []))
        .catch(err => console.error(err));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!campId) {
      setError('Please select a camp.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/feedback', { camp_id: campId, rating, comments });
      setSuccess(true);
      setComments('');
    } catch (err) {
      setError(err.message || 'Failed to submit feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Donor Feedback</h1>
        <p className="text-sm text-slate-600">Share your experience to help us improve blood donation drives.</p>
      </div>

      {success && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded text-sm text-emerald-800 flex items-start space-x-2">
          <FaCheckCircle className="text-emerald-600 w-5 h-5 shrink-0 mt-0.5" />
          <span>Thank you for your valuable feedback!</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700 flex items-start space-x-2">
          <FaExclamationCircle className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Select Camp</label>
            <select
              required
              value={campId}
              onChange={(e) => setCampId(e.target.value)}
              className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
            >
              <option value="">Choose a camp you attended...</option>
              {camps.map(c => (
                <option key={c.id} value={c.camp_id}>{c.camp_name} ({c.camp_date})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">Rating (1 to 5 Stars)</label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  <FaStar className={star <= rating ? 'text-amber-400' : 'text-slate-200'} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">Comments</label>
            <textarea
              rows="4"
              required
              placeholder="Tell us about the staff, cleanliness, wait times, or process..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white font-bold text-sm py-3 rounded-lg shadow hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackPage;
