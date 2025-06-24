import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/OrderModal.css';
import OrderSummary from './OrderSummary';
import PaymentMethod from './PaymentMethod';
import MobileOrderResponsiveFix from './MobileOrderResponsiveFix';
import { useCreateOrder } from '../hooks/useCreateOrder';
import { getActiveOutlet } from '../utils/getActiveOutlets';
import { getActiveUser } from '../utils/getActiveUser';

const OrderModal = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [notes, setNotes] = useState('');
  const [showPaymentOnMobile, setShowPaymentOnMobile] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);
  
  // Add error state
  const [errorMessage, setErrorMessage] = useState('');

  const createOrderMutation = useCreateOrder();
  const active_outlet = getActiveOutlet()
  const sephcocco_user_id = getActiveUser();

  // Prevent scrolling of the body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Handle escape key to close modal (only if order not created)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && !orderCreated) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose, orderCreated]);

  // Clear error message when user makes changes
  useEffect(() => {
    if (errorMessage) {
      setErrorMessage('');
    }
  }, [quantity, address, phoneNumbers, notes]);

  // Handle back button for mobile (only show if order not created)
  const handleBackToSummary = () => {
    if (!orderCreated) {
      setShowPaymentOnMobile(false);
    }
  };

  // Handle proceeding to payment with enhanced error handling
  const handleProceedToPayment = async () => {
    // Clear any previous error
    setErrorMessage('');
    
    // Basic validation
    if (!address.trim()) {
      setErrorMessage('Please enter a delivery address');
      return;
    }
    
    if (!phoneNumbers.trim()) {
      setErrorMessage('Please enter a phone number');
      return;
    }

    try {
      const payload = {
        sephcocco_user_id,
        [`sephcocco_${active_outlet}_product_id`]: product.id,
        quantity,
        address,
        phone_number: phoneNumbers,
        additional_notes: notes,
      };

      const response = await createOrderMutation.mutateAsync({
        active_outlet,
        payload
      });

      setCreatedOrderId(response.order_id || response.id);
      setOrderCreated(true);
      setShowPaymentOnMobile(true);
    } catch (error) {
      console.error('Failed to create order:', error);
      
      // Set user-friendly error message
      let errorMsg = 'Failed to create order. Please try again.';
      
      // Handle specific error cases
      if (error.response?.status === 400) {
        errorMsg = error.response.data?.message || 'Invalid order details. Please check your information.';
      } else if (error.response?.status === 401) {
        errorMsg = 'Authentication failed. Please log in again.';
      } else if (error.response?.status === 500) {
        errorMsg = 'Server error. Please try again later.';
      } else if (error.message === 'Network Error') {
        errorMsg = 'Network error. Please check your connection and try again.';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      setErrorMessage(errorMsg);
    }
  };

  // Handle modal close with order created warning
  const handleClose = () => {
    if (orderCreated) {
      const confirmClose = window.confirm(
        'You have an unpaid order that will be moved to pending orders. Do you want to continue?'
      );
      if (confirmClose) {
        onClose();
      }
    } else {
      onClose();
    }
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
          onClick={handleClose}
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
            {showPaymentOnMobile && !orderCreated && (
              <button 
                className="back-button-mobile"
                onClick={handleBackToSummary}
                aria-label="Back to order summary"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2>
              {orderCreated 
                ? 'Complete Payment' 
                : showPaymentOnMobile 
                  ? 'Create Order' 
                  : 'Order Details'
              }
            </h2>
          </div>

          {/* Error Message Display */}
          {errorMessage && (
            <motion.div 
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          <div className="order-modal-body">
            <OrderSummary 
              product={product}
              setQuantity={setQuantity}
              setAddress={setAddress}
              setPhoneNumbers={setPhoneNumbers}
              setNotes={setNotes}
              quantity={quantity}
              address={address}
              phoneNumbers={phoneNumbers}
              notes={notes}
              showPaymentOnMobile={() => setShowPaymentOnMobile(true)}
              onProceedToPayment={handleProceedToPayment}
              orderCreated={orderCreated}
              isCreatingOrder={createOrderMutation.isPending}
            />

            {orderCreated && (
              <PaymentMethod 
                address={address}
                quantity={quantity}
                product={product}
                orderId={createdOrderId}
                onPaymentComplete={onClose}
              />
            )}
          </div>
          
          {orderCreated && (
            <div className="order-created-notice">
              <p>✅ Order created successfully! Complete payment to finalize your order.</p>
              <p><small>Unpaid orders can be found in your pending orders section.</small></p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OrderModal;