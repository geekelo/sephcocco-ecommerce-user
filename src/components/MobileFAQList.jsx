import React, { useState } from 'react';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import '../styles/MobileFAQList.css';

const MobileFAQList = ({ faqData, loading, error }) => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Handle loading state
  if (loading) {
    return (
      <div className="mobile-faq-list">
        <div className="faq-loading">
          <div className="spinner"></div>
          <p>Loading FAQs...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="mobile-faq-list">
        <div className="faq-error">
          <MessageCircle size={48} className="error-icon" />
          <h3>Unable to load FAQs</h3>
          <p>Please try again later.</p>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  // Handle empty state
  if (!faqData || faqData.length === 0) {
    return (
      <div className="mobile-faq-list">
        <div className="faq-empty">
          <MessageCircle size={48} className="empty-icon" />
          <h3>No FAQs available</h3>
          <p>Frequently asked questions will appear here when available.</p>
        </div>
      </div>
    );
  }

  const handleToggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="mobile-faq-list">
      {faqData.map((faq, index) => (
        <div key={faq.id || index} className="faq-item">
          <div 
            className={`faq-question ${expandedFaq === index ? 'expanded' : ''}`}
            onClick={() => handleToggleFaq(index)}
          >
            <div className="faq-question-content">
              <h3>{faq.question || faq.title}</h3>
              <div className="toggle-icon">
                {expandedFaq === index ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </div>
          </div>
          
          {expandedFaq === index && (
            <div className={`faq-answer ${expandedFaq === index ? 'show' : ''}`}>
              <div className="faq-answer-content">
                <p>{faq.answer || faq.content || faq.description}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MobileFAQList;