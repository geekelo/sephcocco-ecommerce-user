
import React, { useState } from 'react';
import '../styles/Messages.css';
import { Link } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="customer-support-app">
      <div className="main-content">
        <div className="tabs-container">
          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
            <button 
              className={`tab ${activeTab === 'faqs' ? 'active' : ''}`}
              onClick={() => setActiveTab('faqs')}
            >
              FAQs
            </button>
          </div>
          <div className="return-link">
            <Link to="/products">Return to Products →</Link>
          </div>
        </div>
        <ChatInterface activeTab={activeTab} />
      </div>
    </div>
  );
};

export default Messages;