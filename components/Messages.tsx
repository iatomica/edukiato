import React, { useState } from 'react';
import { MOCK_MESSAGES } from '../services/mockData';
import { Search, Send, Phone, Video, MoreVertical, Paperclip, CheckCheck, Users, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '../contexts/LanguageContext';
import { useTenantData } from '../hooks/useTenantData';

export const Messages: React.FC = () => {
  const { t } = useLanguage();
  const { conversations } = useTenantData();
  const [selectedChatId, setSelectedChatId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const selectedConversation = conversations.find(c => c.id === selectedChatId);
  const currentMessages = messages[selectedChatId] || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: `new-${Date.now()}`,
      senderId: 'me',
      content: inputText,
      timestamp: new Date(),
      isRead: false
    };

    setMessages({
      ...messages,
      [selectedChatId]: [...(messages[selectedChatId] || []), newMessage]
    });
    setInputText('');
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Sidebar List */}
      <div id="tour-messages-list" className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{t.messages.title}</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t.messages.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Group Channels */}
          <div className="p-3 pb-0">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t.messages.courseChannels}</p>
            {conversations.filter(c => c.type === 'COURSE_GROUP').map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`w-full flex items-center p-3 rounded-xl mb-1 transition-colors ${selectedChatId === chat.id ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-100'}`}
              >
                <div className="relative">
                  <img src={chat.avatar} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  {chat.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                <div className="ml-3 text-left flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className={`text-sm font-semibold truncate ${selectedChatId === chat.id ? 'text-primary-700' : 'text-slate-700'}`}>{chat.name}</p>
                    {chat.lastMessageTime && <span className="text-[10px] text-slate-400">{format(chat.lastMessageTime, 'HH:mm')}</span>}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Direct Messages */}
          <div className="p-3">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">{t.messages.directMessages}</p>
            {conversations.filter(c => c.type === 'DIRECT').map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`w-full flex items-center p-3 rounded-xl mb-1 transition-colors ${selectedChatId === chat.id ? 'bg-white shadow-sm ring-1 ring-slate-200' : 'hover:bg-slate-100'}`}
              >
                <div className="relative">
                  <img src={chat.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                </div>
                <div className="ml-3 text-left flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className={`text-sm font-semibold truncate ${selectedChatId === chat.id ? 'text-primary-700' : 'text-slate-700'}`}>{chat.name}</p>
                    {chat.lastMessageTime && <span className="text-[10px] text-slate-400">{format(chat.lastMessageTime, 'HH:mm')}</span>}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div id="tour-messages-chat" className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
            <div className="flex items-center">
              <img src={selectedConversation.avatar} className={`w-10 h-10 object-cover mr-4 ${selectedConversation.type === 'DIRECT' ? 'rounded-full' : 'rounded-lg'}`} alt="" />
              <div>
                <h3 className="font-bold text-slate-800">{selectedConversation.name}</h3>
                <p className="text-xs text-slate-500 flex items-center">
                  {selectedConversation.type === 'COURSE_GROUP' ? (
                    <><Users size={12} className="mr-1" /> {selectedConversation.participants.length} {t.messages.members}</>
                  ) : t.messages.activeNow}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 text-slate-400">
              <button className="p-2 hover:bg-slate-50 rounded-full"><Phone size={20} /></button>
              <button className="p-2 hover:bg-slate-50 rounded-full"><Video size={20} /></button>
              <button className="p-2 hover:bg-slate-50 rounded-full"><MoreVertical size={20} /></button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {currentMessages.map((msg, idx) => {
              const isMe = msg.senderId === 'me';
              const showAvatar = idx === 0 || currentMessages[idx - 1].senderId !== msg.senderId;

              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  {!isMe && (
                    <div className="w-8 mr-2 flex-shrink-0">
                      {showAvatar && <img src={selectedConversation.avatar} className="w-8 h-8 rounded-full" alt="Sender" />}
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
                      {format(msg.timestamp, 'h:mm a')}
                      {isMe && <CheckCheck size={12} className="ml-1 text-primary-400" />}
                    </div>
                  </div>
                </div>
              );
            })}
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
                placeholder={t.messages.typeMessage}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-700 placeholder:text-slate-400"
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
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <MessageSquare size={32} />
          </div>
          <p>{t.messages.selectChat}</p>
        </div>
      )}
    </div>
  );
};