import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeartbeat } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem-4rem)] flex flex-col items-center justify-center space-y-4 bg-slate-50 text-center px-4">
      <div className="bg-red-50 p-6 rounded-full text-red-600 animate-bounce">
        <FaHeartbeat className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-800">404 - Page Not Found</h1>
      <p className="text-sm text-slate-550 max-w-md">
        The page you are looking for does not exist or may have been relocated.
      </p>
      <Link
        to="/"
        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-6 py-3 rounded-lg shadow transition-all"
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
