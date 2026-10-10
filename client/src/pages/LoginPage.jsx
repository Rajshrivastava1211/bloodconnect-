import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHeartbeat,
  FaEnvelope,
  FaLock,
  FaExclamationCircle,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(email, password);
      const userRole = res.user.role;

      const targetPath = from || (
        userRole === 'admin'
          ? '/admin/dashboard'
          : userRole === 'organizer'
            ? '/organizer/dashboard'
            : '/donor/dashboard'
      );

      navigate(targetPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

    return (
    <div className="min-h-[calc(100vh-4rem-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">

        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-red-600 rounded-xl text-white shadow">
            <FaHeartbeat className="w-6 h-6 animate-pulse" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900">
            Sign In to BloodConnect
          </h2>

          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-red-600 hover:underline"
            >
              Register as Donor/Organizer
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg text-xs text-red-700 flex items-center space-x-2">
            <FaExclamationCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Email Address
            </label>

            <div className="relative mt-1">
              <FaEnvelope className="absolute left-3 top-3 text-slate-400 w-4 h-4" />

              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase">
              Password
            </label>

            <div className="relative mt-1">
              <FaLock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />

              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-red-500 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* SIGN IN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 rounded-xl shadow-md transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

        </form>

                
      </div>
    </div>
  );
};

export default LoginPage;
