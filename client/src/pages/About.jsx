import React from 'react';
import { FaHeartbeat, FaCode, FaUniversity, FaUserCheck } from 'react-icons/fa';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-3">
        <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-red-100">Semester 5 CEP Project</span>
        <h1 className="text-3xl font-extrabold text-slate-900">About BloodConnect Portal</h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          BloodConnect – Blood Donation Camp Management and Donor Registration Portal is a web-based application designed to bridge the gap between voluntary blood donors, camp organizers, and blood banks.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Project Overview & Objectives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 flex items-center space-x-2">
              <FaUserCheck className="text-red-600" />
              <span>For Donors</span>
            </h3>
            <p className="text-xs leading-relaxed">
              Provides online registration, location-based camp discovery, a 6-step preliminary eligibility pre-screening wizard, digital donation certificates, and historical records tracking.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 flex items-center space-x-2">
              <FaHeartbeat className="text-red-600" />
              <span>For Organizers & Admins</span>
            </h3>
            <p className="text-xs leading-relaxed">
              Allows organizers to schedule donation drives, manage attendance, record donation outcomes, and issue certificates while offering administrators comprehensive reporting and system controls.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center space-x-2">
          <FaUniversity className="text-red-600" />
          <span>Academic Project Metadata</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <p className="font-semibold text-slate-400 uppercase">Degree Program</p>
            <p className="font-bold text-slate-800 text-sm">BSc in Information Technology (BSc IT)</p>
            <p className="text-slate-500">Semester 5 — Academic Year 2026–2027</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <p className="font-semibold text-slate-400 uppercase">Group Members</p>
            <p className="font-bold text-slate-800 text-sm">Shrivastava Raj Santosh (Roll No. 61)</p>
            <p className="font-bold text-slate-800 text-sm">Zanke Om Suresh (Roll No. 122)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
