import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole } from '../types';
import { Search, Send, UserPlus, X, Mail, Phone, Video, MoreVertical, Paperclip, CheckCheck, Users as UsersIcon, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { useAppState } from '../contexts/AppStateContext';
import { usersApi, messagesApi } from '../services/api';

export const Messages: React.FC<{ initialUserId?: string | null }> = ({ initialUserId }) => {
  const { user: currentUser, currentInstitution, token } = useAuth();
  const { state } = useAppState();

  // Directory State
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sidebar Tab State
  const [sidebarTab, setSidebarTab] = useState<'chats' | 'contacts'>('chats');
  const [conversations, setConversations] = useState<{ contactId: string, lastMessage: any }[]>([]);

  // Chat State
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialUserId || null);
  const [inputText, setInputText] = useState('');
  const [messagesState, setMessagesState] = useState<Record<string, any[]>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  // Load Conversations List
  const fetchConversations = async () => {
    if (!currentUser || !token) return;
    try {
      const result = await messagesApi.getConversations(currentUser.id, token);
      setConversations(result);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [currentUser, token]); // Initialize on mount and user change

  // Load Messages for Selected User
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser || !selectedUserId || !token) return;
      try {
        const msgs = await messagesApi.getMessages(currentUser.id, selectedUserId, token);
        setMessagesState(prev => ({ ...prev, [selectedUserId]: msgs }));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [selectedUserId, currentUser, token]);

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
      const myKidsParentIds = state.ninos.filter(n => myAulas.includes(n.aulaId)).flatMap(n => n.parentIds || []);

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
      const myKidsAulaIds = state.ninos.filter(n => n.parentIds?.includes(currentUser.id)).map(n => n.aulaId);
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

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      alert("El archivo supera el límite de 10MB.");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && !selectedFile) || !selectedUserId || !currentUser || !token) return;

    const tempText = inputText;
    const fileToSend = selectedFile;

    setInputText('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    try {
      let fileData = undefined;

      if (fileToSend) {
        // In a real app we would upload the file to a server/S3 and get a URL.
        // For the mock, we create a generic URL or use objectURL if you want preview
        const fakeUrl = URL.createObjectURL(fileToSend);
        fileData = {
          name: fileToSend.name,
          url: fakeUrl,
          type: fileToSend.type,
          size: fileToSend.size
        };
      }

      const newMessage = await messagesApi.sendMessage(
        currentUser.id,
        selectedUserId,
        fileData && !tempText ? `\uD83D\uDCCE Archivo adjunto: ${fileData.name}` : tempText,
        token,
        fileData
      );

      setMessagesState(prev => ({
        ...prev,
        [selectedUserId]: [...(prev[selectedUserId] || []), newMessage]
      }));

      // Refresh conversations list to update order and last message, and handle new chats
      fetchConversations();

      // If we were in 'contacts' tab and started talking, auto-switch to 'chats' tab
      if (sidebarTab === 'contacts') {
        setSidebarTab('chats');
      }

    } catch (error) {
      console.error("Failed to send message", error);
    }
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
            <h2 className="text-xl font-bold text-slate-900">Mensajes</h2>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-lg mb-4">
            <button
              onClick={() => setSidebarTab('chats')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${sidebarTab === 'chats' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Chats
            </button>
            <button
              onClick={() => setSidebarTab('contacts')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${sidebarTab === 'contacts' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Directorio
            </button>
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
            <div className="text-center p-4 text-slate-500 text-sm">Cargando...</div>
          ) : sidebarTab === 'contacts' ? (
            // Contacts List View
            visibleUsers.length > 0 ? (
              visibleUsers.map(u => {
                const roleLabel = getRoleLabel(u.role);
                const myKids = state.ninos.filter(n => n.parentIds?.includes(u.id));
                const displayName = u.role === 'PADRE' && myKids.length > 0
                  ? `Familia de ${myKids.map(k => k.name.split(' ')[0]).join(', ')}`
                  : u.name;

                return (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUserId(u.id)}
                    className={`w-full flex items-center p-3 rounded-xl mb-1 transition-colors ${selectedUserId === u.id ? 'bg-primary-50 ring-1 ring-primary-100' : 'hover:bg-slate-100'}`}
                  >
                    <img src={u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    <div className="ml-3 text-left flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${selectedUserId === u.id ? 'text-primary-800' : 'text-slate-700'}`}>{displayName}</p>
                      <p className={`text-[10px] font-bold mt-0.5 inline-block px-1.5 rounded-sm ${getRoleBadgeColor(u.role)}`}>
                        {roleLabel}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center p-4 text-slate-500 text-sm">No se encontraron contactos en tu red.</div>
            )
          ) : (
            // Conversations List View
            conversations.length > 0 ? (
              conversations.map(conv => {
                // Find full user details
                const contact = users.find(u => u.id === conv.contactId);
                // Si la persona de ese chat ya no es visible por permisos, no deberíamos mostrarlo o se muestra sin rol context. 
                // Optemos por mostrar siempre los chats históricos, pero si un admin le quita permisos, que quede claro.
                if (!contact) return null;

                const displayName = contact.role === 'PADRE'
                  ? `Familia de ${state.ninos.filter(n => n.parentIds?.includes(contact.id)).map(k => k.name.split(' ')[0]).join(', ')}`
                  : contact.name;
                const isMsgMine = conv.lastMessage.senderId === currentUser?.id;
                const date = new Date(conv.lastMessage.timestamp);
                const showDate = format(date, 'd MMM'); // e.g. "4 Ago"
                const showTime = format(date, 'h:mm a'); // e.g. "2:30 PM"
                const isToday = new Date().toDateString() === date.toDateString();
                const displayTime = isToday ? showTime : showDate;

                return (
                  <button
                    key={conv.contactId}
                    onClick={() => setSelectedUserId(conv.contactId)}
                    className={`w-full flex items-center p-3 rounded-xl mb-1 transition-colors ${selectedUserId === conv.contactId ? 'bg-white shadow-sm ring-1 ring-slate-200 border border-slate-100/50' : 'hover:bg-slate-100'}`}
                  >
                    <div className="relative">
                      <img src={contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}`} alt="" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                    </div>
                    <div className="ml-3 flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <p className={`text-[13px] font-bold truncate ${selectedUserId === conv.contactId ? 'text-primary-800' : 'text-slate-800'}`}>{displayName}</p>
                        <span className="text-[10px] text-slate-400 font-medium ml-2 whitespace-nowrap">{displayTime}</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-500">
                        {isMsgMine && <CheckCheck size={14} className="mr-1 inline text-primary-400" />}
                        <span className="truncate">{conv.lastMessage.content}</span>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center p-6 text-slate-400 text-sm flex flex-col items-center">
                <MessageSquare size={24} className="mb-2 text-slate-300" />
                <p>Aún no hay mensajes activos.</p>
                <button
                  onClick={() => setSidebarTab('contacts')}
                  className="mt-3 text-primary-600 font-medium hover:underline"
                >
                  Buscar en el directorio
                </button>
              </div>
            )
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
                  {selectedUser.role === 'PADRE' && state.ninos.filter(n => n.parentIds?.includes(selectedUser.id)).length > 0
                    ? `Familia de ${state.ninos.filter(n => n.parentIds?.includes(selectedUser.id)).map(k => k.name.split(' ')[0]).join(', ')} (${selectedUser.name})`
                    : selectedUser.name}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span className={`px-1.5 rounded font-medium ${getRoleBadgeColor(selectedUser.role)}`}>{getRoleLabel(selectedUser.role)}</span>
                  <span className="flex items-center"><Mail size={10} className="mr-1" /> {selectedUser.email}</span>
                </div>
              </div>
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
                const isMe = msg.senderId === currentUser?.id;
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
                        {msg.file && msg.file.type.startsWith('image/') ? (
                          <div className="mb-2">
                            <img src={msg.file.url} alt="adjunto" className="max-w-full max-h-60 rounded-lg" />
                          </div>
                        ) : msg.file ? (
                          <div className="mb-2 p-2 rounded bg-white/10 flex items-center gap-2 border border-white/20">
                            <Paperclip size={16} className={isMe ? 'text-white' : 'text-slate-500'} />
                            <a href={msg.file.url} download={msg.file.name} target="_blank" rel="noreferrer" className="underline truncate max-w-[200px]" title={msg.file.name}>
                              {msg.file.name}
                            </a>
                          </div>
                        ) : null}
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
          <div className="p-4 bg-white border-t border-slate-100 flex flex-col gap-2">
            {selectedFile && (
              <div className="flex items-center p-2 bg-slate-100 rounded-lg w-fit text-sm">
                <Paperclip size={14} className="text-primary-600 mr-2" />
                <span className="truncate max-w-[200px] font-medium mr-2">{selectedFile.name}</span>
                <span className="text-slate-500 text-xs mr-3">({Math.round(selectedFile.size / 1024)} KB)</span>
                <button type="button" onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="p-1 hover:bg-slate-200 rounded-full text-slate-500">
                  <X size={14} />
                </button>
              </div>
            )}
            <form onSubmit={handleSend} className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-300 transition-all">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-2 rounded-lg transition-colors ${selectedFile ? 'text-primary-600 bg-primary-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-200/50'}`}
              >
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
                disabled={!inputText.trim() && !selectedFile}
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