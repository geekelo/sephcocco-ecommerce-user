import { CheckCircle, CreditCard, Landmark, Copy, Check } from 'lucide-react'
import React, { useState } from 'react'
import BankDetails from './BankDetails'
import '../styles/PaymentMethod.css'
import { usePayment } from '../hooks/usePayment';
import { getActiveOutlet } from '../utils/getActiveOutlets';

export default function PaymentMethod({address, product, quantity, orderId, onPaymentComplete}) {
  
  // Calculate costs
  const itemTotal = product.price * quantity;
  const totalCost = itemTotal;
  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const activeOutlet = getActiveOutlet()
  const {mutateAsync: payment} = usePayment()
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

  const handlePaymentAction = async () => {
    if (paymentMethod === 'bank') {
      const payload = {
        sephcocco_restaurant_payment: {
          order_ids: [orderId],
          amount: totalCost,
          payment_method: paymentMethod,
          transaction_id: '' // Add actual ID if needed
        }
      };
    
      try {
        await payment({ activeOutlet, payload });
    
        if (paymentMethod === 'bank') {
          alert('Bank transfer recorded. Your order is now pending verification.');
          onPaymentComplete();
        } else {
          alert('Payment successful.');
        }
    
        onPaymentComplete(); // Trigger whatever happens after payment
      } catch (error) {
        console.error('Payment failed:', error);
        alert('Payment failed. Please try again.');
      }
   
    
    } else if (paymentMethod === 'online') {
      // Proceed with online payment integration
      // This would typically integrate with your payment gateway
      console.log('Proceeding with online payment for order:', orderId);
      // Implement your online payment logic here
    }
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
          <span>₦{itemTotal.toFixed(2)}</span>
        </div>
        <div className="order-total-row grand-total">
          <span>Total</span>
          <span>₦{totalCost.toFixed(2)}</span>
        </div>
      </div>

      {paymentMethod === 'bank' && showBankDetails && (
        <BankDetails orderId={orderId} />
      )}

      <button 
        className={`checkout-button ${!paymentMethod ? 'disabled' : ''}`}
        disabled={!paymentMethod}
        onClick={handlePaymentAction}
      >
        {paymentMethod === 'bank' ? 'I have paid' : 'Pay Now'}
      </button>
      
   
    </div>
  )
}