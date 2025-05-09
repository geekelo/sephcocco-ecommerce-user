import React from 'react';
import '../styles/ChatBubble.css';
import Image from '../assets/image.png'
const ChatBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`chat-bubble ${isUser ? 'user' : 'agent'}`}>
      {!isUser && (
        <div className="avatar">
          <img src={message.avatar || Image} alt="Agent" />
        </div>
      )}
      <div className="message-content">
        {!isUser && <div className="sender-name">{message.senderName || 'Agent'}</div>}
        <div className="message-text">{message.text}</div>
      </div>
      {isUser && (
        <div className="avatar">
          <img src={message.avatar || '/user-avatar.png'} alt="User" />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;