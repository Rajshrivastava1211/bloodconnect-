import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaBell, FaCheck, FaCheckDouble } from 'react-icons/fa';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/my');
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 font-medium">Loading notifications...</div>;
  }

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="donor" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Notifications</h1>
            <p className="text-xs text-slate-500 mt-1">Review alerts regarding registrations, screening results, and certificate approvals.</p>
          </div>
          {notifications.some(n => !n.is_read) && (
            <button
              onClick={markAllAsRead}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2 rounded-lg flex items-center space-x-1.5 border border-slate-300 transition-colors"
            >
              <FaCheckDouble />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No notifications yet.
            </div>
          ) : (
            notifications.map(notif => (
              <div 
                key={notif.id} 
                className={`p-4 flex justify-between items-center gap-4 transition-colors ${
                  notif.is_read ? 'bg-white' : 'bg-slate-50/50 border-l-2 border-red-600'
                }`}
              >
                <div className="space-y-1">
                  <p className={`text-xs text-slate-700 leading-relaxed ${notif.is_read ? 'font-normal' : 'font-bold'}`}>
                    {notif.message}
                  </p>
                  <p className="text-[9px] text-slate-400 font-mono">
                    {new Date(notif.created_at).toLocaleString()}
                  </p>
                </div>
                {!notif.is_read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 p-2 rounded-lg text-slate-400 transition-colors border"
                    title="Mark as Read"
                  >
                    <FaCheck className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
