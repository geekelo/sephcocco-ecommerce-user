import React, { useState, useEffect, useRef } from 'react';
import { Send, ChevronLeft, Wifi, WifiOff } from 'lucide-react';
import '../styles/MobileChatDetail.css';
import Image from '../assets/image.png';

const MobileChatDetail = ({ 
  chatItem, 
  onBackClick, 
  messages, 
  sendMessage, 
  isConnected, 
  isConnecting, 
  connectionError 
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  
  // Filter messages for this conversation
  const conversationMessages = messages.filter(msg => 
    chatItem?.isNew ? false : (msg.conversation_id === chatItem?.id || chatItem?.id === 'default')
  );

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !isConnected || isSending) {
      return;
    }

    setIsSending(true);
    
    try {
      // Send message through WebSocket
      await sendMessage(message.trim(), 'text');
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      // You might want to show an error notification here
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessages = () => {
    if (chatItem?.isNew && conversationMessages.length === 0) {
      return (
        <div className="welcome-message">
          <div className="welcome-content">
            <img src={Image} alt="Support" className="welcome-avatar" />
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
          <p>No messages in this conversation yet.</p>
        </div>
      );
    }

    return conversationMessages.map((msg, index) => (
      <div
        key={msg.id || index}
        className={`chat-message ${msg.sender || (msg.user_id ? 'user' : 'agent')} ${
          msg.highlighted ? 'highlighted' : ''
        }`}
      >
        {(msg.sender === 'agent' || !msg.user_id) && (
          <div className="message-avatar">
            <img src={Image} alt="Agent" />
          </div>
        )}
        <div className="message-bubble">
          <div className="message-text">{msg.content || msg.text}</div>
          <div className="message-time">
            {formatMessageTime(msg.created_at || msg.timestamp || new Date())}
          </div>
        </div>
      </div>
    ));
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
    </div>
  );
};

export default MobileChatDetail;