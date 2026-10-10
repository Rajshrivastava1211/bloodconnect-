import indianCities from '../data/indianCities';
import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaCalendarAlt, FaCity } from 'react-icons/fa';
import api from '../services/api';
import CampCard from '../components/CampCard';

const Camps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCamps();
  }, [cityFilter, statusFilter]);

  const fetchCamps = async () => {
    setLoading(true);
    try {
      const params = {};
      if (cityFilter) params.city = cityFilter;
      if (statusFilter) params.status = statusFilter;
      
      const res = await api.get('/camps', { params });
      setCamps(res.camps || []);
    } catch (err) {
      console.error('Failed to load camps:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredCamps = camps.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.venue.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Blood Donation Camps</h1>
        <p className="text-sm text-slate-500 mt-1">Discover scheduled blood drives and register online.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FaSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search camp name or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white"
          />
        </div>

        {/* City Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FaCity className="w-4 h-4" />
          </div>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white"
          >
            <option value="">All Cities</option>
            {indianCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FaFilter className="w-4 h-4" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="open">Open for Registration</option>
            <option value="upcoming">Upcoming</option>
            <option value="full">Full</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium">Loading camps...</div>
      ) : filteredCamps.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
          <p className="font-semibold text-base">No blood donation camps found matching your filters.</p>
          <button onClick={() => { setCityFilter(''); setStatusFilter(''); setSearch(''); }} className="text-xs text-red-600 underline font-bold">Clear all filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCamps.map(camp => (
            <CampCard key={camp.id} camp={camp} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Camps;
