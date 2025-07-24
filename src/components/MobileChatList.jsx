import React, { useMemo } from 'react';
import { MessageCircle, Wifi, WifiOff } from 'lucide-react';
import '../styles/MobileChatList.css';
import Image from '../assets/image.png';

const MobileChatList = ({ 
  onChatClick, 
  messages, 
  isConnected, 
  isConnecting, 
  connectionError 
}) => {
  // Group messages by conversation/thread
  const chatConversations = useMemo(() => {
    if (!messages || messages.length === 0) {
      return [];
    }

    // Group messages by conversation_id or create single conversation
    const conversationsMap = new Map();
    
    messages.forEach(message => {
      const conversationId = message.conversation_id || 'default';
      
      if (!conversationsMap.has(conversationId)) {
        conversationsMap.set(conversationId, {
          id: conversationId,
          title: message.subject || 'Chat Support',
          description: message.content?.substring(0, 40) + '...' || 'New conversation',
          lastMessage: message,
          messages: []
        });
      }
      
      conversationsMap.get(conversationId).messages.push(message);
      
      // Update with latest message
      if (new Date(message.created_at || message.timestamp) > 
          new Date(conversationsMap.get(conversationId).lastMessage.created_at || 
                  conversationsMap.get(conversationId).lastMessage.timestamp)) {
        conversationsMap.get(conversationId).lastMessage = message;
        conversationsMap.get(conversationId).description = 
          message.content?.substring(0, 40) + '...' || 'New message';
      }
    });

    return Array.from(conversationsMap.values()).sort((a, b) => 
      new Date(b.lastMessage.created_at || b.lastMessage.timestamp) - 
      new Date(a.lastMessage.created_at || a.lastMessage.timestamp)
    );
  }, [messages]);

  const handleStartNewChat = () => {
    const newChat = {
      id: 'new',
      title: 'New Chat',
      description: 'Start a new conversation',
      isNew: true
    };
    onChatClick(newChat);
  };

  return (
    <div className="mobile-chat-list">
      {/* Connection Status */}
      <div className="connection-status-header">
        {isConnecting && (
          <div className="status-indicator connecting">
            <div className="spinner"></div>
            <span>Connecting...</span>
          </div>
        )}
        
        {connectionError && (
          <div className="status-indicator error">
            <WifiOff size={16} />
            <span>Connection failed</span>
          </div>
        )}
        
        {isConnected && (
          <div className="status-indicator connected">
            <Wifi size={16} />
            <span>Connected</span>
          </div>
        )}
      </div>

      {/* Start New Chat Button */}
      <div className="support-chat-button">
        <button 
          className="chat-with-support"
          onClick={handleStartNewChat}
          disabled={!isConnected && !connectionError}
        >
          <MessageCircle size={16} />
          <span>
            {isConnected 
              ? 'Chat with support now' 
              : isConnecting 
                ? 'Connecting...' 
                : 'Chat offline'
            }
          </span>
        </button>
      </div>
      
      {/* Chat Conversations */}
      <div className="chat-orders">
        {chatConversations.length === 0 ? (
          <div className="no-conversations">
            <MessageCircle size={48} className="empty-icon" />
            <h3>No conversations yet</h3>
            <p>Start a new chat to get help from our support team</p>
          </div>
        ) : (
          chatConversations.map((conversation, index) => (
            <div 
              key={conversation.id}
              className={`chat-order-item ${index % 2 === 1 ? 'highlighted' : ''}`}
              onClick={() => onChatClick(conversation)}
            >
              <div className="order-avatar">
                <img src={Image} alt="Conversation" />
                {conversation.lastMessage.sender !== 'user' && (
                  <div className="unread-indicator"></div>
                )}
              </div>
              <div className="order-details">
                <h3>{conversation.title}</h3>
                <p>{conversation.description}</p>
                <div className="message-meta">
                  <span className="message-time">
                    {new Date(
                      conversation.lastMessage.created_at || 
                      conversation.lastMessage.timestamp
                    ).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  <span className="message-count">
                    {conversation.messages.length} messages
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MobileChatList;