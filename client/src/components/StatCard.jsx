import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'red', subtitle }) => {
  const colorMap = {
    red: 'bg-red-50 text-red-600 border-red-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg border ${colorMap[color] || colorMap.red}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
