import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, FaUser, FaClipboardCheck, FaHistory, FaAward, 
  FaBell, FaPlusCircle, FaCampground, FaUsers, FaChartLine, 
  FaHospital, FaQuestionCircle, FaComment, FaFileAlt
} from 'react-icons/fa';

const Sidebar = ({ role }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const donorLinks = [
    { path: '/donor/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/donor/profile', label: 'My Profile', icon: FaUser },
    { path: '/donor/eligibility-wizard', label: 'Pre-Screening Wizard', icon: FaClipboardCheck },
    { path: '/donor/registrations', label: 'My Registrations', icon: FaCampground },
    { path: '/donor/history', label: 'Donation History', icon: FaHistory },
    { path: '/donor/notifications', label: 'Notifications', icon: FaBell },
  ];

  const organizerLinks = [
    { path: '/organizer/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { path: '/organizer/create-camp', label: 'Schedule New Camp', icon: FaPlusCircle },
    { path: '/organizer/manage-camps', label: 'Manage My Camps', icon: FaCampground },
  ];

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard & Charts', icon: FaTachometerAlt },
    { path: '/admin/users', label: 'User Management', icon: FaUsers },
    { path: '/admin/camps', label: 'Camp Management', icon: FaCampground },
    { path: '/admin/registrations', label: 'Registrations', icon: FaClipboardCheck },
    { path: '/admin/donations', label: 'Donation Records', icon: FaHistory },
    { path: '/admin/blood-banks', label: 'Blood Bank Directory', icon: FaHospital },
    { path: '/admin/feedback', label: 'Donor Feedback', icon: FaComment },
    { path: '/admin/faqs', label: 'FAQ Management', icon: FaQuestionCircle },
    { path: '/admin/reports', label: 'Reports & Analytics', icon: FaChartLine },
  ];

  const links = role === 'admin' ? adminLinks : role === 'organizer' ? organizerLinks : donorLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 shrink-0 hidden md:block">
      <div className="mb-6 px-3 py-2 bg-red-50 rounded-lg border border-red-100">
        <p className="text-xs font-semibold text-red-700 uppercase tracking-wider">Logged in as</p>
        <p className="text-sm font-bold text-slate-800 capitalize">{role} Portal</p>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active 
                  ? 'bg-red-600 text-white shadow-sm font-semibold' 
                  : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
