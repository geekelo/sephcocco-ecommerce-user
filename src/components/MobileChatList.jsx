import React, { useMemo } from 'react';
import { MessageCircle, Wifi, WifiOff } from 'lucide-react';
import '../styles/MobileChatList.css';

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

    // Extract chats from messages (same as Desktop approach)
    const allChats = messages.flatMap(msg => 
      msg.chats ? msg.chats.map(chat => ({...chat, conversation_id: msg.conversation_id || 'default'})) : []
    );

    if (allChats.length === 0) {
      return [];
    }

    // Group chats by conversation_id
    const conversationsMap = new Map();
    
    allChats.forEach(chat => {
      const conversationId = chat.conversation_id || 'default';
      
      if (!conversationsMap.has(conversationId)) {
        conversationsMap.set(conversationId, {
          id: conversationId,
          title: 'Chat Support',
          description: chat.content?.substring(0, 40) + '...' || 'New conversation',
          lastMessage: chat,
          messages: []
        });
      }
      
      conversationsMap.get(conversationId).messages.push(chat);
      
      // Update with latest message (check timestamp validity)
      const currentLastMessageTime = conversationsMap.get(conversationId).lastMessage.timestamp;
      const newMessageTime = chat.timestamp;
      
      if (currentLastMessageTime && newMessageTime) {
        const currentDate = new Date(currentLastMessageTime);
        const newDate = new Date(newMessageTime);
        
        // Only update if both dates are valid and new message is more recent
        if (!isNaN(currentDate.getTime()) && !isNaN(newDate.getTime()) && newDate > currentDate) {
          conversationsMap.get(conversationId).lastMessage = chat;
          conversationsMap.get(conversationId).description = 
            chat.content?.substring(0, 40) + '...' || 'New message';
        }
      } else if (newMessageTime && !currentLastMessageTime) {
        // If current has no timestamp but new one does, update
        conversationsMap.get(conversationId).lastMessage = chat;
        conversationsMap.get(conversationId).description = 
          chat.content?.substring(0, 40) + '...' || 'New message';
      }
    });

    // Sort conversations by last message timestamp
    return Array.from(conversationsMap.values()).sort((a, b) => {
      const aTime = a.lastMessage.timestamp;
      const bTime = b.lastMessage.timestamp;
      
      if (!aTime && !bTime) return 0;
      if (!aTime) return 1;
      if (!bTime) return -1;
      
      const aDate = new Date(aTime);
      const bDate = new Date(bTime);
      
      if (isNaN(aDate.getTime()) && isNaN(bDate.getTime())) return 0;
      if (isNaN(aDate.getTime())) return 1;
      if (isNaN(bDate.getTime())) return -1;
      
      return bDate - aDate;
    });
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

  // Format time safely
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Recently';
    
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return 'Recently';
    
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Check if message is from user
  const isUserMessage = (msg) => {
    return msg.user_role === 'user';
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
                <div className="avatar-circle">
                  <MessageCircle size={24} />
                </div>
            
              </div>
              <div className="order-details">
                <h3>{conversation.title}</h3>
                <p>{conversation.description}</p>
                <div className="message-meta">
                  <span className="message-time">
                    {formatTime(conversation.lastMessage?.timestamp)}
                  </span>
                  <span className="message-count">
                    {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
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