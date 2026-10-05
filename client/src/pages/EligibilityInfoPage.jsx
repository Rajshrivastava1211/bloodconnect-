import React from 'react';
import { FaShieldAlt, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaHeartbeat } from 'react-icons/fa';

const EligibilityInfoPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Blood Donation Eligibility Guidelines</h1>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Understand the basic health and safety criteria before taking our online pre-screening questionnaire or visiting a camp.
        </p>
      </div>

      {/* Prominent Disclaimer */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-5 rounded-xl text-amber-900 space-y-1 shadow-sm">
        <h3 className="font-bold text-sm flex items-center space-x-2 text-amber-950">
          <FaShieldAlt className="text-amber-600" />
          <span>Pre-Screening Medical Disclaimer</span>
        </h3>
        <p className="text-xs text-amber-800 leading-relaxed">
          Pre-screening only: The BloodConnect questionnaire provides a preliminary indication and does not replace professional medical screening. Final eligibility will be determined by qualified medical staff at the camp according to applicable blood-bank guidelines.
        </p>
      </div>

      {/* Key Criteria Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-3 flex items-center space-x-2">
            <FaCheckCircle className="text-emerald-600" />
            <span>Basic Requirements</span>
          </h2>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="font-bold text-emerald-600">✔</span>
              <span><strong>Age:</strong> Between 18 and 65 years old.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold text-emerald-600">✔</span>
              <span><strong>Weight:</strong> Minimum 50 kg (110 lbs).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold text-emerald-600">✔</span>
              <span><strong>Hemoglobin:</strong> Minimum 12.5 g/dL (tested free at camp).</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold text-emerald-600">✔</span>
              <span><strong>Donation Interval:</strong> At least 90 days (3 months) since last whole blood donation.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold text-emerald-600">✔</span>
              <span><strong>Vital Signs:</strong> Normal pulse, blood pressure, and temperature.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-3 flex items-center space-x-2">
            <FaTimesCircle className="text-red-600" />
            <span>Temporary Deferrals</span>
          </h2>
          <ul className="space-y-2.5 text-xs text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="font-bold text-red-600">✖</span>
              <span><strong>Antibiotics / Infection:</strong> Defer until 7 days after finishing treatment.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold text-red-600">✖</span>
              <span><strong>Major Surgery:</strong> Wait 6 months after major surgical procedures.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold text-red-600">✖</span>
              <span><strong>Tattoo / Piercing:</strong> Wait 6–12 months if performed at unregulated facilities.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-bold text-red-600">✖</span>
              <span><strong>Pregnancy / Lactation:</strong> Defer during pregnancy and up to 12 months post-childbirth.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EligibilityInfoPage;
