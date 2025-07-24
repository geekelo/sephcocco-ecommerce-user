import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import '../styles/Messages.css';
import DesktopChat from '../components/DesktopChat';
import DesktopFAQ from '../components/DesktopFAQList';
import MobileChatDetail from '../components/MobileChatDetail';
import MobileFAQList from '../components/MobileFAQList';
import MobileChatList from '../components/MobileChatList';
import { useMessaging } from '../hooks/useMessaging';
import { getActiveOutlet } from '../utils/getActiveOutlets';
import { useGetFaq } from '../hooks/useGetFaq';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [activeChatItem, setActiveChatItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  
  // Get auth token from localStorage, context, or props
  const authToken = localStorage.getItem('token');
  const outletType = getActiveOutlet();
  
  // Get FAQ data
  const { 
    data: faqData, 
    loading: faqLoading, 
    error: faqError 
  } = useGetFaq(outletType);
  
  // Initialize messaging hook
  const { 
    messages, 
    isConnected, 
    isConnecting, 
    connectionError, 
    sendMessage,
    refreshMessages
  } = useMessaging(authToken, outletType);

  console.log('Messages:', messages);
  console.log('FAQ Data:', faqData);

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
    navigate('/products');
  };

  // Render mobile view
  const renderMobileView = () => {
    if (activeTab === 'chat') {
      return activeChatItem ? (
        <MobileChatDetail 
          chatItem={activeChatItem}
          onBackClick={handleBackClick}
          messages={messages}
          sendMessage={sendMessage}
          isConnected={isConnected}
          isConnecting={isConnecting}
          connectionError={connectionError}
          refreshMessages={refreshMessages}
        />
      ) : (
        <MobileChatList 
          onChatClick={handleChatClick}
          messages={messages}
          isConnected={isConnected}
          isConnecting={isConnecting}
          connectionError={connectionError}
        />
      );
    } else {
      return (
        <MobileFAQList 
          faqData={faqData}
          loading={faqLoading}
          error={faqError}
        />
      );
    }
  };

  // Render desktop view
  const renderDesktopView = () => {
    if (activeTab === 'chat') {
      return (
        <DesktopChat 
          messages={messages}
          sendMessage={sendMessage}
          isConnected={isConnected}
          isConnecting={isConnecting}
          connectionError={connectionError}
          refreshMessages={refreshMessages}
        />
      );
    } else {
      return (
        <DesktopFAQ 
          faqData={faqData}
          loading={faqLoading}
          error={faqError}
        />
      );
    }
  };

  return (
    <div className="customer-support-app">
      {/* Connection Status Indicator */}
      {connectionError && (
        <div className="connection-error">
          <span>⚠️ {connectionError}</span>
        </div>
      )}
      
      {isConnecting && (
        <div className="connection-status">
          <span>🔄 Connecting to chat...</span>
        </div>
      )}
      
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
              Chat {isConnected && <span className="status-dot connected"></span>}
            </button>
            <button 
              className={`tab ${activeTab === 'faqs' ? 'active' : ''}`}
              onClick={() => setActiveTab('faqs')}
            >
              FAQs
              {faqData && faqData.length > 0 && (
                <span className="faq-count">{faqData.length}</span>
              )}
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