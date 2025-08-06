import React, { useState, useEffect, useRef } from 'react';
import { Send, ChevronLeft, Wifi, WifiOff, User, Check, Clock, AlertCircle, MessageCircle } from 'lucide-react';
import '../styles/MobileChatDetail.css';

const MobileChatDetail = ({ 
  chatItem, 
  onBackClick, 
  messages, 
  sendMessage, 
  isConnected, 
  isConnecting, 
  connectionError,
  refreshMessages // Add refreshMessages prop
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendingMessages, setSendingMessages] = useState(new Set());
  const messagesEndRef = useRef(null);
  
  // Extract chats from messages and filter for this conversation (same as Desktop)
  const allChats = messages.flatMap(msg => 
    msg.chats ? msg.chats.map(chat => ({...chat, conversation_id: msg.conversation_id || 'default'})) : []
  );
  
  // Filter messages for this conversation
  const conversationMessages = allChats.filter(chat => 
    chatItem?.isNew ? false : (chat.conversation_id === chatItem?.id || chatItem?.id === 'default')
  );

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  // Function to get user display text with initials (same as Desktop)
  const getUserDisplayText = (name) => {
    if (!name) return 'YU'; // Default fallback

    const words = name.trim().split(' ');
    const initials = words.map(word => word.charAt(0).toUpperCase());

    return initials.slice(0, 2).join('');
  };

  // Function to get user message status
  const getUserMessageStatus = (chat) => {
    if (chat.optimistic && sendingMessages.has(chat.id)) {
      return 'sending';
    } else if (chat.optimistic) {
      return 'sent';
    } else if (chat.error) {
      return 'error';
    }
    return 'sent';
  };

  // Enhanced message sending with history refresh
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !isConnected || isSending) {
      return;
    }

    const messageContent = message.trim();
    const tempMessageId = `temp-${Date.now()}`;
    
    setIsSending(true);
    setSendingMessages(prev => new Set([...prev, tempMessageId]));
    
    try {
      // Send message through WebSocket
      await sendMessage(messageContent, 'text', chatItem?.id || 'default');
      setMessage('');
      
      // Wait a brief moment for the message to be processed on the server
      setTimeout(async () => {
        try {
          // Refresh message history to get the real message from server
          if (refreshMessages) {
            await refreshMessages();
          }
          
          // Remove from sending messages after successful send and refresh
          setSendingMessages(prev => {
            const newSet = new Set(prev);
            newSet.delete(tempMessageId);
            return newSet;
          });
        } catch (refreshError) {
          console.error('Failed to refresh messages after send:', refreshError);
          // Still remove from sending messages even if refresh fails
          setSendingMessages(prev => {
            const newSet = new Set(prev);
            newSet.delete(tempMessageId);
            return newSet;
          });
        }
      }, 1000); // Wait 1 second before refreshing
      
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove from sending messages on error
      setSendingMessages(prev => {
        const newSet = new Set(prev);
        newSet.delete(tempMessageId);
        return newSet;
      });
    } finally {
      setIsSending(false);
    }
  };

  // Format message time (same as Desktop)
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    // Check if date is valid
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
  };

  // Check if message is from user (same logic as Desktop)
  const isUserMessage = (msg) => {
    return msg.user_role === 'user';
  };

  const renderUserStatus = (status) => {
    switch (status) {
      case 'sending':
        return <Clock size={12} className="status-icon sending" />;
      case 'sent':
        return <Check size={12} className="status-icon sent" />;
      case 'error':
        return <AlertCircle size={12} className="status-icon error" />;
      default:
        return <Check size={12} className="status-icon sent" />;
    }
  };

  const renderMessages = () => {
    if (chatItem?.isNew && conversationMessages.length === 0) {
      return (
        <div className="welcome-message">
          <div className="welcome-content">
            <div className="welcome-avatar">
              <MessageCircle size={32} className="welcome-icon" />
            </div>
            <div className="welcome-text">
              <h3>👋 Welcome to Support Chat</h3>
              <p>Hi there! How can we help you today? Feel free to ask any questions.</p>
            </div>
          </div>
        </div>
      );
    }

    if (conversationMessages.length === 0) {
      return (
        <div className="no-messages">
          <div className="welcome-avatar">
            <MessageCircle size={48} className="empty-icon" />
          </div>
          <p>No messages in this conversation yet.</p>
        </div>
      );
    }

    return conversationMessages.map((chat, index) => {
      const isUser = isUserMessage(chat);
      const userStatus = isUser ? getUserMessageStatus(chat) : null;

      return (
        <div
          key={chat.id || index}
          className={`chat-message ${isUser ? 'user' : 'agent'} ${
            chat.optimistic ? 'sending' : ''
          }`}
        >
          {!isUser && (
            <div className="message-avatar agent-avatar">
              <MessageCircle size={16} />
            </div>
          )}
          
          <div className="message-bubble">
            {/* Add user name display */}
            <div className="message-sender">
              {chat.user_name || (isUser ? 'You' : 'Admin')}
            </div>
            <div className="message-text">{chat.content || 'No content'}</div>
            <div className="message-time">
              {formatMessageTime(chat.timestamp)}
              {chat.optimistic && <span className="sending-indicator">Sending...</span>}
              {isUser && !chat.optimistic && renderUserStatus(userStatus)}
            </div>
          </div>
          
          {isUser && (
            <div className="user-avatar-container">
              <div className={`user-label ${userStatus ? `style-modern ${userStatus}` : 'style-modern'}`}>
                <span className="user-initials">{getUserDisplayText(chat.user_name)}</span>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="mobile-chat-detail">
      <div className="mobile-back-navigation">
        <div className="back-button" onClick={onBackClick}>
          <ChevronLeft size={20} />
          <span>{chatItem?.title || 'Chat Support'}</span>
        </div>
        
        {/* Connection Status */}
        <div className="connection-status">
          {isConnecting && <div className="status-dot connecting"></div>}
          {connectionError && <WifiOff size={16} className="status-icon error" />}
          {isConnected && <Wifi size={16} className="status-icon connected" />}
        </div>
      </div>

      {/* Connection Error Banner */}
      {connectionError && (
        <div className="connection-error-banner">
          ⚠️ Connection lost. Messages may not be delivered.
        </div>
      )}

      <div className="mobile-chat-messages">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder={
            isConnected 
              ? "Type message..." 
              : isConnecting 
                ? "Connecting..." 
                : "Cannot send message (offline)"
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!isConnected || isSending}
          maxLength={1000}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!isConnected || !message.trim() || isSending}
        >
          {isSending ? (
            <div className="spinner-small"></div>
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
      
      {/* Character Count */}
      {message.length > 800 && (
        <div className="character-count">
          {message.length}/1000
        </div>
      )}
      
      {/* Typing Indicator */}
      {isSending && (
        <div className="typing-indicator">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>Sending message...</span>
        </div>
      )}
    </div>
  );
};

export default MobileChatDetail;