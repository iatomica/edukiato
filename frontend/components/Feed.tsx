import React, { useState } from 'react';
import { FeedItem } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, FileText, Upload, Bell, Filter, Search, Megaphone, BookOpen } from 'lucide-react';

interface FeedProps {
    items: FeedItem[];
    className?: string;
}

export const Feed: React.FC<FeedProps> = ({ items, className }) => {
    const [filterType, setFilterType] = useState<'ALL' | 'ANNOUNCEMENT' | 'MATERIAL' | 'ASSIGNMENT'>('ALL');
    const [filterScope, setFilterScope] = useState<'ALL' | 'INSTITUTION' | 'COURSE'>('ALL');

    const filteredItems = items.filter(item => {
        if (filterType !== 'ALL' && item.type !== filterType) return false;
        if (filterScope !== 'ALL' && item.scope !== filterScope) return false;
        return true;
    }).sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());

    const getIcon = (item: FeedItem) => {
        if (item.scope === 'INSTITUTION') return <Megaphone size={20} className="text-purple-600" />;
        switch (item.type) {
            case 'MATERIAL': return <FileText size={20} className="text-blue-600" />;
            case 'ASSIGNMENT': return <Upload size={20} className="text-orange-600" />;
            default: return <MessageSquare size={20} className="text-emerald-600" />;
        }
    };

    const getBgColor = (item: FeedItem) => {
        if (item.scope === 'INSTITUTION') return 'bg-purple-50 border-purple-100';
        switch (item.type) {
            case 'MATERIAL': return 'bg-blue-50 border-blue-100';
            case 'ASSIGNMENT': return 'bg-orange-50 border-orange-100';
            default: return 'bg-emerald-50 border-emerald-100';
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Timeline */}
            <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                {filteredItems.map((item) => (
                    <div key={item.id} className="relative pl-8 group">
                        {/* Timeline Connector */}
                        <div className={`absolute -left-[9px] top-0 p-1 rounded-full border-2 border-white box-content ${getBgColor(item)}`}>
                            {getIcon(item)}
                        </div>

                        {/* Content Card */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {item.scope === 'INSTITUTION' && (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700">
                                            Institucional
                                        </span>
                                    )}
                                    {item.scope === 'COURSE' && item.courseId && (
                                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 flex items-center">
                                            <BookOpen size={10} className="mr-1" />
                                            {item.courseId} {/* In real app, look up course title */}
                                        </span>
                                    )}
                                    <span className="text-xs text-slate-400">
                                        {formatDistanceToNow(new Date(item.postedAt), { addSuffix: true, locale: es })}
                                    </span>
                                </div>

                                {item.type === 'ASSIGNMENT' && item.status && (
                                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${item.status === 'PENDING' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {item.status}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 mb-1">{item.title}</h3>
                            <div
                                className="text-slate-600 text-sm leading-relaxed mb-4 prose prose-sm max-w-none prose-slate"
                                dangerouslySetInnerHTML={{ __html: item.description || '' }}
                            />

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 mr-2">
                                        {item.author.charAt(0)}
                                    </div>
                                    <span className="text-xs font-medium text-slate-500">{item.author}</span>
                                </div>

                                {item.type === 'ASSIGNMENT' && item.dueDate && (
                                    <span className="text-xs text-orange-600 font-medium flex items-center bg-orange-50 px-2 py-1 rounded">
                                        <Bell size={12} className="mr-1" />
                                        Vence: {new Date(item.dueDate).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredItems.length === 0 && (
                    <div className="text-center py-10">
                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Search size={20} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-sm">No hay publicaciones para mostrar</p>
                    </div>
                )}
            </div>
        </div>
    );
};
