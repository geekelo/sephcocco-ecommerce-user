import React, { useState, useEffect } from 'react';
import { MessageCircle, ChevronRight } from 'lucide-react';
import '../styles/DesktopFAQ.css';

const DesktopFAQ = ({ faqData, loading, error }) => {
  const [selectedFaqId, setSelectedFaqId] = useState(null);

  // Set the first FAQ as selected when data loads
  useEffect(() => {
    if (faqData && faqData.length > 0 && !selectedFaqId) {
      setSelectedFaqId(faqData[0].id || 0);
    }
  }, [faqData, selectedFaqId]);

  // Handle loading state
  if (loading) {
    return (
      <div className="desktop-faq">
        <div className="desktop-faq-loading">
          <div className="spinner"></div>
          <p>Loading FAQs...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="desktop-faq">
        <div className="desktop-faq-error">
          <MessageCircle size={64} className="error-icon" />
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
      <div className="desktop-faq">
        <div className="desktop-faq-empty">
          <MessageCircle size={64} className="empty-icon" />
          <h3>No FAQs available</h3>
          <p>Frequently asked questions will appear here when available.</p>
        </div>
      </div>
    );
  }

  // Find the selected FAQ
  const selectedFaq = faqData.find(faq => 
    (faq.id || faqData.indexOf(faq)) === selectedFaqId
  ) || faqData[0];

  return (
    <div className="desktop-faq">
      {/* Left Panel - FAQ List */}
      <div className="desktop-faq-list">
        <div className="faq-list-header">
          <h2>Frequently Asked Questions</h2>
          <p>{faqData.length} questions</p>
        </div>
        
        <div className="faq-list-content">
          {faqData.map((faq, index) => {
            const faqId = faq.id || index;
            const isSelected = selectedFaqId === faqId;
            
            return (
              <div 
                key={faqId}
                className={`faq-item ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedFaqId(faqId)}
              >
                <div className="faq-question">
                  <div className="faq-question-text">
                    <h3>{faq.question || faq.title}</h3>
                    {faq.category && (
                      <span className="faq-category">{faq.category}</span>
                    )}
                  </div>
                  <ChevronRight 
                    size={16} 
                    className={`arrow-icon ${isSelected ? 'rotated' : ''}`} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Right Panel - FAQ Detail */}
      <div className="desktop-faq-detail">
        {selectedFaq && (
          <div className="faq-answer-content">
            <div className="faq-header">
              <h2>{selectedFaq.question || selectedFaq.title}</h2>
              {selectedFaq.category && (
                <span className="faq-category-badge">{selectedFaq.category}</span>
              )}
            </div>
            
            <div className="faq-answer-desktop">
              <p>{selectedFaq.answer || selectedFaq.content || selectedFaq.description}</p>
            </div>
            
            {selectedFaq.lastUpdated && (
              <div className="faq-meta">
                <small>Last updated: {new Date(selectedFaq.lastUpdated).toLocaleDateString()}</small>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopFAQ;