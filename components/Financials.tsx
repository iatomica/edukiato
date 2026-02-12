import React, { useState } from 'react';
import { Payment } from '../types';
import { Search, Filter, Plus, DollarSign, Calendar, CheckCircle, AlertCircle, Clock, X } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenantData } from '../hooks/useTenantData';

export const Financials: React.FC = () => {
  const { t } = useLanguage();
  const { payments, students, courses, institutionId, emitEvent, dispatch } = useTenantData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('CASH');

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudent);
    const course = courses.find(c => c.id === selectedCourse);

    if (student && course) {
      const newPayment: Payment = {
        id: `p-${Date.now()}`,
        institutionId: institutionId || '',
        studentName: student.name,
        studentAvatar: student.avatar,
        courseTitle: course.title,
        amount: Number(amount),
        dueDate: new Date(),
        paidDate: new Date(),
        status: 'PAID',
        method: method as 'CASH' | 'TRANSFER' | 'CARD'
      };
      // Add to centralized state
      dispatch({ type: 'ADD_PAYMENT', payload: newPayment });
      // Trigger cross-module side-effects (notification, activity log)
      emitEvent({ type: 'PAYMENT_RECORDED', payload: newPayment });

      setIsModalOpen(false);
      // Reset form
      setSelectedStudent('');
      setSelectedCourse('');
      setAmount('');
    }
  };

  const totalCollected = payments.filter(p => p.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'OVERDUE').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.financials.title}</h1>
          <p className="text-slate-500 mt-1">{t.financials.subtitle}</p>
        </div>
        <button
          id="tour-financials-create"
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center shadow-lg shadow-slate-200"
        >
          <Plus size={18} className="mr-2" />
          {t.financials.recordPayment}
        </button>
      </div>

      {/* Summary Cards */}
      <div id="tour-financials-stats" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.financials.collected}</p>
          <h3 className="text-3xl font-bold text-emerald-600 mt-2">${totalCollected.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.financials.overdue}</p>
          <h3 className="text-3xl font-bold text-rose-600 mt-2">${totalOverdue.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{t.financials.pending}</p>
          <h3 className="text-3xl font-bold text-slate-700 mt-2">$2,150</h3>
        </div>
      </div>

      {/* Ledger */}
      <div id="tour-financials-table" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.financials.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-2 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg text-sm font-medium flex items-center">
              <Filter size={16} className="mr-2" />
              {t.financials.filterStatus}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">{t.financials.table.student}</th>
                <th className="px-6 py-4">{t.financials.table.course}</th>
                <th className="px-6 py-4">{t.financials.table.dueDate}</th>
                <th className="px-6 py-4">{t.financials.table.amount}</th>
                <th className="px-6 py-4">{t.financials.table.status}</th>
                <th className="px-6 py-4 text-right">{t.financials.table.method}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img className="h-8 w-8 rounded-full object-cover mr-3" src={payment.studentAvatar} alt="" />
                      <span className="text-sm font-bold text-slate-900">{payment.studentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{payment.courseTitle}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2 opacity-50" />
                      {format(payment.dueDate, 'MMM d, yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm font-medium text-slate-800">${payment.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide
                      ${payment.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                        payment.status === 'OVERDUE' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'}`}>
                      {payment.status === 'PAID' && <CheckCircle size={12} className="mr-1" />}
                      {payment.status === 'OVERDUE' && <AlertCircle size={12} className="mr-1" />}
                      {payment.status === 'PENDING' && <Clock size={12} className="mr-1" />}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-400">
                    {payment.method || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center">
                <DollarSign size={20} className="mr-2 text-primary-600" /> {t.financials.modal.title}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRecordPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.financials.modal.studentLabel}</label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400"
                >
                  <option value="">{t.financials.modal.selectStudent}</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.financials.modal.courseLabel}</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400"
                >
                  <option value="">{t.financials.modal.selectCourse}</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t.financials.modal.amountLabel}</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t.financials.modal.methodLabel}</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400"
                  >
                    <option value="CASH">{t.financials.modal.methods.cash}</option>
                    <option value="TRANSFER">{t.financials.modal.methods.transfer}</option>
                    <option value="CARD">{t.financials.modal.methods.card}</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                disabled={!selectedStudent || !selectedCourse || !amount}
                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
              >
                {t.financials.modal.confirm}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};