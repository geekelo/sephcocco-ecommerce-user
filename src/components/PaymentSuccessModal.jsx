import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/PaymentSuccessModal.css';

const PaymentSuccessModal = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="payment-success-backdrop">
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
        <p>Your orders have been confirmed and are being processed.</p>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessModal;
