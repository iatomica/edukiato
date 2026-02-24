import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole } from '../types';
import { Search, Send, UserPlus, X, Mail, Phone, Video, MoreVertical, Paperclip, CheckCheck, Users as UsersIcon, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useAppState } from '../contexts/AppStateContext';
import { usersApi } from '../services/api';
import { MOCK_MESSAGES } from '../services/mockData';

export const Messages: React.FC = () => {
  const { user: currentUser, currentInstitution, token } = useAuth();
  const { state } = useAppState();

  // Directory State
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Chat State
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [messagesState, setMessagesState] = useState(MOCK_MESSAGES);

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isAdmin = currentUser?.role === 'ADMIN_INSTITUCION' || isSuperAdmin;
  const isDocente = currentUser?.role === 'DOCENTE';
  const isEspecial = currentUser?.role === 'ESPECIALES';

  // 1. Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!token || !currentInstitution) return;
      try {
        // In a real app we'd fetch ALL users for this institution and then filter in backend.
        // Here we fetch all from mock and filter based on Role rules.
        const data = await usersApi.getAll(currentInstitution.id, token);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [currentInstitution, token]);

  // 2. Filter Visible Users Based on Rules
  const visibleUsers = useMemo(() => {
    if (!currentUser) return [];
    let filtered = users;

    if (isAdmin) {
      // Admins see everyone
      filtered = users;
    } else if (isDocente) {
      // Docentes see: SuperAdmins, Admins, other Docentes, Especiales OR Parents of kids in their aulas.
      const myAulas = state.aulas.filter(a => a.teachers.includes(currentUser.id)).map(a => a.id);
      const myKidsParentIds = state.ninos.filter(n => myAulas.includes(n.aulaId)).map(n => n.parentId);

      filtered = users.filter(u =>
        u.role === 'SUPER_ADMIN' ||
        u.role === 'ADMIN_INSTITUCION' ||
        u.role === 'DOCENTE' ||
        u.role === 'ESPECIALES' ||
        (u.role === 'PADRE' && myKidsParentIds.includes(u.id))
      );
    } else if (isEspecial) {
      // Especiales see: Staff only. No parents.
      filtered = users.filter(u =>
        u.role === 'SUPER_ADMIN' ||
        u.role === 'ADMIN_INSTITUCION' ||
        u.role === 'DOCENTE' ||
        u.role === 'ESPECIALES'
      );
    } else if (currentUser.role === 'PADRE') {
      // Parents see: Admins and Docentes of their kids
      const myKidsAulaIds = state.ninos.filter(n => n.parentId === currentUser.id).map(n => n.aulaId);
      const myKidsTeacherIds = state.aulas.filter(a => myKidsAulaIds.includes(a.id)).flatMap(a => a.teachers);

      filtered = users.filter(u =>
        u.role === 'SUPER_ADMIN' ||
        u.role === 'ADMIN_INSTITUCION' ||
        (u.role === 'DOCENTE' && myKidsTeacherIds.includes(u.id))
      );
    }

    // Exclude self from directory
    filtered = filtered.filter(u => u.id !== currentUser.id);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    return filtered;
  }, [users, currentUser, isAdmin, isDocente, isEspecial, state.aulas, state.ninos, searchQuery]);

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !currentInstitution) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const role = formData.get('role') as UserRole;

    try {
      const newUser = await usersApi.create(
        { name, email, role },
        currentInstitution.id,
        token
      );
      setUsers([...users, newUser]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedUserId) return;

    const newMessage = {
      id: `new-${Date.now()}`,
      senderId: 'me',
      content: inputText,
      timestamp: new Date(),
      isRead: false
    };

    const chatId = `chat_${currentUser?.id}_${selectedUserId}`;

    setMessagesState(prev => ({
      ...prev,
      [selectedUserId]: [...(prev[selectedUserId] || []), newMessage]
    }));
    setInputText('');
  };

  const selectedUser = visibleUsers.find(u => u.id === selectedUserId);
  const currentMessages = selectedUser ? (messagesState[selectedUserId] || []) : [];

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-800';
      case 'ADMIN_INSTITUCION': return 'bg-amber-100 text-amber-800';
      case 'DOCENTE': return 'bg-blue-100 text-blue-800';
      case 'ESPECIALES': return 'bg-emerald-100 text-emerald-800';
      case 'PADRE': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    if (role === 'ADMIN_INSTITUCION') return 'ADMIN';
    if (role === 'SUPER_ADMIN') return 'DUEÑA';
    return role;
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Sidebar Directory List */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">Directorio y Chat</h2>
            {isAdmin && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="p-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                title="Añadir Usuario"
              >
                <UserPlus size={18} />
              </button>
            )}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar contactos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {isLoadingUsers ? (
            <div className="text-center p-4 text-slate-500 text-sm">Cargando directorio...</div>
          ) : visibleUsers.length > 0 ? (
            visibleUsers.map(u => {
              const hasUnread = false; // Mock
              const roleLabel = getRoleLabel(u.role);
              const myKids = state.ninos.filter(n => n.parentId === u.id);
              const displayName = u.role === 'PADRE' && myKids.length > 0
                ? `Familia de ${myKids.map(k => k.name.split(' ')[0]).join(', ')}`
                : u.name;

              return (
                <button
                  key={u.id}
                  onClick={() => setSelectedUserId(u.id)}
                  className={`w-full flex items-center p-3 rounded-xl mb-1 transition-colors ${selectedUserId === u.id ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-100'}`}
                >
                  <div className="relative">
                    <img src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    {hasUnread && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div className="ml-3 text-left flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className={`text-sm font-semibold truncate ${selectedUserId === u.id ? 'text-primary-700' : 'text-slate-700'}`}>{displayName}</p>
                    </div>
                    <p className={`text-[10px] font-bold mt-0.5 inline-block px-1.5 rounded-sm ${getRoleBadgeColor(u.role)}`}>
                      {roleLabel}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center p-4 text-slate-500 text-sm">No se encontraron contactos.</div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
            <div className="flex items-center">
              <img src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}`} className="w-10 h-10 object-cover mr-4 rounded-full border border-slate-200" alt="" />
              <div>
                <h3 className="font-bold text-slate-800">
                  {selectedUser.role === 'PADRE' && state.ninos.filter(n => n.parentId === selectedUser.id).length > 0
                    ? `Familia de ${state.ninos.filter(n => n.parentId === selectedUser.id).map(k => k.name.split(' ')[0]).join(', ')} (${selectedUser.name})`
                    : selectedUser.name}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className={`px-1.5 rounded font-medium ${getRoleBadgeColor(selectedUser.role)}`}>{getRoleLabel(selectedUser.role)}</span>
                  <span className="flex items-center"><Mail size={10} className="mr-1" /> {selectedUser.email}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <button className="p-2 hover:bg-slate-50 hover:text-primary-600 rounded-full transition-colors"><Phone size={20} /></button>
              <button className="p-2 hover:bg-slate-50 hover:text-primary-600 rounded-full transition-colors"><Video size={20} /></button>
              <button className="p-2 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors"><MoreVertical size={20} /></button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {currentMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare size={24} className="text-slate-300" />
                </div>
                <p className="text-sm">Inicia una conversación con {selectedUser.name}</p>
              </div>
            ) : (
              currentMessages.map((msg, idx) => {
                const isMe = msg.senderId === 'me';
                const showAvatar = idx === 0 || currentMessages[idx - 1].senderId !== msg.senderId;

                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && (
                      <div className="w-8 mr-2 flex-shrink-0">
                        {showAvatar && <img src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}`} className="w-8 h-8 rounded-full border border-slate-200" alt="Sender" />}
                      </div>
                    )}
                    <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
                      <div className={`px-4 py-2 rounded-2xl shadow-sm text-sm ${isMe
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
                        }`}>
                        {msg.content}
                      </div>
                      <div className={`text-[10px] text-slate-400 mt-1 flex items-center ${isMe ? 'justify-end' : 'justify-start'}`}>
                        {format(new Date(msg.timestamp), 'h:mm a')}
                        {isMe && <CheckCheck size={12} className="ml-1 text-primary-400" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-300 transition-all">
              <button type="button" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Enviar mensaje a ${selectedUser.name.split(' ')[0]}...`}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 placeholder:text-slate-400 outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/30">
          <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-6">
            <UsersIcon size={32} className="text-slate-300" />
          </div>
          <h3 className="text-lg font-medium text-slate-600 mb-1">Directorio de Usuarios</h3>
          <p className="text-sm max-w-sm text-center">Selecciona un contacto en la lista lateral para ver su perfil o iniciar una conversación.</p>
        </div>
      )}

      {/* Add Modal (Only for Admins) */}
      {isAddModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center">
                <UserPlus size={20} className="mr-2 text-primary-600" />
                Nuevo Usuario
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none"
                  placeholder="Ej. Juan Pérez"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none"
                  placeholder="juan@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rol</label>
                <select
                  name="role"
                  required
                  className="w-full text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-100 focus:border-primary-400 p-3 outline-none bg-white font-medium"
                >
                  <option value="PADRE">Familia / Padre</option>
                  <option value="DOCENTE">Docente</option>
                  <option value="ESPECIALES">Profesor Especial / Staff</option>
                  <option value="ADMIN_INSTITUCION">Administrador Institucional</option>
                  {isSuperAdmin && (
                    <option value="SUPER_ADMIN">Super Administrador (Dueño)</option>
                  )}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-500 font-medium hover:text-slate-700 transition-colors">Cancelar</button>
                <button type="submit" className="px-6 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-200">
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};