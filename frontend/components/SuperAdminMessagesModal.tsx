import React, { useState, useEffect } from 'react';
import { X, Search, MessageSquare, ShieldAlert } from 'lucide-react';
import { messagesApi, usersApi } from '@/services/api';
import { User, Message } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatar } from '@/components/UserAvatar';

interface SuperAdminMessagesModalProps {
    targetUser: User;
    onClose: () => void;
}

export const SuperAdminMessagesModal: React.FC<SuperAdminMessagesModalProps> = ({ targetUser, onClose }) => {
    const { token, currentInstitution } = useAuth();
    const [conversations, setConversations] = useState<{ contactId: string, lastMessage: Message, unreadCount: number }[]>([]);
    const [selectedContact, setSelectedContact] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [usersDirectory, setUsersDirectory] = useState<Map<string, User>>(new Map());
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const initializeData = async () => {
            if (!token || !currentInstitution) return;
            try {
                const [convsData, usersData] = await Promise.all([
                    messagesApi.getAdminConversations(targetUser.id, token),
                    usersApi.getAll(currentInstitution.id, token),
                ]);

                setConversations(convsData);

                const dir = new Map<string, User>();
                usersData.forEach(u => dir.set(u.id, u));
                setUsersDirectory(dir);
            } catch (error) {
                console.error("Error fetching admin messages data:", error);
            } finally {
                setIsLoadingConversations(false);
            }
        };

        initializeData();
    }, [targetUser.id, token, currentInstitution]);

    const handleSelectContact = async (contactId: string) => {
        const contact = usersDirectory.get(contactId);
        if (contact) {
            setSelectedContact(contact);
            setIsLoadingMessages(true);
            try {
                if (token) {
                    const msgs = await messagesApi.getAdminMessages(targetUser.id, contactId, token);
                    setMessages(msgs);
                }
            } catch (error) {
                console.error("Error fetching admin messages:", error);
            } finally {
                setIsLoadingMessages(false);
            }
        }
    };

    const filteredConversations = conversations.filter(conv => {
        if (!searchQuery) return true;
        const contact = usersDirectory.get(conv.contactId);
        return contact?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-50 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mr-3 shrink-0">
                            <ShieldAlert size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg flex items-center">
                                Monitoreo de Conversaciones
                            </h3>
                            <p className="text-xs text-slate-500 flex items-center">
                                Visualizando historial de: <strong className="ml-1 text-slate-700">{targetUser.name}</strong>
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Main Content Layout */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar: Conversations List */}
                    <div className="w-1/3 border-r border-slate-200 bg-white flex flex-col">
                        <div className="p-3 border-b border-slate-100 bg-white shrink-0">
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar conversación..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all bg-slate-50"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {isLoadingConversations ? (
                                <div className="p-8 text-center text-slate-500">Cargando conversaciones...</div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">No se encontraron conversaciones.</div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {filteredConversations.map(conv => {
                                        const contact = usersDirectory.get(conv.contactId);
                                        if (!contact) return null;
                                        return (
                                            <button
                                                key={conv.contactId}
                                                onClick={() => handleSelectContact(conv.contactId)}
                                                className={`w-full p-3 flex items-start text-left hover:bg-slate-50 transition-colors ${selectedContact?.id === conv.contactId ? 'bg-amber-50/50 relative' : ''}`}
                                            >
                                                {selectedContact?.id === conv.contactId && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r-full" />
                                                )}
                                                <UserAvatar name={contact.name} role={contact.role} className="w-10 h-10 border border-slate-200 shrink-0 mt-0.5" />
                                                <div className="ml-3 flex-1 min-w-0">
                                                    <div className="flex justify-between items-baseline mb-0.5">
                                                        <h4 className="text-sm font-bold text-slate-800 truncate">{contact.name}</h4>
                                                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                                                            {new Date(conv.lastMessage?.timestamp).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 truncate">{conv.lastMessage?.content || 'Mensaje'}</p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Area: Chat History */}
                    <div className="w-2/3 bg-slate-50 flex flex-col relative">
                        {selectedContact ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-3 bg-white border-b border-slate-200 flex items-center shrink-0 shadow-sm z-10">
                                    <UserAvatar name={selectedContact.name} role={selectedContact.role} className="w-9 h-9 border border-slate-200" />
                                    <div className="ml-3">
                                        <h4 className="text-sm font-bold text-slate-800 leading-tight">{selectedContact.name}</h4>
                                        <span className="text-[10px] uppercase font-bold text-slate-500">{selectedContact.role.replace('_', ' ')}</span>
                                    </div>
                                </div>

                                {/* Messages Overflow Area */}
                                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col gap-3">
                                    {isLoadingMessages ? (
                                        <div className="flex-1 flex items-center justify-center text-slate-400">
                                            <div className="animate-spin w-8 h-8 border-2 border-slate-200 border-t-amber-500 rounded-full" />
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                            <MessageSquare size={32} className="mb-2 opacity-50" />
                                            <p className="text-sm">No hay historial de mensajes disponible.</p>
                                        </div>
                                    ) : (
                                        messages.map((msg, index) => {
                                            const isTargetSender = msg.senderId === targetUser.id;
                                            const showAvatar = index === messages.length - 1 || messages[index + 1]?.senderId !== msg.senderId;

                                            return (
                                                <div key={msg.id} className={`flex max-w-[85%] ${isTargetSender ? 'self-end flex-row-reverse' : 'self-start'}`}>
                                                    <div className="flex-shrink-0 w-8 flex flex-col justify-end">
                                                        {showAvatar && (
                                                            <UserAvatar
                                                                name={isTargetSender ? targetUser.name : selectedContact.name}
                                                                role={isTargetSender ? targetUser.role : selectedContact.role}
                                                                className="w-6 h-6 border border-slate-200"
                                                            />
                                                        )}
                                                    </div>

                                                    <div className={`mx-2 rounded-2xl px-4 py-2 shadow-sm ${isTargetSender
                                                            ? 'bg-amber-100 text-amber-900 rounded-br-sm'
                                                            : 'bg-white text-slate-800 rounded-bl-sm border border-slate-100'
                                                        }`}>
                                                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                                        {msg.file && (
                                                            <div className="mt-2 p-2 bg-black/5 rounded-lg flex items-center text-xs">
                                                                <span className="font-medium truncate mr-2">{msg.file.name}</span>
                                                                <span className="opacity-50 min-w-max">{(msg.file.size / 1024).toFixed(1)} KB</span>
                                                            </div>
                                                        )}
                                                        <div className={`text-[10px] mt-1 text-right ${isTargetSender ? 'text-amber-700/60' : 'text-slate-400'}`}>
                                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Read-Only Footnote */}
                                <div className="p-3 bg-white border-t border-slate-200 shrink-0 text-center">
                                    <p className="text-xs text-amber-600 font-medium flex items-center justify-center">
                                        <ShieldAlert size={14} className="mr-1.5" /> Estás visualizando este chat en modo lectura (Solo auditoría).
                                    </p>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 text-slate-300">
                                    <MessageSquare size={32} />
                                </div>
                                <p className="font-medium text-slate-500">Selecciona una conversación</p>
                                <p className="text-sm text-slate-400 mt-1">Podrás ver el historial completo de mensajes.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
