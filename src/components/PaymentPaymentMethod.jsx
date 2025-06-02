import { CheckCircle, CreditCard, Landmark } from 'lucide-react';
import React, { useState } from 'react';
import BankDetails from './BankDetails';
import '../styles/PaymentPaymentMethod.css';

export default function PaymentPaymentMethod({
  address,
  product,
  quantity,
  onPaymentComplete,
  selectedOrders
}) {
  // Calculate costs
  const itemTotal = selectedOrders
    ? selectedOrders.reduce((sum, order) => sum + (order.price * order.quantity), 0)
    : product.price * quantity;
    
  const totalCost = itemTotal;
  
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleBankTransfer = () => {
    setPaymentMethod('bank');
    setShowBankDetails(true);
  };
      
  const handleOnlinePayment = () => {
    setPaymentMethod('online');
    setShowBankDetails(false);
  };
  
  const handleCheckout = () => {
    if (!paymentMethod || (paymentMethod === 'bank' && !address)) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      if (onPaymentComplete) {
        onPaymentComplete();
      }
    }, 2000);
  };

  return (
    <div className="payment-right-column">
      <div className="payment-checkout-section payment-method-section">
        <h3 className="payment-section-title">Payment Method</h3>
        <div className="payment-options">
          <div
            className={`payment-option ${paymentMethod === 'bank' ? 'payment-selected-option' : ''}`}
            onClick={handleBankTransfer}
          >
            <div className="payment-option-inner">
              <div className="payment-option-icon">
                <Landmark size={24} />
              </div>
              <div className="payment-option-label">Bank Transfer</div>
              {paymentMethod === 'bank' && (
                <div className="payment-selected-indicator">
                  <CheckCircle size={20} />
                </div>
              )}
            </div>
          </div>
          
          <div
            className={`payment-option ${paymentMethod === 'online' ? 'payment-selected-option' : ''}`}
            onClick={handleOnlinePayment}
          >
            <div className="payment-option-inner">
              <div className="payment-option-icon">
                <CreditCard size={24} />
              </div>
              <div className="payment-option-label">Online Payment</div>
              {paymentMethod === 'online' && (
                <div className="payment-selected-indicator">
                  <CheckCircle size={20} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="payment-checkout-section payment-total-section">
        <div className="payment-total-row">
          <span>Subtotal</span>
          <span>₦{itemTotal.toFixed(2)}</span>
        </div>
        
        <div className="payment-total-row payment-grand-total">
          <span>Total</span>
          <span>₦{totalCost.toFixed(2)}</span>
        </div>
      </div>

      {paymentMethod === 'bank' && showBankDetails && (
        <BankDetails />
      )}

      <button
        className={`payment-checkout-button ${!paymentMethod || isProcessing || (paymentMethod === 'bank' && !address) ? 'payment-disabled' : ''}`}
        disabled={!paymentMethod || isProcessing || (paymentMethod === 'bank' && !address)}
        onClick={handleCheckout}
      >
        {isProcessing ? 'Processing...' : paymentMethod === 'bank' ? 'Complete Order' : 'Proceed to Payment'}
      </button>
    </div>
  );
}