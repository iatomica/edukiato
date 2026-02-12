import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Users, AlertTriangle, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenantData } from '../hooks/useTenantData';

export const Reports: React.FC = () => {
   const { t } = useLanguage();
   const { courses, revenueData, attendanceData, payments, students } = useTenantData();

   return (
      <div className="space-y-6">
         <div className="flex justify-between items-end mb-6">
            <div>
               <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.reports.title}</h1>
               <p className="text-slate-500 mt-1">{t.reports.subtitle}</p>
            </div>
         </div>

         <div id="tour-reports-kpi" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Summary Cards */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t.reports.totalRevenue}</h3>
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><TrendingUp size={18} /></div>
               </div>
               <p className="text-3xl font-bold text-slate-800">$14,950</p>
               <p className="text-xs text-emerald-600 font-medium mt-1">+12% {t.reports.vsLastTerm}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t.reports.activeStudents}</h3>
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users size={18} /></div>
               </div>
               <p className="text-3xl font-bold text-slate-800">142</p>
               <p className="text-xs text-slate-500 font-medium mt-1">{t.reports.activeCourses}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t.reports.avgAttendance}</h3>
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><BookOpen size={18} /></div>
               </div>
               <p className="text-3xl font-bold text-slate-800">88%</p>
               <p className="text-xs text-rose-600 font-medium mt-1">-2% {t.reports.thisWeek}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t.reports.atRisk}</h3>
                  <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><AlertTriangle size={18} /></div>
               </div>
               <p className="text-3xl font-bold text-slate-800">5</p>
               <p className="text-xs text-slate-500 font-medium mt-1">{t.reports.below70}</p>
            </div>
         </div>

         <div id="tour-reports-charts" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Course Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-lg font-bold text-slate-800 mb-6">{t.reports.revenuePerCourse}</h3>
               <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={revenueData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                        <XAxis type="number" hide />
                        <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                        <Tooltip
                           cursor={{ fill: '#f8fafc' }}
                           contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Attendance Pie Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="text-lg font-bold text-slate-800 mb-6">{t.reports.attendanceOverview}</h3>
               <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                        <Pie
                           data={attendanceData}
                           cx="50%"
                           cy="50%"
                           innerRadius={60}
                           outerRadius={100}
                           paddingAngle={5}
                           dataKey="value"
                        >
                           {attendanceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                           ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            </div>
         </div>

         {/* Enrollment Table */}
         <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
               <h3 className="text-lg font-bold text-slate-800">{t.reports.enrollmentStatus}</h3>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold tracking-wider">
                     <tr>
                        <th className="px-6 py-4">{t.reports.table.courseName}</th>
                        <th className="px-6 py-4">{t.reports.table.instructor}</th>
                        <th className="px-6 py-4">{t.reports.table.status}</th>
                        <th className="px-6 py-4">{t.reports.table.capacity}</th>
                        <th className="px-6 py-4 text-right">{t.reports.table.utilization}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {courses.map(course => {
                        const utilization = Math.round((course.enrolled / course.capacity) * 100);
                        return (
                           <tr key={course.id} className="hover:bg-slate-50/50">
                              <td className="px-6 py-4 font-medium text-slate-800">{course.title}</td>
                              <td className="px-6 py-4 text-sm text-slate-600">{course.instructor}</td>
                              <td className="px-6 py-4">
                                 <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                    {t.reports.table.active}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">{course.enrolled} / {course.capacity}</td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end">
                                    <span className="text-xs font-bold mr-2 text-slate-500">{utilization}%</span>
                                    <div className="w-24 bg-slate-100 rounded-full h-2">
                                       <div
                                          className={`h-2 rounded-full ${utilization > 90 ? 'bg-rose-500' : 'bg-primary-500'}`}
                                          style={{ width: `${utilization}%` }}
                                       ></div>
                                    </div>
                                 </div>
                              </td>
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            </div>
         </div>
      </div>
   );
};