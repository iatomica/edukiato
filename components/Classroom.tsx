
import React, { useState, useEffect } from 'react';
import { Video, FileText, Link as LinkIcon, Upload, MessageSquare, Clock, CheckCircle, ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { FeedItem, User, UserRole } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenantData } from '../hooks/useTenantData';

interface FeedCardProps {
  item: FeedItem;
  submittingId: string | null;
  setSubmittingId: (id: string | null) => void;
  submissionText: string;
  setSubmissionText: (text: string) => void;
  handleSubmit: (e: React.FormEvent, id: string) => void;
}

const FeedCard: React.FC<FeedCardProps> = ({
  item,
  submittingId,
  setSubmittingId,
  submissionText,
  setSubmissionText,
  handleSubmit
}) => {
  const isMaterial = item.type === 'MATERIAL';
  const isAssignment = item.type === 'ASSIGNMENT';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up">
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl flex-shrink-0 ${isMaterial ? 'bg-blue-50 text-blue-600' :
          isAssignment ? 'bg-orange-50 text-orange-600' :
            'bg-slate-100 text-slate-600'
          }`}>
          {isMaterial && item.materialType === 'VIDEO' ? <Video size={24} /> :
            isMaterial && item.materialType === 'PDF' ? <FileText size={24} /> :
              isMaterial ? <LinkIcon size={24} /> :
                isAssignment ? <Upload size={24} /> :
                  <MessageSquare size={24} />}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Posted by {item.author} • {format(item.postedAt, 'MMM d, h:mm a')}
              </p>
            </div>
            {isAssignment && (
              <div className="text-right">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Due {item.dueDate && format(item.dueDate, 'MMM d')}
                </div>
              </div>
            )}
          </div>

          <p className="text-slate-600 mt-3 text-sm leading-relaxed whitespace-pre-wrap">{item.description}</p>

          {/* Material Action */}
          {isMaterial && (
            <a href={item.url} className="mt-4 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700">
              View Material <ArrowRight size={16} className="ml-1" />
            </a>
          )}

          {/* Assignment Action */}
          {isAssignment && item.status === 'PENDING' && (
            <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-100">
              {submittingId === item.id ? (
                <form onSubmit={(e) => handleSubmit(e, item.id)}>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Submit your work</label>
                  <textarea
                    className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none"
                    rows={3}
                    placeholder="Paste a link to your work or write a description..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    required
                  ></textarea>
                  <div className="mt-2 flex space-x-2">
                    <button type="submit" className="px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800">Submit</button>
                    <button type="button" onClick={() => setSubmittingId(null)} className="px-4 py-2 text-slate-600 text-sm font-medium hover:text-slate-800">Cancel</button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setSubmittingId(item.id)}
                  className="w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 flex items-center justify-center shadow-sm"
                >
                  <Upload size={16} className="mr-2" />
                  Submit Assignment
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ClassroomProps {
  courseId: string;
  user: User;
  onBack?: () => void;
}

export const Classroom: React.FC<ClassroomProps> = ({ courseId, user, onBack }) => {
  const { t } = useLanguage();
  const { courses, feed: tenantFeed, institutionId, emitEvent, dispatch } = useTenantData();
  const course = courses.find(c => c.id === courseId) || courses[0];

  // Onboarding: Mark 'explore_courses' as complete for students visiting this view
  useEffect(() => {
    if (user.role === 'ESTUDIANTE') {
      dispatch({ type: 'COMPLETE_ONBOARDING_STEP', payload: 'explore_courses' });
    }
  }, [user.role, dispatch]);

  // Feed filtered by course — reads live from AppState
  const feed = tenantFeed.filter(f => f.courseId === (course?.id ?? ''));

  // Submission State
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState('');

  // Add Material Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addType, setAddType] = useState<'ANNOUNCEMENT' | 'MATERIAL' | 'ASSIGNMENT'>('ANNOUNCEMENT');
  const [addTitle, setAddTitle] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [addUrl, setAddUrl] = useState('');

  const handleSubmit = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    setSubmittingId(null);
    setSubmissionText('');
    alert('Work submitted successfully!');
  };

  const handleAddContent = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: FeedItem = {
      id: `f_${Date.now()}`,
      institutionId: institutionId || '',
      scope: 'COURSE',
      courseId: course?.id ?? '',
      type: addType,
      title: addTitle,
      description: addDesc,
      postedAt: new Date(),
      author: user.name,
      url: addUrl,
      materialType: addType === 'MATERIAL' ? 'LINK' : undefined,
      status: addType === 'ASSIGNMENT' ? 'PENDING' : undefined,
      dueDate: addType === 'ASSIGNMENT' ? new Date(Date.now() + 86400000 * 7) : undefined
    };

    // Add to centralized state
    dispatch({ type: 'ADD_FEED_ITEM', payload: newItem });
    // Trigger cross-module side-effects (notification, calendar for assignments)
    emitEvent({ type: 'CONTENT_PUBLISHED', payload: newItem });

    // Onboarding: Mark 'publish_content' as complete for teachers
    if (user.role === 'DOCENTE') {
      dispatch({ type: 'COMPLETE_ONBOARDING_STEP', payload: 'publish_content' });
    }

    setIsAddOpen(false);

    // Reset
    setAddTitle('');
    setAddDesc('');
    setAddUrl('');
    setAddType('ANNOUNCEMENT');
  };

  const canEdit = user.role === 'ADMIN_INSTITUCION' || user.role === 'DOCENTE';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">

      {/* Back Button */}
      <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium">
        <ArrowLeft size={18} className="mr-2" />
        {t.classroom.back}
      </button>

      {/* Classroom Header */}
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
        <div className="h-32 bg-gradient-to-r from-indigo-900 to-slate-800 relative">
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        <div className="p-6 pt-0 relative">
          <div className="absolute -top-10 left-6">
            <div className="w-20 h-20 bg-white rounded-xl shadow-lg p-1">
              <img src={course.image} className="w-full h-full object-cover rounded-lg" alt="Course" />
            </div>
          </div>
          <div className="pl-24 pt-2 flex flex-col sm:flex-row sm:justify-between sm:items-end">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{course.title}</h1>
              <p className="text-slate-500 text-sm font-medium">{t.classroom.instructor}: {course.instructor}</p>
            </div>

            {/* Virtual Class Link */}
            <a href="#" className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition-all transform active:scale-95">
              <Video size={20} className="mr-2 animate-pulse" />
              {t.classroom.joinLive}
            </a>
          </div>
        </div>
      </div>

      {/* Stream */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-slate-800">{t.classroom.stream}</h2>
            <div className="flex items-center text-sm text-slate-400">
              <span className="mr-2">{t.classroom.sortBy}:</span>
              <span className="font-medium text-slate-600">{t.classroom.newest}</span>
            </div>
          </div>

          {/* Quick Create (Teacher Only) */}
          {canEdit && (
            <div
              onClick={() => setIsAddOpen(true)}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-3 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                <Plus size={24} />
              </div>
              <span className="text-slate-500 text-sm font-medium">{t.classroom.createPost}</span>
            </div>
          )}

          {feed.length > 0 ? (
            feed.map(item => (
              <FeedCard
                key={item.id}
                item={item}
                submittingId={submittingId}
                setSubmittingId={setSubmittingId}
                submissionText={submissionText}
                setSubmissionText={setSubmissionText}
                handleSubmit={handleSubmit}
              />
            ))
          ) : (
            <div className="text-center py-10 text-slate-400">
              <p>No activity yet.</p>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center">
              <Clock size={18} className="mr-2 text-slate-400" />
              {t.classroom.upcomingDue}
            </h3>
            <div className="space-y-4">
              {feed.filter(i => i.type === 'ASSIGNMENT').slice(0, 3).map(assign => (
                <div key={assign.id} className="flex items-start">
                  <div className="mt-1 w-2 h-2 rounded-full bg-orange-500 mr-3"></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 line-clamp-1">{assign.title}</p>
                    <p className="text-xs text-slate-500">
                      {assign.dueDate ? format(assign.dueDate, 'MMM d') : 'No date'}
                    </p>
                  </div>
                </div>
              ))}
              {feed.filter(i => i.type === 'ASSIGNMENT').length === 0 && (
                <p className="text-sm text-slate-400 italic">No assignments due.</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-2">About this Course</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {course.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>

      {/* Add Content Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-lg">{t.classroom.addMaterial.title}</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddContent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.classroom.addMaterial.type}</label>
                <div className="flex gap-2">
                  {[
                    { id: 'ANNOUNCEMENT', label: t.classroom.addMaterial.types.announcement },
                    { id: 'MATERIAL', label: t.classroom.addMaterial.types.material },
                    { id: 'ASSIGNMENT', label: t.classroom.addMaterial.types.assignment }
                  ].map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setAddType(type.id as any)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${addType === type.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.classroom.addMaterial.titleLabel}</label>
                <input
                  type="text"
                  required
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t.classroom.addMaterial.descLabel}</label>
                <textarea
                  rows={3}
                  required
                  value={addDesc}
                  onChange={(e) => setAddDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                ></textarea>
              </div>
              {addType !== 'ANNOUNCEMENT' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.classroom.addMaterial.urlLabel}</label>
                  <input
                    type="url"
                    placeholder="https://"
                    value={addUrl}
                    onChange={(e) => setAddUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700">
                  {t.classroom.addMaterial.cancel}
                </button>
                <button type="submit" className="px-6 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700">
                  {t.classroom.addMaterial.publish}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
