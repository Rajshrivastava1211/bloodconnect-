import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { FaAward, FaHeartbeat, FaPrint, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';

const CertificatePage = () => {
  const { code } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/certificates/${code}`)
      .then(res => {
        if (res.success) {
          setCert(res.certificate);
        } else {
          setError('Certificate not found.');
        }
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch certificate.');
      })
      .finally(() => setLoading(false));
  }, [code]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 font-medium">Loading certificate...</div>;
  }

  if (error || !cert) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <p className="text-red-600 font-semibold">{error || 'Certificate not found.'}</p>
        <Link to="/donor/dashboard" className="text-slate-500 font-bold hover:underline">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Navigation bar, hidden during print */}
      <div className="flex justify-between items-center print:hidden">
        <Link to="/donor/dashboard" className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center space-x-1">
          <FaArrowLeft className="w-3 h-3" />
          <span>Dashboard</span>
        </Link>
        <button
          onClick={handlePrint}
          className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 transition-colors shadow-sm"
        >
          <FaPrint className="w-3.5 h-3.5" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      {/* Certificate Frame */}
      <div className="bg-white border-[16px] border-double border-red-800 p-8 sm:p-12 rounded-xl text-center relative overflow-hidden shadow-lg">
        {/* Corner borders */}
        <div className="absolute top-4 left-4 w-10 h-10 border-t-4 border-l-4 border-red-800"></div>
        <div className="absolute top-4 right-4 w-10 h-10 border-t-4 border-r-4 border-red-800"></div>
        <div className="absolute bottom-4 left-4 w-10 h-10 border-b-4 border-l-4 border-red-800"></div>
        <div className="absolute bottom-4 right-4 w-10 h-10 border-b-4 border-r-4 border-red-800"></div>

        <div className="space-y-6 max-w-xl mx-auto py-4">
          <div className="flex justify-center text-red-600">
            <FaAward className="w-16 h-16" />
          </div>

          <div className="space-y-1">
            <p className="text-red-700 font-extrabold tracking-widest text-xs uppercase">BloodConnect Portal</p>
            <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-800">Certificate of Appreciation</h1>
          </div>

          <div className="border-t border-b border-slate-100 py-3 text-xs text-slate-400 font-bold uppercase tracking-wider">
            This certificate is proudly awarded to
          </div>

          <h2 className="text-3xl font-serif font-extrabold text-red-700 italic underline decoration-slate-300 underline-offset-8">
            {cert.donor_name}
          </h2>

          <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto">
            In recognition of your noble act of voluntary blood donation at the <strong className="text-slate-800">{cert.camp_name}</strong> on <span className="font-bold">{cert.camp_date}</span>.
          </p>

          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your generous contribution of <strong className="text-red-600">{cert.units_donated} Unit(s)</strong> of <strong className="text-red-600">{cert.blood_group}</strong> blood will help save lives in local healthcare centers.
          </p>

          {/* Signature Grid */}
          <div className="grid grid-cols-2 gap-8 pt-8 items-end text-xs text-slate-500 font-bold font-mono">
            <div className="text-left space-y-1">
              <p className="italic text-slate-800">BloodConnect Coordinator</p>
              <div className="border-t border-slate-300 pt-1 mt-1 uppercase text-[9px] tracking-wider text-slate-400">Authorized Signature</div>
            </div>
            <div className="text-right space-y-1">
              <p className="text-slate-700 select-all">{cert.certificate_code}</p>
              <div className="border-t border-slate-300 pt-1 mt-1 uppercase text-[9px] tracking-wider text-slate-400">Certificate Code</div>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Warning */}
      <div className="bg-slate-100 border p-4 rounded-lg flex items-start space-x-2.5 text-[11px] leading-relaxed text-slate-550 border-slate-200">
        <FaShieldAlt className="text-slate-400 shrink-0 w-4 h-4 mt-0.5" />
        <p><strong>Disclaimer:</strong> {cert.disclaimer}</p>
      </div>
    </div>
  );
};

export default CertificatePage;
