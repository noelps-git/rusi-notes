'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Users, Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import EmojiPicker from './EmojiPicker';

interface Message {
  id: string;
  content: string;
  message_type: string;
  metadata: any;
  created_at: string;
  sender: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

interface Member {
  id: string;
  role: string;
  joined_at: string;
  user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    email: string;
  };
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  is_private: boolean;
  created_at: string;
  creator: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
}

interface Props {
  group: Group;
  members: Member[];
  initialMessages: Message[];
  currentUserId: string;
  userRole: string;
}

export default function GroupChatClient({
  group,
  members,
  initialMessages,
  currentUserId,
  userRole,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (messages.length === 0) return;

      const lastMessage = messages[messages.length - 1];
      const res = await fetch(
        `/api/groups/${group.id}/messages?after=${lastMessage.created_at}`
      );

      if (res.ok) {
        const newMessages = await res.json();
        if (newMessages.length > 0) {
          setMessages((prev) => [...prev, ...newMessages]);
        }
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [group.id, messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    setSending(true);

    try {
      const res = await fetch(`/api/groups/${group.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage.trim(),
          message_type: 'text',
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const message = await res.json();
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="h-screen flex flex-col bg-[#111111] font-['Inter',sans-serif]">
      {/* Header */}
      <div className="bg-[#1E1E1E] border-b border-[#333333] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/groups"
            className="p-2 hover:bg-[#333333] rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-[#999999] hover:text-white" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">{group.name} 🦁</h1>
            {group.description && (
              <p className="text-sm text-[#999999]">{group.description}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowMembers(!showMembers)}
          className="flex items-center gap-2 px-4 py-2 hover:bg-[#333333] rounded-lg transition-colors"
        >
          <Users size={20} className="text-[#999999]" />
          <span className="text-sm font-medium text-[#999999]">
            {members.length} {members.length === 1 ? 'nanba' : 'nanbas'}
          </span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages */}
        <div className="flex-1 flex flex-col">
          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0E0E0E]">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-[#999999] mb-2">"Yarum illa da!" - No messages yet 🤷</p>
                  <p className="text-sm text-[#666666]">
                    Be the first to start the mass conversation! 💬
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => {
                const isOwnMessage = message.sender.id === currentUserId;
                const showAvatar =
                  index === 0 ||
                  messages[index - 1].sender.id !== message.sender.id;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {showAvatar ? (
                        <div className="w-8 h-8 rounded-full bg-[#e52020] flex items-center justify-center text-white text-sm font-bold">
                          {message.sender?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      ) : (
                        <div className="w-8" />
                      )}
                    </div>

                    {/* Message */}
                    <div
                      className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-[70%]`}
                    >
                      {showAvatar && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-white">
                            {message.sender?.full_name || 'Unknown User'}
                          </span>
                          <span className="text-xs text-[#666666]">
                            {getRelativeTime(message.created_at)}
                          </span>
                        </div>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          isOwnMessage
                            ? 'bg-[#e52020] text-white'
                            : 'bg-[#1E1E1E] text-white border border-[#333333]'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 bg-[#1E1E1E] border-t border-[#333333]">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 px-4 bg-[#111111] border border-[#333333] rounded-[100px] focus-within:border-[#e52020] transition-all">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message... 💬"
                  className="flex-1 py-3 bg-transparent text-white placeholder-[#666666] focus:outline-none"
                  disabled={sending}
                />
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="px-6 py-3 bg-[#e52020] text-white rounded-[100px] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send size={18} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Members Sidebar */}
        {showMembers && (
          <div className="w-80 bg-[#1E1E1E] border-l border-[#333333] flex flex-col">
            <div className="p-4 border-b border-[#333333]">
              <h2 className="font-bold text-white">Nanba Gang 🦁</h2>
              <p className="text-xs text-[#666666] mt-1">{members.length} mass members</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#333333] transition-colors border border-[#333333]"
                >
                  <div className="w-10 h-10 rounded-full bg-[#e52020] flex items-center justify-center text-white font-bold">
                    {member.user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">
                        {member.user?.full_name || 'Unknown User'}
                      </p>
                      {member.role === 'admin' && (
                        <span className="px-2 py-0.5 bg-[#e52020]/20 text-[#e52020] text-xs font-medium rounded-full border border-[#e52020]/30">
                          Boss 👑
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#999999] truncate">
                      {member.user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
