import React, { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import '../styles/DesktopChat.css';
import Image from '../assets/image.png'
const DesktopChat = () => {
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
      text: "Open the FinX Stock app to get started and follow the steps. FinX Stock doesn't charge a fee to create or maintain your FinX Stock account.",
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
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages([...chatMessages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="desktop-chat">
      {/* Left Panel - Support Button + Input */}
      <div className="desktop-chat-list">
        <div className="support-chat-button">
          <button className="chat-with-support">
            <MessageCircle size={16} />
            <span>Chat with support now</span>
          </button>
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

      {/* Right Panel - Chat History */}
      <div className="desktop-chat-detail">
        <div className="chat-desktop-messages">
          {chatMessages.map(msg => (
            <div
              key={msg.id}
              className={`chat-desktop-message ${msg.sender} ${msg.highlighted ? 'highlighted' : ''}`}
            >
              {msg.sender === 'agent' && (
                <div className="message-desktop-avatar">
                  <img src={Image} alt="Agent" />
                </div>
              )}
              <div className="message-desktop-bubble">
                <div className="message-deskop-text">{msg.text}</div>
                <div className="message-desktop-time">{msg.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesktopChat;
