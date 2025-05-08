// FAQsTab Component
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import '../styles/FAQs.css';

const FAQsTab = () => {
  const [expandedIndex, setExpandedIndex] = useState(0);
  
  const faqs = [
    {
      question: 'How many days does it take to get my order?',
      answer: 'Lorem ipsum dolor sit amet consectetur. Lacus massa euismod in duis in arcu tellus sapien. Eget bibendum risus est malesuada facilisi dui tellus amet eget. Consectetur semper blandit eget sollicitudin. Faucibus tellus tristique non nulla aliquet.'
    },
    {
      question: 'How many days does it take to get my order?',
      answer: 'Condimentum tempor est mauris vitae mauris nulla in. At fames pulvinar adipiscing facilisi massa amet viverra enim. Nisi venenatis tempus fringilla enim vel euismod. Dolor fames sed bibendum ullamcorper.'
    },
    {
      question: 'How many days does it take to get my order?',
      answer: 'Shipping typically takes 3-5 business days for standard orders. Premium shipping options are available at checkout for faster delivery.'
    },
    {
      question: 'How many days does it take to get my order?',
      answer: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery in select areas.'
    },
    {
      question: 'How many days does it take to get my order?',
      answer: 'Orders are typically processed within 24 hours and shipped within 3-5 business days depending on your location.'
    }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? -1 : index);
  };

  return (
    <div className="faqs-tab">
      <div className="faq-content-wrapper">
        <div className="faq-questions-list">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div 
                className="faq-question"
                onClick={() => toggleExpand(index)}
              >
                <div className="plus-icon">
                  <Plus size={16} />
                </div>
                <h3>{faq.question}</h3>
              </div>
              
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div 
                    className="faq-answer"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p>{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        {/* Right side content area to match the image */}
        <div className="faq-answer-content">
          {expandedIndex >= 0 && expandedIndex < faqs.length && (
            <div className="expanded-content">
              <p>{faqs[expandedIndex].answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQsTab;