import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat, FaHeart, FaShieldAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="bg-red-600 p-1.5 rounded text-white">
                <FaHeartbeat className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Blood<span className="text-red-500">Connect</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A centralized blood donation camp discovery, donor pre-screening, and record management platform.
            </p>
            
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/camps" className="hover:text-red-400 transition-colors">Find Donation Camps</Link></li>
              <li><Link to="/blood-banks" className="hover:text-red-400 transition-colors">Blood Bank Directory</Link></li>
              <li><Link to="/eligibility-info" className="hover:text-red-400 transition-colors">Pre-Screening Guidelines</Link></li>
              <li><Link to="/faqs" className="hover:text-red-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/feedback" className="hover:text-red-400 transition-colors">Donor Feedback</Link></li>
            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Portals</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-red-400 transition-colors">Donor Login</Link></li>
              <li><Link to="/register" className="hover:text-red-400 transition-colors">Donor Registration</Link></li>
              <li><Link to="/login" className="hover:text-red-400 transition-colors">Organizer Login</Link></li>
              <li><Link to="/login" className="hover:text-red-400 transition-colors">Admin Login</Link></li>
              <li><Link to="/contact" className="hover:text-red-400 transition-colors">Support & Contact</Link></li>
            </ul>
          </div>

          {/* Legal / Medical Disclaimer */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center space-x-1.5">
              <FaShieldAlt className="text-red-500" />
              <span>Medical Disclaimer</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              This portal provides preliminary pre-screening only and does not provide medical diagnosis or replace official medical evaluation. Final eligibility is determined at the camp by qualified medical personnel.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 space-y-2 md:space-y-0">
          <p>&copy; {new Date().getFullYear()} BloodConnect Portal. </p>
          <p className="flex items-center space-x-1">
            <span>Made with</span>
            <FaHeart className="text-red-500 w-3 h-3 animate-pulse" />
            <span>for voluntary blood donation awareness.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
