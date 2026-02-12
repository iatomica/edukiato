
import React, { useState } from 'react';
import { Search, Mail, MoreHorizontal, Download, Award, X, Printer } from 'lucide-react';
import { Student } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenantData } from '../hooks/useTenantData';
import { usePermissions } from '../contexts/PermissionsContext';

export const Students: React.FC = () => {
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<Student | null>(null);
  const { t } = useLanguage();
  const { students, courses, dispatch, emitEvent } = useTenantData();
  const { can } = usePermissions();
  const courseName = courses[0]?.title ?? 'N/A';
  const instructorName = courses[0]?.instructor ?? 'N/A';

  const CertificateModal = ({ student, onClose }: { student: Student; onClose: () => void }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 flex items-center">
            <Award className="mr-2 text-primary-600" size={20} />
            {t.students.certModal.title}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-10 bg-slate-50 flex justify-center">
          {/* Certificate Design */}
          <div className="bg-white p-8 md:p-12 w-full text-center border-4 border-double border-slate-200 shadow-lg relative">
            <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center rounded-full mx-auto mb-6">
              <span className="font-serif text-3xl font-bold">E</span>
            </div>
            <h2 className="text-4xl font-serif text-slate-900 mb-2">{t.students.certModal.certTitle}</h2>
            <p className="text-slate-500 mb-8 italic">{t.students.certModal.institution}</p>

            <p className="text-slate-600 mb-2">{t.students.certModal.certifyThat}</p>
            <h3 className="text-3xl font-bold text-primary-700 mb-6 font-serif">{student.name}</h3>

            <p className="text-slate-600 max-w-md mx-auto leading-relaxed mb-8">
              {t.students.certModal.completedText}
              <span className="font-bold text-slate-800"> {courseName}</span>.
            </p>

            <div className="flex justify-around items-end mt-12">
              <div className="text-center">
                <div className="w-32 border-b border-slate-300 mb-2"></div>
                <p className="text-xs uppercase font-bold text-slate-400">Alex Rivera</p>
                <p className="text-[10px] text-slate-400">{t.students.certModal.director}</p>
              </div>
              <div className="text-center">
                <div className="w-32 border-b border-slate-300 mb-2 text-slate-800 font-serif italic text-lg">{instructorName.split(' ')[0]}</div>
                <p className="text-xs uppercase font-bold text-slate-400">{instructorName}</p>
                <p className="text-[10px] text-slate-400">{t.students.certModal.instructor}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-white flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">{t.students.certModal.close}</button>
          <button onClick={() => alert('Printing...')} className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 flex items-center">
            <Printer size={18} className="mr-2" />
            {t.students.certModal.print}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.students.title}</h1>
          <p className="text-slate-500 mt-1">{t.students.subtitle}</p>
        </div>
        <button
          id="tour-students-export"
          className="hidden md:flex items-center px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-sm font-medium"
        >
          <Download size={16} className="mr-2" />
          {t.students.export}
        </button>
      </div>

      <div id="tour-students-list" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div id="tour-students-search" className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.students.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-primary-200 cursor-pointer">
              <option>All Programs</option>
              <option>Visual Arts</option>
              <option>Music</option>
            </select>
            <select className="text-sm border-slate-200 rounded-lg text-slate-600 focus:ring-primary-200 cursor-pointer">
              <option>{t.students.table.status}: All</option>
              <option>{t.students.status.active}</option>
              <option>{t.students.status.inactive}</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4">{t.students.table.student}</th>
                <th className="px-6 py-4">{t.students.table.program}</th>
                <th className="px-6 py-4">{t.students.table.status}</th>
                <th className="px-6 py-4">{t.students.table.attendance}</th>
                <th className="px-6 py-4 text-right">{t.students.table.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img className="h-10 w-10 rounded-full object-cover border border-slate-200" src={student.avatar} alt="" />
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900">{student.name}</div>
                        <div className="text-xs text-slate-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700 font-medium">{student.program}</span>
                  </td>
                  <td className="px-6 py-4">
                    {can('manage', 'student') ? (
                      <select
                        value={student.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const newStatus = e.target.value as any;
                          const oldStatus = student.status;
                          dispatch({ type: 'UPDATE_STUDENT', payload: { id: student.id, status: newStatus } });
                          emitEvent({
                            type: 'STUDENT_STATUS_CHANGED',
                            payload: {
                              studentId: student.id,
                              studentName: student.name,
                              oldStatus,
                              newStatus,
                              changedBy: 'Admin', // In real app, get from auth.user.name
                            }
                          });
                        }}
                        className={`text-xs font-medium rounded-full px-2 py-0.5 border-0 cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-primary-200
                          ${student.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                            student.status === 'on_leave' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-800'}`}
                      >
                        <option value="active">{t.students.status.active}</option>
                        <option value="inactive">{t.students.status.inactive}</option>
                        <option value="on_leave">{t.students.status.on_leave}</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${student.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
                          student.status === 'on_leave' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-800'}`}>
                        {t.students.status[student.status] || student.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-slate-200 rounded-full h-1.5 mr-2">
                        <div
                          className={`h-1.5 rounded-full ${student.attendanceRate > 80 ? 'bg-emerald-500' : student.attendanceRate > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${student.attendanceRate}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-slate-600">{student.attendanceRate}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedStudentForCert(student)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Generate Certificate"
                      >
                        <Award size={18} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Mail size={18} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedStudentForCert && (
        <CertificateModal student={selectedStudentForCert} onClose={() => setSelectedStudentForCert(null)} />
      )}
    </div>
  );
};
