import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaComment, FaStar, FaExclamationCircle } from 'react-icons/fa';

const FeedbackManagementPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/feedback');
      setFeedback(res.feedback || []);
      setAvgRating(res.averageRating || 0);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch donor feedback.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <FaComment className="text-red-600" />
              <span>Feedback Management</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Audit donor satisfaction metrics and textual comments.</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2.5 rounded-lg text-xs font-bold shrink-0">
            Average Score: {avgRating} / 5.0 Stars
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg text-xs text-red-700 flex items-center space-x-2">
            <FaExclamationCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-medium">Loading feedback logs...</div>
          ) : feedback.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No feedback logs found.</div>
          ) : (
            feedback.map(fb => (
              <div key={fb.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                  <div>
                    <p className="font-bold text-slate-800 text-xs">{fb.donor_name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Camp Drive: <strong>{fb.camp_name}</strong> ({fb.camp_date})</p>
                  </div>
                  
                  <div className="flex items-center text-amber-400 shrink-0">
                    {[1, 2, 3, 4, 5].map(star => (
                      <FaStar key={star} className={star <= fb.rating ? 'text-amber-400' : 'text-slate-200'} />
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="italic">"{fb.comments}"</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default FeedbackManagementPage;
