import React, { useState, useEffect, useRef, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import chatService from '../services/chatService';
import Layout from '../components/Layout';
import { COLORS, SHADOW } from '../styles/theme';

function Chat() {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const initialChatId = searchParams.get('chatId');

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => { loadChats(); }, []);

  useEffect(() => {
    if (initialChatId && chats.length > 0) {
      const found = chats.find(c => c._id === initialChatId);
      if (found) openChat(found);
    }
    // eslint-disable-next-line
  }, [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages?.length]);

  const loadChats = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await chatService.getMyChats();
      setChats(data.chats || []);
    } catch (err) {
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const openChat = async (chat) => {
    try {
      const data = await chatService.getChatById(chat._id);
      setActiveChat(data.chat);
      chatService.markAsRead(chat._id).catch(() => {});
    } catch (err) {
      setError('Failed to open conversation');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;
    setSending(true);
    try {
      const data = await chatService.sendMessage(activeChat._id, messageText.trim());
      setActiveChat(data.chat);
      setMessageText('');
      loadChats();
    } catch (err) {
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getOtherParty = (chat) => {
    return user?.role === 'provider' ? chat.userId : chat.providerId?.userId;
  };

  const formatTime = (dateString) =>
    new Date(dateString).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <Layout>
        <div style={styles.loadingBox}>
          <div style={styles.spinner}></div>
          Loading conversations...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 style={styles.pageTitle}>Messages</h1>

      {error && (
        <div style={styles.errorBox}>
          <i className="ti ti-alert-circle" style={{ fontSize: '16px' }}></i>
          {error}
        </div>
      )}

      <div style={styles.chatLayout}>
        {/* Conversation list */}
        <div style={styles.sidebar}>
          {chats.length === 0 ? (
            <div style={styles.emptySidebar}>
              <i className="ti ti-message-circle" style={{ fontSize: '24px', color: COLORS.textMuted }}></i>
              <p style={styles.emptyText}>No conversations yet</p>
            </div>
          ) : (
            chats.map((chat) => {
              const other = getOtherParty(chat);
              const isActive = activeChat?._id === chat._id;
              return (
                <div
                  key={chat._id}
                  onClick={() => openChat(chat)}
                  style={{ ...styles.chatItem, backgroundColor: isActive ? COLORS.primaryLight : 'transparent' }}
                >
                  <div style={styles.chatAvatar}>{other?.name?.charAt(0) || '?'}</div>
                  <div style={styles.chatItemContent}>
                    <div style={styles.chatItemName}>{other?.name || 'Unknown'}</div>
                    <div style={styles.chatItemLast}>{chat.lastMessage || 'No messages yet'}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message thread */}
        <div style={styles.threadPanel}>
          {!activeChat ? (
            <div style={styles.noChatSelected}>
              <i className="ti ti-messages" style={{ fontSize: '36px', color: COLORS.textMuted }}></i>
              <p style={styles.emptyText}>Select a conversation to start chatting</p>
            </div>
          ) : (
            <>
              <div style={styles.threadHeader}>
                <div style={styles.chatAvatar}>{getOtherParty(activeChat)?.name?.charAt(0) || '?'}</div>
                <div>
                  <div style={styles.threadName}>{getOtherParty(activeChat)?.name}</div>
                  <div style={styles.threadRole}>{activeChat.providerId?.serviceType}</div>
                </div>
              </div>

              <div style={styles.messagesArea}>
                {activeChat.messages?.length === 0 && (
                  <div style={styles.noMessages}>Say hello 👋</div>
                )}
                {activeChat.messages?.map((msg, idx) => {
                  const isMine = msg.sender?._id === user?._id || msg.sender === user?._id;
                  return (
                    <div key={idx} style={{ ...styles.messageRow, justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                      <div style={{ ...styles.bubble, ...(isMine ? styles.bubbleMine : styles.bubbleTheirs) }}>
                        <div>{msg.message}</div>
                        <div style={{ ...styles.bubbleTime, color: isMine ? 'rgba(255,255,255,0.7)' : COLORS.textMuted }}>
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} style={styles.inputRow}>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  style={styles.input}
                />
                <button type="submit" disabled={sending || !messageText.trim()} style={styles.sendBtn}>
                  <i className="ti ti-send" style={{ fontSize: '16px' }}></i>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  pageTitle: { fontSize: '24px', fontWeight: '700', color: COLORS.textPrimary, marginBottom: '20px' },
  chatLayout: {
    display: 'grid', gridTemplateColumns: '300px 1fr', height: '600px',
    backgroundColor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: '14px',
    boxShadow: SHADOW.card, overflow: 'hidden'
  },
  sidebar: { borderRight: `1px solid ${COLORS.border}`, overflowY: 'auto' },
  chatItem: { display: 'flex', gap: '10px', padding: '14px', cursor: 'pointer', borderBottom: `1px solid ${COLORS.border}` },
  chatAvatar: {
    width: '40px', height: '40px', borderRadius: '50%', backgroundColor: COLORS.primaryLight,
    color: COLORS.primary, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '15px', fontWeight: '700', flexShrink: 0
  },
  chatItemContent: { flex: 1, minWidth: 0 },
  chatItemName: { fontSize: '13px', fontWeight: '700', color: COLORS.textPrimary },
  chatItemLast: { fontSize: '12px', color: COLORS.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  emptySidebar: { padding: '40px 16px', textAlign: 'center' },
  emptyText: { fontSize: '13px', color: COLORS.textMuted, marginTop: '8px' },
  threadPanel: { display: 'flex', flexDirection: 'column' },
  noChatSelected: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  threadHeader: { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderBottom: `1px solid ${COLORS.border}` },
  threadName: { fontSize: '14px', fontWeight: '700', color: COLORS.textPrimary },
  threadRole: { fontSize: '12px', color: COLORS.textSecondary },
  messagesArea: { flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' },
  noMessages: { textAlign: 'center', color: COLORS.textMuted, fontSize: '13px', marginTop: '20px' },
  messageRow: { display: 'flex' },
  bubble: { maxWidth: '70%', padding: '10px 14px', borderRadius: '14px', fontSize: '13px', lineHeight: '1.5' },
  bubbleMine: { backgroundColor: COLORS.primary, color: COLORS.white, borderBottomRightRadius: '4px' },
  bubbleTheirs: { backgroundColor: COLORS.bgSubtle, color: COLORS.textPrimary, borderBottomLeftRadius: '4px' },
  bubbleTime: { fontSize: '10px', marginTop: '4px', textAlign: 'right' },
  inputRow: { display: 'flex', gap: '8px', padding: '14px', borderTop: `1px solid ${COLORS.border}` },
  input: { flex: 1, padding: '11px 14px', border: `1px solid ${COLORS.border}`, borderRadius: '999px', fontSize: '13px', outline: 'none' },
  sendBtn: {
    width: '40px', height: '40px', borderRadius: '50%', backgroundColor: COLORS.primary, color: COLORS.white,
    border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
  },
  errorBox: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: COLORS.dangerBg, color: COLORS.danger, padding: '12px 16px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' },
  loadingBox: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '60px', fontSize: '14px', color: COLORS.textSecondary },
  spinner: { width: '18px', height: '18px', border: `2px solid ${COLORS.border}`, borderTopColor: COLORS.primary, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }
};

export default Chat;