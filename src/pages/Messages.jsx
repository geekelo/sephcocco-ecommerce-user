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
import { getActiveUser } from '../utils/getActiveUser';
import { useGetFaq } from '../hooks/useGetFaq';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [activeChatItem, setActiveChatItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  
  // Get auth token from localStorage, context, or props
  const authToken = localStorage.getItem('token');
  const outletType = getActiveOutlet();
  
  // Get user info for debugging
  const user = getActiveUser();
  console.log('📱 Messages page - Current user:', user);
  
  // Get FAQ data
  const { 
    data: faqData, 
    loading: faqLoading, 
    error: faqError 
  } = useGetFaq(outletType);
  
  // Initialize messaging hook
  const { 
    allMessages, 
    optimisticMessages,
    isConnected, 
    isConnecting, 
    connectionError, 
    isLoading,
    sendMessage,
    refreshMessages,
    triggerMessageLoad
  } = useMessaging(authToken, outletType, user);

  console.log('Messages:', allMessages);
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
          messages={allMessages}
          sendMessage={sendMessage}
          isConnected={isConnected}
          isConnecting={isConnecting}
          connectionError={connectionError}
          refreshMessages={refreshMessages}
        />
      ) : (
        <MobileChatList 
          onChatClick={handleChatClick}
          messages={allMessages}
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
          messages={allMessages}
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

      {/* Debug Connection Status */}
      <div style={{ 
        padding: '10px', 
        background: '#f8f9fa', 
        borderBottom: '1px solid #e9ecef',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <div>🔗 Connection: {isConnected ? '✅ Connected' : isConnecting ? '🔄 Connecting' : '❌ Disconnected'}</div>
        <div>📨 Messages: {allMessages.length}</div>
        <div>👤 User ID: {localStorage.getItem('userId') || 'Not set'}</div>
        <div>🏪 Outlet: {outletType}</div>
      </div>
      
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
          {/* Debug button for loading messages */}
          <button 
            onClick={refreshMessages}
            disabled={!isConnected}
            style={{ 
              marginLeft: '10px', 
              padding: '4px 8px', 
              fontSize: '12px',
              background: isConnected ? '#007bff' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isConnected ? 'pointer' : 'not-allowed'
            }}
          >
            {isConnected ? 'Load Messages' : 'Connecting...'}
          </button>
          {/* Debug connection button */}
          <button 
            onClick={() => {
              console.log('🔧 Manual connection trigger');
              console.log('🔧 Current state:', { isConnected, isConnecting, connectionError });
              console.log('🔧 Auth token:', !!localStorage.getItem('token'));
              console.log('🔧 Outlet type:', outletType);
              console.log('🔧 User ID:', localStorage.getItem('userId'));
              
              if (!isConnected && !isConnecting) {
                console.log('🔧 Attempting manual connection...');
                // The connect function is no longer available in the new useMessaging hook
                // This button will now only log the state.
                console.log('🔧 Manual connection not available in this version.');
              }
            }}
            style={{ 
              marginLeft: '10px', 
              padding: '4px 8px', 
              fontSize: '12px',
              background: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isConnected ? 'Debug State' : 'Connect'}
          </button>
          {/* Test load messages button */}
          <button 
            onClick={() => {
              console.log('🧪 Manual load messages test');
              console.log('🧪 Current messages count:', allMessages.length);
              console.log('🧪 Current messages:', allMessages);
              triggerMessageLoad();
            }}
            style={{ 
              marginLeft: '10px', 
              padding: '4px 8px', 
              fontSize: '12px',
              background: '#ffc107',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Test Load
          </button>
          {/* Create test message button */}
          <button 
            onClick={() => {
              console.log('🧪 Creating test message to create thread...');
              try {
                sendMessage('Hello! This is a test message to create a message thread.', 'text');
                console.log('🧪 Test message sent successfully');
              } catch (error) {
                console.error('🧪 Error sending test message:', error);
              }
            }}
            style={{ 
              marginLeft: '10px', 
              padding: '4px 8px', 
              fontSize: '12px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Thread
          </button>
          {/* Force refresh messages button */}
          <button 
            onClick={() => {
              console.log('🔄 Force refreshing messages...');
              console.log('🔄 Current messages before refresh:', allMessages);
              // The forceRefreshMessages function is no longer available in the new useMessaging hook
              // This button will now only log the state.
              console.log('🔄 Force refresh not available in this version.');
            }}
            style={{ 
              marginLeft: '10px', 
              padding: '4px 8px', 
              fontSize: '12px',
              background: '#6f42c1',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Force Refresh
          </button>
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