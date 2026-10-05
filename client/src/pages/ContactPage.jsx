import React, { useState } from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Contact Us</h1>
        <p className="text-sm text-slate-600">Have questions about blood donation camps or portal usage? Reach out to us.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs text-slate-600">
            <div className="flex items-center space-x-2 text-red-600 font-bold text-sm">
              <FaEnvelope />
              <span>Email Support</span>
            </div>
            <p>support@bloodconnect.org</p>
            <p>info@bloodconnect.org</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs text-slate-600">
            <div className="flex items-center space-x-2 text-red-600 font-bold text-sm">
              <FaPhoneAlt />
              <span>Helpline</span>
            </div>
            <p>+91 98765 43210</p>
            <p>Toll-Free: 1800-123-BLOOD</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-2 text-xs text-slate-600">
            <div className="flex items-center space-x-2 text-red-600 font-bold text-sm">
              <FaMapMarkerAlt />
              <span>Academic Address</span>
            </div>
            <p>Department of Information Technology</p>
            <p>BSc IT Semester 5 CEP Group</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm md:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 border-b pb-3">Send a Message</h2>
          {submitted ? (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded text-sm text-emerald-800 flex items-center space-x-2">
              <FaCheckCircle className="text-emerald-600 w-5 h-5 shrink-0" />
              <span>Thank you for contacting us! We will get back to you shortly.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Your Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Message</label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                ></textarea>
              </div>

              <button type="submit" className="bg-red-600 text-white font-bold text-xs px-6 py-3 rounded-lg shadow hover:bg-red-700 transition-colors">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
