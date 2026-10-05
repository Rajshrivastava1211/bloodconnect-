import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaSearch, FaTrash, FaCheck, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (roleFilter) params.role = roleFilter;
      
      const res = await api.get('/admin/users', { params });
      setUsers(res.users || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch user accounts.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    setError('');
    setSuccess('');
    try {
      const nextStatus = currentStatus === 1 ? 0 : 1;
      await api.patch(`/admin/users/${userId}/status`, { is_active: nextStatus });
      setSuccess(`User status updated to ${nextStatus ? 'Active' : 'Inactive'}.`);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to update user status.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
            <FaUsers className="text-red-600" />
            <span>User Management</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Audit active accounts, activate/deactivate logs, and delete credentials.</p>
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

        {/* Filter bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-white"
          >
            <option value="">All Roles</option>
            <option value="donor">Donors Only</option>
            <option value="organizer">Organizers Only</option>
            <option value="admin">Administrators Only</option>
          </select>
        </div>

        {/* User list */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-medium">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase">
                  <tr>
                    <th className="px-6 py-3">Account Details</th>
                    <th className="px-6 py-3">City / Org</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{u.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        {u.role === 'donor' ? (
                          <p>{u.donor_city || 'N/A'}</p>
                        ) : u.role === 'organizer' ? (
                          <p>{u.organization_name || 'N/A'} ({u.org_city || 'N/A'})</p>
                        ) : (
                          <p className="text-slate-400 italic">System</p>
                        )}
                      </td>
                      <td className="px-6 py-4 capitalize font-semibold">{u.role}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(u.id, u.is_active)}
                          disabled={u.id === currentUser.id}
                          className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold tracking-wider uppercase transition-colors disabled:opacity-50 ${
                            u.is_active === 1
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {u.is_active === 1 ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.id !== currentUser.id && (
                          <span className="text-slate-400 italic">Deactivate account to suspend access</span>
                        )}
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

export default UserManagementPage;
