
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FaHeartbeat,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaCalendarAlt,
  FaCity,
  FaMapMarkerAlt,
  FaBuilding,
  FaTint
} from 'react-icons/fa';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('donor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [donorData, setDonorData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    blood_group: 'O+',
    dob: '',
    gender: 'male',
    city: '',
    address: ''
  });

  const [organizerData, setOrganizerData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    organization: '',
    city: ''
  });

  // =========================
  // DONOR INPUT HANDLER
  // =========================
  const handleDonorChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);

      setDonorData({
        ...donorData,
        phone: digitsOnly
      });

      return;
    }

    setDonorData({
      ...donorData,
      [name]: value
    });
  };

  // =========================
  // ORGANIZER INPUT HANDLER
  // =========================
  const handleOrganizerChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);

      setOrganizerData({
        ...organizerData,
        phone: digitsOnly
      });

      return;
    }

    setOrganizerData({
      ...organizerData,
      [name]: value
    });
  };

  // =========================
  // DONOR REGISTRATION
  // =========================
  const handleDonorSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Gmail validation
    if (!/^[^\s@]+@gmail\.com$/i.test(donorData.email.trim())) {
      setError('Please use a valid Gmail address ending with @gmail.com.');
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(donorData.phone)) {
      setError('Phone number must contain exactly 10 digits.');
      return;
    }

    // Age validation
    if (donorData.dob) {
      const birthDate = new Date(donorData.dob);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();

      const m = today.getMonth() - birthDate.getMonth();

      if (
        m < 0 ||
        (m === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18 || age > 65) {
        setError('Donor age must be between 18 and 65 years.');
        return;
      }
    }

    setLoading(true);

    try {
      const registrationData = {
        ...donorData,
        email: donorData.email.trim().toLowerCase(),
        phone: `+91${donorData.phone}`
      };

      await register(registrationData);

      navigate('/donor/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ORGANIZER REGISTRATION
  // =========================
  const handleOrganizerSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Gmail validation
    if (!/^[^\s@]+@gmail\.com$/i.test(organizerData.email.trim())) {
      setError('Please use a valid Gmail address ending with @gmail.com.');
      return;
    }

    // Phone validation
    if (!/^\d{10}$/.test(organizerData.phone)) {
      setError('Phone number must contain exactly 10 digits.');
      return;
    }

    // Password validation
    if (organizerData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        ...organizerData,
        email: organizerData.email.trim().toLowerCase(),
        phone: `+91${organizerData.phone}`
      };

      const res = await api.post(
        '/auth/register-organizer',
        registrationData
      );

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

  // =========================
  // INPUT CLASS
  // =========================
  const inputClass = (color) => `
    w-full border rounded-lg px-4 py-3
    focus:outline-none focus:ring-2
    ${
      color === 'red'
        ? 'focus:ring-red-500 border-slate-300'
        : 'focus:ring-blue-500 border-slate-300'
    }
  `;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =========================
          HEADER
      ========================= */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/"
              className="flex items-center gap-2 text-red-600 font-bold text-xl"
            >
              <FaHeartbeat />
              <span>BloodConnect</span>
            </Link>

            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-red-600"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* =========================
              TITLE
          ========================= */}
          <div className="text-center px-6 pt-8 pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
              <FaHeartbeat className="text-3xl" />
            </div>

            <h1 className="text-3xl font-bold text-slate-800">
              Create Your Account
            </h1>

            <p className="text-slate-500 mt-2">
              Join BloodConnect and help save lives.
            </p>
          </div>

          {/* =========================
              TABS
          ========================= */}
          <div className="px-6">
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('donor');
                  setError('');
                }}
                className={`flex-1 py-4 font-semibold border-b-2 transition ${
                  activeTab === 'donor'
                    ? 'text-red-600 border-red-600'
                    : 'text-slate-500 border-transparent hover:text-red-600'
                }`}
              >
                <FaUser className="inline mr-2" />
                Donor Registration
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('organizer');
                  setError('');
                }}
                className={`flex-1 py-4 font-semibold border-b-2 transition ${
                  activeTab === 'organizer'
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-500 border-transparent hover:text-blue-600'
                }`}
              >
                <FaBuilding className="inline mr-2" />
                Organizer Registration
              </button>
            </div>
          </div>

          {/* =========================
              ERROR MESSAGE
          ========================= */}
          {error && (
            <div className="mx-6 mt-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* =========================
              DONOR FORM
          ========================= */}
          {activeTab === 'donor' && (
            <form onSubmit={handleDonorSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NAME */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>

                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="name"
                      required
                      value={donorData.name}
                      onChange={handleDonorChange}
                      placeholder="Enter your full name"
                      className={`${inputClass('red')} pl-11`}
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>

                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                    type="email"
                    name="email"
                    required
                    value={donorData.email}
                    onChange={handleDonorChange}
                    placeholder="example@gmail.com"
                    pattern="^[^\s@]+@gmail\.com$"
                    title="Only Gmail addresses ending with @gmail.com are accepted."
                    className={`${inputClass('red')} pl-11`}
/>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    Only Gmail addresses are accepted.
                  </p>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="password"
                      name="password"
                      required
                      minLength="6"
                      value={donorData.password}
                      onChange={handleDonorChange}
                      placeholder="Minimum 6 characters"
                      className={`${inputClass('red')} pl-11`}
                    />
                  </div>
                </div>

                {/* PHONE */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>

                  <div className="flex">
                    <div className="flex items-center px-4 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-slate-700 font-semibold">
                      +91
                    </div>

                    <div className="relative flex-1">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        type="tel"
                        name="phone"
                        required
                        value={donorData.phone}
                        onChange={handleDonorChange}
                        placeholder="9876543210"
                        inputMode="numeric"
                        minLength="10"
                        maxLength="10"
                        pattern="[0-9]{10}"
                        title="Phone number must contain exactly 10 digits."
                        className={`${inputClass('red')} pl-11 rounded-l-none`}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    Enter exactly 10 digits. +91 is added automatically.
                  </p>
                </div>

                {/* DATE OF BIRTH */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Date of Birth
                  </label>

                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="date"
                      name="dob"
                      value={donorData.dob}
                      onChange={handleDonorChange}
                      className={`${inputClass('red')} pl-11`}
                    />
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    Donor age must be between 18 and 65 years.
                  </p>
                </div>

                {/* BLOOD GROUP */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Blood Group
                  </label>

                  <div className="relative">
                    <FaTint className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500" />

                    <select
                      name="blood_group"
                      required
                      value={donorData.blood_group}
                      onChange={handleDonorChange}
                      className={`${inputClass('red')} pl-11`}
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
                </div>

                {/* GENDER */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Gender
                  </label>

                  <select
                    name="gender"
                    required
                    value={donorData.gender}
                    onChange={handleDonorChange}
                    className={inputClass('red')}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* CITY */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City
                  </label>

                  <div className="relative">
                    <FaCity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="city"
                      required
                      value={donorData.city}
                      onChange={handleDonorChange}
                      placeholder="Enter your city"
                      className={`${inputClass('red')} pl-11`}
                    />
                  </div>
                </div>
              </div>

              {/* ADDRESS */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Address
                </label>

                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-4 text-slate-400" />

                  <textarea
                    name="address"
                    rows="3"
                    value={donorData.address}
                    onChange={handleDonorChange}
                    placeholder="Enter your address"
                    className={`${inputClass('red')} pl-11`}
                  />
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-bold py-3 rounded-lg transition"
              >
                {loading ? 'Creating Account...' : 'Register as Donor'}
              </button>
            </form>
          )}

          {/* =========================
              ORGANIZER FORM
          ========================= */}
          {activeTab === 'organizer' && (
            <form
              onSubmit={handleOrganizerSubmit}
              className="p-6 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NAME */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>

                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="name"
                      required
                      value={organizerData.name}
                      onChange={handleOrganizerChange}
                      placeholder="Enter your full name"
                      className={`${inputClass('blue')} pl-11`}
                    />
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>

                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                     type="email"
                      name="email"
                      required
                      value={organizerData.email}
                      onChange={handleOrganizerChange}
                      placeholder="example@gmail.com"
                      pattern="^[^\s@]+@gmail\.com$"
                      title="Only Gmail addresses ending with @gmail.com are accepted."
                      className={`${inputClass('blue')} pl-11`}
                    />
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    Only Gmail addresses are accepted.
                  </p>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>

                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="password"
                      name="password"
                      required
                      minLength="6"
                      value={organizerData.password}
                      onChange={handleOrganizerChange}
                      placeholder="Minimum 6 characters"
                      className={`${inputClass('blue')} pl-11`}
                    />
                  </div>
                </div>

                {/* PHONE */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>

                  <div className="flex">
                    <div className="flex items-center px-4 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-slate-700 font-semibold">
                      +91
                    </div>

                    <div className="relative flex-1">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                      <input
                        type="tel"
                        name="phone"
                        required
                        value={organizerData.phone}
                        onChange={handleOrganizerChange}
                        placeholder="9876543210"
                        inputMode="numeric"
                        minLength="10"
                        maxLength="10"
                        pattern="[0-9]{10}"
                        title="Phone number must contain exactly 10 digits."
                        className={`${inputClass('blue')} pl-11 rounded-l-none`}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    Enter exactly 10 digits. +91 is added automatically.
                  </p>
                </div>

                {/* ORGANIZATION */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Organization
                  </label>

                  <div className="relative">
                    <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="organization"
                      required
                      value={organizerData.organization}
                      onChange={handleOrganizerChange}
                      placeholder="Organization name"
                      className={`${inputClass('blue')} pl-11`}
                    />
                  </div>
                </div>

                {/* CITY */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    City
                  </label>

                  <div className="relative">
                    <FaCity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      name="city"
                      required
                      value={organizerData.city}
                      onChange={handleOrganizerChange}
                      placeholder="Enter city"
                      className={`${inputClass('blue')} pl-11`}
                    />
                  </div>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 rounded-lg transition"
              >
                {loading ? 'Creating Account...' : 'Register as Organizer'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;