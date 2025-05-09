import React, { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import '../styles/ChatInterface.css';

export const ChatInterface = ({ activeTab }) => {
  const [activeChatItem, setActiveChatItem] = useState(null);
  const [message, setMessage] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sample chat items
  const chatItems = [
    {
      id: 1,
      title: 'Listerine Zero Delivery Enquiry',
      description: 'Hello i made payment for the list.............'
    },
    {
      id: 2,
      title: 'Listerine Zero Delivery Enquiry',
      description: 'Hello i made payment for the list.............'
    },
    {
      id: 3,
      title: 'Listerine Zero Delivery Enquiry',
      description: 'Hello i made payment for the list.............'
    }
  ];

  // Sample chat messages for chat detail
  const chatMessages = [
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
  ];

  // Sample FAQs
  const faqs = [
    {
      id: 1,
      question: 'How many days does it take to get my order?',
      answer: 'Lorem ipsum dolor sit amet consectetur. Lacus massa euismod in duis in arcu tellus sapien. Eget bibendum risus est malesuada facilisi dui tellus amet eget. Consectetur semper blandit eget sollicitudin. Faucibus tellus tristique non nulla aliquet. Condimentum tempor est mauris vitae mauris nulla in. At fames pulvinar adipiscing facilisi massa amet viverra enim. Nisi venenatis tempus fringilla enim vel euismod. Dolor fames sed bibendum ullamcorper.'
    },
    {
      id: 2,
      question: 'How many days does it take to get my order?',
      answer: 'Sample answer for FAQ 2.'
    },
    {
      id: 3,
      question: 'How many days does it take to get my order?',
      answer: 'Sample answer for FAQ 3.'
    },
    {
      id: 4,
      question: 'How many days does it take to get my order?',
      answer: 'Sample answer for FAQ 4.'
    },
    {
      id: 5,
      question: 'How many days does it take to get my order?',
      answer: 'Sample answer for FAQ 5.'
    }
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    // Logic to send message would go here
    setMessage('');
  };

  const handleBackClick = () => {
    setActiveChatItem(null);
  };

  // Render chat list view
  const renderChatList = () => (
    <div className="chat-list-container">
      <div className="support-chat-button">
        <button className="chat-with-support">
          <MessageCircle size={16} />
          <span>Chat with support now</span>
        </button>
      </div>
      
      <div className="chat-items">
        {chatItems.map((item, index) => (
          <div 
            key={item.id} 
            className={`chat-item ${index % 2 === 1 ? 'highlighted' : ''}`}
            onClick={() => setActiveChatItem(item)}
          >
            <div className="chat-item-avatar">
              <img src="/listerine-icon.png" alt="Listerine" />
            </div>
            <div className="chat-item-details">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render chat detail view
  const renderChatDetail = () => (
    <div className="chat-detail-container">
      {isMobile && (
        <p>Hello</p>
      )}
      
      <div className="chat-messages">
        {chatMessages.map(message => (
          <div 
            key={message.id} 
            className={`chat-message ${message.sender} ${message.highlighted ? 'highlighted' : ''}`}
          >
            {message.sender === 'agent' && (
              <div className="message-avatar">
                <img src="/agent-avatar.png" alt="Agent" />
              </div>
            )}
            <div className="message-bubble">
              <div className="message-text">{message.text}</div>
              <div className="message-time">{message.time}</div>
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

  // Render FAQs
  const renderFaqs = () => (
    <div className="faqs-container">
      <div className="faqs-list">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="faq-item">
            <div 
              className={`faq-question ${expandedFaq === index ? 'expanded' : ''}`}
              onClick={() => setExpandedFaq(index)}
            >
              <div className="plus-icon">+</div>
              <h3>{faq.question}</h3>
            </div>
            
            {(isMobile && expandedFaq === index) && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Show the expanded answer on desktop layout */}
      {!isMobile && (
        <div className="faq-expanded-content">
          {expandedFaq !== null && expandedFaq < faqs.length && (
            <div className="faq-expanded-answer">
              <p>{faqs[expandedFaq].answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Determine what to render based on active tab and whether a chat item is selected
  const renderContent = () => {
    // On mobile, just return the appropriate view
    if (isMobile) {
      if (activeTab === 'chat') {
        return activeChatItem ? renderChatDetail() : renderChatList();
      } else {
        return renderFaqs();
      }
    }
    
    // On desktop, we need to handle the side-by-side layout
    if (activeTab === 'chat') {
      return (
        <>
          {renderChatList()}
          {activeChatItem ? renderChatDetail() : <div className="empty-detail"></div>}
        </>
      );
    } else {
      return renderFaqs();
    }
  };

  return (
    <div className={`chat-interface ${isMobile ? 'mobile' : 'desktop'}`}>
      {renderContent()}
    </div>
  );
};