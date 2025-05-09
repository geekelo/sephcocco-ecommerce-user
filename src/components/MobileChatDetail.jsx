import React, { useState } from 'react';
import { Send, ChevronLeft } from 'lucide-react';
import '../styles/MobileChatDetail.css';
import Image from '../assets/image.png'
const MobileChatDetail = ({ chatItem, onBackClick }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: 'Hi Kitsbase. Let me know you need help and you can ask us any questions.',
      time: '08:20 AM'
    },
    {
      id: 2,
      sender: 'user',
      text: 'How to create a FinX Stock account?',
      time: '08:21 AM',
      highlighted: true
    },
    {
      id: 3,
      sender: 'agent',
      text: 'Open the FinX Stock app to get started and follow the steps. FinX Stock doesn\'t charge a fee to create or maintain your FinX Stock account.',
      time: '08:22 AM'
    }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'user',
        text: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="mobile-chat-detail">
      <div className="mobile-back-navigation">
        <div className="back-button" onClick={onBackClick}>
          <ChevronLeft size={20} />
          <span>{chatItem?.title || 'Chat Support'}</span>
        </div>
      </div>

      <div className="mobile-chat-messages">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-message ${msg.sender} ${msg.highlighted ? 'highlighted' : ''}`}
          >
            {msg.sender === 'agent' && (
              <div className="message-avatar">
                <img src={Image} alt="Agent" />
              </div>
            )}
            <div className="message-bubble">
              <div className="message-text">{msg.text}</div>
              <div className="message-time">{msg.time}</div>
            </div>
          </div>
        ))}
      </div>

      <form className="chat-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="send-button">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MobileChatDetail;
