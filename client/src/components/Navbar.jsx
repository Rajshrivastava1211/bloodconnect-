import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeartbeat, FaUser, FaSignOutAlt, FaBars, FaTimes, FaPlusCircle, FaCampground } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="bg-red-600 p-2 rounded-lg text-white shadow-sm">
                <FaHeartbeat className="h-5 w-5 animate-pulse" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                Blood<span className="text-red-600">Connect</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:ml-8 lg:space-x-1">
              <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'bg-red-50 text-red-700 font-semibold' : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'}`}>Home</Link>
              <Link to="/camps" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/camps') ? 'bg-red-50 text-red-700 font-semibold' : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'}`}>Donation Camps</Link>
              
              {user?.role === 'organizer' && (
                <>
                  <Link to="/organizer/create-camp" className={`px-3 py-2 rounded-md text-sm font-bold transition-colors ${isActive('/organizer/create-camp') ? 'bg-red-600 text-white' : 'text-red-600 hover:bg-red-50'}`}>
                    + Organize Camp
                  </Link>
                  <Link to="/organizer/manage-camps" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/organizer/manage-camps') ? 'bg-red-50 text-red-700 font-semibold' : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'}`}>
                    My Camps
                  </Link>
                </>
              )}

              <Link to="/blood-banks" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/blood-banks') ? 'bg-red-50 text-red-700 font-semibold' : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'}`}>Blood Banks</Link>
              <Link to="/eligibility-info" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/eligibility-info') ? 'bg-red-50 text-red-700 font-semibold' : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'}`}>Eligibility Guidelines</Link>
              <Link to="/faqs" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/faqs') ? 'bg-red-50 text-red-700 font-semibold' : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'}`}>FAQs</Link>
              <Link to="/about" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/about') ? 'bg-red-50 text-red-700 font-semibold' : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'}`}>About</Link>
              <Link to="/contact" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/contact') ? 'bg-red-50 text-red-700 font-semibold' : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'}`}>Contact</Link>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="hidden lg:flex lg:items-center lg:space-x-3">
            {user ? (
              <div className="flex items-center space-x-2.5">
                {user.role === 'organizer' && (
                  <Link
                    to="/organizer/create-camp"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
                  >
                    <FaPlusCircle className="w-3.5 h-3.5" />
                    <span>+ Organize Camp</span>
                  </Link>
                )}
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'organizer' ? '/organizer/dashboard' : '/donor/dashboard'}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
                >
                  <FaUser className="w-3 h-3" />
                  <span className="capitalize">{user.role} Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-red-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-slate-700 hover:text-red-600 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">Log In</Link>
                <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors">Become a Donor</Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Home</Link>
          <Link to="/camps" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Donation Camps</Link>

          {user?.role === 'organizer' && (
            <div className="py-2 border-y border-slate-100 bg-red-50/50 rounded-lg my-1 px-1 space-y-1">
              <Link
                to="/organizer/create-camp"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-100 rounded-md"
              >
                <FaPlusCircle className="w-4 h-4 text-red-600" />
                <span>+ Organize / Schedule New Camp</span>
              </Link>
              <Link
                to="/organizer/manage-camps"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-red-100 rounded-md"
              >
                <FaCampground className="w-4 h-4 text-slate-500" />
                <span>Manage My Camps</span>
              </Link>
            </div>
          )}

          <Link to="/blood-banks" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Blood Banks</Link>
          <Link to="/eligibility-info" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Eligibility Guidelines</Link>
          <Link to="/faqs" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">FAQs</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">About Us</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-md">Contact Us</Link>

          {user ? (
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'organizer' ? '/organizer/dashboard' : '/donor/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-slate-800 text-white font-semibold py-2 rounded-lg capitalize"
              >
                Go to {user.role} Dashboard
              </Link>
              <button onClick={handleLogout} className="block w-full text-center text-red-600 font-semibold py-2 border border-red-200 rounded-lg">Logout</button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 border border-slate-300 rounded-lg font-medium">Log In</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-center py-2 bg-red-600 text-white rounded-lg font-medium">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
