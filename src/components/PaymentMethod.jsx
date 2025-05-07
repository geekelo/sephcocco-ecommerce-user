import { CheckCircle, CreditCard, Landmark } from 'lucide-react'
import React, { useState } from 'react'
import BankDetails from './BankDetails'
import { DELIVERY_FEE } from '../constants/DeliveryFee';
import '../styles/PaymentMethod.css'

export default function PaymentMethod({address, product, quantity}) {
      // Calculate costs
      const itemTotal = product.price * quantity;
      const totalCost = itemTotal + DELIVERY_FEE;
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [showBankDetails, setShowBankDetails] = useState(false);
    const handleBankTransfer = () => {
        setPaymentMethod('bank');
        setShowBankDetails(true);
      };
    
      const handleOnlinePayment = () => {
        setPaymentMethod('online');
        setShowBankDetails(false);
      };

  return (
    <div className="order-right-column">
    <div className="checkout-section payment-section">
      <h3 className="section-title">Payment Method</h3>
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
        <span>${itemTotal.toFixed(2)}</span>
      </div>
      <div className="order-total-row">
        <span>Delivery Fee</span>
        <span>${DELIVERY_FEE.toFixed(2)}</span>
      </div>
      <div className="order-total-row grand-total">
        <span>Total</span>
        <span>${totalCost.toFixed(2)}</span>
      </div>
    </div>

    {paymentMethod === 'bank' && showBankDetails && (
   <BankDetails/>
    )}

    <button 
      className={`checkout-button ${!paymentMethod ? 'disabled' : ''}`}
      disabled={!paymentMethod || (paymentMethod === 'bank' && !address)}
    >
      {paymentMethod === 'bank' ? 'Complete Order' : 'Proceed to Payment'}
    </button>
  </div>
  )
}
