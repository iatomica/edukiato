import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Plus, Loader2, AlertCircle, X, Calendar, User as UserIcon } from 'lucide-react';
import { AcademicReport } from '../types';
import { reportsApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTenantData } from '../hooks/useTenantData';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { RichTextEditor } from './RichTextEditor';

interface AcademicReportsTabProps {
    studentId: string;
}

export default function AcademicReportsTab({ studentId }: AcademicReportsTabProps) {
    const { token, user } = useAuth();
    // 'students' in useTenantData actually holds all tenant users for mock mapping
    const { students } = useTenantData();

    const [reports, setReports] = useState<AcademicReport[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewReport, setViewReport] = useState<AcademicReport | null>(null);

    // Form states
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const loadReports = useCallback(async () => {
        if (!token) return;
        try {
            setIsLoading(true);
            const data = await reportsApi.getByStudent(studentId, token);
            setReports(data);
            setError(null);
        } catch (err) {
            console.error('Fetch reports failed:', err);
            // Fail gracefully as requested by user. If it fails, assume no reports.
            setReports([]);
            setError(null);
        } finally {
            setIsLoading(false);
        }
    }, [studentId, token]);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    const handleCreateReport = async () => {
        if (!title.trim() || !content.trim() || !token) {
            setError('Debes completar el título y el contenido.');
            return;
        }

        setError(null);
        setIsSaving(true);
        try {
            await reportsApi.create(studentId, title, content, token);
            await loadReports();

            // Reset form and close
            setTitle('');
            setContent('');
            setIsCreateModalOpen(false);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error al guardar el informe');
        } finally {
            setIsSaving(false);
        }
    };

    const getAuthorName = (uploaderId: string) => {
        const author = students.find(s => s.id === uploaderId);
        return author ? author.name : (user?.id === uploaderId ? user.name : 'Autor Desconocido');
    };

    return (
        <div className="space-y-6 animate-fade-in relative">
            {/* Header / Actions */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-800 flex items-center gap-2">
                    <FileText size={18} className="text-primary-500" /> Documentación e Informes
                </h3>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/40 hover:-translate-y-0.5 text-sm"
                >
                    <Plus size={18} /> Agregar Informe
                </button>
            </div>

            {error && !isCreateModalOpen && (
                <div className="bg-rose-50 text-rose-700 p-3 rounded-lg border border-rose-200 flex items-center gap-2 text-sm font-medium">
                    <AlertCircle size={16} /> {error}
                </div>
            )}

            {/* List */}
            {isLoading ? (
                <div className="flex justify-center p-8 bg-white rounded-xl border border-slate-200">
                    <Loader2 className="animate-spin text-slate-400" size={32} />
                </div>
            ) : reports.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm border-dashed text-center text-slate-500 hover:border-primary-300 transition-colors">
                    <FileText size={48} className="mx-auto mb-4 text-slate-300 opacity-50" />
                    <p className="font-bold text-lg text-slate-700">Sin informes registrados</p>
                    <p className="text-sm mt-1 mb-4">No hay documentación académica para este alumno aún.</p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-4 bg-primary-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-700 transition-all hover:-translate-y-1 shadow-lg shadow-primary-200 flex items-center justify-center mx-auto gap-2 text-base"
                    >
                        <Plus size={20} />
                        Redactar Primer Informe
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            onClick={() => setViewReport(report)}
                            className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between cursor-pointer transition-all hover:shadow-md hover:border-primary-300 group"
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="p-3 bg-indigo-50 text-indigo-500 rounded-lg shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                    <FileText size={20} />
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-slate-800 truncate mb-1">
                                        {report.title}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                                        <span className="flex items-center gap-1"><Calendar size={13} /> {format(new Date(report.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}</span>
                                        <span className="flex items-center gap-1"><UserIcon size={13} /> {getAuthorName(report.uploaderId)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Creation Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex justify-center items-center p-4 sm:p-6 pb-20 sm:pb-6 animate-fade-in">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isSaving && setIsCreateModalOpen(false)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                <FileText className="text-primary-500" size={20} /> Redactar Nuevo Informe
                            </h2>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                disabled={isSaving}
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
                            {error && (
                                <div className="bg-rose-50 text-rose-700 p-3 rounded-lg border border-rose-200 flex items-center gap-2 text-sm font-medium">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Título del Informe</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Reporte Disciplinario de Marzo, Evaluación Trimestral..."
                                    className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 bg-slate-50 focus:bg-white font-medium text-slate-800 transition-all placeholder:font-normal"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    disabled={isSaving}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5 flex justify-between items-center">
                                    Cuerpo del Informe
                                    <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Editor Enriquecido</span>
                                </label>
                                <RichTextEditor
                                    value={content}
                                    onChange={setContent}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                disabled={isSaving}
                                className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateReport}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm shadow-primary-500/20"
                            >
                                {isSaving ? (
                                    <><Loader2 size={18} className="animate-spin" /> Guardando...</>
                                ) : (
                                    <>Guardar Informe</>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* View Modal */}
            {viewReport && (
                <div className="fixed inset-0 z-[100] flex justify-center items-center p-4 sm:p-6 pb-20 sm:pb-6 animate-fade-in">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setViewReport(null)}></div>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">

                        {/* Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
                            <div>
                                <h2 className="text-xl font-black text-slate-800">
                                    {viewReport.title}
                                </h2>
                                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 font-medium mt-2">
                                    <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                                        <UserIcon size={14} /> Elaborado por {getAuthorName(viewReport.uploaderId)}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} /> {format(new Date(viewReport.createdAt), "PPP 'a las' p", { locale: es })}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewReport(null)}
                                className="p-2 -mr-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body Content */}
                        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-50/50 flex-1">
                            <div
                                className="prose prose-sm sm:prose-base max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-a:text-primary-600 prose-ul:list-disc prose-ol:list-decimal text-slate-700 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200"
                                dangerouslySetInnerHTML={{ __html: viewReport.content }}
                            />
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
                            <button
                                onClick={() => setViewReport(null)}
                                className="px-6 py-2.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
