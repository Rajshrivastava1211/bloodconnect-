import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa';
import api from '../services/api';

const FaqsPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/faqs')
      .then(res => setFaqs(res.faqs || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredFaqs = faqs.filter(f =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center justify-center space-x-2">
          <FaQuestionCircle className="text-red-600" />
          <span>Frequently Asked Questions</span>
        </h1>
        <p className="text-sm text-slate-600">Everything you need to know about safe blood donation and camp pre-screening.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <FaSearch className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search FAQs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white shadow-sm"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="text-center py-8 text-slate-500 font-medium">Loading FAQs...</div>
      ) : (
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => (
            <div key={faq.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-slate-800 text-sm flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <span>{faq.question}</span>
                {openIdx === idx ? <FaChevronUp className="text-slate-400 shrink-0" /> : <FaChevronDown className="text-slate-400 shrink-0" />}
              </button>
              {openIdx === idx && (
                <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FaqsPage;
