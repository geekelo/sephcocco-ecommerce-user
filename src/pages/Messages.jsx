import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import '../styles/Messages.css';
import DesktopChat from '../components/DesktopChat';
import DesktopFAQ from '../components/DesktopFAQList';
import MobileChatDetail from '../components/MobileChatDetail';
import MobileFAQList from '../components/MobileFAQList';
import MobileChatList from '../components/MobileChatList';
import { AuthModals } from '../components/AuthModal'; // Import auth modals
import { useMessaging } from '../hooks/useMessaging';
import { getActiveOutlet } from '../utils/getActiveOutlets';
import { getActiveUser } from '../utils/getActiveUser';
import { useGetFaq } from '../hooks/useGetFaq';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [activeChatItem, setActiveChatItem] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Get auth token from localStorage and user info
  const authToken = localStorage.getItem('token');
  const outletType = getActiveOutlet();
  const user = getActiveUser();
  
  console.log('📱 Messages page - Current user:', user);
       // Check if user is properly authenticated
   
  // Check authentication status
  useEffect(() => {
    const checkAuthentication = () => {



 
      
      setIsAuthenticated(!!authToken);
      setIsCheckingAuth(false);
      
      // If not authenticated, show login modal
      if (!authToken) {
        console.log('🚫 User not authenticated, showing login modal');
        setShowLoginModal(true);
      }
    };

    checkAuthentication();
  }, []);


  // Get FAQ data (only if authenticated)
  const { 
    data: faqData, 
    loading: faqLoading, 
    error: faqError 
  } = useGetFaq(outletType, { 
    enabled: isAuthenticated // Only fetch if authenticated
  });
  
  // Initialize messaging hook (only if authenticated)
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
  } = useMessaging(
    isAuthenticated ? authToken : null, // Only pass token if authenticated
    outletType, 
    isAuthenticated ? user : null, // Only pass user if authenticated
    { enabled: isAuthenticated } // Only initialize if authenticated
  );

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

  // Authentication handlers
  const handleAuthSuccess = () => {
    console.log('✅ Authentication successful');
    setIsAuthenticated(true);
    setShowLoginModal(false);
    setShowRegisterModal(false);
    
    // Optionally refresh the page to reinitialize all hooks with auth
    // window.location.reload();
  };

  const handleCloseAuthModals = () => {
    console.log('❌ Auth modals closed without authentication');
    setShowLoginModal(false);
    setShowRegisterModal(false);
    

  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  // Navigation handlers
  const handleChatClick = (chat) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    setActiveChatItem(chat);
  };

  const handleBackClick = () => {
    setActiveChatItem(null);
  };

  const handleClick = () => {
    navigate('/products');
  };



  // Render mobile view (only if authenticated)
  const renderMobileView = () => {
    if (!isAuthenticated) return null;
    
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

  // Render desktop view (only if authenticated)
  const renderDesktopView = () => {
    if (!isAuthenticated) return null;
    
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
      {/* Connection Status Indicator - only show if authenticated */}
      {isAuthenticated && connectionError && (
        <div className="connection-error">
          <span>⚠️ {connectionError}</span>
        </div>
      )}
      
      {isAuthenticated && isConnecting && (
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

      {/* Tab Navigation - only show if authenticated */}
      {isAuthenticated && (!isMobile || !activeChatItem) && (
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

      {/* Main Content - only render if authenticated */}
      {isAuthenticated && (
        <div className="main-content">
          {isMobile ? renderMobileView() : renderDesktopView()}
        </div>
      )}

      {/* Authentication Modals */}
      <AuthModals
        showLogin={showLoginModal}
        showRegister={showRegisterModal}
        onCloseAll={handleCloseAuthModals}
        onAuthSuccess={handleAuthSuccess}
        onSwitchToRegister={handleSwitchToRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
};

export default Messages;

