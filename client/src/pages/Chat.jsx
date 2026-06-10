import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { messageService } from '../services';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPaperAirplane, HiChat, HiSearch } from 'react-icons/hi';

const Chat = () => {
  const { user } = useSelector(state => state.auth);
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState(false);
  const [searchChat, setSearchChat] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const darkMode = document.documentElement.classList.contains('dark');

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join', user._id);
    socketRef.current.on('onlineUsers', (users) => setOnlineUsers(users));
    socketRef.current.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });
    socketRef.current.on('userTyping', () => setTyping(true));
    socketRef.current.on('userStopTyping', () => setTyping(false));
    return () => socketRef.current?.disconnect();
  }, [user._id]);

  useEffect(() => {
    messageService.getConversations().then(res => {
      setConversations(res.data.data || []);
      const urlUserId = searchParams.get('userId');
      if (urlUserId) {
        const conv = (res.data.data || []).find(c => c._id?._id === urlUserId);
        if (conv) selectConversation(conv._id);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectConversation = async (chatUser) => {
    setSelectedUser(chatUser);
    try {
      const res = await messageService.getMessages(chatUser._id);
      setMessages(res.data.data || []);
    } catch { }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    socketRef.current.emit('sendMessage', {
      senderId: user._id,
      receiverId: selectedUser._id,
      message: newMessage
    });
    setMessages(prev => [...prev, {
      _id: Date.now(),
      senderId: { _id: user._id, name: user.name },
      receiverId: { _id: selectedUser._id },
      message: newMessage,
      createdAt: new Date().toISOString()
    }]);
    setNewMessage('');
  };

  const handleTyping = () => {
    if (selectedUser) {
      socketRef.current.emit('typing', { senderId: user._id, receiverId: selectedUser._id });
      setTimeout(() => {
        socketRef.current.emit('stopTyping', { senderId: user._id, receiverId: selectedUser._id });
      }, 2000);
    }
  };

  const filteredConversations = conversations.filter(c =>
    c._id?.name?.toLowerCase().includes(searchChat.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{
          background: darkMode ? '#1e293b' : '#ffffff',
          borderRadius: '20px',
          border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          height: 'calc(100vh - 8rem)',
          display: 'flex'
        }}>
          {/* Sidebar */}
          <div style={{
            width: '320px', flexShrink: 0,
            borderRight: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
            display: 'flex', flexDirection: 'column'
          }}>
            <div style={{ padding: '20px', borderBottom: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}` }}>
              <h2 style={{
                fontSize: '18px', fontWeight: 700,
                color: darkMode ? '#ffffff' : '#1e293b',
                display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px'
              }}><HiChat style={{ color: '#6366f1' }} /> Messages</h2>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 14px',
                background: darkMode ? '#0f172a' : '#f8fafc',
                borderRadius: '12px',
                border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`
              }}>
                <HiSearch style={{ color: '#94a3b8', flexShrink: 0 }} />
                <input type="text" placeholder="Search conversations..."
                  style={{
                    width: '100%', background: 'transparent', border: 'none', outline: 'none',
                    fontSize: '14px', color: darkMode ? '#ffffff' : '#334155'
                  }}
                  value={searchChat} onChange={(e) => setSearchChat(e.target.value)} />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {filteredConversations.length === 0 ? (
                <p style={{ padding: '20px', fontSize: '14px', color: '#94a3b8', textAlign: 'center' }}>No conversations yet</p>
              ) : (
                filteredConversations.map(conv => (
                  <button key={conv._id?._id} onClick={() => selectConversation(conv._id)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '14px 20px', border: 'none', cursor: 'pointer', textAlign: 'left',
                      transition: 'all 0.2s',
                      background: selectedUser?._id === conv._id?._id
                        ? (darkMode ? 'rgba(99, 102, 241, 0.1)' : '#eef2ff')
                        : 'transparent'
                    }}
                    onMouseEnter={(e) => { if (selectedUser?._id !== conv._id?._id) e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc'; }}
                    onMouseLeave={(e) => { if (selectedUser?._id !== conv._id?._id) e.currentTarget.style.background = 'transparent'; }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: '42px', height: '42px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: '15px'
                      }}>
                        {conv._id?.name?.charAt(0).toUpperCase()}
                      </div>
                      {onlineUsers.includes(conv._id?._id) && (
                        <span style={{
                          position: 'absolute', bottom: '0', right: '0',
                          width: '12px', height: '12px', background: '#10b981', borderRadius: '50%',
                          border: `2px solid ${darkMode ? '#1e293b' : '#ffffff'}`
                        }}></span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontWeight: 600, fontSize: '14px',
                        color: darkMode ? '#ffffff' : '#1e293b',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>{conv._id?.name}</p>
                      <p style={{
                        fontSize: '12px', color: '#94a3b8',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}>{conv.lastMessage}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span style={{
                        width: '22px', height: '22px',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: 'white', fontSize: '11px', fontWeight: 700,
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>{conv.unreadCount}</span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div style={{
                  padding: '16px 24px',
                  borderBottom: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}`,
                  display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 700, fontSize: '14px'
                  }}>
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, color: darkMode ? '#ffffff' : '#1e293b', fontSize: '15px' }}>{selectedUser.name}</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {onlineUsers.includes(selectedUser._id) ? (
                        <span style={{ color: '#10b981' }}>● Online</span>
                      ) : 'Offline'}
                      {typing && <span style={{ color: '#6366f1', marginLeft: '8px' }}>typing...</span>}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {messages.map((msg, i) => {
                    const isMine = msg.senderId?._id === user._id || msg.senderId === user._id;
                    return (
                      <motion.div key={msg._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                          maxWidth: '70%', padding: '12px 16px', borderRadius: '16px',
                          fontSize: '14px', lineHeight: 1.5,
                          ...(isMine ? {
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            color: 'white',
                            borderBottomRightRadius: '4px'
                          } : {
                            background: darkMode ? '#0f172a' : '#f1f5f9',
                            color: darkMode ? '#ffffff' : '#1e293b',
                            borderBottomLeftRadius: '4px'
                          })
                        }}>
                          <p>{msg.message}</p>
                          <p style={{
                            fontSize: '10px', marginTop: '6px',
                            color: isMine ? 'rgba(255,255,255,0.6)' : '#94a3b8'
                          }}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={sendMessage} style={{
                  padding: '16px 24px',
                  borderTop: `1px solid ${darkMode ? '#334155' : '#f1f5f9'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input type="text" placeholder="Type a message..."
                      style={{
                        flex: 1, padding: '12px 16px',
                        background: darkMode ? '#0f172a' : '#f8fafc',
                        borderRadius: '12px',
                        border: `1.5px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                        outline: 'none', fontSize: '14px',
                        color: darkMode ? '#ffffff' : '#334155',
                        transition: 'all 0.2s'
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#6366f1'; }}
                      onBlur={(e) => { e.target.style.borderColor = darkMode ? '#334155' : '#e2e8f0'; }}
                      value={newMessage} onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
                      id="chat-input" />
                    <button type="submit" id="chat-send" style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                      color: 'white', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                      transition: 'all 0.2s', flexShrink: 0
                    }}>
                      <HiPaperAirplane style={{ fontSize: '18px', transform: 'rotate(90deg)' }} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: darkMode ? 'rgba(99, 102, 241, 0.1)' : '#eef2ff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 16px auto'
                  }}>
                    <HiChat style={{ fontSize: '36px', color: '#6366f1' }} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 700, color: darkMode ? '#ffffff' : '#1e293b', marginBottom: '6px' }}>Your Messages</h3>
                  <p style={{ color: '#94a3b8', fontSize: '15px' }}>Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
