import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/PaymentModal.css';
import PaymentOrderSummary from './PaymentOrderSummary';
import PaymentPaymentMethod from './PendingPaymentMethod';


const PaymentModal = ({ selectedOrders,locations,totalCost, onClose, onPaymentComplete }) => {


  const [quantity, setQuantity] = useState(1);


  
  // If we have selected orders, set the initial quantity to the total
  useEffect(() => {
    if (selectedOrders && selectedOrders.length > 0) {
      const totalQuantity = selectedOrders.reduce((sum, order) => sum + order.quantity, 0);
      setQuantity(totalQuantity);
    }
  }, [selectedOrders]);
  
  // Create a combined product object for OrderSummary
  const combinedProduct = {
    name: `${selectedOrders.length} Selected Items`,
    price: selectedOrders.reduce((sum, order) => sum + Number(order.price), 0),
    images: [selectedOrders[0]?.image || ''],
    stockCount: 100, // Arbitrary large number
    id: 'combined-orders'
  };
  
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
  
  // Mark payment as complete
  const handlePaymentComplete = () => {
    // Trigger the parent component's payment complete handler
    // This will close the modal and show the success message
    if (onPaymentComplete) {
      onPaymentComplete();
    }
  };
  console.log('ddk',quantity);
  
  return (
    <AnimatePresence>
      <motion.div
        className="payment-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          className="payment-close-button"
          onClick={onClose}
          aria-label="Close"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={24} strokeWidth={2.5} color="white" />
        </motion.button>
                
        <motion.div
          className="payment-modal-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
        
          {/* Mobile Tabs */}
          <div className="payment-modal-tabs">
      
            <button 
              className={`payment-tab-button`}
            
            >
              Payment Method
            </button>
          </div>
          
          <div className="payment-modal-body">
            {/* Desktop view - both columns always visible */}
            <div className="payment-desktop-view">
          
              
              <PaymentPaymentMethod
               locations={locations}
                quantity={quantity}
                product={combinedProduct}
                onPaymentComplete={handlePaymentComplete}
                selectedOrders={selectedOrders}
                totalCost={totalCost} 
              />
            </div>
            
            {/* Mobile view - show based on active tab */}
            <div className="payment-mobile-view">
            
                <PaymentPaymentMethod
                 
                  quantity={quantity}
                  product={combinedProduct}
                  onPaymentComplete={handlePaymentComplete}
                  selectedOrders={selectedOrders}
                  totalCost={totalCost}
                />
              
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;