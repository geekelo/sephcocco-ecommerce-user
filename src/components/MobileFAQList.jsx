
import React, { useState } from 'react';
import '../styles/MobileFAQList.css';

const MobileFAQList = () => {
  const [expandedFaq, setExpandedFaq] = useState(0);
  
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
  
  return (
    <div className="mobile-faq-list">
      {faqs.map((faq, index) => (
        <div key={faq.id} className="faq-item">
          <div 
            className={`faq-question ${expandedFaq === index ? 'expanded' : ''}`}
            onClick={() => setExpandedFaq(index)}
          >
            <div className="plus-icon">+</div>
            <h3>{faq.question}</h3>
          </div>
          
          {expandedFaq === index && (
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MobileFAQList;