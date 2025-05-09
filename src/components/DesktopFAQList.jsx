
import React, { useState } from 'react';
import '../styles/DesktopFAQ.css';

const DesktopFAQ = () => {
  const [selectedFaqId, setSelectedFaqId] = useState(1);
  
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
  
  // Find the selected FAQ
  const selectedFaq = faqs.find(faq => faq.id === selectedFaqId) || faqs[0];
  
  return (
    <div className="desktop-faq">
      {/* Left Panel - FAQ List */}
      <div className="desktop-faq-list">
        {faqs.map(faq => (
          <div 
            key={faq.id} 
            className={`faq-item ${selectedFaqId === faq.id ? 'selected' : ''}`}
            onClick={() => setSelectedFaqId(faq.id)}
          >
            <div className="faq-question">
              <div className="plus-icon">+</div>
              <h3>{faq.question}</h3>
            </div>
          </div>
        ))}
      </div>
      
      {/* Right Panel - FAQ Detail */}
      <div className="desktop-faq-detail">
        <div className="faq-answer-content">
          <p>{selectedFaq.answer}</p>
        </div>
      </div>
    </div>
  );
};

export default DesktopFAQ;