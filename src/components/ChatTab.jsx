import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle } from 'lucide-react';
import ChatBubble from './ChatBubble';
import '../styles/ChatTab.css';
import { useChatService } from '../hooks/useChatService';

const ChatTab = () => {
  const { messages, sendMessage, connected } = useChatService();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    // Use the chat service to send message
    sendMessage(newMessage);
    setNewMessage('');
  };

  return (
    <div className="chat-tab">
      {/* Left side - Chat support and input */}
      <div className="chat-left-panel">
        <div className="chat-support-action">
          <button className="support-button">
            <MessageCircle size={16} />
            <span>Chat with support now</span>
          </button>
        </div>
        
        {/* Empty space in the middle */}
        <div className="chat-left-empty-space"></div>
        
        {/* User avatar and message input at the bottom */}
        <form className="chat-input" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button type="submit" className="send-button">
            <Send size={18} />
          </button>
        </form>
      </div>
      
      {/* Right side - Chat messages display */}
      <div className="chat-right-panel">
        <div className="chat-messages">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="message-container"
            >
              <ChatBubble message={message} />
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatTab;