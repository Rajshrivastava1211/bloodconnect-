import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import CampStatusBadge from './CampStatusBadge';

const CampCard = ({ camp }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{camp.name}</h3>
          <CampStatusBadge status={camp.status} />
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{camp.description || 'Join us to save lives at this blood donation drive.'}</p>

        <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="text-red-500 w-3.5 shrink-0" />
            <span className="font-semibold text-slate-800">{camp.date}</span>
            <span className="text-slate-400">({camp.start_time} - {camp.end_time})</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaMapMarkerAlt className="text-red-500 w-3.5 shrink-0" />
            <span className="truncate">{camp.venue}, {camp.city}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaUsers className="text-red-500 w-3.5 shrink-0" />
            <span>Capacity: {camp.registered_count || 0} / {camp.capacity} Donors</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">Organizer: {camp.organizer_name || 'Organized Drive'}</span>
        <Link
          to={`/camps/${camp.id}`}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-colors"
        >
          View & Register
        </Link>
      </div>
    </div>
  );
};

export default CampCard;
