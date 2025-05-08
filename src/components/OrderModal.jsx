import React, { useState, useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/OrderModal.css';
import OrderSummary from './OrderSummary';
import PaymentMethod from './PaymentMethod';
import MobileOrderResponsiveFix from './MobileOrderResponsiveFix';

const OrderModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [showPaymentOnMobile, setShowPaymentOnMobile] = useState(false);

  // Prevent scrolling of the body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  // Handle back button for mobile
  const handleBackToSummary = () => {
    setShowPaymentOnMobile(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="order-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Add the mobile responsive fix utility component */}
        <MobileOrderResponsiveFix showPaymentOnMobile={showPaymentOnMobile} />
        
        <motion.button
          className="close-button-outside"
          onClick={onClose}
          aria-label="Close"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={24} strokeWidth={2.5} color="white" />
        </motion.button>
        
        <motion.div
          className={`order-modal-content ${showPaymentOnMobile ? 'show-payment-mobile' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="order-modal-header">
            {showPaymentOnMobile && (
              <button 
                className="back-button-mobile"
                onClick={handleBackToSummary}
                aria-label="Back to order summary"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2>{showPaymentOnMobile ? 'Payment Method' : 'Order Payment'}</h2>
          </div>

          <div className="order-modal-body">
            <OrderSummary 
              product={product} 
              setQuantity={setQuantity} 
              setAddress={setAddress} 
              quantity={quantity} 
              address={address}
              showPaymentOnMobile={() => setShowPaymentOnMobile(true)}
            />

            <PaymentMethod 
              address={address} 
              quantity={quantity} 
              product={product}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderModal;