import React, { useState } from 'react';
import { Search, Plus, Filter, X } from 'lucide-react';
import { View, Course, UserRole, CourseType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { usePermissions } from '../contexts/PermissionsContext';
import { useTenantData } from '../hooks/useTenantData';
import { COURSE_TYPES, getCourseTypeConfig } from '../services/courseTypeConfig';
import { useAuth } from '../contexts/AuthContext';
import { coursesApi } from '../services/api';

interface CoursesProps {
  onViewChange?: (view: View) => void;
  onCourseSelect: (courseId: string) => void;
  userRole: UserRole;
}

export const Courses: React.FC<CoursesProps> = ({ onViewChange, onCourseSelect, userRole }) => {
  const { t, language } = useLanguage();
  const { can } = usePermissions();
  const { courses, institutionId, emitEvent, dispatch } = useTenantData();
  const { currentInstitution, token } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New Course Form State
  const [newTitle, setNewTitle] = useState('');
  const [newInstructor, setNewInstructor] = useState('');
  const [newSchedule, setNewSchedule] = useState('');
  const [newCapacity, setNewCapacity] = useState('12');
  const [newDescription, setNewDescription] = useState('');
  const [newCourseType, setNewCourseType] = useState<CourseType>('REGULAR');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInstitution || !token) {
      console.error("Cannot create course: Missing institution or token.");
      return;
    }

    setIsLoading(true);
    try {
      const dto: Partial<Course> = {
        institutionId: currentInstitution.id,
        courseType: newCourseType,
        title: newTitle,
        instructor: newInstructor || 'TBD',
        schedule: newSchedule,
        capacity: parseInt(newCapacity),
        description: newDescription,
        // Default values for properties not in the form
        enrolled: 0,
        image: 'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?auto=format&fit=crop&q=80&w=800',
        tags: ['Nuevo'],
        nextSession: 'TBD',
      };

      const newCourse = await coursesApi.create(dto, token);

      dispatch({
        type: 'ADD_COURSE',
        payload: newCourse
      });

      emitEvent({ type: 'COURSE_CREATED', payload: newCourse });

      // Onboarding: Mark 'create_course' as complete
      dispatch({ type: 'COMPLETE_ONBOARDING_STEP', payload: 'create_course' });

      setIsCreateOpen(false);

      // Reset form
      setNewTitle('');
      setNewInstructor('');
      setNewSchedule('');
      setNewCapacity('12');
      setNewDescription('');
      setNewCourseType('REGULAR');

    } catch (error) {
      console.error("Failed to create course:", error);
      // Optionally, show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const canCreate = can('create', 'course');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t.courses.title}</h1>
          <p className="text-slate-500 mt-1">{t.courses.subtitle}</p>
        </div>

        {canCreate && (
          <button
            id="tour-courses-create"
            onClick={() => setIsCreateOpen(true)}
            className="bg-primary-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-primary-700 transition-colors flex items-center shadow-lg shadow-primary-200"
          >
            <Plus size={18} className="mr-2" />
            {t.courses.create}
          </button>
        )}
      </div>

      {/* Filters */}
      <div id="tour-courses-filter" className="flex items-center space-x-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-full md:w-auto self-start">
        <div className="relative flex-1 md:w-80">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t.courses.search}
            className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border-none focus:ring-0 placeholder-slate-400 text-slate-700"
          />
        </div>
        <div className="h-6 w-px bg-slate-200"></div>
        <button className="px-3 py-2 text-slate-500 hover:text-slate-800 transition-colors flex items-center text-sm font-medium">
          <Filter size={16} className="mr-2" />
          {t.courses.filter}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-primary-200 hover:shadow-xl hover:shadow-primary-50 transition-all duration-300">
            <div className="relative h-48 overflow-hidden">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                {(() => {
                  const cfg = getCourseTypeConfig(course);
                  const colorMap: Record<string, string> = {
                    indigo: 'bg-indigo-500/90 text-white',
                    amber: 'bg-amber-500/90 text-white',
                    emerald: 'bg-emerald-500/90 text-white',
                  };
                  return (
                    <span className={`px - 2.5 py - 1 backdrop - blur - md text - xs font - bold rounded - lg shadow - sm ${colorMap[cfg.color] || 'bg-slate-500/90 text-white'} `}>
                      {cfg.icon} {cfg.label[language]}
                    </span>
                  );
                })()}
                {course.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-white/90 backdrop-blur-md text-xs font-semibold text-slate-700 rounded-lg shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-primary-600 transition-colors">{course.title}</h3>
              <p className="text-slate-500 text-sm mb-4">{t.courses.by} {course.instructor}</p>

              <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 uppercase font-bold">{t.courses.schedule}</span>
                  <span className="font-medium">{course.schedule}</span>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-400 uppercase font-bold">{t.courses.capacity}</span>
                  <span className="font-medium">{course.enrolled} / {course.capacity}</span>
                </div>
              </div>

              {/* Type-Specific Details */}
              {(() => {
                const cfg = getCourseTypeConfig(course);
                const details: string[] = [];
                if (cfg.attendance.mode === 'MANDATORY') details.push(language === 'es' ? `Asistencia mín.${cfg.attendance.minRate}% ` : `Min.attendance ${cfg.attendance.minRate}% `);
                if (cfg.attendance.mode === 'FLEXIBLE') details.push(language === 'es' ? 'Asistencia flexible' : 'Flexible attendance');
                if (cfg.attendance.mode === 'NONE') details.push(language === 'es' ? 'Sin control de asistencia' : 'No attendance tracking');
                if (cfg.evaluation.hasProject) details.push(language === 'es' ? 'Evaluación por proyecto' : 'Project-based evaluation');
                if (cfg.evaluation.hasGrades) details.push(language === 'es' ? 'Calificaciones numéricas' : 'Numeric grades');
                if (cfg.certificate.autoGenerate) details.push(language === 'es' ? 'Certificado automático' : 'Auto certificate');
                if (cfg.schedule.mode === 'SINGLE') details.push(language === 'es' ? 'Evento único' : 'Single event');
                if (details.length === 0) return null;
                return (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {details.map(d => (
                      <span key={d} className="px-2 py-0.5 bg-slate-100 text-xs text-slate-500 rounded-md">
                        {d}
                      </span>
                    ))}
                  </div>
                );
              })()}

              <button
                onClick={() => onCourseSelect(course.id)}
                className="w-full mt-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-900 hover:text-white transition-colors"
              >
                {t.courses.goToClassroom}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">{t.courses.createModal.title}</h3>
              <button onClick={() => setIsCreateOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Course Type Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {language === 'es' ? 'Tipo de Curso' : 'Course Type'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COURSE_TYPES.map(ct => {
                    const colorMap: Record<string, { active: string; inactive: string }> = {
                      indigo: { active: 'bg-indigo-50 border-indigo-400 text-indigo-700', inactive: 'bg-white border-slate-200 text-slate-600 hover:border-indigo-200' },
                      amber: { active: 'bg-amber-50 border-amber-400 text-amber-700', inactive: 'bg-white border-slate-200 text-slate-600 hover:border-amber-200' },
                      emerald: { active: 'bg-emerald-50 border-emerald-400 text-emerald-700', inactive: 'bg-white border-slate-200 text-slate-600 hover:border-emerald-200' },
                    };
                    const colors = colorMap[ct.color] || colorMap.indigo;
                    const isActive = newCourseType === ct.id;
                    return (
                      <button
                        key={ct.id}
                        type="button"
                        onClick={() => setNewCourseType(ct.id)}
                        className={`p - 3 rounded - xl border - 2 text - center transition - all duration - 200 ${isActive ? colors.active + ' shadow-sm' : colors.inactive
                          } `}
                      >
                        <span className="text-lg block mb-0.5">{ct.icon}</span>
                        <span className="text-xs font-bold block">{ct.label[language]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.courses.createModal.courseName}</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.courses.createModal.instructor}</label>
                  <input
                    type="text"
                    required
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.courses.createModal.capacity}</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.courses.createModal.schedule}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mon/Wed 10:00 AM"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.courses.createModal.description}</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                ></textarea>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-6 py-2.5 text-slate-500 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                  disabled={isLoading}
                >
                  {t.courses.createModal.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
                >
                  {isLoading ? t.courses.createModal.create : t.courses.createModal.create}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
