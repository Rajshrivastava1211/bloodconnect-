import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaHospital, FaPlus, FaTrash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const BloodBankManagementPage = () => {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBank, setNewBank] = useState({
    name: '', city: 'Mumbai', area: '', contact: '', email: '', address: '', services: ''
  });

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blood-banks');
      setBanks(res.bloodBanks || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch blood banks.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewBank({ ...newBank, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/admin/blood-banks', newBank);
      setSuccess('Blood bank added successfully.');
      setShowAddForm(false);
      setNewBank({ name: '', city: 'Mumbai', area: '', contact: '', email: '', address: '', services: '' });
      fetchBanks();
    } catch (err) {
      setError(err.message || 'Failed to create blood bank.');
    }
  };

  const handleDelete = async (bankId) => {
    if (!window.confirm('Are you sure you want to remove this blood bank?')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/admin/blood-banks/${bankId}`);
      setSuccess('Blood bank removed successfully.');
      fetchBanks();
    } catch (err) {
      setError(err.message || 'Failed to delete blood bank.');
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <FaHospital className="text-red-600" />
              <span>Blood Bank Management</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Add, update, or remove hospital blood banks from the directory checklist.</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-colors flex items-center space-x-1"
          >
            <FaPlus />
            <span>{showAddForm ? 'Cancel' : 'Add Blood Bank'}</span>
          </button>
        </div>

        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-lg text-xs text-emerald-800 flex items-center space-x-2">
            <FaCheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg text-xs text-red-700 flex items-center space-x-2">
            <FaExclamationCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Add Blood Bank Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Hospital/Center Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={newBank.name}
                    onChange={handleInputChange}
                    className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase">City</label>
                  <select
                    name="city"
                    value={newBank.city}
                    onChange={handleInputChange}
                    className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm bg-white"
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Bangalore">Bangalore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Area/Neighborhood</label>
                  <input
                    type="text"
                    name="area"
                    value={newBank.area}
                    onChange={handleInputChange}
                    className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Contact Phone</label>
                  <input
                    type="text"
                    name="contact"
                    value={newBank.contact}
                    onChange={handleInputChange}
                    className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={newBank.email}
                    onChange={handleInputChange}
                    className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Services provided</label>
                  <input
                    type="text"
                    name="services"
                    value={newBank.services}
                    onChange={handleInputChange}
                    placeholder="e.g. Whole Blood, Components"
                    className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Address details</label>
                <textarea
                  name="address"
                  rows="2"
                  value={newBank.address}
                  onChange={handleInputChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm bg-white"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-red-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow">
                  Save Blood Bank
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Directory listing table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-medium">Loading directory...</div>
          ) : banks.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No blood banks registered.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase">
                  <tr>
                    <th className="px-6 py-3">Hospital/Center</th>
                    <th className="px-6 py-3">City / Area</th>
                    <th className="px-6 py-3">Contact</th>
                    <th className="px-6 py-3">Services</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {banks.map(bank => (
                    <tr key={bank.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-800">{bank.name}</td>
                      <td className="px-6 py-4">{bank.area ? `${bank.area}, ` : ''}{bank.city}</td>
                      <td className="px-6 py-4">
                        <p>{bank.contact || 'N/A'}</p>
                        <p className="text-[10px] text-slate-400">{bank.email || ''}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">{bank.services || 'Whole Blood'}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(bank.id)}
                          className="text-red-600 hover:text-red-950 hover:bg-red-50 p-2 rounded transition-colors"
                          title="Delete Blood Bank"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BloodBankManagementPage;
