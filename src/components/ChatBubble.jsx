
import React from 'react';
import '../styles/ChatBubble.css';
import { formatTime } from '../utils/Date';

const ChatBubble = ({ message }) => {
    const { type, text, sender, timestamp } = message;
  
    return (
      <div className={`chat-bubble ${type === 'user' ? 'user' : 'agent'}`}>
        {type === 'user' && (
          <div className="avatar">
            <img src="/api/placeholder/30/30" alt={sender} />
          </div>
        )}
        <div className="message-content">
          {type === 'user' && <div className="sender">{sender}</div>}
          <div className="message-bubble">
            <p>{text}</p>
            <span className="timestamp">{formatTime(timestamp)}</span>
          </div>
        </div>
      </div>
    );
  };

export default ChatBubble;