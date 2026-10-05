import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaChartLine, FaDownload, FaExclamationCircle } from 'react-icons/fa';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/reports')
      .then(res => setReports(res.campReports || []))
      .catch(err => {
        console.error(err);
        setError('Failed to load reports.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleExportCSV = () => {
    // Basic CSV generator helper
    const headers = ['Camp Name', 'Date', 'City', 'Target Units', 'Total Registrations', 'Attended', 'Donated Units'];
    const rows = reports.map(r => [
      r.name, r.date, r.city, r.capacity, r.total_registrations, r.attended, r.donated
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BloodConnect_Camp_Outcomes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <FaChartLine className="text-red-600" />
              <span>Reports & Analytics</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Generate outcome reports showing targets vs collected volumes.</p>
          </div>
          {reports.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition-colors flex items-center space-x-1.5"
            >
              <FaDownload className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg text-xs text-red-705 flex items-center space-x-2">
            <FaExclamationCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-medium">Generating reports...</div>
          ) : reports.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No reports generated.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-3">Camp Details</th>
                    <th className="px-6 py-3">Organizer</th>
                    <th className="px-6 py-3 text-center">Registrations</th>
                    <th className="px-6 py-3 text-center">Attended Donors</th>
                    <th className="px-6 py-3 text-center">Target (Units)</th>
                    <th className="px-6 py-3 text-center text-red-600 font-bold">Collected (Units)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{r.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{r.date} | {r.city}</p>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-600">{r.organizer_name}</td>
                      <td className="px-6 py-4 text-center font-bold">{r.total_registrations}</td>
                      <td className="px-6 py-4 text-center font-bold text-emerald-700">{r.attended}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-500">{r.capacity}</td>
                      <td className="px-6 py-4 text-center font-extrabold text-red-600 text-sm bg-red-50/20">{r.donated} Unit(s)</td>
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

export default ReportsPage;
