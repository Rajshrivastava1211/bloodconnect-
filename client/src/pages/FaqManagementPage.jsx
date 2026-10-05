import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { FaQuestionCircle, FaPlus, FaTrash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const FaqManagementPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [newFaq, setNewFaq] = useState({
    question: '', answer: '', category: 'General', display_order: 0
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/faqs');
      setFaqs(res.faqs || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch FAQs.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewFaq({ ...newFaq, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('/admin/faqs', newFaq);
      setSuccess('FAQ added successfully.');
      setShowAddForm(false);
      setNewFaq({ question: '', answer: '', category: 'General', display_order: 0 });
      fetchFaqs();
    } catch (err) {
      setError(err.message || 'Failed to create FAQ.');
    }
  };

  const handleDelete = async (faqId) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    setError('');
    setSuccess('');
    try {
      await api.delete(`/admin/faqs/${faqId}`);
      setSuccess('FAQ removed successfully.');
      fetchFaqs();
    } catch (err) {
      setError(err.message || 'Failed to remove FAQ.');
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-[calc(100vh-4rem)]">
      <Sidebar role="admin" />
      <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-4xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
              <FaQuestionCircle className="text-red-600" />
              <span>FAQ Management</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Add, update, or remove pre-donation questions from public listings.</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-sm transition-colors flex items-center space-x-1"
          >
            <FaPlus />
            <span>{showAddForm ? 'Cancel' : 'Add FAQ'}</span>
          </button>
        </div>

        {success && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-3 rounded-lg text-xs text-emerald-800 flex items-center space-x-2">
            <FaCheckCircle className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg text-xs text-red-700 flex items-center space-x-2">
            <FaExclamationCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Add FAQ form */}
        {showAddForm && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Question Category</label>
                  <select
                    name="category"
                    value={newFaq.category}
                    onChange={handleInputChange}
                    className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Eligibility">Eligibility</option>
                    <option value="Preparation">Preparation</option>
                    <option value="Safety">Safety</option>
                    <option value="Process">Process</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase">Display Order (Sorting)</label>
                  <input
                    type="number"
                    name="display_order"
                    value={newFaq.display_order}
                    onChange={handleInputChange}
                    className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm bg-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Question Text</label>
                <input
                  type="text"
                  name="question"
                  required
                  value={newFaq.question}
                  onChange={handleInputChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase">Detailed Answer</label>
                <textarea
                  name="answer"
                  required
                  rows="3"
                  value={newFaq.answer}
                  onChange={handleInputChange}
                  className="w-full mt-1 border border-slate-300 rounded-lg p-2 text-sm bg-white"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="bg-red-600 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow">
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        )}

        {/* FAQs List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-medium">Loading FAQs...</div>
          ) : faqs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No FAQs registered.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Question / Answer</th>
                    <th className="px-6 py-3 text-center">Display Order</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {faqs.map(faq => (
                    <tr key={faq.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-red-600 capitalize">{faq.category}</td>
                      <td className="px-6 py-4 space-y-1 max-w-sm">
                        <p className="font-bold text-slate-800">{faq.question}</p>
                        <p className="text-[10px] text-slate-400 leading-relaxed truncate">{faq.answer}</p>
                      </td>
                      <td className="px-6 py-4 text-center font-bold">{faq.display_order}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="text-red-600 hover:text-red-950 hover:bg-red-50 p-2 rounded transition-colors"
                          title="Remove FAQ"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </td>
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

export default FaqManagementPage;
