import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaCheckCircle, FaExclamationCircle, FaShieldAlt } from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CampStatusBadge from '../components/CampStatusBadge';

const CampDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchCampDetails();
  }, [id]);

  const fetchCampDetails = async () => {
    try {
      const res = await api.get(`/camps/${id}`);
      setCamp(res.camp);
    } catch (err) {
      setError(err.message || 'Failed to load camp details.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/camps/${id}` } } });
      return;
    }

    if (user.role !== 'donor') {
      setError('Only registered donors can register for donation camps.');
      return;
    }

    setRegistering(true);
    setError('');
    setSuccess(null);

    try {
      const res = await api.post(`/camps/${id}/register`);
      setSuccess(res.registration);
      // Refresh camp capacity
      fetchCampDetails();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 font-medium text-slate-500">Loading camp details...</div>;
  }

  if (!camp) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <p className="text-slate-600">Camp not found.</p>
        <Link to="/camps" className="text-red-600 font-bold text-sm">Back to Camps</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Camp Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
          <div className="space-y-2">
            <CampStatusBadge status={camp.status} />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{camp.name}</h1>
          </div>
          <Link to="/camps" className="text-xs font-bold text-slate-500 hover:text-slate-800">&larr; Back to Camps</Link>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">{camp.description || 'Join this blood donation camp organized by voluntary health organizations.'}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-slate-100 py-4 text-xs text-slate-700">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-red-600 w-4 h-4 shrink-0" />
            <div>
              <p className="text-slate-400 font-semibold uppercase">Date & Time</p>
              <p className="font-bold">{camp.date}</p>
              <p className="text-slate-500">{camp.start_time} - {camp.end_time}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-red-600 w-4 h-4 shrink-0" />
            <div>
              <p className="text-slate-400 font-semibold uppercase">Venue</p>
              <p className="font-bold">{camp.venue}</p>
              <p className="text-slate-500">{camp.city}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <FaUsers className="text-red-600 w-4 h-4 shrink-0" />
            <div>
              <p className="text-slate-400 font-semibold uppercase">Capacity</p>
              <p className="font-bold">{camp.registered_count || 0} / {camp.capacity} Registered</p>
              <p className="text-slate-500">{camp.capacity - (camp.registered_count || 0)} spots left</p>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Organized by: <strong className="text-slate-800">{camp.organizer_name}</strong>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-sm text-red-700 flex items-start space-x-2">
          <FaExclamationCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-xl text-emerald-900 space-y-4 shadow-sm">
          <div className="flex items-start space-x-3">
            <FaCheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-extrabold text-base">Camp Registration Confirmed!</h3>
              <p className="text-xs">Your unique registration code is: <strong className="bg-white px-2 py-0.5 rounded font-mono text-emerald-950 border border-emerald-300">{success.registration_code}</strong></p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-emerald-200 text-xs text-slate-700 space-y-2">
            <p className="font-bold text-slate-800">Next Step: Donor Pre-Screening Questionnaire</p>
            <p>Please complete our 6-step online pre-screening wizard to check your preliminary eligibility before arriving at the camp.</p>
            <Link
              to="/donor/eligibility-wizard"
              className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg mt-1 transition-colors"
            >
              Take Pre-Screening Wizard Now
            </Link>
          </div>
        </div>
      )}

      {/* Registration Action */}
      {!success && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Ready to donate at this camp?</h3>
            <p className="text-xs text-slate-500 mt-0.5">Registration is free and reserves your slot for medical screening.</p>
          </div>

          {['upcoming', 'open'].includes(camp.status) ? (
            <button
              onClick={handleRegister}
              disabled={registering}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-sm transition-colors disabled:opacity-50 shrink-0"
            >
              {registering ? 'Registering...' : 'Register for Camp'}
            </button>
          ) : (
            <button disabled className="bg-slate-200 text-slate-500 font-bold text-sm px-6 py-3 rounded-xl cursor-not-allowed">
              Registration Unavailable ({camp.status})
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CampDetailsPage;
