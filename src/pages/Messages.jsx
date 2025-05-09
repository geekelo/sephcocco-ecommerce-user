
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, Search } from 'lucide-react';
import '../styles/Messages.css';
import DesktopChat from '../components/DesktopChat';
import DesktopFAQ from '../components/DesktopFAQList';
import MobileChatDetail from '../components/MobileChatDetail';
import MobileFAQList from '../components/MobileFAQList';
import MobileChatList from '../components/MobileChatList';


const Messages = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [activeChatItem, setActiveChatItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
const navigate = useNavigate()
  // Check for mobile/desktop view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handler for mobile chat item click
  const handleChatClick = (chat) => {
    setActiveChatItem(chat);
  };

  // Handler for mobile back button
  const handleBackClick = () => {
    setActiveChatItem(null);
  };
  const handleClick = () => {
    navigate('/products')
  }
  // Render mobile view
  const renderMobileView = () => {
    if (activeTab === 'chat') {
      return activeChatItem ? (
        <MobileChatDetail 
          chatItem={activeChatItem}
          onBackClick={handleBackClick}
        />
      ) : (
        <MobileChatList onChatClick={handleChatClick} />
      );
    } else {
      return <MobileFAQList />;
    }
  };

  // Render desktop view
  const renderDesktopView = () => {
    return activeTab === 'chat' ? <DesktopChat /> : <DesktopFAQ />;
  };

  return (
    <div className="customer-support-app">
   

      {/* Back Navigation */}
      <div className="back-navigation">
        {isMobile && activeChatItem ? (
          <div className="back-link" onClick={handleBackClick}>
            <ChevronLeft size={20} color='black'/>
            <span>Back</span>
          </div>
        ) : (
          <div className="order" onClick={handleClick}>
            
            <ArrowLeft size={20} />
            <span>Messages</span>
          
         
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      {(!isMobile || !activeChatItem) && (
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
          
          {!isMobile && (
            <div className="return-link">
              <Link to="/products">Return to Products →</Link>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        {isMobile ? renderMobileView() : renderDesktopView()}
      </div>
    </div>
  );
};

export default Messages;