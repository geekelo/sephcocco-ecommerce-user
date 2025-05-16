import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/PaymentSuccessModal.css';

const PaymentSuccessModal = ({ onClose }) => {
  // Close modal automatically after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <>
   
      <motion.div 
        className="payment-success-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="payment-success-icon">
          <CheckCircle size={50} />
        </div>
        <h2>Payment Successful!</h2>
        <p >Your orders have been confirmed and are being processed.</p>
      </motion.div>
    </>
  );
  
};

export default PaymentSuccessModal;