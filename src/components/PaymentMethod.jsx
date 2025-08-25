import { CheckCircle, CreditCard, Landmark, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'
import BankDetails from './BankDetails'

import '../styles/PaymentMethod.css'
import { usePayment } from '../hooks/usePayment';
import { usePaymentVerify } from '../hooks/usePaymentVerify'; // Add this import
import { getActiveOutlet } from '../utils/getActiveOutlets';
import { getActiveUser } from '../utils/getActiveUser'; // Add this import
import PaystackPayment from './PaystackButton';

export default function PaymentMethod({address,totalCost, product, quantity, orderId, onPaymentComplete, userEmail}) {
  console.log(address, product);
  


  const itemTotal = product?.price 
  console.log('proddds',product);
  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Add processing state
  
  const activeOutlet = getActiveOutlet()
  const activeUser = getActiveUser() // Get active user data
  const { mutateAsync: payment } = usePayment()
  const { mutateAsync: paymentVerify } = usePaymentVerify() // Add payment verify hook
  const transactionId = localStorage.getItem('pay-ref')
  
  const handleBankTransfer = () => {
    setPaymentMethod('bank');
    setShowBankDetails(true);
  };
  
  const handleOnlinePayment = () => {
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
    setIsProcessing(true);
    
    const payload = {
      [`sephcocco_${activeOutlet}_payment`]: {
        orders_ids: [orderId],
        amount: totalCost,
        payment_method: 'bank',
        transaction_id: transactionId 
      }
    };
    console.log(payload);
    
    try {
      await payment({ activeOutlet, payload });
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
    console.log('Paystack payment successful:', response);
    
    setIsProcessing(true);
    
    // Verify payment with Paystack first
    const verifyPayload = {
      reference: response.reference
    };

    try {
      const verificationResult = await paymentVerify({ active_outlet: activeOutlet, payload: verifyPayload });
      
      if (verificationResult.status === "success") {
        console.log("Payment verified ✅");
        
        // // Now record the payment in your system
        // const paymentPayload = {
        //   [`sephcocco_${activeOutlet}_payment`]: {
        //     orders_ids: [orderId],
        //     amount: totalCost,
        //     payment_method: 'online',
        //     transaction_id: response.reference,
        //     paystack_reference: response.reference,
        //     status: response.status
        //   }
        // };
        
        // await payment({ active_outlet: activeOutlet, payload: paymentPayload });
        // alert('Payment successful!');
        onPaymentComplete();
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
    // Optionally handle what happens when user closes payment modal
  };

  // Generate a unique reference for Paystack
  const generatePaystackReference = () => {
    return `${orderId}_${Date.now()}`;
  };

  // Get user email from multiple sources with proper priority
  const getEmailForPayment = () => {
    // Priority order: userEmail prop > activeUser email > address email > default
    return activeUser.email 
          
  };

  return (
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
  )
}