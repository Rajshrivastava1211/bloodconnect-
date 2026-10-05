import React from 'react';

const CampStatusBadge = ({ status }) => {
  const styles = {
    draft: 'bg-slate-100 text-slate-700 border-slate-300',
    upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
    open: 'bg-emerald-50 text-emerald-700 border-emerald-200 animate-pulse',
    full: 'bg-amber-50 text-amber-700 border-amber-200',
    completed: 'bg-purple-50 text-purple-700 border-purple-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  const labels = {
    draft: 'Draft',
    upcoming: 'Upcoming',
    open: 'Open for Registration',
    full: 'Registration Full',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] || styles.upcoming}`}>
      {labels[status] || status}
    </span>
  );
};

export default CampStatusBadge;
