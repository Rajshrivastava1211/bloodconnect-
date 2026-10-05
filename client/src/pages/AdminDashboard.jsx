import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend 
} from 'chart.js';
import { Bar, Pie, Doughnut, Line } from 'react-chartjs-2';
import { FaUsers, FaCampground, FaHistory, FaStar, FaShieldAlt, FaClipboardList } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/statistics')
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-slate-500 font-medium">Loading Admin Dashboard...</div>;
  }

  // Fallback defaults if charts data is empty
  const summary = data?.stats || { donors: 0, organizers: 0, activeCamps: 0, totalDonations: 0, totalRegistrations: 0 };
  const charts = data?.charts || { donationsByMonth: [], bloodGroupDist: [], campStatusBreakdown: [], donorGrowth: [] };

  // 1. Donations by Month Chart
  const donationsData = {
    labels: charts.donationsByMonth.map(d => d.month) || [],
    datasets: [{
      label: 'Units Donated',
      data: charts.donationsByMonth.map(d => d.count) || [],
      backgroundColor: 'rgba(220, 38, 38, 0.7)', // red-600
      borderColor: 'rgb(220, 38, 38)',
      borderWidth: 1,
      borderRadius: 4
    }]
  };

  // 2. Blood Group Distribution Chart
  const bloodGroupsData = {
    labels: charts.bloodGroupDist.map(b => b.blood_group) || [],
    datasets: [{
      label: 'Donors Count',
      data: charts.bloodGroupDist.map(b => b.count) || [],
      backgroundColor: [
        '#ef4444', '#f87171', '#dc2626', '#b91c1c', 
        '#fca5a5', '#fee2e2', '#991b1b', '#7f1d1d'
      ],
      borderWidth: 1
    }]
  };

  // 3. Camp Status Breakdown Chart
  const statusData = {
    labels: charts.campStatusBreakdown.map(s => s.status) || [],
    datasets: [{
      label: 'Camps count',
      data: charts.campStatusBreakdown.map(s => s.count) || [],
      backgroundColor: ['#60a5fa', '#34d399', '#fbbf24', '#c084fc', '#f87171'],
      borderWidth: 1
    }]
  };

  // 4. Donor Growth Trend Chart
  const growthData = {
    labels: charts.donorGrowth.map(g => g.month) || [],
    datasets: [{
      label: 'New Donors Registered',
      data: charts.donorGrowth.map(g => g.count) || [],
      borderColor: '#b91c1c',
      backgroundColor: 'rgba(185, 28, 28, 0.1)',
      fill: true,
      tension: 0.3
    }]
  };

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Console</h1>
          <p className="text-xs text-slate-500 mt-1">Portal aggregates, blood group inventory metrics, user accounts tracking, and drive reports.</p>
        </div>

        {/* Aggregate Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <StatCard title="Total Registered Donors" value={summary.donors} icon={FaUsers} color="red" />
          <StatCard title="Active Organizers" value={summary.organizers} icon={FaShieldAlt} color="blue" />
          <StatCard title="Total Registrations" value={summary.totalRegistrations} icon={FaClipboardList} color="amber" />
          <StatCard title="Successful Donations" value={summary.totalDonations} icon={FaHistory} color="emerald" />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart - Monthly Donations */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Donations by Month</h4>
            <div className="h-64 flex items-center justify-center">
              {charts.donationsByMonth.length === 0 ? (
                <span className="text-slate-400 text-xs">No donation history recorded.</span>
              ) : (
                <Bar data={donationsData} options={{ responsive: true, maintainAspectRatio: false }} />
              )}
            </div>
          </div>

          {/* Pie Chart - Blood Groups */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Blood Group Distribution</h4>
            <div className="h-64 flex items-center justify-center">
              {charts.bloodGroupDist.length === 0 ? (
                <span className="text-slate-400 text-xs">No blood group records found.</span>
              ) : (
                <Pie data={bloodGroupsData} options={{ responsive: true, maintainAspectRatio: false }} />
              )}
            </div>
          </div>

          {/* Doughnut Chart - Camp Statuses */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Donation Camps Status</h4>
            <div className="h-64 flex items-center justify-center">
              {charts.campStatusBreakdown.length === 0 ? (
                <span className="text-slate-400 text-xs">No camps scheduled.</span>
              ) : (
                <Doughnut data={statusData} options={{ responsive: true, maintainAspectRatio: false }} />
              )}
            </div>
          </div>

          {/* Line Chart - Donor Growth */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Donor Registration Growth</h4>
            <div className="h-64 flex items-center justify-center">
              {charts.donorGrowth.length === 0 ? (
                <span className="text-slate-400 text-xs">No registration data.</span>
              ) : (
                <Line data={growthData} options={{ responsive: true, maintainAspectRatio: false }} />
              )}
            </div>
          </div>
        </div>

        {/* Recent Camps table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <FaCampground className="text-red-500" />
            <span>Recent Camps Scheduled</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-2.5">Camp Name</th>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">City</th>
                  <th className="px-4 py-2.5">Registrations</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(data?.recentCamps || []).map(camp => (
                  <tr key={camp.id}>
                    <td className="px-4 py-2.5 font-bold text-slate-800">{camp.name}</td>
                    <td className="px-4 py-2.5 font-medium">{camp.date}</td>
                    <td className="px-4 py-2.5">{camp.city}</td>
                    <td className="px-4 py-2.5 font-bold">{camp.registered || 0}</td>
                    <td className="px-4 py-2.5 font-semibold capitalize">{camp.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
