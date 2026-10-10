
import indianCities from '../data/indianCities';import React, { useState, useEffect } from 'react';
import { FaHospital, FaSearch, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaExclamationTriangle } from 'react-icons/fa';
import api from '../services/api';

const BloodBanksPage = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBanks();
  }, [cityFilter]);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blood-banks', { params: { city: cityFilter } });
      setBanks(res.bloodBanks || []);
    } catch (err) {
      console.error('Failed to load blood banks:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBanks = banks.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.area.toLowerCase().includes(search.toLowerCase()) ||
    b.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Blood Bank Directory</h1>
        <p className="text-sm text-slate-500 mt-1">Search licensed hospital blood banks and collection centers.</p>
      </div>

      {/* Prominent Demo Data Disclaimer */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl text-amber-900 flex items-start space-x-3 text-xs shadow-sm">
        <FaExclamationTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-950 text-sm">Demo / Sample Directory Notice</p>
          <p className="mt-0.5">All blood bank listings shown on this page are sample/demo data provided for academic evaluation. This platform does not provide live inventory tracking.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <FaSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by hospital name or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
          />
        </div>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
        >
          <option value="">All Cities</option>
          {indianCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="py-12 text-center text-slate-500 font-medium">Loading directory...</div>
      ) : filteredBanks.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
          No blood banks found matching criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBanks.map(bank => (
            <div key={bank.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg shrink-0">
                      <FaHospital className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{bank.name}</h3>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Demo Data</span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                  <p className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-red-500 shrink-0" />
                    <span>{bank.address || `${bank.area}, ${bank.city}`}</span>
                  </p>
                  {bank.contact && (
                    <p className="flex items-center space-x-2">
                      <FaPhoneAlt className="text-red-500 shrink-0" />
                      <span>{bank.contact}</span>
                    </p>
                  )}
                  {bank.email && (
                    <p className="flex items-center space-x-2">
                      <FaEnvelope className="text-red-500 shrink-0" />
                      <span>{bank.email}</span>
                    </p>
                  )}
                </div>

                {bank.services && (
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-700 block mb-0.5">Services:</span>
                    <span>{bank.services}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BloodBanksPage;
