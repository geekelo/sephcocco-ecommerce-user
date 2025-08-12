import { CheckCircle, CreditCard, Landmark, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'
import BankDetails from './BankDetails'

import '../styles/PaymentMethod.css'
import { usePayment } from '../hooks/usePayment';
import { getActiveOutlet } from '../utils/getActiveOutlets';
import PaystackPayment from './PaystackButton';

export default function PaymentMethod({address, product, quantity, orderId, onPaymentComplete, userEmail}) {
  console.log(address, product);
  
  // Calculate costs
  const totalCost = product?.total_cost;
  const itemTotal = product?.item_total || totalCost; // Add fallback for itemTotal
  console.log(product?.total_cost, 'total cost');
  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const activeOutlet = getActiveOutlet()
  const {mutateAsync: payment} = usePayment()
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
    }
  };

  // Handle successful Paystack payment
  const handlePaystackSuccess = async (response) => {
    console.log('Paystack payment successful:', response);
    
    const payload = {
      [`sephcocco_${activeOutlet}_payment`]: {
        orders_ids: [orderId],
        amount: totalCost,
        payment_method: 'online',
        transaction_id: response.reference,
        paystack_reference: response.reference,
        status: response.status
      }
    };

    try {
      await payment({ activeOutlet, payload });
      alert('Payment successful!');
      onPaymentComplete();
    } catch (error) {
      console.error('Payment verification failed:', error);
      alert('Payment successful but verification failed. Please contact support with reference: ' + response.reference);
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
          <span>₦{itemTotal?.toFixed(2)}</span>
        </div>
        <div className="order-total-row grand-total">
          <span>Total</span>
          <span>₦{totalCost?.toFixed(2)}</span>
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
        >
          I have paid
        </button>
      ) : paymentMethod === 'online' ? (
        <div className="paystack-button-container">
          <PaystackPayment
            email={userEmail || address?.email || 'customer@example.com'} 
            amount={totalCost}
            reference={generatePaystackReference()}
            onSuccess={handlePaystackSuccess}
            onClose={handlePaystackClose}
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