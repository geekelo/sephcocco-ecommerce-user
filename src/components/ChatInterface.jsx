
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus } from 'lucide-react';

import '../styles/ChatInterface.css';
import ChatTab from './ChatTab';
import FAQsTab from './FAQs';

const ChatInterface = ({ activeTab }) => {
  return (
    <div className="chat-interface">
      <div className="content-split-view">
        <AnimatePresence mode="wait">
          {activeTab === 'chat' ? (
            <motion.div
              key="chat"
              className="tab-content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <ChatTab />
            </motion.div>
          ) : (
            <motion.div
              key="faqs"
              className="tab-content"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <FAQsTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatInterface;