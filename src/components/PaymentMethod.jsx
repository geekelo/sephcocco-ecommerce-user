import { CheckCircle, CreditCard, Landmark, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'
import BankDetails from './BankDetails'


import '../styles/PaymentMethod.css'
import { usePayment } from '../hooks/usePayment';
import { usePaymentVerify } from '../hooks/usePaymentVerify';
import { getActiveOutlet } from '../utils/getActiveOutlets';
import { getActiveUser } from '../utils/getActiveUser';
import PaystackPayment from './PaystackButton';
import { AuthModals } from './AuthModal';

export default function PaymentMethod({address, totalCost,selectedOrders, product, quantity, orderId, onPaymentComplete, userEmail}) {
  console.log(address, product);
  
  const itemTotal = product?.price 
  console.log('proddds', product);
  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Auth modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  
  const activeOutlet = getActiveOutlet()
  const activeUser = localStorage.getItem('userEmail')
  console.log('act', activeOutlet);
  
  const { mutateAsync: payment } = usePayment()
  const { mutateAsync: paymentVerify } = usePaymentVerify()
  const transactionId = localStorage.getItem('pay-ref')
  
  // Check if user is authenticated
  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    
    if (!token || !userEmail) {
      setShowLoginModal(true);
      return false;
    }
    return true;
  };
  
  const handleBankTransfer = () => {
    if (!checkAuthentication()) return;
    
    setPaymentMethod('bank');
    setShowBankDetails(true);
  };
  
  const handleOnlinePayment = () => {
    if (!checkAuthentication()) return;
    
    setPaymentMethod('online');
    setShowBankDetails(false);
  };

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = orderId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBankPayment = async () => {
    if (!checkAuthentication()) return;
    
    setIsProcessing(true);
    
    const payload = {
      [`sephcocco_${activeOutlet}_payment`]: {
        orders_ids: [orderId],
        amount: Number(totalCost),
        payment_method: 'bank',
        transaction_id: transactionId 
      }
    };
    console.log('activeOutlet', activeOutlet);
    console.log(payload);
    
    try {
      await payment({ active_outlet: activeOutlet, payload: payload });
      alert('Bank transfer recorded. Your order is now pending verification.');
      onPaymentComplete(); // Trigger whatever happens after payment
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle successful Paystack payment
  const handlePaystackSuccess = async (response) => {
    if (!checkAuthentication()) return;
    
    console.log('Paystack payment successful:', response);
    
    setIsProcessing(true);
    
    // Verify payment with Paystack first
    const verifyPayload = {
      reference: response.reference
    };

    try {
      // Now record the payment in your system
      const orderIds = selectedOrders?.map(order => order.id);
      const paymentPayload = {
        [`sephcocco_${activeOutlet}_payment`]: {
          orders_ids: orderIds,
          amount: totalCost,
          payment_method: 'online',
          transaction_id: response.reference,
          paystack_reference: response.reference,
          status: response.status
        }
      };
      
      const res = await payment({ active_outlet: activeOutlet, payload: paymentPayload });
      console.log('payment created', res);
      
      const verificationResult = await paymentVerify({ active_outlet: activeOutlet, payload: verifyPayload });
      console.log('payment verify', verificationResult);
      
      if (verificationResult.payment.status) {
        console.log("Payment verified ✅");
        onPaymentComplete?.();
      } else {
        console.log("Payment verification failed ❌");
        alert('Payment verification failed. Please contact support with reference: ' + response.reference);
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      alert('Payment successful but verification failed. Please contact support with reference: ' + response.reference);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Paystack payment closure/cancellation
  const handlePaystackClose = () => {
    console.log('Paystack payment closed');
  };

  // Generate a unique reference for Paystack
  const generatePaystackReference = () => {
    return `${orderId}_${Date.now()}`;
  };

  // Get user email from multiple sources with proper priority
  const getEmailForPayment = () => {
    return activeUser || userEmail || '';
  };

  // Handle auth success
  const handleAuthSuccess = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    // Optionally refresh user data or trigger any needed updates
  };

  // Handle closing auth modals
  const handleCloseAuthModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  return (
    <>
      <div className="order-right-column">
        <div className="checkout-section payment-section">
          <h3 className="section-title">Payment Method</h3>
          
          <div className="order-status-info">
            <div className="order-id-container">
              <p className='order-id'>
                <strong>Order ID:</strong> {orderId}
                <button 
                  className="copy-button-order"
                  onClick={handleCopyOrderId}
                  title={copied ? 'Copied!' : 'Copy Order ID'}
                >
                  {copied ? <Check size={16} color='#000' /> : <Copy size={16} color='#000' />}
                </button>
              </p>
            </div>
            <p><small>✅ Order created successfully</small></p>
          </div>
          
          <div className="payment-options">
            <div 
              className={`payment-option ${paymentMethod === 'bank' ? 'selected' : ''}`}
              onClick={handleBankTransfer}
            >
              <div className="payment-option-inner">
                <div className="payment-option-icon">
                  <Landmark size={24} />
                </div>
                <div className="payment-option-label">Bank Transfer</div>
                {paymentMethod === 'bank' && (
                  <div className="payment-selected">
                    <CheckCircle size={20} />
                  </div>
                )}
              </div>
            </div>
            
            <div 
              className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}
              onClick={handleOnlinePayment}
            >
              <div className="payment-option-inner">
                <div className="payment-option-icon">
                  <CreditCard size={24} />
                </div>
                <div className="payment-option-label">Online Payment</div>
                {paymentMethod === 'online' && (
                  <div className="payment-selected">
                    <CheckCircle size={20} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-section order-total-section">
          <div className="order-total-row">
            <span>Subtotal</span>
            <span>₦{parseFloat(totalCost).toFixed(2)}</span>
          </div>
          <div className="order-total-row grand-total">
            <span>Total</span>
            <span>₦{parseFloat(totalCost).toFixed(2)}</span>
          </div>
        </div>

        {paymentMethod === 'bank' && showBankDetails && (
          <BankDetails orderId={orderId} />
        )}

        {/* Conditional rendering based on payment method */}
        {paymentMethod === 'bank' ? (
          <button 
            className="checkout-button"
            onClick={handleBankPayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'I have paid'}
          </button>
        ) : paymentMethod === 'online' ? (
          <div className="paystack-button-container">
            <PaystackPayment
              email={getEmailForPayment()} 
              amount={totalCost}
              reference={generatePaystackReference()}
              onSuccess={handlePaystackSuccess}
              onClose={handlePaystackClose}
              disabled={isProcessing}
            />
          </div>
        ) : (
          <button 
            className="checkout-button disabled"
            disabled
          >
            Select Payment Method
          </button>
        )}
      </div>

      {/* Auth Modals */}
      <AuthModals
        showLogin={showLoginModal}
        showRegister={showRegisterModal}
        onCloseAll={handleCloseAuthModals}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  )
}