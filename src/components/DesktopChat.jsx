import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, Wifi, WifiOff, AlertCircle, User, Check, Clock } from 'lucide-react';
import '../styles/DesktopChat.css';

const DesktopChat = ({ 
  messages = [], 
  sendMessage, 
  isConnected, 
  isConnecting, 
  connectionError,
  refreshMessages // Add this prop to refresh message history
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState('default');
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [sendingMessages, setSendingMessages] = useState(new Set()); // Track sending messages
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  // Extract chats from messages and filter for the selected conversation
  const allChats = messages.flatMap(msg => 
    msg.chats ? msg.chats.map(chat => ({...chat, conversation_id: msg.conversation_id || 'default'})) : []
  );
  
  const conversationMessages = allChats.filter(chat => 
    (chat.conversation_id || 'default') === selectedConversation
  );

  // Function to get user display text with initials
const getUserDisplayText = (name) => {
  if (!name) return '';

  const words = name.trim().split(' ');
  const initials = words.map(word => word.charAt(0).toUpperCase());

  return initials.slice(0, 2).join('');
};

  // Function to get user display status
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

  // Smart auto-scroll logic - only scroll when new messages arrive, not when typing
  useEffect(() => {
    const currentMessageCount = conversationMessages.length;
    const hasNewMessage = currentMessageCount > lastMessageCountRef.current;
    
    if (hasNewMessage && shouldAutoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
    lastMessageCountRef.current = currentMessageCount;
  }, [conversationMessages.length, shouldAutoScroll]);

  // Check if user is near bottom to determine auto-scroll behavior
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShouldAutoScroll(isNearBottom);
    }
  };

  // Auto-select first conversation if available
  useEffect(() => {
    if (allChats.length > 0 && !conversationMessages.length) {
      const firstConversationId = allChats[0].conversation_id || 'default';
      setSelectedConversation(firstConversationId);
    }
  }, [allChats.length, conversationMessages.length]);

  // Enhanced message sending with history refresh
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !isConnected || isSending) {
      return;
    }

    const messageContent = message.trim();
    const tempMessageId = `temp-${Date.now()}`;
    
    setIsSending(true);
    setShouldAutoScroll(true);
    setSendingMessages(prev => new Set([...prev, tempMessageId]));
    
    try {
      // Send the message
      await sendMessage(messageContent, 'text', selectedConversation);
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

  const handleStartNewConversation = () => {
    setSelectedConversation('default');
    setShouldAutoScroll(true);
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isUserMessage = (msg) => {
    return msg.user_role === 'user' 
  };

  const renderWelcomeMessage = () => (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-avatar">
          <MessageCircle size={32} className="welcome-icon" />
        </div>
        <div className="welcome-text">
          <h3>👋 Welcome to Support Chat</h3>
          <p>Hi there! How can we help you today?</p>
          <p>Feel free to ask any questions - our support team is here to help!</p>
        </div>
      </div>
    </div>
  );

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
    if (conversationMessages.length === 0) {
      return renderWelcomeMessage();
    }

    return conversationMessages.map((chat, index) => {
      const isUser = isUserMessage(chat);
      const userStatus = isUser ? getUserMessageStatus(chat) : null;

      return (
        <div
          key={chat.id || index}
          className={`message-container ${isUser ? 'user-message' : 'agent-message'} ${
            chat.optimistic ? 'sending' : ''
          }`}
        >
     
          
          <div className="message-content">
            <div className={`message-bubble ${isUser ? 'user-bubble' : 'agent-bubble'}`}>
              <div className="message-text">{chat.content || 'No content'}</div>
              <div className="message-time">
                {formatMessageTime(chat.timestamp)}
                {chat.optimistic && <span className="sending-indicator">Sending...</span>}
                {isUser && !chat.optimistic && renderUserStatus(userStatus)}
              </div>
            </div>
          </div>
          
          {isUser && (
            <div className="message-avatar user-avatar">
              <div className={`user-label ${userStatus ? `style-modern ${userStatus}` : 'style-modern'}`}>
                <span className="user-initials">{getUserDisplayText(chat.user_name)}</span>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  const getConnectionStatusText = () => {
    if (isConnecting) return 'Connecting to chat...';
    if (connectionError) return 'Connection failed - Chat offline';
    if (isConnected) return 'Chat with support now';
    return 'Chat unavailable';
  };

  const getConnectionIcon = () => {
    if (isConnecting) return <div className="spinner" />;
    if (connectionError) return <WifiOff size={16} />;
    if (isConnected) return <MessageCircle size={16} />;
    return <AlertCircle size={16} />;
  };

  return (
    <div className="desktop-chat">
      {/* Left Panel - Support Button + Input */}
      <div className="chat-sidebar">
        {/* Connection Status */}
        <div className="connection-status-desktop">
          <div className={`status-indicator ${
            isConnected ? 'connected' : connectionError ? 'error' : 'connecting'
          }`}>
            {isConnected && <Wifi size={14} />}
            {connectionError && <WifiOff size={14} />}
            {isConnecting && <div className="spinner-small" />}
            <span className="status-text">
              {isConnected ? 'Online' : connectionError ? 'Offline' : 'Connecting'}
            </span>
          </div>
        </div>

        {/* Support Chat Button */}
        <div className="support-button-container">
          <button 
            className="support-chat-button"
            onClick={handleStartNewConversation}
            disabled={!isConnected && !connectionError}
          >
            {getConnectionIcon()}
            <span>{getConnectionStatusText()}</span>
          </button>
        </div>

        {/* Connection Error Message */}
        {connectionError && (
          <div className="connection-error">
            <AlertCircle size={14} />
            <span>Messages may not be delivered</span>
          </div>
        )}

        {/* Chat Input */}
        <div className="chat-input-form">
          <div className="input-container">
            <input
              type="text"
              placeholder={
                isConnected 
                  ? "Type your message..." 
                  : isConnecting 
                    ? "Connecting..." 
                    : "Chat offline"
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              disabled={!isConnected || isSending}
              maxLength={1000}
              className="message-input"
            />
            <button 
              onClick={handleSendMessage}
              className={`send-button ${(!isConnected || !message.trim() || isSending) ? 'disabled' : ''}`}
              disabled={!isConnected || !message.trim() || isSending}
              title={!isConnected ? 'Not connected' : 'Send message'}
            >
              {isSending ? (
                <div className="spinner-small" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Message Info */}
        <div className="message-info">
          <div className="message-count">
            {conversationMessages.length} message{conversationMessages.length !== 1 ? 's' : ''}
          </div>
          {message.length > 800 && (
            <div className="character-count">
              {message.length}/1000
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Chat History */}
      <div className="chat-main">
        <div className="chat-header">
          <h3>Support Chat</h3>
        </div>

        <div 
          className="messages-container"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          {renderMessages()}
          <div ref={messagesEndRef} />
        </div>

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
    </div>
  );
};

export default DesktopChat;